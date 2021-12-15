import { colors, makeStyles } from "@material-ui/core"
import GIF, { defaultMaxListeners } from "gif.js"
import React from "react"
import { toCssStringRGB } from "./effects/webgl/Color"
import { loadImage, renderFlashImageToCanvas, renderImageToCanvas } from "./effects/webgl/Image"
import { createPatternShader, renderSpiralShaderToCanvas } from "./effects/webgl/Pattern"
import { renderFlashBoxToCanvas, renderFlashTextToCanvas } from "./effects/webgl/Text"
import { loadVideo, renderVideoToCanvas } from "./effects/webgl/Video"
import WebGLRef from "./effects/webgl/WebGLRef"
import defer from "./util/defer"
import onKeyboard, { KeyState } from "./util/onKeyboard"

export function linearInterpolate(y1: [number, number, number, number], y2: number, mu: number): [number, number, number, number];
export function linearInterpolate(y1: number, y2: [number, number, number, number], mu: number): [number, number, number, number];
export function linearInterpolate(y1: [number, number, number, number], y2: [number, number, number, number], mu: number): [number, number, number, number];
export function linearInterpolate(y1: number, y2: number, mu: number): number;
export function linearInterpolate(y1: number | [number, number, number, number], y2: number | [number, number, number, number], mu: number): number | [number, number, number, number] {
	if (Array.isArray(y1) && Array.isArray(y2)) {
		return y1.map((x1, i) => x1 + (y2[i] - x1) * mu) as [number, number, number, number]
	} else if (Array.isArray(y1) && !Array.isArray(y2)) {
		return y1.map((x1) => x1 + (y2 - x1) * mu) as [number, number, number, number]
	} else if (Array.isArray(y2) && !Array.isArray(y1)) {
		return y2.map((x2) => y1 + (x2 - y1) * mu) as [number, number, number, number]
	} else {
		return (y1 as number) + (((y2 as number) - (y1 as number)) * mu)
	}
}

export function cosineInterpolate(y1: number, y2: [number, number, number, number], mu: number): number;
export function cosineInterpolate(y1: [number, number, number, number], y2: number, mu: number): number;
export function cosineInterpolate(y1: [number, number, number, number], y2: [number, number, number, number], mu: number): [number, number, number, number];
export function cosineInterpolate(y1: number, y2: number, mu: number): number;
export function cosineInterpolate(y1: number | [number, number, number, number], y2: number | [number, number, number, number], mu: number): [number, number, number, number] | number {
	function interpolate(y1: number, y2: number, mu: number): number {
		const mu2 = (1 - Math.cos(mu * Math.PI)) / 2
		return y1 * (1 - mu2) + y2 * mu2
	}

	if (Array.isArray(y1) && Array.isArray(y2)) {
		return y1.map((x1, i) => interpolate(x1, y2[i], mu)) as [number, number, number, number]
	} else if (Array.isArray(y1) && !Array.isArray(y2)) {
		return y1.map((x1) => interpolate(x1, y2, mu)) as [number, number, number, number]
	} else if (Array.isArray(y2) && !Array.isArray(y1)) {
		return y2.map((x2) => interpolate(y1, x2, mu)) as [number, number, number, number]
	} else {
		return interpolate(y2 as number, y1 as number, mu)
	}
}

export function interpolate(mode: "cosine" | "linear" | "cosine-reverse" | "linear-reverse", y1: number, y2: number, mu: number): number;
export function interpolate(mode: "cosine" | "linear" | "cosine-reverse" | "linear-reverse", y1: number, y2: [number, number, number, number], mu: number): [number, number, number, number];
export function interpolate(mode: "cosine" | "linear" | "cosine-reverse" | "linear-reverse", y1: [number, number, number, number], y2: number, mu: number): [number, number, number, number];
export function interpolate(mode: "cosine" | "linear" | "cosine-reverse" | "linear-reverse", y1: [number, number, number, number], y2: [number, number, number, number], mu: number): [number, number, number, number];
export function interpolate(mode: "cosine" | "linear" | "cosine-reverse" | "linear-reverse", y1: number | [number, number, number, number], y2: number | [number, number, number, number], mu: number) {
	switch (mode) {
		case "cosine": return cosineInterpolate(y1 as any, y2 as any, mu)
		case "linear": return linearInterpolate(y1 as any, y2 as any, mu)
		case "cosine-reverse": return cosineInterpolate(y1 as any, y2 as any, mu > 0.5 ? (1.0 - mu) * 2 : mu * 2)
		case "linear-reverse": return linearInterpolate(y1 as any, y2 as any, mu > 0.5 ? (1.0 - mu) * 2 : mu * 2)
	}
}

const useAppStyles = makeStyles({
	root: {
		position: "absolute",
		width: "100vw",
		height: "100vh",
		overflow: "hidden",
		cursor: "none",
		backgroundSize: "cover"
	}
}, { name: "App" })

export function rgba(r: number, g: number, b: number, a: number): [number, number, number, number] {
	return [r / 255, g / 255, b / 255, a / 255]
}
export function rgb(r: number, g: number, b: number): [number, number, number, number] {
	return [r / 255, g / 255, b / 255, 1]
}

export function fade(amount: number, [r, g, b, a]: [number, number, number, number]): [number, number, number, number] {
	return [r, g, b, a * amount]
}
export function lighten(amount: number, [r, g, b, a]: [number, number, number, number]): [number, number, number, number] {
	const d = [r * amount, g * amount, b * amount, a] as [number, number, number, number]
	console.log(d)
	return d
}


const colours = {
	cornflowerBlue: rgb(100, 149, 237),
	amethyst: rgb(178, 76, 229),
	emerald: rgb(80, 200, 120),
	pink: rgb(255, 192, 203),
	magenta: rgb(255, 0, 255),
	yellow: rgb(255, 255, 0),
	red: rgb(255, 0, 0),
	green: rgb(0, 255, 0),
	blue: rgb(0, 0, 255),
	black: rgb(0, 0, 0),
	grey: rgb(127, 127, 127),
	white: rgb(255, 255, 255),
	transparent: rgba(0, 0, 0, 0)
}

export default function App() {
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

	onKeyboard(async (state, code) => {
		if (state === KeyState.Up && code === "KeyR" && canvasRef.current) {
			const targetScreen = canvasRef.current!
			targetScreen.width = 640
			targetScreen.height = 349

			const targetBuffer = document.createElement("canvas")
			targetBuffer.width = targetScreen.width
			targetBuffer.height = targetScreen.height

			const targetShader = document.createElement("canvas")
			targetShader.width = targetBuffer.width
			targetShader.height = targetBuffer.height

			const context3d = new WebGLRef(targetShader)
			const [buffer3d, shader3d] = await createPatternShader(context3d, "shaders/spiral.vs", `shaders/full-inwards.fs`)

			const drone = await loadImage("./assets/drone.png")
			const hexcorp = await loadImage("./assets/hexcorplogo.png")
			const eyes = await loadImage("./assets/eyes.png")
			const video = await loadVideo("./assets/untitled.webm")
			const targetVideo = document.createElement("canvas")
			targetVideo.width = targetBuffer.width
			targetVideo.height = targetBuffer.height

			const flashText = ["GOOD TOYS DON'T THINK", "GOOD TOYS JUST SINK", "GOOD TOYS OBEY", "TRANCE THEIR MINDS AWAY"]
			const flashTimer: [number, number, number, number] = [15, 5, 5, 5]
			const flashPositions = ["top", "bottom", "top", "bottom"] as readonly ("top" | "center" | "bottom")[]

			const speed = 1
			const fps = 30
			const totalFrames = flashTimer.reduce((p, c) => p + c, 0) * flashText.length
			const gif = new GIF({ background: "#000", quality: 5, repeat: 0 })

			const frames: string[] = [];
			for (let loops = 0; loops < 3; ++loops) {
				for (let frame = 0; frame < totalFrames; ++frame) {
					const flashTextIndex = ((frame / (flashTimer.reduce((p, c) => p + c))) | 0) % flashText.length
					await defer(async () => {
						if (context3d != null) {
							context3d.clear()

							if (buffer3d != null && buffer3d.ok() && shader3d != null && shader3d.ok()) {
								buffer3d.bind()
								const frameDt = interpolate("linear", 0.0, totalFrames, frame / totalFrames)
								renderSpiralShaderToCanvas(targetShader, frameDt, {
									colors: {
										bgColor:  colours.transparent,
										fgColor: interpolate("cosine-reverse", colours.magenta, colours.amethyst, frame / totalFrames)
									},
									shader: shader3d,
									fps
								})
							}
						}

						const canvasContext = targetBuffer.getContext("2d")!
						canvasContext.save()
						canvasContext.clearRect(0, 0, targetBuffer.width, targetBuffer.height)
						canvasContext.fillStyle = toCssStringRGB(...colours.pink)
						canvasContext.fillRect(0, 0, targetBuffer.width, targetBuffer.height)
						canvasContext.restore()

						//await renderVideoToCanvas(targetVideo, frame, video, { fps })
						//canvasContext.drawImage(targetVideo, 0, 0, targetBuffer.width, targetBuffer.height)

						renderImageToCanvas(targetBuffer, { image: eyes, styles: { alpha: 0.10 } })
						renderFlashImageToCanvas(targetBuffer, frame, {
							images: [eyes],
							styles: {
								alpha: 0.25
							},
							stageLengths: flashTimer
						})
						//renderImageToCanvas(targetBuffer, { image: hexcorp, styles: { alpha: 0.25 } })

						canvasContext.save()
						//canvasContext.filter = "blur(1px)"
						canvasContext.drawImage(targetShader, 0, 0, targetBuffer.width, targetBuffer.height)
						canvasContext.restore()


						//renderFlashTextToCanvas(targetBuffer, frame, {
						//	text: flashText,
						//	style: {
						//		lineWidth: 1,
						//		size: 0.75,
						//		fillColor: colours.white,
						//		strokeColor: colours.blue,
						//	},
						//	stageLengths: flashTimer,
						//	align: flashPositions
						//})
					})

					if (loops == 2) {
						const dataurl = targetBuffer.toDataURL()
						if (frames.find(e => e == dataurl) == null) {
							frames.push(dataurl)
						} else {
							console.log(frame)
						}
						gif.addFrame(targetBuffer, { delay: 1000 / (speed * fps), copy: true })
					}
					targetScreen.getContext("2d")!.drawImage(targetBuffer, 0, 0, targetScreen.width, targetScreen.height)
				}
			}
			gif.on("progress", e => {
				console.log(e)
			})
			gif.on("finished", blob => {
				window.open(URL.createObjectURL(blob))
			})
			gif.render()
		}
	})

	const appStyles = useAppStyles()
	return (<canvas ref={canvasRef} className={appStyles.root}></canvas>)
}

