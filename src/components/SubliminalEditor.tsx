import { Grid, MenuItem, Select, Slider, TextField, Typography } from "@material-ui/core"
import React from "react"

export default function PatternEditor({ text, speed, spacing, animation, onChange }: {
	readonly text: readonly string[]
	readonly speed: number
	readonly spacing: number
	readonly animation: "collapse" | "fade" | "grow" | "slide" | "zoom"
	readonly onChange: (value: {
		readonly text: readonly string[]
		readonly speed: number
		readonly spacing: number
		readonly animation: "collapse" | "fade" | "grow" | "slide" | "zoom"
	}) => void
}) {
	return (
		<Grid container spacing={2} alignItems="center">
			<Grid item xs={12}>
				<TextField label="Messages" multiline fullWidth
					value={text.join("\n")}
					onChange={e => onChange({ animation, spacing, speed, text: e.target.value.split("\n") })} />
			</Grid>

			<Grid item xs={12}>
				<Select fullWidth label="Animation" value={animation} onChange={e => onChange({ animation: e.target.value as ("collapse" | "fade" | "grow" | "slide" | "zoom"), spacing, speed, text })}>
					<MenuItem value="collapse">Collapse</MenuItem>
					<MenuItem value="fade">Fade</MenuItem>
					<MenuItem value="grow">Grow</MenuItem>
					<MenuItem value="slide">Slide</MenuItem>
					<MenuItem value="zoom">Zoom</MenuItem>
				</Select>
			</Grid>

			<Grid item xs={12}>
				<Grid container spacing={2} alignItems="center">
					<Grid item>
						<Typography variant="body1"><strong>Speed</strong></Typography>
					</Grid>
					<Grid item xs>
						<Slider
							value={speed}
							min={0} max={5} step={0.25}
							onChange={(_, e) => { onChange({ animation, spacing, text, speed: e as number }) }} />
					</Grid>
					<Grid item>
						<Typography style={{ minWidth: "2em" }} variant="body1">{speed}</Typography>
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12}>
				<Grid container spacing={2} alignItems="center">
					<Grid item>
						<Typography variant="body1"><strong>Spacing</strong></Typography>
					</Grid>
					<Grid item xs>
						<Slider
							value={spacing}
							min={0} max={5} step={1.0}
							onChange={(_, e) => { onChange({ animation, speed, text, spacing: e as number }) }} />
					</Grid>
					<Grid item>
						<Typography style={{ minWidth: "2em" }} variant="body1">{spacing}</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}