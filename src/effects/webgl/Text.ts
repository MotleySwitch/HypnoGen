import random, { hash } from "../../util/random"
import { Color, toCssStringRGB } from "./Color"

export type TextStyle = {
	readonly bold?: boolean
	readonly lineWidth?: number
	readonly size?: number
	readonly fillColor?: Color
	readonly strokeColor?: Color
	readonly fonts?: readonly string[]
}

export type TextProps = {
	readonly x: number
	readonly y: number
	readonly value: string
	readonly style?: TextStyle
}

export function renderTextToCanvas(dom: HTMLCanvasElement, { x, y, value, ...opts }: TextProps) {
	const screenSize = [dom.width, dom.height]
	const fontSize = Math.min(Math.max(12, Math.min(...screenSize) / 12.5), 256) * (opts.style?.size ?? 1)

	const context = dom.getContext("2d")!
	context.save()
	context.textBaseline = "top"
	context.font = `${fontSize}px ${(opts.style?.fonts ?? ["Uni Sans Heavy", "Roboto", "Helvetica", "Arial", "sans-serif"]).join(", ")}`
	const measure = context.measureText(value)

	let px = (((1.0 + x) / 2.0) * dom.width) - (measure.width / 2.0)
	if (px < 10.0) {
		px = 10.0
		context.textAlign = "left"
	} else if (px + measure.width >= (dom.width - 10.0)) {
		px = (dom.width - measure.width - 10.0)
		context.textAlign = "left"
	} else {
		context.textAlign = "center"
		px = (((1.0 + x) / 2.0) * dom.width)
	}

	let py = (((1.0 + y) / 2.0) * dom.height) - (fontSize / 2.0)
	if (py < 10.0) {
		py = 10.0
	} else if (py + (fontSize / 2.0) >= (dom.height - fontSize - 10.0)) {
		py = (dom.height - fontSize - 10.0)
	}

	const fill = toCssStringRGB(...(opts.style?.fillColor?.slice(0, 3) ?? [1, 1, 1]) as [number, number, number])
	const stroke = toCssStringRGB(...(opts.style?.strokeColor?.slice(0, 3) ?? [1 / 256, 1 / 256, 1 / 256]) as [number, number, number])
	context.lineWidth = opts.style?.lineWidth ?? Math.max(opts.style?.size ?? 1, 1)
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

export type SubliminalProps = {
	readonly text: readonly string[]
	readonly style?: TextStyle
	readonly stageLengths?: readonly [number, number, number, number]
};

export function renderSubliminalToCanvas(dom: HTMLCanvasElement, frame: number, opts: SubliminalProps) {
	if (opts.text.length === 0) {
		return
	}

	const stageLengths = opts.stageLengths ?? [5, 2, 3, 2]
	const totalFramesLength = stageLengths.reduce((p, c) => p + c, 0)
	const index = (frame / totalFramesLength) | 0
	const h = hash(opts.text.reduce((p, c) => `${p}:${c}`, ""))
	const [offsetX, offsetY] = [(random(h, index * 2) * 2 - 1), (random(h, index * 2 + 1) * 2 - 1)]

	renderFlashTextToCanvas(dom, frame, {
		text: opts.text,
		align: ["center"],
		stageLengths: stageLengths,
		style: {
			...(opts.style ?? {}),
			offsetX,
			offsetY
		}
	})
}

export type FlashTextStyle = TextStyle & {
	readonly offsetX?: number
	readonly offsetY?: number
}

export type FlashTextAlign = ("center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right")

export type FlashTextProps = {
	readonly text: readonly string[]
	readonly style?: FlashTextStyle
	readonly stageLengths?: readonly [number, number, number, number]
	readonly align?: readonly FlashTextAlign[]
}

export function renderFlashTextToCanvas(dom: HTMLCanvasElement, frame: number, opts: FlashTextProps) {
	if (opts.text.length === 0) {
		return
	}

	const stageLengths = opts.stageLengths ?? [15, 15, 15, 15]
	const totalFramesLength = stageLengths.reduce((p, c) => p + c, 0)
	const framePosition = frame % totalFramesLength
	const align = opts.align != null ? opts.align[((frame / totalFramesLength) | 0) % opts.align.length ?? 1] : "center"
	const text = opts.text[((frame / totalFramesLength) | 0) % opts.text.length]

	let x = 0.0 + (opts.style?.offsetX ?? 0)
	let y = 0.0 + (opts.style?.offsetY ?? 0)
	switch (align) {
		case "left":
			x = -0.95 + (opts.style?.offsetX ?? 0)
			break
		case "right":
			x = 0.95 + (opts.style?.offsetX ?? 0)
			break
		case "center":
			y = 0.0 + (opts.style?.offsetY ?? 0)
			break
		case "top":
			y = -0.95 + (opts.style?.offsetY ?? 0)
			break
		case "bottom":
			y = 0.95 + (opts.style?.offsetY ?? 0)
			break;
		case "top-left":
			x = -0.95 + (opts.style?.offsetX ?? 0)
			y = -0.95 + (opts.style?.offsetY ?? 0)
			break
		case "top-right":
			x = 0.95 + (opts.style?.offsetX ?? 0)
			y = -0.95 + (opts.style?.offsetY ?? 0)
			break
		case "bottom-left":
			x = -0.95 + (opts.style?.offsetX ?? 0)
			y = 0.95 + (opts.style?.offsetY ?? 0)
			break;
		case "bottom-right":
			x = 0.95 + (opts.style?.offsetX ?? 0)
			y = 0.95 + (opts.style?.offsetY ?? 0)
			break
	}

	const context = dom.getContext("2d")!
	context.save()
	if (framePosition < stageLengths[0]) {
	} else if (stageLengths[0] > 0 && framePosition < stageLengths[0] + stageLengths[1]) {
		context.globalAlpha = context.globalAlpha * ((opts.style?.fillColor ?? [0, 0, 0, 1])[3] * (framePosition - stageLengths[0]) / stageLengths[1])
		renderTextToCanvas(dom, {
			x,
			y,
			value: text,
			style: {
				lineWidth: opts.style?.lineWidth,
				...(opts.style?.fillColor != null ? { fillColor: opts.style.fillColor } : {}),
				...(opts.style?.strokeColor != null ? { strokeColor: opts.style.strokeColor } : {}),
				bold: opts.style?.bold,
				size: opts.style?.size ?? 1
			}
		})
	} else if (stageLengths[1] > 0 && framePosition < stageLengths[0] + stageLengths[1] + stageLengths[2]) {
		context.globalAlpha = context.globalAlpha * ((opts.style?.fillColor ?? [0, 0, 0, 1])[3])
		renderTextToCanvas(dom, {
			x,
			y,
			value: text,
			style: {
				lineWidth: opts.style?.lineWidth,
				...(opts.style?.fillColor != null ? { fillColor: (opts.style.fillColor) } : {}),
				...(opts.style?.strokeColor != null ? { strokeColor: (opts.style.strokeColor) } : {}),
				bold: opts.style?.bold,
				size: opts.style?.size ?? 1
			}
		})
	} else if (stageLengths[2] > 0 && framePosition < stageLengths[0] + stageLengths[1] + stageLengths[2] + stageLengths[3]) {
		const pos = framePosition - (stageLengths[0] + stageLengths[1] + + stageLengths[2])
		context.globalAlpha = context.globalAlpha * ((opts.style?.fillColor ?? [0, 0, 0, 1])[3] * ((stageLengths[3] - pos) / stageLengths[3]))
		renderTextToCanvas(dom, {
			x,
			y,
			value: text,
			style: {
				lineWidth: opts.style?.lineWidth,
				...(opts.style?.fillColor != null ? { fillColor: opts.style.fillColor } : {}),
				...(opts.style?.strokeColor != null ? { strokeColor: opts.style.strokeColor } : {}),
				bold: opts.style?.bold,
				size: opts.style?.size ?? 1
			}
		})
	} else {

	}
	context.restore()
}
