import { Grid, Slider, styled, TextField, Typography } from "@mui/material"
import React from "react"
import type { Assets } from "src/effects/webgl"
import type { RenderDef } from "src/effects/webgl/webgl.react"
import { PatternEditor } from "./PatternEditor"
import { SpiralFrameViewer, SpiralViewer } from "./SpiralViewer"

export type RenderDefEditorProps = {
	readonly assets: Assets
	readonly value: RenderDef
	readonly onChange: (def: RenderDef) => void
}

const PreviewStyles = styled("div")({
	"& .root": {
		marginRight: "1em"
	},
	"& .canvas": {
		width: "320px",
		verticalAlign: "top",
		cursor: "pointer"
	},
	"& .background": {
		backgroundImage: "linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)",
		backgroundSize: "20px 20px",
		backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
	}
})

export const RenderDefEditor = ({ assets, value, onChange }: RenderDefEditorProps) => {
	const [enablePreviewTimeSelector, setEnablePreviewTimeSelector] = React.useState(false)
	const [targetFrame, setTargetFrame] = React.useState(0)
	return (
		<PreviewStyles>
			<Typography variant="h1" paragraph>Spiral Editor</Typography>

			<Typography variant="h2" paragraph>Pattern</Typography>
			<PatternEditor assets={assets} value={value.pattern} fps={value.fps} onChange={pattern => onChange({ ...value, pattern })} />

			<Grid container>
				<Grid item>
					<div style={{ padding: "1em" }} />
					<Typography variant="h2" paragraph>Preview</Typography>

					<div className="root">
						{!enablePreviewTimeSelector
							? <div className="background">
								<SpiralViewer className="canvas" def={value} assets={assets} onClick={() => setEnablePreviewTimeSelector(true)} />
							</div>
							: <div>
								<div className="background">
									<SpiralFrameViewer className="canvas" def={value} assets={assets} frame={targetFrame} onClick={() => setEnablePreviewTimeSelector(false)} />
								</div>

								<div>
									{value.totalFrames == 0
										? <TextField value={targetFrame} type="number" inputProps={{ min: 0 }} onChange={e => setTargetFrame(parseInt(e.target.value, 0))} />
										: <Slider step={1} valueLabelDisplay="auto" value={targetFrame} min={0} max={value.totalFrames - 1} onChange={(_, e) => setTargetFrame(e as number)} />}
								</div>
							</div>}
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
		</PreviewStyles>
	)
}
