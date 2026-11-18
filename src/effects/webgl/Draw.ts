import { Color, toCssStringRGB } from "./Color"

export async function clipCircle(dom: HTMLCanvasElement, origin: readonly [number, number], size: number, render: (dom: HTMLCanvasElement) => Promise<void>) {
	if (size === 0) {
		return
	}

	const src = document.createElement("canvas")
	src.width = size * Math.min(dom.width, dom.height)
	src.height = src.width
	await render(src)

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

export async function clipRect(dom: HTMLCanvasElement, origin: readonly [number, number], size: readonly [number, number], render: (dom: HTMLCanvasElement) => Promise<void>) {
	if (size[0] === 0 || size[1] === 0) {
		return
	}

	const src = document.createElement("canvas")
	src.width = (size[0]) * dom.width
	src.height = (size[1]) * dom.height
	await render(src)

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

export async function rotate(dom: HTMLCanvasElement, angle: number, render: (dom: HTMLCanvasElement) => Promise<void>) {
	const context = dom.getContext("2d")!

	const target = document.createElement("canvas")
	target.width = dom.width
	target.height = dom.height
	await render(target)

	context.save()
	context.translate(target.width / 2, target.height / 2)
	context.rotate(angle * 0.0174533)
	context.drawImage(target, -target.width / 2, -target.height / 2, target.width, target.height)
	context.restore()
}

export function clear(dom: HTMLCanvasElement) {
	const context = dom.getContext("2d")!
	context.clearRect(0, 0, dom.width, dom.height)
}

export async function opacity(dom: HTMLCanvasElement, opacity: number, render: (dom: HTMLCanvasElement) => Promise<void>) {
	const src = document.createElement("canvas")
	src.width = dom.width
	src.height = dom.height
	await render(src)

	const context = dom.getContext("2d")!
	context.save()
	context.globalAlpha = context.globalAlpha * opacity
	context.drawImage(src, 0, 0)
	context.restore()
}

export type FlashProps = {
	readonly stageLengths?: readonly [number, number, number, number]
	readonly style?: {
		readonly alpha?: number
	}
}

export async function renderFlashToCanvas(dom: HTMLCanvasElement, frame: number, opts: FlashProps, render: (dom: HTMLCanvasElement) => Promise<void>) {
	const stageLengths = opts.stageLengths ?? [15, 15, 15, 15]

	const hiddenStart = 0
	const hiddenEnd = hiddenStart + stageLengths[0] - 1

	const fadeInStart = hiddenEnd + 1
	const fadeInEnd = fadeInStart + stageLengths[1] - 1

	const visibleStart = fadeInEnd + 1
	const visibleEnd = visibleStart + stageLengths[2] - 1

	const fadeOutStart = visibleEnd + 1
	const fadeOutEnd = fadeOutStart + stageLengths[3] - 1

	const totalFramesLength = stageLengths.reduce((p, c) => p + c, 0)
	const framePosition = frame % totalFramesLength

	if (framePosition <= hiddenEnd) {
	} else if (framePosition <= fadeInEnd) {
		await renderFadeInToCanvas(dom, framePosition - fadeInStart, { length: stageLengths[1] }, render)
	} else if (framePosition <= visibleEnd) {
		await render(dom)
	} else if (framePosition <= fadeOutEnd) {
		await renderFadeOutToCanvas(dom, framePosition - fadeOutStart, { length: stageLengths[3] }, render)
	}
}

export type FadeInProps = {
	readonly length?: number
	readonly style?: {
		readonly alpha?: number
	}
}

export async function renderFadeInToCanvas(dom: HTMLCanvasElement, frame: number, opts: FadeInProps, render: (dom: HTMLCanvasElement) => Promise<void>) {
	const length = opts.length ?? 60
	let alpha = 1.0
	if (frame < length) {
		alpha = frame / length
	}

	await opacity(dom, alpha, render)
}

export type FadeOutProps = {
	readonly length?: number
	readonly style?: {
		readonly alpha?: number
	}
}

export async function renderFadeOutToCanvas(dom: HTMLCanvasElement, frame: number, opts: FadeInProps, render: (dom: HTMLCanvasElement) => Promise<void>) {
	const length = opts.length ?? 60
	let alpha = 0.0
	if (frame < length) {
		alpha = 1.0 - (frame / length)
	}

	await opacity(dom, alpha, render)
}

export type FlashBoxProps = {
	readonly style?: {
		readonly backgroundColor?: Color
	}
	readonly stageLengths?: readonly [number, number, number, number]
}

export function renderFlashFillToCanvas(dom: HTMLCanvasElement, frame: number, opts: FlashBoxProps) {
	renderFlashToCanvas(dom, frame, { stageLengths: opts.stageLengths }, (async dom => {
		fill(dom, opts.style?.backgroundColor ?? [1, 1, 1, 1])
	}))
}

export type SwitchProps = {
	readonly stepLength: number
	readonly steps: readonly ((dom: HTMLCanvasElement) => Promise<void>)[]
}

export async function renderSwitchToCanvas(dom: HTMLCanvasElement, frame: number, opts: SwitchProps): Promise<void> {
	if (opts.steps.length > 0 && opts.stepLength > 0) {
		if (frame < 0) {
			frame = (opts.stepLength * opts.steps.length) - frame;
		}
		const index = Math.floor(frame / opts.stepLength) % opts.steps.length
		const render = opts.steps[index]

		await render(dom)
	}
}
