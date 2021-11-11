import { Dialog, Grid, makeStyles, Typography } from "@material-ui/core"
import GIF from "gif.js"
import React from "react"
import HapticEditor from "./components/HapticEditor"
import PatternEditor from "./components/PatternEditor"
import SubliminalEditor from "./components/SubliminalEditor"
import { Canvas } from "./effects/Canvas"
import Pattern from "./effects/Pattern"
import SubliminalText, { RandomPosition } from "./effects/SubliminalText"
import { useButtplugDevices, useButtplugVibrate } from "./util/Buttplug"
import onKeyboard, { KeyState } from "./util/onKeyboard"
import useInterval from "./util/useInterval"
import useJsonFile from "./util/useJsonFile"
import { useQueryString, useQueryNumber, useQuery } from "./util/useQuery"

const useAppStyles = makeStyles({
	root: {
		position: "absolute",
		width: "100vw",
		height: "100vh",
		overflow: "hidden",
		cursor: "none",
		backgroundSize: "cover"
	}
}, { name: "App" })


export default function App() {
	const classes = useAppStyles()
	const [seed, _] = React.useState(Date.now)

	const timer = React.useRef(0)
	useInterval(() => { if (play) timer.current += 0.016 }, 16)

	const gif = React.useRef<GIF | null>()
	React.useEffect(() => {
		gif.current = new GIF({
			background: "#000",
			quality: 10,
			repeat: 0
		})
	}, [])
	const [recording, setRecording] = React.useState(false)
	const postDraw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
		if (gif.current && recording) {
			gif.current.addFrame(canvas, { delay: 16, copy: true })
		}
		return gif
	}

	const [showDrawer, setShowDrawer] = React.useState(false)
	onKeyboard((state, code) => {
		if (state == KeyState.Up && code === "Escape") {
			setShowDrawer(!showDrawer)
		} else if (!showDrawer) {
			const current = gif.current
			if (current && state === KeyState.Up && code === "KeyR") {
				if (!recording) {
					setRecording(true)
					timer.current = 0
					setTimeout(() => {
						setRecording(false)
						current.on("progress", e => {
						})
						current.on("finished", blob => {
							window.open(URL.createObjectURL(blob))
						})
						current.render()
						gif.current = new GIF()
					}, 8000)
				} else {
				}
			}
		}
	})

	const availableBackgrounds = useJsonFile<readonly string[]>("shaders/backgrounds.json")
	const availableForegrounds = useJsonFile<readonly string[]>("shaders/foregrounds.json")

	const [selectedBackground, setSelectedBackground] = useQueryString<string>("bg.pattern", "")
	const [backgroundSpeed, setBackgroundSpeed] = useQueryNumber<number>("bg.speed", 1.0)

	const [selectedForeground, setSelectedForeground] = useQueryString<string>("fg.pattern", "")
	const [foregroundSpeed, setForegroundSpeed] = useQueryNumber<number>("fg.speed", 1.0)

	const [subliminalSpacing, setSubliminalSpacing] = useQueryNumber<number>("sb.spacing", 1.0)
	const [subliminalSpeed, setSubliminalSpeed] = useQueryNumber<number>("sb.speed", 1.0)
	const [subliminalAnimation, setSubliminalAnimation] = useQueryString<"collapse" | "fade" | "grow" | "slide" | "zoom">("sb.anim", "fade")
	const [subliminalText, setSubliminalText] = useQuery<string>("sb.text")

	const [_v, vibrate] = useButtplugVibrate()
	const devices = useButtplugDevices()

	const play = !showDrawer

	useInterval(() => {
		if (devices.length === 0 || showDrawer) {
			vibrate(0)
			return
		}

		const speed = 0.25
		const shift = -0.25
		const min = 0.0
		const max = 0.5
		const mult = 1
		const value = (1 + Math.cos(timer.current * speed)) / 2
		vibrate(Math.min(max, Math.max(min, mult * (value + shift))))
	}, 100)

	return (
		<>
			<Canvas className={classes.root} postDraw={postDraw}>
				{(<>
					{selectedBackground && <Pattern zIndex={1} timer={() => timer.current} play={play} speed={backgroundSpeed} pattern={selectedBackground} />}
					{subliminalText.length > 0 && <SubliminalText
						zIndex={0}
						positionSelector={RandomPosition(seed)}
						timer={() => timer.current}
						play={play} animation={subliminalAnimation} speed={subliminalSpeed} spacing={subliminalSpacing}
						values={subliminalText} />}
					{selectedForeground && <Pattern zIndex={2} timer={() => timer.current} play={play} speed={foregroundSpeed} pattern={selectedForeground} />}
				</>)}
			</Canvas>

			<Dialog open={showDrawer}>
				<div style={{ padding: "1em" }}>
					<Typography variant="h1" paragraph>HypnoGen</Typography>

					<Grid container spacing={2} alignItems="center">
						<Grid item xs={12}>
							<Typography variant="h3" paragraph>Background</Typography>
							<PatternEditor patterns={availableBackgrounds ?? []} pattern={selectedBackground} speed={backgroundSpeed} onChange={({ pattern, speed }) => {
								setSelectedBackground(pattern)
								setBackgroundSpeed(speed)
							}} />
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h3" paragraph>Foreground</Typography>
							<PatternEditor patterns={availableForegrounds ?? []} pattern={selectedForeground} speed={foregroundSpeed} onChange={({ pattern, speed }) => {
								setSelectedForeground(pattern)
								setForegroundSpeed(speed)
							}} />
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h3" paragraph>Subliminals</Typography>
							<SubliminalEditor animation={subliminalAnimation} text={subliminalText} speed={subliminalSpeed} spacing={subliminalSpacing} onChange={({ animation, speed, spacing, text }) => {
								setSubliminalAnimation(animation)
								setSubliminalSpeed(speed)
								setSubliminalSpacing(spacing)
								setSubliminalText(text)
							}} />
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h3" paragraph>Haptics</Typography>
							<HapticEditor />
						</Grid>
					</Grid>
				</div>
			</Dialog>
		</>
	)
}
