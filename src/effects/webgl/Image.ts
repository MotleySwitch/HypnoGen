export type BackgroundImageProps = {
	readonly image: HTMLImageElement
	readonly styles?: {
		readonly alpha?: number
	}
}

export function renderImageToCanvas(dom: HTMLCanvasElement, opts: BackgroundImageProps) {
	const context = dom.getContext("2d")!
	const canvas = dom
	const img = opts.image

	const w = canvas.width / img.width
	const h = canvas.height / img.height
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
	}
}

export function renderFlashImageToCanvas(dom: HTMLCanvasElement, frame: number, opts: FlashImageProps) {
	const stageLengths = opts.stageLengths ?? [15, 15, 15, 15]
	const totalFramesLength = stageLengths.reduce((p, c) => p + c)
	const framePosition = frame % totalFramesLength
	const image = opts.images[((frame / totalFramesLength) | 0) % opts.images.length]

	if (framePosition < stageLengths[0]) {
	} else if (framePosition < stageLengths[0] + stageLengths[1]) {
		renderImageToCanvas(dom, {
			image,
			styles: {
				alpha: (framePosition - stageLengths[0]) / stageLengths[1] * (opts.styles?.alpha ?? 1)
			}
		})
	} else if (framePosition < stageLengths[0] + stageLengths[1] + stageLengths[2]) {
		renderImageToCanvas(dom, {
			image,
			styles: {
				alpha: (opts.styles?.alpha ?? 1)
			}
		})
	} else if (framePosition < stageLengths[0] + stageLengths[1] + stageLengths[2] + stageLengths[3]) {
		const pos = framePosition - (stageLengths[0] + stageLengths[1] + stageLengths[2])
		renderImageToCanvas(dom, {
			image,
			styles: {
				alpha: (stageLengths[3] - pos) / stageLengths[3] * (opts.styles?.alpha ?? 1),
			}
		})
	} else {
	}
}


export function loadImage(href: string): Promise<HTMLImageElement> {
	return new Promise<HTMLImageElement>((resolve) => {
		const image = new Image()
		function onLoad() {
			image.removeEventListener("load", onLoad)
			resolve(image)
		}
		image.addEventListener("load", onLoad)
		image.src = href

	})
}
