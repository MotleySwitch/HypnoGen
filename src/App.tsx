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
	paleyellow: rgb(246, 240, 224),
	pink: rgb(255, 192, 203),
	magenta: rgb(255, 0, 255),
	yellow: rgb(255, 255, 0),
	darkred: rgb(127, 0, 0),
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
			targetScreen.width = 620
			targetScreen.height = 360

			const targetBuffer = document.createElement("canvas")
			targetBuffer.width = targetScreen.width
			targetBuffer.height = targetScreen.height

			const targetEyeShader = document.createElement("canvas")
			targetEyeShader.width = 300
			targetEyeShader.height = 300
			
			const targetBackgroundShader = document.createElement("canvas")
			targetBackgroundShader.width = targetScreen.width
			targetBackgroundShader.height = targetScreen.height

			const eyeContext3d = new WebGLRef(targetEyeShader)
			const [eyeBuffer, eyeShader] = await createPatternShader(eyeContext3d, "shaders/spiral.vs", `shaders/full-sharded-pulse.fs`)
			const bgContext3d = new WebGLRef(targetBackgroundShader)
			//const [bgBuffer, bgShader] = await createPatternShader(bgContext3d, "shaders/spiral.vs", `shaders/pendulum-oval.fs`)

			const eyes_full = await loadImage("./assets/eyes.png")
			const eyes_vacant = await loadImage("./assets/eyes-vacant.png")
			const eyes_bg = await loadImage("./assets/eyes-background.png")
			const targetVideo = document.createElement("canvas")
			targetVideo.width = targetBuffer.width
			targetVideo.height = targetBuffer.height

			const flashText = ["TAKE THE HEALS", "HEALS GIVE ME PLEASURE", "HEALED FEELS GOOD", "FULL HEALTH IS BEST"]
			const flashTimer: [number, number, number, number] = [9, 5, 5, 5]
			const flashPositions = ["bottom", "top", "bottom", "top"] as readonly ("top" | "center" | "bottom")[]

			const speed = 2
			const fps = 24
			const totalFrames = 96//flashTimer.reduce((p, c) => p + c, 0) * flashText.length
			const gif = new GIF({ background: "#000", quality: 5, repeat: 0 })

			const frames: string[] = [];
			for (let loops = 0; loops < 3; ++loops) {
				for (let frame = 0; frame < totalFrames; ++frame) {
					const flashTextIndex = ((frame / (flashTimer.reduce((p, c) => p + c))) | 0) % flashText.length
					await defer(async () => {
						eyeContext3d.clear()
						if (eyeBuffer != null && eyeBuffer.ok() && eyeShader != null && eyeShader.ok()) {
							eyeBuffer.bind()
							const frameDt = interpolate("linear", 0.0, totalFrames, frame / totalFrames)
							renderSpiralShaderToCanvas(targetEyeShader, frameDt, {
								colors: {
									bgColor:  colours.transparent,
									fgColor: colours.red,
									dimColor: colours.amethyst,
									pulseColor: colours.magenta
								},
								shader: eyeShader,
								fps
							})
						}
						
						/*bgContext3d.clear()
						if (bgBuffer != null && bgBuffer.ok() && bgBuffer != null && bgBuffer.ok()) {
							bgBuffer.bind()
							const frameDt = interpolate("linear", 0.0, totalFrames, frame / totalFrames) / 2
							renderSpiralShaderToCanvas(targetBackgroundShader, frameDt, {
								colors: {
									bgColor:  colours.transparent,
									fgColor: colours.black,
									dimColor: colours.amethyst,
									pulseColor: colours.magenta
								},
								shader: bgShader,
								fps
							})
						}*/

						const canvasContext = targetBuffer.getContext("2d")!
						canvasContext.save()
						canvasContext.clearRect(0, 0, targetBuffer.width, targetBuffer.height)
						canvasContext.fillStyle = toCssStringRGB(...colours.pink)
						canvasContext.fillRect(0, 0, targetBuffer.width, targetBuffer.height)
						canvasContext.restore()

						//await renderVideoToCanvas(targetVideo, frame, video, { fps })
						//canvasContext.drawImage(targetVideo, 0, 0, targetBuffer.width, targetBuffer.height)

						//renderImageToCanvas(targetBuffer, { image: hexcorp, styles: { alpha: 0.25 } })


						renderImageToCanvas(targetBuffer, { image: eyes_bg, styles: { alpha: 1.0, padding: 100 } })

						canvasContext.save()
						canvasContext.arc(135, 200, 32, 0, Math.PI * 2, true)
						canvasContext.closePath()
						canvasContext.clip()
						canvasContext.drawImage(targetEyeShader, -28, 50, targetEyeShader.width, targetEyeShader.height)
						canvasContext.restore()

						canvasContext.save()
						canvasContext.arc(485, 200, 32, 0, Math.PI * 2, true)
						canvasContext.closePath()
						canvasContext.clip()
						canvasContext.drawImage(targetEyeShader, 318, 50, targetEyeShader.width, targetEyeShader.height)
						canvasContext.restore()

						renderImageToCanvas(targetBuffer, { image: eyes_vacant, styles: { alpha: 1.0, padding: 100 } })
						
						canvasContext.save()
						canvasContext.drawImage(targetBackgroundShader, 0, 0, targetBackgroundShader.width, targetBackgroundShader.height)
						canvasContext.restore()

						renderFlashImageToCanvas(targetBuffer, frame, {
							images: [eyes_full],
							styles: {
								alpha: 0.75,
								padding: 100
							},
							stageLengths: flashTimer
						})

						renderFlashTextToCanvas(targetBuffer, frame, {
							text: flashText,
							style: {
								lineWidth: 1,
								size: 0.9,
								fillColor: colours.white,
								strokeColor: colours.black
							},
							stageLengths: flashTimer,
							align: flashPositions
						})
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


