import { CircularProgress, Dialog, Grid, makeStyles } from "@material-ui/core"
import GIF from "gif.js"
import React from "react"
import { render } from "./effects/webgl"
import { useAssets, useRenderDef, useRenderToCanvas } from "./effects/webgl/webgl.react"
import defer from "./util/defer"
import onKeyboard, { KeyState } from "./util/onKeyboard"

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

type RenderingStatus = { readonly current: "no" } | {
	readonly current: "rendering" | "exporting"
	readonly progress: number
}

const RenderingSpinner = ({ className, status }: { readonly className?: string; readonly status: RenderingStatus }) => {
	return (
		<Dialog open={status.current !== "no"}>
			<CircularProgress
				className={className} size={360}
				color={status.current === "rendering" ? "primary" : "secondary"} variant="determinate"
				value={(status.current === "rendering" ? 0 : 50) + (status.current !== "no" ? (status.progress * 50) : 0)} />
		</Dialog>
	)
}

export default function App() {
	const [def, setRenderDef] = useRenderDef()
	const assets = useAssets(def)

	React.useEffect(() => {
		setRenderDef(def)
	}, [def])

	const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
	const [rendering, setRendering] = React.useState<RenderingStatus>({ current: "no" })

	useRenderToCanvas(canvasRef.current, { enable: rendering.current === "no", assets, def })

	onKeyboard(async (state, code) => {
		if (assets == null) {
			return
		}

		if (state === KeyState.Up && code === "KeyR" && canvasRef.current) {
			setRendering({ current: "rendering", progress: 0 })

			const targetScreen = canvasRef.current!

			const gif = new GIF({ quality: 5, repeat: 0, background: "#000" })
			for (let frame = 0; frame < def.totalFrames; ++frame) {
				const targetBuffer = document.createElement("canvas")
				targetBuffer.width = targetScreen.width
				targetBuffer.height = targetScreen.height

				await defer(() => {
					render(targetBuffer, def.pattern, frame, assets, { fps: def.fps })
					setRendering({ current: "rendering", progress: (frame / def.totalFrames) })
					gif.addFrame(targetBuffer, { delay: 1000 / (def.speed * def.fps), copy: true })
				})
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

	const appStyles = useAppStyles()
	return (
		<div className={appStyles.root}>
			<Grid container>
				<Grid item />
				<Grid item style={{ flexGrow: 1 }}>
					<canvas width={def.resolution[0]} height={def.resolution[1]} ref={canvasRef} />
				</Grid>
				<Grid item />
			</Grid>
			<RenderingSpinner className={appStyles.spinner} status={rendering} />
		</div>
	)
}


