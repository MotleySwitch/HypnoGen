import { Grid, MenuItem, Select, Slider, TextField, Typography } from "@material-ui/core"
import React from "react"

export default function PatternEditor({ text, speed, spacing, onChange }: {
	readonly text: readonly string[]
	readonly speed: number
	readonly spacing: number
	readonly onChange: (value: {
		readonly text: readonly string[]
		readonly speed: number
		readonly spacing: number
	}) => void
}) {
	return (
		<Grid container spacing={2} alignItems="center">
			<Grid item xs={12}>
				<TextField label="Messages" multiline fullWidth
					value={text.join("\n")}
					onChange={e => onChange({ spacing, speed, text: e.target.value.split("\n") })} />
			</Grid>

			<Grid item xs={12}>
				<Grid container spacing={2} alignItems="center">
					<Grid item>
						<Typography variant="body1"><strong>Speed</strong></Typography>
					</Grid>
					<Grid item xs>
						<Slider
							value={speed}
							min={0} max={2} step={0.05}
							onChange={(_, e) => { onChange({ spacing, text, speed: e as number}) }} />
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
							onChange={(_, e) => { onChange({ speed, text, spacing: e as number}) }} />
					</Grid>
					<Grid item>
						<Typography style={{ minWidth: "2em" }} variant="body1">{spacing}</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}