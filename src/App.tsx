import { createTheme, CssBaseline, Dialog, Grid, MuiThemeProvider, ThemeOptions, Typography } from "@material-ui/core"
import React from "react"
import PatternEditor from "./components/PatternEditor"
import SubliminalEditor from "./components/SubliminalEditor"
import Pattern from "./effects/Pattern"
import SubliminalText from "./effects/SubliminalText"
import onKeyboard, { KeyState } from "./util/onKeyboard"
import useJsonFile from "./util/useJsonFile"
import { useQueryString, useQueryNumber, useQuery } from "./util/useQuery"

const theme: ThemeOptions = {
	overrides: {
		MuiTypography: {
			h1: { fontSize: "2rem", fontWeight: 600 },
			h2: { fontSize: "1.5rem", fontWeight: 600 },
			h3: { fontSize: "1.25rem", fontWeight: 600 },
			h4: { fontSize: "1rem" },
			h5: { fontSize: "0.75rem" },
		},
		MuiCssBaseline: {
			"@global": {
				"body": {
					position: "absolute",
					width: "100vw",
					height: "100vh",
					backgroundColor: "black",
					overflow: "hidden"
				}
			}
		}
	}
}

export default function App() {
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

	return (
		<MuiThemeProvider theme={createTheme(theme)}>
			<CssBaseline>
				<>
					<div style={{
						position: "absolute",
						width: "100vw",
						height: "100vh",
						backgroundColor: "black",
						overflow: "hidden",
						cursor: "none"
					}}>
						<Pattern play={!!selectedBackground && play} speed={backgroundSpeed} pattern={selectedBackground} />

						<SubliminalText
							seed={seed}
							play={subliminalText && play} animation={subliminalAnimation} speed={subliminalSpeed} spacing={subliminalSpacing}
							values={subliminalText} />

						<Pattern play={!!selectedForeground && play} speed={foregroundSpeed} pattern={selectedForeground} />
					</div>
				</>
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
								<SubliminalEditor text={subliminalText} speed={subliminalSpeed} spacing={subliminalSpacing} onChange={({ speed, spacing, text }) => {
									setSubliminalSpeed(speed)
									setSubliminalSpacing(spacing)
									setSubliminalText(text)
								}} />
							</Grid>
						</Grid>
					</div>
				</Dialog>
			</CssBaseline>
		</MuiThemeProvider >
	)
}
