import { toCssStringRGB } from "./Color"

export type TextProps = {
	readonly x: number
	readonly y: number
	readonly value: string
	readonly scale?: number
	readonly style?: {
		readonly lineWidth?: number
		readonly alpha?: number
		readonly fillColor?: [number, number, number, number]
		readonly strokeColor?: [number, number, number, number]
		readonly fonts?: readonly string[]
	}
}

export function renderTextToCanvas(dom: HTMLCanvasElement, { x, y, value, ...opts }: TextProps) {
	const screenSize = [dom.width, dom.height]
	const fontSize = Math.min(Math.max(48, Math.min(...screenSize) / 12.5), 256) * (opts.scale ?? 1)

	const context = dom.getContext("2d")!
	context.save()
	context.textAlign = "left"
	context.textBaseline = "top"
	context.globalAlpha = opts.style?.alpha ?? 1
	context.font = `${fontSize}px ${(opts.style?.fonts ?? ["Roboto", "Helvetica", "Arial", "sans-serif"]).join(", ")}`
	const measure = context.measureText(value)

	let px = (x * dom.width) - (measure.width / 2.0)
	if (px < 10.0) {
		px = 10.0
	} else if (px + measure.width >= (dom.width - 10.0)) {
		px = (dom.width - measure.width - 10.0)
	}

	let py = (y * dom.height) - (fontSize / 2.0)
	if (py < 10.0) {
		py = 10.0
	} else if (py + (fontSize / 2.0) >= (dom.height - fontSize - 10.0)) {
		py = (dom.height - fontSize - 10.0)
	}

	const fill = toCssStringRGB(...(opts.style?.fillColor?.slice(0, 3) ?? [1, 1, 1]) as [number, number, number])
	const stroke = toCssStringRGB(...(opts.style?.strokeColor?.slice(0, 3) ?? [1, 1, 1]) as [number, number, number])

	if (stroke != fill) {
		context.strokeStyle = toCssStringRGB(...(opts.style?.strokeColor?.slice(0, 3) ?? [1, 1, 1]) as [number, number, number])
	}

	context.fillStyle = fill
	context.lineWidth = opts.style?.lineWidth ?? Math.max(opts.scale ?? 1, 1)
	context.fillText(value, px, py)
	if (stroke != fill) {
		context.strokeText(value, px, py)
	}
	context.restore()
}

export type SubliminalProps = {
	readonly values: readonly string[]
	readonly scale?: number
	readonly style?: {
		readonly fillColor?: string
		readonly strokeColor?: string
		readonly fonts?: readonly string[]
	}
	readonly stageLengths?: readonly [number, number, number, number]
};

export function renderSubliminalToCanvas(dom: HTMLCanvasElement, frame: number, opts: SubliminalProps) {
	// TODO
}

export type FlashBoxProps = {
	readonly style?: {
		readonly backgroundColor?: [number, number, number, number]
	}
	readonly stageLengths?: readonly [number, number, number, number]
}

export function renderFlashBoxToCanvas(dom: HTMLCanvasElement, frame: number, opts: FlashBoxProps) {
	const stageLengths = opts.stageLengths ?? [15, 15, 15, 15]
	const totalFramesLength = stageLengths.reduce((p, c) => p + c)
	const framePosition = frame % totalFramesLength

	const bgcolor = toCssStringRGB(...(opts.style?.backgroundColor ?? [1, 1, 1, 1]))
	const context = dom.getContext("2d")!
	if (framePosition < stageLengths[0]) {
	} else if (framePosition < stageLengths[0] + stageLengths[1]) {
		context.save()
		context.globalAlpha = (framePosition - stageLengths[1]) / stageLengths[1]
		context.fillStyle = bgcolor
		context.fillRect(0, 0, dom.width, dom.height)
		context.restore()
	} else if (framePosition < stageLengths[0] + stageLengths[1] + stageLengths[2]) {
		context.save()
		context.globalAlpha = 1.0
		context.fillStyle = bgcolor
		context.fillRect(0, 0, dom.width, dom.height)
		context.restore()
	} else if (framePosition < stageLengths[0] + stageLengths[1] + stageLengths[2] + stageLengths[3]) {
		const pos = framePosition - (stageLengths[0] + stageLengths[1] + + stageLengths[2])
		context.save()
		context.globalAlpha = (stageLengths[3] - pos) / stageLengths[3]
		context.fillStyle = bgcolor
		context.fillRect(0, 0, dom.width, dom.height)
		context.restore()
	} else {

	}
}


export type FlashTextProps = {
	readonly text: readonly string[]
	readonly style?: {
		readonly strokeColor?: [number, number, number, number]
		readonly fillColor?: [number, number, number, number]
		readonly size?: number
		readonly lineWidth?: number
		readonly offsetY?: number
	}
	readonly stageLengths?: readonly [number, number, number, number]
	readonly align?: readonly ("center" | "top" | "bottom")[]
}

export function renderFlashTextToCanvas(dom: HTMLCanvasElement, frame: number, opts: FlashTextProps) {
	const stageLengths = opts.stageLengths ?? [15, 15, 15, 15]
	const totalFramesLength = stageLengths.reduce((p, c) => p + c)
	const framePosition = frame % totalFramesLength
	const align = opts.align != null ? opts.align[((frame / totalFramesLength) | 0) % opts.align.length ?? 1] : "center"
	const text = opts.text[((frame / totalFramesLength) | 0) % opts.text.length]

	let y = 0.5
	switch (align) {
		case "center": y = 0.5 + (opts.style?.offsetY ?? 0); break;
		case "top": y = 0.05 + (opts.style?.offsetY ?? 0); break;
		case "bottom": y = 0.95 + (opts.style?.offsetY ?? 0); break;
	}

	if (framePosition < stageLengths[0]) {
	} else if (framePosition < stageLengths[0] + stageLengths[1]) {
		renderTextToCanvas(dom, {
			x: 0.5,
			y,
			value: text,
			scale: opts.style?.size ?? 2,
			style: {
				lineWidth: opts.style?.lineWidth,
				alpha: (framePosition - stageLengths[0]) / stageLengths[1],
				...(opts.style?.fillColor != null ? { fillColor: opts.style.fillColor } : {}),
				...(opts.style?.strokeColor != null ? { strokeColor: opts.style.strokeColor } : {})
			}
		})
	} else if (framePosition < stageLengths[0] + stageLengths[1] + stageLengths[2]) {
		renderTextToCanvas(dom, {
			x: 0.5,
			y,
			value: text,
			scale: opts.style?.size ?? 1,
			style: {
				lineWidth: opts.style?.lineWidth,
				...(opts.style?.fillColor != null ? { fillColor: (opts.style.fillColor) } : {}),
				...(opts.style?.strokeColor != null ? { strokeColor: (opts.style.strokeColor) } : {})
			}
		})
	} else if (framePosition < stageLengths[0] + stageLengths[1] + stageLengths[2] + stageLengths[3]) {
		const pos = framePosition - (stageLengths[0] + stageLengths[1] + + stageLengths[2])
		renderTextToCanvas(dom, {
			x: 0.5,
			y,
			value: text,
			scale: opts.style?.size ?? 2,
			style: {
				lineWidth: opts.style?.lineWidth,
				alpha: (stageLengths[3] - pos) / stageLengths[3],
				...(opts.style?.fillColor != null ? { fillColor: opts.style.fillColor } : {}),
				...(opts.style?.strokeColor != null ? { strokeColor: opts.style.strokeColor } : {})
			}
		})
	} else {

	}
}
