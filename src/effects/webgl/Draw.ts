import { Color, toCssStringRGB } from "./Color"

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

export function clipRect(dom: HTMLCanvasElement, origin: readonly [number, number], size: number, render: (dom: HTMLCanvasElement) => void) {
	const src = document.createElement("canvas")
	src.width = size * dom.width
	src.height = size * dom.height
	render(src)

	const ox = (origin[0] + 1.0) * (dom.width / 2)
	const oy = (origin[1] + 1.0) * (dom.height / 2)
	const hw = src.width / 2

	const context = dom.getContext("2d")!
	context.save()
	context.beginPath()
	context.rect(ox, oy, src.width, src.height);
	context.closePath()
	context.clip()
	context.drawImage(src, ox - hw, oy - hw, src.width, src.height)
	context.restore()
}

export function fill(dom: HTMLCanvasElement, color: Color) {
	const context = dom.getContext("2d")!
    
    context.save()
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
