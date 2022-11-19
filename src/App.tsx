import React from "react"
import { Button, Dialog, DialogActions, DialogContent, Grid, makeStyles } from "@material-ui/core"

import { RenderDefEditor } from "./components/RenderDefEditor"
import { RenderingSpinner } from "./components/RenderingStatus"
import { SpiralViewer } from "./components/SpiralViewer"
import { useRenderToGIF } from "./effects/webgl"
import { useAssets, useRenderDef } from "./effects/webgl/webgl.react"

const useSpiralViewerStyles = makeStyles({
	page: {
		objectFit: "cover",
		width: "100%",
		height: "100vh"
	}
}, { name: "SpiralViewer" })

export default function App() {
	const { page } = useSpiralViewerStyles()

	const [openEditor, setEditorOpen] = React.useState(false)

	const [def, setRenderDef] = useRenderDef()
	const assets = useAssets(def)

	const [rendering, renderToGIF] = useRenderToGIF(def, assets)
	return (
		<>
			<SpiralViewer disabled={openEditor || rendering.current !== "no"} className={page} def={def} assets={assets} onClick={() => setEditorOpen(true)} />
			<Dialog open={openEditor} maxWidth="xl" fullWidth>
				<DialogContent>
					<RenderDefEditor assets={assets} value={def} onChange={setRenderDef} />
				</DialogContent>
				<DialogActions>
					<Button color="secondary" onClick={() => setEditorOpen(false)}>Close</Button>
					<Button color="primary" disabled={def.totalFrames <= 0} onClick={() => {
						setEditorOpen(false)
						renderToGIF()
					}}>Render</Button>
				</DialogActions>
			</Dialog>
			<RenderingSpinner status={rendering} />
		</>
	)
}
