import random, { hash } from "../../util/random"
import { Color, toCssStringRGB } from "./Color"
import { renderFlashToCanvas, renderSwitchToCanvas } from "./Draw"

export type TextAlign = ("center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right")

export type TextStyle = {
	readonly bold?: boolean
	readonly lineWidth?: number
	readonly size?: number
	readonly fillColor?: Color
	readonly strokeColor?: Color
	readonly fonts?: readonly string[]
	readonly offsetX?: number
	readonly offsetY?: number
	readonly align?: TextAlign
}

export type TextProps = {
	readonly value: string
	readonly style?: TextStyle
}

export function renderTextToCanvas(dom: HTMLCanvasElement, opts: TextProps) {
	const { value, style } = opts
	const screenSize = [dom.width, dom.height]
	const fontSize = Math.min(Math.max(12, Math.min(...screenSize) / 12.5), 256) * (style?.size ?? 1)

	let x = 0.0 + (style?.offsetX ?? 0)
	let y = 0.0 + (style?.offsetY ?? 0)
	switch (style?.align ?? "center") {
		case "left":
			x = -0.95 + (style?.offsetX ?? 0)
			break
		case "right":
			x = 0.95 + (style?.offsetX ?? 0)
			break
		case "center":
			y = 0.0 + (style?.offsetY ?? 0)
			break
		case "top":
			y = -0.95 + (style?.offsetY ?? 0)
			break
		case "bottom":
			y = 0.95 + (style?.offsetY ?? 0)
			break;
		case "top-left":
			x = -0.95 + (style?.offsetX ?? 0)
			y = -0.95 + (style?.offsetY ?? 0)
			break
		case "top-right":
			x = 0.95 + (style?.offsetX ?? 0)
			y = -0.95 + (style?.offsetY ?? 0)
			break
		case "bottom-left":
			x = -0.95 + (style?.offsetX ?? 0)
			y = 0.95 + (style?.offsetY ?? 0)
			break;
		case "bottom-right":
			x = 0.95 + (style?.offsetX ?? 0)
			y = 0.95 + (style?.offsetY ?? 0)
			break
	}

	const context = dom.getContext("2d")!
	context.save()
	context.textBaseline = "top"
	context.font = `${fontSize}px ${(style?.fonts ?? ["Uni Sans Heavy", "Roboto", "Helvetica", "Arial", "sans-serif"]).join(", ")}`
	const measure = context.measureText(value)

	let px = (((1.0 + x) / 2.0) * dom.width) - (measure.width / 2.0)
	let py = (((1.0 + y) / 2.0) * dom.height) - (fontSize / 2.0)

	const fill = toCssStringRGB(...(style?.fillColor?.slice(0, 3) ?? [1, 1, 1]) as [number, number, number])
	const stroke = toCssStringRGB(...(style?.strokeColor?.slice(0, 3) ?? [1 / 256, 1 / 256, 1 / 256]) as [number, number, number])
	context.lineWidth = style?.lineWidth ?? Math.max(style?.size ?? 1, 1)
	context.fillStyle = fill
	if (stroke != fill) {
		context.strokeStyle = stroke
	}

	context.fillText(value, px, py)
	if (stroke != fill) {
		context.strokeText(value, px, py)
	}
	context.restore()
}

export type SubliminalStyle = Omit<TextStyle, "align" | "offsetX" | "offsetY">

export type SubliminalProps = {
	readonly text: readonly string[]
	readonly style?: SubliminalStyle
	readonly stageLengths?: readonly [number, number, number, number]
};

export function renderSubliminalToCanvas(dom: HTMLCanvasElement, frame: number, opts: SubliminalProps) {
	if (opts.text.length === 0) {
		return
	}

	const stageLengths = opts.stageLengths ?? [15, 15, 15, 15]
	const totalFramesLength = stageLengths.reduce((p, c) => p + c, 0)
	const h = hash(stageLengths.reduce((p, c) => p.toString() + ":" + c.toString(), "") + opts.text.reduce((p, c) => `${p}:${c}`, ""))
	const commands = opts.text.map((value, index) => {
		const [offsetX, offsetY] = [(random(h, index * 2) * 2 - 1), (random(h, index * 2 + 1) * 2 - 1)]
		const style: TextStyle = {
			...(opts.style ?? {}),
			align: "center",
			offsetX,
			offsetY
		}
		return async (dom: HTMLCanvasElement) => renderTextToCanvas(dom, { value, style })
	})

	return renderFlashToCanvas(dom, frame, { stageLengths: opts.stageLengths }, async dom => {
		await renderSwitchToCanvas(dom, frame, {
			stepLength: totalFramesLength,
			steps: commands
		})
	})
}

export type FlashTextStyle = Omit<TextStyle, "align"> & {
	readonly align?: readonly TextAlign[]
}

export type FlashTextProps = {
	readonly text: readonly string[]
	readonly style?: FlashTextStyle
	readonly stageLengths?: readonly [number, number, number, number]
}

export function renderFlashTextToCanvas(dom: HTMLCanvasElement, frame: number, opts: FlashTextProps) {
	if (opts.text.length === 0) {
		return
	}

	const stageLengths = opts.stageLengths ?? [15, 15, 15, 15]
	const totalFramesLength = stageLengths.reduce((p, c) => p + c, 0)
	const align = opts.style?.align != null ? opts.style.align[((frame / totalFramesLength) | 0) % opts.style.align.length ?? 1] : "center"
	const style = {
		lineWidth: opts.style?.lineWidth,
		...(opts.style?.fillColor != null ? { fillColor: opts.style.fillColor } : {}),
		...(opts.style?.strokeColor != null ? { strokeColor: opts.style.strokeColor } : {}),
		bold: opts.style?.bold,
		size: opts.style?.size ?? 1,
		align: align,
		fonts: opts.style?.fonts,
		offsetX: opts.style?.offsetX,
		offsetY: opts.style?.offsetY
	}

	const commands = opts.text.map(value => async (dom: HTMLCanvasElement) => renderTextToCanvas(dom, { value, style }))

	return renderFlashToCanvas(dom, frame, { stageLengths: opts.stageLengths }, async dom => {
		await renderSwitchToCanvas(dom, frame, {
			stepLength: totalFramesLength,
			steps: commands
		})
	})
}
