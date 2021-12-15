import type { PatternColors } from "./Pattern"
import type { ProgramRef } from "./WebGLRef"

export type RenderVideoStep = {
    readonly type: "video"
    readonly src: HTMLVideoElement
}
export type RenderFlashTextStep = {
    readonly type: "flash-text"
    readonly src: readonly string[]
    readonly align?: readonly string[]
	readonly style?: {
		readonly alpha?: number
		readonly fillColor?: [number, number, number, number]
		readonly strokeColor?: [number, number, number, number]
		readonly fonts?: readonly string[]
	}
}

export type RenderShaderStep = {
    readonly type: "shader"
    readonly shader: ProgramRef
	readonly colors?: Partial<PatternColors>
}

export type RenderImageStep = {
    readonly type: "image"
    readonly src: readonly HTMLImageElement[]
}

export type RenderStep =
| RenderVideoStep
| RenderFlashTextStep
| RenderShaderStep
| RenderImageStep