import React from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, Grid, TextField } from "@mui/material"

import { RenderDefEditor } from "./components/RenderDefEditor"
import { RenderingSpinner } from "./components/RenderingStatus"
import { SpiralViewer } from "./components/SpiralViewer"
import { useRenderVideo } from "./effects/webgl"
import { useAssets, useRenderDef } from "./effects/webgl/webgl.react"
import styled from "@emotion/styled"
import { useSearch } from "./util/useQuery"

const SpiralViewerStyles = styled("div")({
	"& .page": {
		objectFit: "cover",
		width: "100%",
		height: "100vh"
	}
})

export default function App() {
	const [openEditor, setEditorOpen] = React.useState(false)

	const [def, setRenderDef] = useRenderDef()
	const assets = useAssets(def)

	const render = useRenderVideo(def, assets)
	const [search, _] = useSearch()

	return (
		<SpiralViewerStyles>
			<SpiralViewer disabled={openEditor || render.status.current !== "no"} className="page" def={def} assets={assets} onClick={() => setEditorOpen(true)} />
			<Dialog open={openEditor} fullScreen>
				<DialogActions>
					<Button component="a" href={`${window.location.origin}${window.location.pathname}${search}`}>Link</Button>
					<Box sx={{ flexGrow: 1 }} />

					<Button component="a" download href={URL.createObjectURL(new Blob([JSON.stringify(def)], { type: "application/json" }))} color="primary">
						Download JSON
					</Button>
					<Button color="secondary" component="label">
						<input
							type="file"
							hidden
							value=""
							onChange={async e => {
								if (e.target.files != null && e.target.files.length > 0) {
									const json = new TextDecoder().decode(new Uint8Array(await e.target.files[0].arrayBuffer()));
									try {
										const def = JSON.parse(json);
										if (def != null) {
											setRenderDef(def)
										}
									} catch (e) {
										alert("Upload failed")
									}
								} else {
									alert("File not found?")
								}
							}}
						/>
						Upload
					</Button>
				</DialogActions>
				<DialogContent>
					<RenderDefEditor assets={assets} value={def} onChange={setRenderDef} />
				</DialogContent>
				<DialogActions>
					<Button color="secondary" onClick={() => setEditorOpen(false)}>Close</Button>

					<Button color="primary" disabled={!render.isReady || def.totalFrames <= 0} onClick={() => {
						setEditorOpen(false)
						render.export("GIF")
					}}>Render (GIF)</Button>

					<Button color="primary" disabled={!render.isReady || def.totalFrames <= 0} onClick={() => {
						setEditorOpen(false)
						render.export("MP4")
					}}>Render (MP4)</Button>

					<Button color="primary" disabled={!render.isReady || def.totalFrames <= 0} onClick={() => {
						setEditorOpen(false)
						render.export("WEBP")
					}}>Render (WEBP)</Button>
				</DialogActions>
			</Dialog>
			<RenderingSpinner status={render.status} />
		</SpiralViewerStyles>
	)
}
