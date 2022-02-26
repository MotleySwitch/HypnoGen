
import { Colors } from "./webgl/Color"
import { clear, clipCircle, fill, opacity } from "./webgl/Draw"
import { renderSpiralShaderToCanvas } from "./webgl/Pattern"
import { renderTextToCanvas } from "./webgl/Text"

export type Assets = {
	readonly shader1: PatternShader
	readonly shader2: PatternShader
}

export function render(targetBuffer: HTMLCanvasElement, frame: number, assets: Assets, opts?: {
	readonly fps?: number
}) {
	clear(targetBuffer)
	fill(targetBuffer, Colors.white)
	opacity(targetBuffer, 0.75, targetBuffer => {
		renderSpiralShaderToCanvas(targetBuffer, frame, {
			fps: opts?.fps,
			shader: assets.shader2,
			colors: {
				bgColor: Colors.transparent,
				fgColor: Colors.black,
				dimColor: Colors.darkorange,
				pulseColor: Colors.emerald
			}
		})
		renderSpiralShaderToCanvas(targetBuffer, frame * 0.5, {
			fps: opts?.fps,
			shader: assets.shader1,
			colors: {
				bgColor: Colors.transparent,
				fgColor: Colors.black
			}
		})
	})
}
