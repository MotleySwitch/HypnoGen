import React from "react"
import { useQueryJson, useQueryNumber } from "../../util/useQuery"
import useRequestAnimationFrame, { useRequestAnimationFrameAsync } from "../../util/useRequestAnimationFrame"
import { Assets, DrawCommand, extractUsedImages, extractUsedShaders, extractUsedVideos, ImageStore, loadImageAssets, loadShaderAssets, loadVideoAssets, render, ShaderStore, VideoStore } from "../webgl"
import { clear } from "./Draw"

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
	const buffer = React.useRef<HTMLCanvasElement>()
	useRequestAnimationFrameAsync(async () => {
		if (!enable || !target) {
			return
		}

		if (buffer.current == null || buffer.current.width !== target.width || buffer.current.height !== target.height) {
			buffer.current = document.createElement("canvas")
			buffer.current.width = target.width
			buffer.current.height = target.height
		}
		const last = lastUpdate.current
		const now = performance.now()
		const frameLength = (1.0 / (def.fps * def.speed))

		let delta = (now - last) / 1000
		if (delta < frameLength) {
			return
		}

		while (delta >= frameLength) {
			frame.current = frame.current + 1
			delta = delta - frameLength
		}
		lastUpdate.current = performance.now() - delta

		const actualFrame = (def.totalFrames > 0 ? frame.current % def.totalFrames : frame.current)
		if (target != null && assets != null) {
			await render(buffer.current, def.pattern, actualFrame, assets, { fps: def.fps })

			clear(target)
			target.getContext("2d")?.drawImage(buffer.current, 0, 0)
		}
	}, [enable, def, assets, target])
}

export function useAssets(def: RenderDef): Assets {
	const shaderPaths = React.useMemo(() => extractUsedShaders(def.pattern), [def.pattern])
	const imagePaths = React.useMemo(() => extractUsedImages(def.pattern), [def.pattern])
	const videoPaths = React.useMemo(() => extractUsedVideos(def.pattern), [def.pattern])

	const [shaders, setShaders] = React.useState<ShaderStore>({})
	const [images, setImages] = React.useState<ImageStore>({})
	const [videos, setVideos] = React.useState<VideoStore>({})

	React.useEffect(() => {
		let abort = false
		loadShaderAssets(def.resolution, shaderPaths).then((result) => {
			if (!abort) { setShaders(result) }
		})
		return () => { abort = true }
	}, [def.resolution, shaderPaths.join("|")])

	React.useEffect(() => {
		let abort = false
		loadImageAssets(imagePaths).then((result) => {
			if (!abort) { setImages(result) }
		})
		return () => { abort = true }
	}, [imagePaths.join("|")])

	React.useEffect(() => {
		let abort = false
		loadVideoAssets(videoPaths).then((result) => {
			if (!abort) { setVideos(result) }
		})
		return () => { abort = true }
	}, [videoPaths.join("|")])

	return { shaders, images, videos }
}
