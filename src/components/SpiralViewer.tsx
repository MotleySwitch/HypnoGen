
import React from "react"
import useWindowResolution from "../util/useWindowResolution"
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
	const windowSize = useWindowResolution()
	const sizedDef = React.useMemo(() => ({
		...def,
		resolution: [
			def.resolution[0] > 0 ? def.resolution[0] : windowSize[0],
			def.resolution[1] > 0 ? def.resolution[1] : windowSize[1]
		] as readonly [number, number]
	}), [def, windowSize])

	const [canvasRef, setCanvasRef] = React.useState<HTMLCanvasElement | null>(null)
	useRenderToCanvas(canvasRef, { enable: !disabled, assets, def: sizedDef })

	return (
		<canvas className={className} width={sizedDef.resolution[0]} height={sizedDef.resolution[1]} ref={r => setCanvasRef(r)} onClick={onClick} />
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
	const windowSize = useWindowResolution()

	const sizedDef = React.useMemo(() => ({
		...def,
		resolution: [
			def.resolution[0] > 0 ? def.resolution[0] : windowSize[0],
			def.resolution[1] > 0 ? def.resolution[1] : windowSize[1]
		] as readonly [number, number]
	}), [def])

	useRenderFrameToCanvas(canvasRef, { frame, assets, def: sizedDef })

	return (
		<canvas className={className} width={def.resolution[0]} height={def.resolution[1]} ref={r => setCanvasRef(r)} onClick={onClick} />
	)
}
