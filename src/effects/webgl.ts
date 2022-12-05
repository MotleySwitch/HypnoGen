import GIF from "gif.js"
import React from "react"
import useWindowResolution from "../util/useWindowResolution"
import defer from "../util/defer"
import type { Color } from "./webgl/Color"
import { clear, clipCircle, clipRect, fill, opacity, renderFadeInToCanvas, renderFadeOutToCanvas, renderFlashFillToCanvas, renderFlashToCanvas, renderSwitchToCanvas, rotate } from "./webgl/Draw"
import { loadImage, renderImageToCanvas } from "./webgl/Image"
import { createPatternShader, createPatternShaderFromText, PatternShader, renderSpiralShaderToCanvas } from "./webgl/Pattern"
import { TextAlign, FlashTextStyle, renderFlashTextToCanvas, renderSubliminalToCanvas, renderTextToCanvas, TextStyle, SubliminalStyle } from "./webgl/Text"
import { loadVideo, renderVideoToCanvas } from "./webgl/Video"
import type { RenderDef } from "./webgl/webgl.react"

export type DrawCommandType =
	| "fill"
	| "opacity"
	| "frame-offset"
	| "change-speed"
	| "hide-after"
	| "show-after"
	| "rotate-by"
	| "rotating"
	| "clip-circle"
	| "clip-rect"
	| "pattern"
	| "local-pattern"
	| "text"
	| "subliminal"
	| "fade-in"
	| "fade-out"
	| "flash"
	| "flash-text"
	| "flash-fill"
	| "image"
	| "video"

export type DrawCommandDef = { readonly type: DrawCommandType; readonly name: string }

export const AvailableDrawCommands: readonly DrawCommandDef[] = ([
	{
		"type": "change-speed",
		"name": "Change Speed"
	},
	{
		"type": "clip-circle",
		"name": "Clip (Circle)"
	},
	{
		"type": "clip-rect",
		"name": "Clip (Rectangle)"
	},
	{
		"type": "fade-in",
		"name": "Fade In"
	},
	{
		"type": "fade-out",
		"name": "Fade Out"
	},
	{
		"type": "fill",
		"name": "Fill"
	},
	{
		"type": "flash",
		"name": "Flash"
	},
	{
		"type": "flash-fill",
		"name": "Flash (Fill)"
	},
	{
		"type": "flash-text",
		"name": "Flash (Text)"
	},
	{
		"type": "frame-offset",
		"name": "Frame Offset"
	},
	{
		"type": "hide-after",
		"name": "Hide After"
	},
	{
		"type": "image",
		"name": "Image"
	},
	{
		"type": "opacity",
		"name": "Opacity"
	},
	{
		"type": "pattern",
		"name": "Pattern"
	},
	{
		"type": "local-pattern",
		"name": "Pattern (GLSL)"
	},
	{
		"type": "rotate-by",
		"name": "Rotate By"
	},
	{
		"type": "rotating",
		"name": "Rotating"
	},
	{
		"type": "show-after",
		"name": "Show After"
	},
	{
		"type": "subliminal",
		"name": "Subliminal"
	},
	{
		"type": "switch",
		"name": "Switch"
	},
	{
		"type": "text",
		"name": "Text"
	},
	{
		"type": "video",
		"name": "Video"
	}
] as DrawCommandDef[]).sort((a, b) => a.name > b.name ? 1 : -1)

export type DrawCommand =
	| { readonly type: "fill"; readonly color: Color }
	| { readonly type: "opacity"; readonly value: number; readonly children: readonly DrawCommand[] }
	| { readonly type: "frame-offset"; readonly by: number; readonly children: readonly DrawCommand[] }
	| { readonly type: "change-speed"; readonly factor: number; readonly children: readonly DrawCommand[] }
	| { readonly type: "show-after"; readonly frames: number; readonly children: readonly DrawCommand[] }
	| { readonly type: "hide-after"; readonly frames: number; readonly children: readonly DrawCommand[] }
	| {
		readonly type: "clip-circle"
		readonly origin: readonly [number, number]
		readonly radius: number
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "clip-rect"
		readonly origin: readonly [number, number]
		readonly size: readonly [number, number]
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "pattern"
		readonly pattern: string
		readonly colors: {
			readonly fg?: Color
			readonly bg?: Color
			readonly dim?: Color
			readonly pulse?: Color
			readonly extra?: Color
		}
	}
	| {
		readonly type: "local-pattern"
		readonly pattern: string
		readonly colors: {
			readonly fg?: Color
			readonly bg?: Color
			readonly dim?: Color
			readonly pulse?: Color
			readonly extra?: Color
		}
	}
	| {
		readonly type: "text"
		readonly value: string
		readonly style?: TextStyle
	}
	| {
		readonly type: "rotating"
		readonly speed: number
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "rotate-by"
		readonly angle: number
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "fade-in"
		readonly length?: number
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "fade-out"
		readonly length?: number
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "flash"
		readonly stages?: readonly [number, number, number, number]
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "flash"
		readonly stages?: readonly [number, number, number, number]
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "flash-text"
		readonly text: readonly string[]
		readonly stages?: readonly [number, number, number, number]
		readonly style?: FlashTextStyle
		readonly align?: readonly TextAlign[]
	}
	| {
		readonly type: "subliminal"
		readonly text: readonly string[]
		readonly stages?: readonly [number, number, number, number]
		readonly style?: SubliminalStyle
	}
	| {
		readonly type: "switch"
		readonly stepLength?: number
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "flash-fill"
		readonly color: Color
		readonly stages?: readonly [number, number, number, number]
	}
	| {
		readonly type: "image"
		readonly image: string
	}
	| {
		readonly type: "video"
		readonly video: string
	}

export const DrawCommand = (value: string): DrawCommand => {
	switch (value) {
		case "fill": return { type: "fill", color: [0, 0, 0, 1] }
		case "opacity": return { type: "opacity", value: 1, children: [] }
		case "frame-offset": return { type: "frame-offset", by: 0, children: [] }
		case "hide-after": return { type: "hide-after", frames: 0, children: [] }
		case "show-after": return { type: "show-after", frames: 0, children: [] }
		case "rotate-by": return { type: "rotate-by", angle: 0, children: [] }
		case "rotating": return { type: "rotating", speed: 6, children: [] }
		case "clip-circle": return { type: "clip-circle", origin: [0, 0], radius: 1, children: [] }
		case "clip-rect": return { type: "clip-rect", origin: [0, 0], size: [1, 1], children: [] }
		case "pattern": return { type: "pattern", pattern: "full-archimedes", colors: {} }
		case "local-pattern": return {
			type: "local-pattern",
			pattern: `uniform float time;
uniform vec2 resolution;
uniform vec4 fgColor;

const float PI = radians(180.0);
const float TAU = PI * 2.0;

float time_pos(float time) { return time * TAU; }
float uv_pos(vec2 uv) { return 12.0 / sqrt(length(uv)); }
float curve_pos(vec2 uv) { return 1.0 * atan(uv.y, uv.x); }
float constrict(float value) { return max(0.0, value); }
float spiral(float time, vec2 uv) { return constrict(cos(time_pos(time) + uv_pos(uv) + curve_pos(uv))); }
float dim(vec2 uv) { return smoothstep(0.075, 0.4, length(uv)); }

void main(void) {
       vec2 uv = 2.0 * ((gl_FragCoord.xy - resolution.xy * 0.5) / max(resolution.x, resolution.y));

	gl_FragColor =  spiral(time, uv) * dim(uv) * fgColor;
}
`,
			colors: {}
		}
		case "text": return { type: "text", value: "" }
		case "fade-in": return { type: "fade-in", length: 60, children: [] }
		case "fade-out": return { type: "fade-out", length: 60, children: [] }
		case "flash": return { type: "flash", stages: [15, 15, 15, 15], children: [] }
		case "flash-text": return { type: "flash-text", text: [] }
		case "subliminal": return { type: "subliminal", text: [] }
		case "switch": return { type: "switch", stepLength: 60, children: [] }
		case "flash-fill": return { type: "flash-fill", color: [1, 1, 1, 1] }
		case "change-speed": return { type: "change-speed", factor: 1, children: [] }
		case "image": return { type: "image", image: "./assets/eyes.png" }
		case "video": return { type: "video", video: "./assets/base.mp4" }
		default:
			return { type: "text", value }
	}
}

export type ShaderStore = {
	readonly [name: string]: PatternShader | undefined
}

export type ImageStore = {
	readonly [name: string]: HTMLImageElement | undefined
}

export type VideoStore = {
	readonly [name: string]: HTMLVideoElement | undefined
}

export type Assets = {
	readonly shaders: ShaderStore
	readonly images: ImageStore
	readonly videos: VideoStore
}

async function forEachAsync<T>(items: readonly T[], lambda: (value: T) => Promise<void>) {
	for (const item of items) {
		await lambda(item)
	}
}

function hash(string: string): string {
	let hash = 0;
	if (string.length == 0) {
		return "";
	} else {
		for (let i = 0; i < string.length; i++) {
			let ch = string.charCodeAt(i);
			hash = ((hash << 5) - hash) + ch;
			hash = hash & hash;
		}
	}
	return btoa(hash.toString());
}

export async function renderTree(dom: HTMLCanvasElement, tree: DrawCommand, frame: number, assets: Assets, opts?: { readonly fps?: number }): Promise<void> {
	switch (tree.type) {
		case "fill":
			return fill(dom, tree.color)

		case "opacity":
			return await opacity(dom, tree.value, async dom => { forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)) })

		case "frame-offset":
			await forEachAsync(tree.children, async child => await renderTree(dom, child, frame + tree.by, assets, opts))
			return

		case "change-speed":
			await forEachAsync(tree.children, child => renderTree(dom, child, frame * tree.factor, assets, opts))
			return

		case "rotate-by":
			await rotate(dom, tree.angle, async dom => await forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))
			return


		case "rotating":
			await rotate(dom, tree.speed * frame, async dom => await forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))
			return

		case "hide-after":
			if (frame < tree.frames) {
				await forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts))
				return
			} else {
				return
			}

		case "show-after":
			if (frame >= tree.frames) {
				await forEachAsync(tree.children, child => renderTree(dom, child, frame - tree.frames, assets, opts))
				return
			} else {
				return
			}

		case "clip-circle":
			await clipCircle(dom, tree.origin, tree.radius, dom => forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))
			return

		case "clip-rect":
			await clipRect(dom, tree.origin, tree.size, dom => forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))
			return

		case "pattern":
			const shader = assets.shaders[tree.pattern]
			if (shader == null) {
				return
			} else {
				return renderSpiralShaderToCanvas(dom, frame, {
					shader,
					colors: {
						bgColor: tree.colors.bg,
						fgColor: tree.colors.fg,
						dimColor: tree.colors.dim,
						pulseColor: tree.colors.pulse
					},
					fps: opts?.fps
				})
			}

		case "local-pattern": {
			const shader = assets.shaders[hash(tree.pattern)]
			if (shader == null) {
				return
			} else {
				return renderSpiralShaderToCanvas(dom, frame, {
					shader,
					fps: opts?.fps,
					colors: {
						bgColor: tree.colors.bg,
						fgColor: tree.colors.fg,
						dimColor: tree.colors.dim,
						pulseColor: tree.colors.pulse
					},
				})
			}
		}

		case "text":
			return renderTextToCanvas(dom, {
				value: tree.value,
				style: tree.style
			})

		case "subliminal":
			return renderSubliminalToCanvas(dom, frame, {
				text: tree.text,
				stageLengths: tree.stages,
				style: tree.style
			})

		case "switch":
			return await renderSwitchToCanvas(dom, frame, {
				stepLength: tree.stepLength ?? 60,
				steps: tree.children.map(child => async (dom: HTMLCanvasElement) => renderTree(dom, child, frame, assets, opts))
			})

		case "fade-in":
			return await renderFadeInToCanvas(dom, frame, { length: tree.length }, dom => forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))

		case "fade-out":
			return await renderFadeOutToCanvas(dom, frame, { length: tree.length }, dom => forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))

		case "flash":
			return await renderFlashToCanvas(dom, frame, { stageLengths: tree.stages }, dom => forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))

		case "flash-text":
			return renderFlashTextToCanvas(dom, frame, {
				text: tree.text,
				stageLengths: tree.stages,
				style: tree.style
			})

		case "flash-fill":
			return renderFlashFillToCanvas(dom, frame, {
				stageLengths: tree.stages,
				style: {
					backgroundColor: tree.color
				}
			})

		case "image":
			const image = assets.images[tree.image]
			if (image == null) {
				return
			} else {
				return renderImageToCanvas(dom, { image })
			}


		case "video":
			const video = assets.videos[tree.video]
			if (video == null) {
				return
			} else {
				return await renderVideoToCanvas(dom, frame, { video, fps: opts?.fps })
			}

		default:
			console.log("Unrecognized command type", tree)
	}
}

export async function render(
	targetBuffer: HTMLCanvasElement,
	commands: readonly DrawCommand[],
	frame: number,
	assets: Assets,
	opts?: { readonly fps?: number }
) {
	clear(targetBuffer)
	await forEachAsync(commands, command => renderTree(targetBuffer, command, frame, assets, opts))
}

export function extractUsedShaders(commands: readonly DrawCommand[]): readonly string[] {
	return commands.reduce((prev: readonly string[], curr: DrawCommand) => {
		switch (curr.type) {
			case "pattern":
				return [...prev, curr.pattern]

			default:
				const $curr = (curr as { readonly children?: DrawCommand[] })
				if ($curr.children != null) {
					return [...prev, ...extractUsedShaders($curr.children!)]
				} else {
					return prev
				}
		}
	}, [])
}


export function extractUsedLocalShaders(commands: readonly DrawCommand[]): readonly [string, string][] {
	return commands.reduce((prev: readonly [string, string][], curr: DrawCommand): readonly [string, string][] => {
		switch (curr.type) {
			case "local-pattern":
				return [...prev, [hash(curr.pattern), curr.pattern]]

			default:
				const $curr = (curr as { readonly children?: DrawCommand[] })
				if ($curr.children != null) {
					return [...prev, ...extractUsedLocalShaders($curr.children!)]
				} else {
					return prev
				}
		}
	}, [])
}

export function extractUsedImages(commands: readonly DrawCommand[]): readonly string[] {
	return commands.reduce((prev: readonly string[], curr: DrawCommand) => {
		switch (curr.type) {
			case "image":
				return [...prev, curr.image]
			default:
				const $curr = (curr as { readonly children?: DrawCommand[] })
				if ($curr.children != null) {
					return [...prev, ...extractUsedImages($curr.children!)]
				} else {
					return prev
				}
		}
	}, [])
}


export function extractUsedVideos(commands: readonly DrawCommand[]): readonly string[] {
	return commands.reduce((prev: readonly string[], curr: DrawCommand) => {
		switch (curr.type) {
			case "video":
				return [...prev, curr.video]

			default:
				const $curr = (curr as { readonly children?: DrawCommand[] })
				if ($curr.children != null) {
					return [...prev, ...extractUsedVideos($curr.children!)]
				} else {
					return prev
				}
		}
	}, [])
}

export async function loadShaderAssets(size: readonly [number, number], shaders: readonly string[]): Promise<ShaderStore> {
	const results = await Promise.all(shaders.map(async shader => {
		try {
			return [shader, await createPatternShader(size, `shaders/${shader}.fs`)] as [string, PatternShader] | null
		} catch (err) {
			return null
		}
	}))

	return results
		.filter(f => f != null)
		.map(f => f!)
		.reduce((prev: ShaderStore, [s, d]) => ({ ...prev, [s]: d }), {} as ShaderStore)
}

export async function loadLocalShaderAssets(size: readonly [number, number], shaders: readonly [string, string][]): Promise<ShaderStore> {
	const results = await Promise.all(shaders.map(async ([shader, shaderBody]) => {
		try {
			return [shader, await createPatternShaderFromText(size, shaderBody)] as [string, PatternShader] | null
		} catch (err) {
			return null
		}
	}))

	return results
		.filter(f => f != null)
		.map(f => f!)
		.reduce((prev: ShaderStore, [s, d]) => ({ ...prev, [s]: d }), {} as ShaderStore)
}

export async function loadImageAssets(images: readonly string[]): Promise<ImageStore> {
	const results = await Promise.all(images.map(async image => {
		try {
			return [image, await loadImage(image)] as [string, HTMLImageElement] | null
		} catch (err) {
			return null
		}
	}))

	return results
		.filter(f => f != null)
		.map(f => f!)
		.reduce((prev: ImageStore, [s, d]) => ({ ...prev, [s]: d }), {} as ImageStore)
}

export async function loadVideoAssets(videos: readonly string[]): Promise<VideoStore> {
	const results = await Promise.all(videos.map(async video => {
		try {
			return [video, await loadVideo(video)] as [string, HTMLVideoElement] | null
		} catch (err) {
			return null
		}
	}))

	return results
		.filter(f => f != null)
		.map(f => f!)
		.reduce((prev: VideoStore, [s, d]) => ({ ...prev, [s]: d }), {} as VideoStore)
}

export type RenderingStatus = { readonly current: "no" } | {
	readonly current: "rendering" | "exporting"
	readonly progress: number
}

export function useRenderToGIF(def: RenderDef, assets: Assets): readonly [RenderingStatus, () => void] {
	const windowSize = useWindowResolution()
	const [rendering, setRendering] = React.useState<RenderingStatus>({ current: "no" })

	return [rendering, async () => {
		setRendering({ current: "rendering", progress: 0 })

		const gif = new GIF({ quality: 5, repeat: 0 })
		const totalFrames = def.totalFrames || def.fps
		for (let frame = 0; frame < totalFrames; ++frame) {
			await defer(async () => {
				const targetBuffer = document.createElement("canvas")
				targetBuffer.width = def.resolution[0] > 0 ? def.resolution[0] : windowSize[0]
				targetBuffer.height = def.resolution[1] > 0 ? def.resolution[1] : windowSize[1]

				await render(targetBuffer, def.pattern, frame, assets, { fps: def.fps })
				setRendering({ current: "rendering", progress: (frame / totalFrames) })
				gif.addFrame(targetBuffer, { delay: 1000 / (def.speed * def.fps), copy: true })
			})
		}
		gif.on("progress", e => {
			setRendering({
				current: "exporting",
				progress: e
			})
		})
		gif.on("finished", blob => {
			window.open(URL.createObjectURL(blob))
			setRendering({ current: "no" })
		})
		gif.render()
	}]
}