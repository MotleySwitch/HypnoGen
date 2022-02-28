import React from "react"
import { useQueryJson, useQueryNumber } from "../../util/useQuery"
import useRequestAnimationFrame from "../../util/useRequestAnimationFrame"
import { Assets, DrawCommand, extractUsedShaders, loadShaderAssets, render, ShaderStore } from "../webgl"

export type RenderDef = {
	readonly pattern: readonly DrawCommand[]
	readonly speed: number
	readonly fps: number
	readonly totalFrames: number
	readonly resolution: readonly [number, number]
}

export const useRenderDef = (): readonly [RenderDef, (def: RenderDef) => void] => {
	const [pattern, setPattern] = useQueryJson<readonly DrawCommand[]>("pattern", [])
	const [speed, setSpeed] = useQueryNumber("speed", 1 as number)
	const [fps, setFps] = useQueryNumber("fps", 60 as number)
	const [totalFrames, setTotalFrames] = useQueryNumber("total-frames", fps)
	const [resolution, setResolution] = useQueryJson<readonly [number, number]>("screen", [1280, 720])

	const def = React.useMemo(() => ({ pattern, speed, fps, totalFrames, resolution }), [pattern, speed, fps, totalFrames, resolution])

	return [
		def,
		(def: RenderDef) => {
			setPattern(def.pattern)
			setSpeed(def.speed)
			setFps(def.fps)
			setTotalFrames(def.totalFrames)
			setResolution(def.resolution)
		}
	]
}

export const useRenderToCanvas = (target: HTMLCanvasElement | null, {
	enable,
	def,
	assets
}: {
	readonly enable: boolean
	readonly def: RenderDef
	readonly assets: Assets
}) => {
	const lastUpdate = React.useRef(performance.now())
	const frame = React.useRef(0)
	useRequestAnimationFrame(() => {
		const last = lastUpdate.current
		const now = performance.now()
		const frameLength = (1.0 / def.fps)

		let delta = (now - last) / 1000
		if (delta < frameLength) {
			return
		}

		while (delta >= (frameLength / def.speed)) {
			frame.current = frame.current + 1
			delta = delta - (frameLength / def.speed)
		}
		lastUpdate.current = performance.now() - delta

		const actualFrame = def.totalFrames > 0 ? frame.current % def.totalFrames : frame.current
		if (target != null && assets != null) {
			render(target, def.pattern, actualFrame, assets, { fps: def.fps })
		}
	}, [enable, def, assets, target])
}

export function useAssets(def: RenderDef): Assets {
	const assets = React.useMemo(() => extractUsedShaders(def.pattern), [def.pattern])
	const [shaders, setShaders] = React.useState<ShaderStore>({})

	React.useEffect(() => {
		let abort = false
		loadShaderAssets(def.resolution, assets).then(result => {
			if (!abort) { setShaders(result) }
		})
		return () => { abort = true }
	}, [def.resolution, assets.join("|")])

	return { shaders }
}
