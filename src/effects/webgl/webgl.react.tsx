import React, { useEffect } from "react"
import useWindowResolution from "../../util/useWindowResolution"
import { useQueryJson, useQueryNumber } from "../../util/useQuery"
import { useRequestAnimationFrameAsync } from "../../util/useRequestAnimationFrame"
import { Assets, DrawCommand, extractUsedImages, extractUsedLocalShaders, extractUsedShaders, extractUsedVideos, ImageStore, loadImageAssets, loadLocalShaderAssets, loadShaderAssets, loadVideoAssets, render, ShaderStore, VideoStore } from "../webgl"
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
	const [speed, setSpeed] = useQueryNumber<number>("speed", 1)
	const [fps, setFps] = useQueryNumber<number>("fps", 60)
	const [totalFrames, setTotalFrames] = useQueryNumber<number>("total-frames", fps)
	const [resolution, setResolution] = useQueryJson<readonly [number, number]>("screen", [1280, 720])

	//const [pattern, setPattern] = React.useState<readonly DrawCommand[]>([])
	//const [speed, setSpeed] = React.useState<number>(1)
	//const [fps, setFps] = React.useState<number>(60)
	//const [totalFrames, setTotalFrames] = React.useState<number>(fps)
	//const [resolution, setResolution] = React.useState<readonly [number, number]>([1280, 720])

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


export const useRenderFrameToCanvas = (target: HTMLCanvasElement | null, {
	frame,
	def,
	assets
}: {
	readonly frame: number
	readonly def: RenderDef
	readonly assets: Assets
}) => {
	useEffect(() => {
		if (!target) {
			return
		}

		let abort = false

		const buffer = document.createElement("canvas")
		buffer.width = target.width
		buffer.height = target.height

		const actualFrame = (def.totalFrames > 0 ? frame % def.totalFrames : frame)
		if (target != null && assets != null) {
			render(buffer, def.pattern, actualFrame, assets, { fps: def.fps }).then(() => {
				if (!abort) {
					clear(target)
					target.getContext("2d")?.drawImage(buffer, 0, 0)
				}
			})
		}

		return () => { abort = true }
	}, [def, assets, frame, target])
}

export function useAssets(def: RenderDef): Assets {
	const windowSize = useWindowResolution()
	const size = React.useMemo(() => {
		return [
			def.resolution[0] > 0 ? def.resolution[0] : windowSize[0],
			def.resolution[1] > 0 ? def.resolution[1] : windowSize[1]
		] as readonly [number, number]
	}, [def, windowSize])


	const shaderPaths = React.useMemo(() => extractUsedShaders(def.pattern), [def.pattern])
	const localShaderDefs = React.useMemo(() => extractUsedLocalShaders(def.pattern), [def.pattern])
	const imagePaths = React.useMemo(() => extractUsedImages(def.pattern), [def.pattern])
	const videoPaths = React.useMemo(() => extractUsedVideos(def.pattern), [def.pattern])

	const [remoteShaders, setRemoteShaders] = React.useState<ShaderStore>({})
	const [localShaders, setLocalShaders] = React.useState<ShaderStore>({})
	const [images, setImages] = React.useState<ImageStore>({})
	const [videos, setVideos] = React.useState<VideoStore>({})

	React.useEffect(() => {
		let abort = false
		loadShaderAssets(size, shaderPaths).then((result) => {
			if (!abort) { setRemoteShaders(result) }
		})
		return () => { abort = true }
	}, [size, shaderPaths.join("|")])

	React.useEffect(() => {
		let abort = false
		loadLocalShaderAssets(size, localShaderDefs).then((result) => {
			if (!abort) { setLocalShaders(result) }
		})
		return () => { abort = true }
	}, [size, localShaderDefs.map(([k, v]) => k + "|" + v).join("|")])

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

	const shaders = React.useMemo(() => ({ ...localShaders, ...remoteShaders }), [localShaders, remoteShaders])

	return { shaders, images, videos }
}
