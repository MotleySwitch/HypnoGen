import GIF from "gif.js"
import React from "react"
import defer from "../util/defer"
import type { Color } from "./webgl/Color"
import { clear, clipCircle, fill, opacity } from "./webgl/Draw"
import { createPatternShader, PatternShader, renderSpiralShaderToCanvas } from "./webgl/Pattern"
import { FlashTextAlign, FlashTextStyle, renderFlashBoxToCanvas, renderFlashTextToCanvas, renderSubliminalToCanvas, renderTextToCanvas, TextStyle } from "./webgl/Text"
import type { RenderDef } from "./webgl/webgl.react"

export type DrawCommand =
	| { readonly type: "fill"; readonly color: Color }
	| { readonly type: "opacity"; readonly value: number; readonly children: readonly DrawCommand[] }
	| { readonly type: "frame-offset"; readonly by: number; readonly children: readonly DrawCommand[] }
	| {
		readonly type: "clip-circle"
		readonly origin: readonly [number, number]
		readonly radius: number
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

export type ShaderStore = {
	readonly [name: string]: PatternShader
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

		case "clip-circle":
			return clipCircle(dom, tree.origin, tree.radius, dom => tree.children.forEach(child => renderTree(dom, child, frame, assets, opts)))

		case "pattern":
			return renderSpiralShaderToCanvas(dom, frame, {
				shader: assets.shaders[tree.pattern],
				colors: {
					bgColor: tree.colors.bg,
					fgColor: tree.colors.fg,
					dimColor: tree.colors.dim,
					extraColor: tree.colors.extra,
					pulseColor: tree.colors.pulse
				},
				fps: opts?.fps
			})

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
			return renderFlashBoxToCanvas(dom, frame, {
				stageLengths: tree.stages,
				style: {
					backgroundColor: tree.color
				}
			})
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
				return [...prev, ...extractUsedShaders(curr.children)]
			case "pattern":
				return [...prev, curr.pattern]
			default:
				return prev
		}
	}, [])
}

export async function loadShaderAssets(size: readonly [number, number], shaders: readonly string[]): Promise<ShaderStore> {
	const results = await Promise.all(shaders.map(async shader => [shader, await createPatternShader(size, "shaders/spiral.vs", `shaders/${shader}.fs`)] as [string, PatternShader]))

	return results.reduce((prev: ShaderStore, [s, d]) => ({ ...prev, [s]: d }), {} as ShaderStore)
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
				targetBuffer.width = def.resolution[0]
				targetBuffer.height = def.resolution[1]

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