
import { makeStyles } from "@material-ui/core"
import React from "react"
import type { Assets } from "../effects/webgl"
import { RenderDef, useRenderToCanvas } from "../effects/webgl/webgl.react"

const useSpiralViewerStyles = makeStyles({
	root: {
		objectFit: "cover",
		width: "100%",
		height: "100vh"
	}
}, { name: "SpiralViewer" })

export type SpiralViewerProps = {
	readonly def: RenderDef
	readonly assets: Assets 
	readonly onClick?: () => void
}

export const SpiralViewer = ({ def, assets, onClick }: SpiralViewerProps) => {
	const { root } = useSpiralViewerStyles()
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
	useRenderToCanvas(canvasRef.current, { enable: true, assets, def })

	return (
		<canvas className={root} width={def.resolution[0]} height={def.resolution[1]} ref={canvasRef} onClick={onClick} />
	)
}
