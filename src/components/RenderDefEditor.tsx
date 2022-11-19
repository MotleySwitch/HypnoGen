import { Grid, makeStyles, TextField, Typography } from "@material-ui/core"
import React from "react"
import type { Assets } from "src/effects/webgl"
import type { RenderDef } from "src/effects/webgl/webgl.react"
import { PatternEditor } from "./PatternEditor"
import { SpiralViewer } from "./SpiralViewer"

export type RenderDefEditorProps = {
	readonly assets: Assets
	readonly value: RenderDef
	readonly onChange: (def: RenderDef) => void
}

const usePreviewStyles = makeStyles({
	root: {
		width: "320px"
	},
	background: {
		backgroundImage: "linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)",
		backgroundSize: "20px 20px",
		backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
		marginRight: "1em"
	}
})

export const RenderDefEditor = ({ assets, value, onChange }: RenderDefEditorProps) => {
	const { root, background } = usePreviewStyles()
	return (
		<>
			<Typography variant="h1" paragraph>Spiral Editor</Typography>

			<Typography variant="h2" paragraph>Pattern</Typography>
			<PatternEditor assets={assets} value={value.pattern} fps={value.fps} onChange={pattern => onChange({ ...value, pattern })} />

			<Grid container>
				<Grid item>
					<div style={{ padding: "1em" }} />
					<Typography variant="h2" paragraph>Preview</Typography>
					<div className={background}>
						<SpiralViewer className={root} def={value} assets={assets} />
					</div>
				</Grid>
				<Grid item style={{ flexGrow: 1 }}>
					<div style={{ padding: "1em" }} />
					<Typography variant="h2" paragraph>Resolution</Typography>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth margin="dense"
								type="number" label="Width"
								value={value.resolution[0]} onChange={e => onChange({ ...value, resolution: [parseInt(e.target.value || "0", 0), value.resolution[1]] })} />
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth margin="dense"
								type="number" label="Height"
								value={value.resolution[1]} onChange={e => onChange({ ...value, resolution: [value.resolution[0], parseInt(e.target.value || "0", 0)] })} />
						</Grid>
					</Grid>

					<div style={{ padding: "1em" }} />
					<Typography variant="h2" paragraph>Framerate</Typography>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} lg={4}>
							<TextField
								fullWidth margin="dense"
								type="number" label="FPS"
								value={value.fps} onChange={e => onChange({ ...value, fps: parseInt(e.target.value || "0", 0) })} />
						</Grid>
						<Grid item xs={12} sm={6} lg={4}>
							<TextField
								fullWidth margin="dense"
								type="number" label="Total Frames"
								value={value.totalFrames} onChange={e => onChange({ ...value, totalFrames: parseInt(e.target.value || "0", 0) })} />
						</Grid>
						<Grid item xs={12} lg={4}>
							<TextField
								fullWidth margin="dense"
								type="number" label="Speed"
								value={value.speed} onChange={e => onChange({ ...value, speed: parseFloat(e.target.value || "0") })} />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}
