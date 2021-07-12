import { Dialog, Grid, makeStyles, Typography } from "@material-ui/core"
import React from "react"
import PatternEditor from "./components/PatternEditor"
import SubliminalEditor from "./components/SubliminalEditor"
import { Canvas } from "./effects/Canvas"
import Pattern from "./effects/Pattern"
import SubliminalText, { RandomPosition } from "./effects/SubliminalText"
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

	const [showDrawer, setShowDrawer] = React.useState(false)
	onKeyboard((state, code) => {
		if (state == KeyState.Up && code === "Escape") {
			setShowDrawer(!showDrawer)
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

	const play = !showDrawer

	const timer = React.useRef(0)
	useInterval(() => { if (play) timer.current += 0.016 }, 16)

	return (
		<>
			<Canvas className={classes.root}>
				{(<>
					<Pattern zIndex={0} timer={() => timer.current} play={play} speed={backgroundSpeed} pattern={selectedBackground} />
					<Pattern zIndex={2} timer={() => timer.current} play={play} speed={foregroundSpeed} pattern={selectedForeground} />
				</>)}
			</Canvas>

			<SubliminalText
				zIndex={1}
				positionSelector={RandomPosition(seed)}
				play={subliminalText && play} animation={subliminalAnimation} speed={subliminalSpeed} spacing={subliminalSpacing}
				values={subliminalText} />

			<Dialog open={showDrawer}>
				<div style={{ padding: "1em" }}>
					<Typography variant="h1" paragraph>HypnoGen</Typography>

					<Grid container spacing={2} alignItems="center">
						<Grid item xs={12}>
							<Typography variant="h3">Background</Typography>
							<PatternEditor patterns={availableBackgrounds ?? []} pattern={selectedBackground} speed={backgroundSpeed} onChange={({ pattern, speed }) => {
								setSelectedBackground(pattern)
								setBackgroundSpeed(speed)
							}} />
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h3">Foreground</Typography>
							<PatternEditor patterns={availableForegrounds ?? []} pattern={selectedForeground} speed={foregroundSpeed} onChange={({ pattern, speed }) => {
								setSelectedForeground(pattern)
								setForegroundSpeed(speed)
							}} />
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h3">Subliminals</Typography>
							<SubliminalEditor animation={subliminalAnimation} text={subliminalText} speed={subliminalSpeed} spacing={subliminalSpacing} onChange={({ animation, speed, spacing, text }) => {
								setSubliminalAnimation(animation)
								setSubliminalSpeed(speed)
								setSubliminalSpacing(spacing)
								setSubliminalText(text)
							}} />
						</Grid>
					</Grid>
				</div>
			</Dialog>
		</>
	)
}
