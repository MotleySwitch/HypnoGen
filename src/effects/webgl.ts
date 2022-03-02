import GIF from "gif.js"
import React from "react"
import defer from "../util/defer"
import type { Color } from "./webgl/Color"
import { clear, clipCircle, clipRect, fill, opacity, renderFlashToCanvas } from "./webgl/Draw"
import { createPatternShader, PatternShader, renderSpiralShaderToCanvas } from "./webgl/Pattern"
import { FlashTextAlign, FlashTextStyle, renderFlashTextToCanvas, renderSubliminalToCanvas, renderTextToCanvas, TextStyle } from "./webgl/Text"
import type { RenderDef } from "./webgl/webgl.react"

export type DrawCommandType =
	| "fill"
	| "opacity"
	| "frame-offset"
	| "change-speed"
	| "hide-after"
	| "show-after"
	| "clip-circle"
	| "clip-rect"
	| "pattern"
	| "text"
	| "flash-text"
	| "subliminal"
	| "flash-fill"

export type DrawCommandDef = { readonly type: DrawCommandType; readonly name: string }

export const AvailableDrawCommands: readonly DrawCommandDef[] = [
	{ type: "fill", name: "Fill" },
	{ type: "opacity", name: "Opacity" },
	{ type: "frame-offset", name: "Frame Offset" },
	{ type: "change-speed", name: "Change Speed" },
	{ type: "hide-after", name: "Hide After" },
	{ type: "show-after", name: "Show After" },
	{ type: "clip-circle", name: "Clip (Circle)" },
	{ type: "clip-rect", name: "Clip (Rectangle)" },
	{ type: "pattern", name: "Pattern" },
	{ type: "text", name: "Text" },
	{ type: "flash-fill", name: "Flash (Fill)" },
	{ type: "flash-text", name: "Flash (Text)" },
	{ type: "subliminal", name: "Subliminal" }
]

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
		readonly type: "text"
		readonly value: string
		readonly coords: readonly [number, number]
		readonly style?: TextStyle
	}
	| {
		readonly type: "flash-text"
		readonly text: readonly string[]
		readonly stages?: readonly [number, number, number, number]
		readonly style?: FlashTextStyle
		readonly align?: readonly FlashTextAlign[]
	}
	| {
		readonly type: "subliminal"
		readonly text: readonly string[]
		readonly stages?: readonly [number, number, number, number]
		readonly style?: FlashTextStyle
	}
	| {
		readonly type: "flash-fill"
		readonly color: Color
		readonly stages?: readonly [number, number, number, number]
	}

export const DrawCommand = (value: string): DrawCommand => {
	switch (value) {
		case "fill": return { type: "fill", color: [0, 0, 0, 1] }
		case "opacity": return { type: "opacity", value: 1, children: [] }
		case "frame-offset": return { type: "frame-offset", by: 0, children: [] }
		case "hide-after": return { type: "hide-after", frames: 0, children: [] }
		case "show-after": return { type: "show-after", frames: 0, children: [] }
		case "clip-circle": return { type: "clip-circle", origin: [0, 0], radius: 1, children: [] }
		case "clip-rect": return { type: "clip-rect", origin: [-1, -1], size: [2, 2], children: [] }
		case "pattern": return { type: "pattern", pattern: "full-inwards", colors: {} }
		case "text": return { type: "text", value: "", coords: [0, 0] }
		case "flash-text": return { type: "flash-text", text: [] }
		case "subliminal": return { type: "subliminal", text: [] }
		case "flash-fill": return { type: "flash-fill", color: [1, 1, 1, 1] }
		case "change-speed": return { type: "change-speed", factor: 1, children: [] }
		default:
			return { type: "text", value, coords: [0, 0] }
	}
}

export type ShaderStore = {
	readonly [name: string]: PatternShader | undefined
}

export type Assets = {
	readonly shaders: ShaderStore
}

export function renderTree(dom: HTMLCanvasElement, tree: DrawCommand, frame: number, assets: Assets, opts?: { readonly fps?: number }): void {
	switch (tree.type) {
		case "fill":
			return fill(dom, tree.color)

		case "opacity":
			return opacity(dom, tree.value, dom => tree.children.forEach(child => renderTree(dom, child, frame, assets, opts)))

		case "frame-offset":
			return tree.children.forEach(child => renderTree(dom, child, frame + tree.by, assets, opts))

		case "change-speed":
			return tree.children.forEach(child => renderTree(dom, child, frame * tree.factor, assets, opts))

		case "hide-after":
			if (frame < tree.frames) {
				return tree.children.forEach(child => renderTree(dom, child, frame, assets, opts))
			} else {
				return
			}

		case "show-after":
			if (frame >= tree.frames) {
				return tree.children.forEach(child => renderTree(dom, child, frame - tree.frames, assets, opts))
			} else {
				return
			}

		case "clip-circle":
			return clipCircle(dom, tree.origin, tree.radius, dom => tree.children.forEach(child => renderTree(dom, child, frame, assets, opts)))

		case "clip-rect":
			return clipRect(dom, tree.origin, tree.size, dom => tree.children.forEach(child => renderTree(dom, child, frame, assets, opts)))

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

		case "text":
			return renderTextToCanvas(dom, {
				value: tree.value,
				x: tree.coords[0],
				y: tree.coords[1],
				style: tree.style
			})

		case "flash-text":
			return renderFlashTextToCanvas(dom, frame, {
				text: tree.text,
				align: tree.align,
				stageLengths: tree.stages,
				style: tree.style
			})

		case "subliminal":
			return renderSubliminalToCanvas(dom, frame, {
				text: tree.text,
				stageLengths: tree.stages,
				style: tree.style
			})

		case "flash-fill":
			return renderFlashToCanvas(dom, frame, {
				stageLengths: tree.stages,
				style: {
					backgroundColor: tree.color
				}
			})
		default:
			console.log("Unrecognized command type", tree)
	}
}

export function render(
	targetBuffer: HTMLCanvasElement,
	commands: readonly DrawCommand[],
	frame: number,
	assets: Assets,
	opts?: { readonly fps?: number }
) {
	clear(targetBuffer)
	commands.forEach(command => renderTree(targetBuffer, command, frame, assets, opts))
}

export function extractUsedShaders(commands: readonly DrawCommand[]): readonly string[] {
	return commands.reduce((prev: readonly string[], curr: DrawCommand) => {
		switch (curr.type) {
			case "clip-circle":
			case "frame-offset":
			case "opacity":
			case "change-speed":
				return [...prev, ...extractUsedShaders(curr.children)]
			case "pattern":
				return [...prev, curr.pattern]
			default:
				return prev
		}
	}, [])
}

export async function loadShaderAssets(size: readonly [number, number], shaders: readonly string[]): Promise<ShaderStore> {
	const results = await Promise.all(shaders.map(async shader => {
		try {
			return [shader, await createPatternShader(size, "shaders/spiral.vs", `shaders/${shader}.fs`)] as [string, PatternShader] | null
		} catch (err) {
			return null
		}
	}))

	return results
		.filter(f => f != null)
		.map(f => f!)
		.reduce((prev: ShaderStore, [s, d]) => ({ ...prev, [s]: d }), {} as ShaderStore)
}

export type RenderingStatus = { readonly current: "no" } | {
	readonly current: "rendering" | "exporting"
	readonly progress: number
}

export function useRenderToGIF(def: RenderDef, assets: Assets): readonly [RenderingStatus, () => void] {
	const [rendering, setRendering] = React.useState<RenderingStatus>({ current: "no" })

	return [rendering, async () => {
		setRendering({ current: "rendering", progress: 0 })

		const gif = new GIF({ quality: 5, repeat: 0 })
		const totalFrames = def.totalFrames || def.fps
		for (let frame = 0; frame < totalFrames; ++frame) {
			await defer(() => {
				const targetBuffer = document.createElement("canvas")
				targetBuffer.width = def.resolution[0] > 0 ? def.resolution[0] : 32
				targetBuffer.height = def.resolution[1] > 0 ? def.resolution[1] : 32

				render(targetBuffer, def.pattern, frame, assets, { fps: def.fps })
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