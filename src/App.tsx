import { Button, Dialog, DialogActions, DialogContent } from "@material-ui/core"
import React from "react"
import { RenderDefEditor } from "./components/RenderDefEditor"
import { RenderingSpinner } from "./components/RenderingStatus"
import { SpiralViewer } from "./components/SpiralViewer"
import { useRenderToGIF } from "./effects/webgl"
import { useAssets, useRenderDef } from "./effects/webgl/webgl.react"

export default function App() {
	const [openEditor, setEditorOpen] = React.useState(false)

	const [def, setRenderDef] = useRenderDef()
	const assets = useAssets(def)

	const [rendering, renderToGIF] = useRenderToGIF(def, assets)
	return (
		<>
			<SpiralViewer def={def} assets={assets} onClick={() => setEditorOpen(true)} />
			<Dialog open={openEditor} maxWidth="xl" fullWidth>
				<DialogContent>
					<RenderDefEditor value={def} onChange={setRenderDef} />
				</DialogContent>
				<DialogActions>
					<Button color="secondary" onClick={() => setEditorOpen(false)}>Close</Button>
					<Button color="primary" onClick={() => {
						setEditorOpen(false)
						renderToGIF()
					}}>Render</Button>
				</DialogActions>
			</Dialog>
			<RenderingSpinner status={rendering} />
		</>
	)
}
