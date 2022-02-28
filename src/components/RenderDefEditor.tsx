import { Divider, Grid, TextField, Typography } from "@material-ui/core"
import React from "react"
import type { RenderDef } from "src/effects/webgl/webgl.react"
import { PatternEditor } from "./PatternEditor"

export type RenderDefEditorProps = {
	readonly value: RenderDef
	readonly onChange: (def: RenderDef) => void
}

export const RenderDefEditor = ({ value, onChange }: RenderDefEditorProps) => {
	return (
		<>
			<Typography variant="h1" paragraph>Spiral Editor</Typography>

			<Typography variant="h2" paragraph>Pattern</Typography>
			<PatternEditor value={value.pattern} onChange={pattern => onChange({ ...value, pattern })} />

			<Typography variant="h2" paragraph>Resolution</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
					<TextField
						fullWidth margin="dense"
						type="number" label="Width"
						value={value.resolution[0]} onChange={e => onChange({ ...value, resolution: [parseInt(e.target.value, 0), value.resolution[1]] })} />
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						fullWidth margin="dense"
						type="number" label="Height"
						value={value.resolution[1]} onChange={e => onChange({ ...value, resolution: [value.resolution[0], parseInt(e.target.value, 0)] })} />
				</Grid>
			</Grid>

			<Typography variant="h2" paragraph>Framerate</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} lg={4}>
					<TextField
						fullWidth margin="dense"
						type="number" label="FPS"
						value={value.fps} onChange={e => onChange({ ...value, fps: parseInt(e.target.value, 0) })} />
				</Grid>
				<Grid item xs={12} sm={6} lg={4}>
					<TextField
						fullWidth margin="dense"
						type="number" label="Total Frames"
						value={value.totalFrames} onChange={e => onChange({ ...value, totalFrames: parseInt(e.target.value, 0) })} />
				</Grid>
				<Grid item xs={12} lg={4}>
					<TextField
						fullWidth margin="dense"
						type="number" label="Speed"
						value={value.speed} onChange={e => onChange({ ...value, speed: parseInt(e.target.value, 0) })} />
				</Grid>
			</Grid>
		</>
	)
}
