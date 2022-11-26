
import React from "react"
import type { Assets } from "../effects/webgl"
import { RenderDef, useRenderFrameToCanvas, useRenderToCanvas } from "../effects/webgl/webgl.react"

export type SpiralViewerProps = {
	readonly disabled?: boolean
	readonly className?: string
	readonly def: RenderDef
	readonly assets: Assets 
	readonly onClick?: () => void
}

export const SpiralViewer = ({ disabled, className, def, assets, onClick }: SpiralViewerProps) => {
	const [canvasRef, setCanvasRef] = React.useState<HTMLCanvasElement | null>(null)
	useRenderToCanvas(canvasRef, { enable: !disabled, assets, def })

	return (
		<canvas className={className} width={def.resolution[0] > 0 ? def.resolution[0] : window.innerWidth} height={def.resolution[1] > 0 ? def.resolution[1] : window.innerHeight} ref={r => setCanvasRef(r)} onClick={onClick} />
	)
}


export type SpiralFrameViewerProps = {
	readonly className?: string
	readonly frame: number
	readonly def: RenderDef
	readonly assets: Assets 
	readonly onClick?: () => void
}

export const SpiralFrameViewer = ({ className, frame, def, assets, onClick }: SpiralFrameViewerProps) => {
	const [canvasRef, setCanvasRef] = React.useState<HTMLCanvasElement | null>(null)
	useRenderFrameToCanvas(canvasRef, { frame, assets, def })

	return (
		<canvas className={className} width={def.resolution[0] > 0 ? def.resolution[0] : 32} height={def.resolution[1] > 0 ? def.resolution[1] : 32} ref={r => setCanvasRef(r)} onClick={onClick} />
	)
}
