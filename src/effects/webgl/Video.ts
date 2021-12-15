import defer from "../../util/defer";

export async function renderVideoToCanvas(dom: HTMLCanvasElement, frame: number, video: HTMLVideoElement, opts: {
	fps?: number
}) {
	const fps = opts.fps ?? 60;
	const context = dom.getContext("2d")!

	const w = dom.width / video.videoWidth
	const h = dom.height / video.videoHeight
	const [tw, th] = (((): readonly [number, number] => {
		if (dom.width > dom.height) {
			return [dom.width, video.videoHeight * w | 0]
		} else {
			return [video.videoWidth * h, dom.height]
		}
	})())

	const totalFrames = Math.ceil(video.duration * fps)
	const looped_frame = frame % totalFrames
	const time = (looped_frame / totalFrames) * video.duration
	video.currentTime = time
	await defer(() => context.drawImage(video, (dom.width - tw) / 2, (dom.height - th) / 2, tw, th))
	await defer()
}

export function loadVideo(href: string): Promise<HTMLVideoElement> {
	return new Promise<HTMLVideoElement>((resolve) => {
		const video = document.createElement("video")
		function onLoad() {
			video.removeEventListener("loadeddata", onLoad)
			video.play()
			resolve(video)
		}
		video.addEventListener("loadeddata", onLoad)
		video.src = href
	})
}
