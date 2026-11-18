import { renderFlashToCanvas, renderSwitchToCanvas } from "./Draw"

export type BackgroundImageProps = {
	readonly image: HTMLImageElement
	readonly styles?: {
		readonly alpha?: number
		readonly padding?: number
	}
}

export function renderImageToCanvas(dom: HTMLCanvasElement, opts: BackgroundImageProps) {
	const context = dom.getContext("2d")!
	const canvas = dom
	const img = opts.image

	const w = canvas.width / (img.width + (opts?.styles?.padding ?? 0))
	const h = canvas.height / (img.height + (opts?.styles?.padding ?? 0))
	const [tw, th] = ((): readonly [number, number] => {
		if (w > h) {
			return [canvas.width, img.height * w | 0]
		} else {
			return [img.width * h, canvas.height]
		}
	})()

	context.save()
	context.globalAlpha = opts.styles?.alpha ?? 1.0
	context.drawImage(img, (canvas.width - tw) / 2, (canvas.height - th) / 2, tw, th)
	context.restore()
}

export type FlashImageProps = {
	readonly images: readonly HTMLImageElement[]
	readonly stageLengths?: readonly [number, number, number, number]
	readonly styles?: {
		readonly alpha?: number
		readonly padding?: number
	}
}

export function renderFlashImageToCanvas(dom: HTMLCanvasElement, frame: number, opts: FlashImageProps) {
	const stageLengths = opts.stageLengths ?? [15, 15, 15, 15]
	const totalFramesLength = stageLengths.reduce((p, c) => p + c, 0)
	const steps = opts.images.map(image => async (dom: HTMLCanvasElement) => renderImageToCanvas(dom, {
		image,
		styles: {
			padding: opts.styles?.padding
		}
	}));

	return renderFlashToCanvas(dom, frame, { stageLengths: stageLengths, style: { alpha: opts.styles?.alpha } }, dom => renderSwitchToCanvas(dom, frame, {
		stepLength: totalFramesLength,
		steps: steps
	}))
}


export function loadImage(href: string): Promise<HTMLImageElement> {
	return new Promise<HTMLImageElement>((resolve) => {
		const image = new Image()
		function onLoad() {
			image.removeEventListener("load", onLoad)
			resolve(image)
		}
		image.addEventListener("load", onLoad)
		image.crossOrigin = "Anonymous"
		image.src = href

	})
}
