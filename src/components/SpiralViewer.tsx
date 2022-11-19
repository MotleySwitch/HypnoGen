
import React from "react"
import type { Assets } from "../effects/webgl"
import { RenderDef, useRenderToCanvas } from "../effects/webgl/webgl.react"

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
		<canvas className={className} width={def.resolution[0] > 0 ? def.resolution[0] : 32} height={def.resolution[1] > 0 ? def.resolution[1] : 32} ref={r => setCanvasRef(r)} onClick={onClick} />
	)
}
