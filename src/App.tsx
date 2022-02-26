import { CircularProgress, Dialog, Grid, makeStyles } from "@material-ui/core"
import GIF from "gif.js"
import React, { useEffect } from "react"
import { render, Assets } from "./effects/webgl"
import { createPatternShader } from "./effects/webgl/Pattern"
import defer from "./util/defer"
import onKeyboard, { KeyState } from "./util/onKeyboard"
import useRequestAnimationFrame from "./util/useRequestAnimationFrame"

const useAppStyles = makeStyles({
	root: {
		"& canvas": {
			objectFit: "cover",
			width: "100%",
			height: "100vh"
		}
	},
	spinner: {
		position: "fixed",
		top: "calc(50% - 180px)",
		left: 0,
		right: 0,
		margin: "0 auto"
	}
}, { name: "App" })


function useAssets(loader: () => Promise<Assets>, props: any[]) {
	const [state, setState] = React.useState<Assets | null>()
	useEffect(() => { loader().then(result => setState(result)) }, [...props])
	return state
}

type RenderingStatus = { readonly current: "no" } | {
	readonly current: "rendering" | "exporting"
	readonly progress: number
}

const RenderingSpinner = ({ className, status }: { readonly className?: string; readonly status: RenderingStatus }) => {
	return <Dialog open={status.current !== "no"}>
		<CircularProgress className={className} size={360} color={status.current === "rendering" ? "primary" : "secondary"} variant="determinate" value={(status.current === "rendering" ? 0 : 50) + status.progress * 50} />
	</Dialog>
}

export default function App() {
	const appStyles = useAppStyles()
	const [rendering, setRendering] = React.useState<RenderingStatus>({ current: "no" })

	const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
	const [speed, setSpeed] = React.useState(1)
	const [fps, setFps] = React.useState(60)
	const [totalFrames, setTotalFrames] = React.useState(fps * 2)
	const [canvasResolution, setCanvasResolution] = React.useState([1920, 1080])

	const assets = useAssets(async () => ({
		shader1: await createPatternShader(canvasRef.current!, "shaders/spiral.vs", `shaders/full-inwards.fs`),
		shader2: await createPatternShader(canvasRef.current!, "shaders/spiral.vs", `shaders/full-half-circle.fs`)
	}), [canvasResolution])

	const lastUpdate = React.useRef(performance.now())
	const frame = React.useRef(0)
	useRequestAnimationFrame(() => {
		const last = lastUpdate.current
		const now = performance.now()
		let delta = (now - last) / 1000
		const frameLength = (1.0 / fps)
		if (delta < frameLength) {
			return
		}

		while (delta >= (frameLength / speed)) {
			frame.current = frame.current + 1
			delta = delta - (frameLength / speed)
		}
		lastUpdate.current = performance.now() - delta

		const targetScreen = canvasRef.current
		if (targetScreen != null && assets != null) {
			render(targetScreen, frame.current % totalFrames, assets, { fps })
		}
	}, [rendering, fps, totalFrames])

	onKeyboard(async (state, code) => {
		if (assets == null) {
			return
		}

		if (state === KeyState.Up && code === "KeyR" && canvasRef.current) {
			setRendering({ current: "rendering", progress: 0 })

			const targetScreen = canvasRef.current!

			const targetBuffer = document.createElement("canvas")
			targetBuffer.width = targetScreen.width
			targetBuffer.height = targetScreen.height

			const gif = new GIF({ quality: 5, repeat: 0, background: "#000", transparent: "#f0f" })
			for (let frame = 0; frame < totalFrames; ++frame) {
				await defer(() => {
					render(targetBuffer, frame, assets, { fps })
					setRendering({ current: "rendering", progress: (frame / totalFrames) })
				})
				gif.addFrame(targetBuffer, { delay: 1000 / (speed * fps), copy: true })
			}
			gif.on("progress", e => {
				setRendering({
					current: "exporting",
					progress: e
				})
			})
			gif.on("finished", blob => {
				window.open(URL.createObjectURL(blob))
				setRendering({ current: "no" })
			})
			gif.render()
		}
	})

	return (
		<div className={appStyles.root}>
			<Grid container>
				<Grid item />
				<Grid item style={{ flexGrow: 1 }}>
					<canvas width={canvasResolution[0]} height={canvasResolution[1]} ref={canvasRef} />
				</Grid>
				<Grid item />
			</Grid>
			<RenderingSpinner className={appStyles.spinner} status={rendering} />
		</div>
	)
}


