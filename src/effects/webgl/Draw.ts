import { Color, toCssStringRGB, toCssStringRGBA } from "./Color"

export function clipCircle(dom: HTMLCanvasElement, origin: readonly [number, number], size: number, render: (dom: HTMLCanvasElement) => void) {
	if (size === 0) {
		return
	}

	const src = document.createElement("canvas")
	src.width = size * Math.min(dom.width, dom.height)
	src.height = src.width
	render(src)

	const ox = (origin[0] + 1.0) * (dom.width / 2)
	const oy = (origin[1] + 1.0) * (dom.height / 2)
	const hw = src.width / 2

	const context = dom.getContext("2d")!
	context.save()
	context.beginPath()
	context.arc(ox, oy, hw, 0, Math.PI * 2, true);
	context.closePath()
	context.clip()
	context.drawImage(src, ox - hw, oy - hw, src.width, src.height)
	context.restore()
}

export function clipRect(dom: HTMLCanvasElement, origin: readonly [number, number], size: readonly [number, number], render: (dom: HTMLCanvasElement) => void) {
	if (size[0] === 0 || size[1] === 0) {
		return
	}
	
	const src = document.createElement("canvas")
	src.width = (size[0]) * dom.width
	src.height = (size[1]) * dom.height
	render(src)

	const tl: readonly [number, number] = [origin[0] - size[0], origin[1] - size[1]]
	const ox = ((tl[0] + 1) / 2) * (dom.width)
	const oy = ((tl[1] + 1) / 2) * (dom.height)

	const context = dom.getContext("2d")!
	context.save()
	context.beginPath()
	context.rect(ox, oy, src.width, src.height);
	context.closePath()
	context.clip()
	context.drawImage(src, ox, oy, src.width, src.height)
	context.restore()
}

export function fill(dom: HTMLCanvasElement, color: Color) {
	const context = dom.getContext("2d")!

	context.save()
	context.globalAlpha = color[3]
	context.fillStyle = toCssStringRGB(...color)
	context.fillRect(0, 0, dom.width, dom.height)
	context.restore()
}

export function clear(dom: HTMLCanvasElement) {
	const context = dom.getContext("2d")!
	context.clearRect(0, 0, dom.width, dom.height)
}

export function opacity(dom: HTMLCanvasElement, opacity: number, render: (dom: HTMLCanvasElement) => void) {
	const context = dom.getContext("2d")!

	context.save()
	context.globalAlpha = context.globalAlpha * opacity
	render(dom)
	context.restore()
}


export type FlashBoxProps = {
	readonly style?: {
		readonly backgroundColor?: Color
	}
	readonly stageLengths?: readonly [number, number, number, number]
}

export function renderFlashToCanvas(dom: HTMLCanvasElement, frame: number, opts: FlashBoxProps) {
	const stageLengths = opts.stageLengths ?? [15, 15, 15, 15]
	const totalFramesLength = stageLengths.reduce((p, c) => p + c, 0)
	const framePosition = frame % totalFramesLength

	const bgcolorVals = (opts.style?.backgroundColor ?? [1, 1, 1, 1])
	const bgcolor = toCssStringRGB(...bgcolorVals)
	const bgalpha = bgcolorVals[3]
	const context = dom.getContext("2d")!

	if (framePosition < stageLengths[0]) {
	} else if (stageLengths[0] > 0 && framePosition < stageLengths[0] + stageLengths[1]) {
		context.save()
		context.globalAlpha = bgalpha * (framePosition - stageLengths[1]) / stageLengths[1]
		context.fillStyle = bgcolor
		context.fillRect(0, 0, dom.width, dom.height)
		context.restore()
	} else if (stageLengths[1] > 0 && framePosition < stageLengths[0] + stageLengths[1] + stageLengths[2]) {
		context.save()
		context.globalAlpha = bgalpha
		context.fillStyle = bgcolor
		context.fillRect(0, 0, dom.width, dom.height)
		context.restore()
	} else if (stageLengths[2] > 0 && framePosition < stageLengths[0] + stageLengths[1] + stageLengths[2] + stageLengths[3]) {
		const pos = framePosition - (stageLengths[0] + stageLengths[1] + + stageLengths[2])
		context.save()
		context.globalAlpha = bgalpha * (stageLengths[3] - pos) / stageLengths[3]
		context.fillStyle = bgcolor
		context.fillRect(0, 0, dom.width, dom.height)
		context.restore()
	} else {

	}
}
