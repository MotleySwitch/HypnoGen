import type { Color } from "./Color"
import type { BufferRef, ProgramRef, ShaderParams } from "./WebGLRef"
import WebGLRef from "./WebGLRef"

export type PatternColors = {
	readonly bgColor: Color,
	readonly fgColor: Color,
	readonly pulseColor: Color,
	readonly dimColor: Color
}

export type PatternShader = readonly [BufferRef, ProgramRef, HTMLCanvasElement]

export function renderSpiralShaderToCanvas(dom: HTMLCanvasElement, frame: number, opts: {
	readonly shader: PatternShader
	readonly colors?: Partial<PatternColors>
	readonly fps?: number
}) {
	const src = opts.shader[2]
	src.width = dom.width
	src.height = dom.height

	const context = new WebGLRef(src)
	const params: ShaderParams = {
		time: (frame / (opts.fps ?? 60)),
		rotation: 1,
		direction: 1,
		branchCount: 4,

		resolution: [src.width, src.height],
		aspect: src.width > src.height ? [src.width / src.height, 1.0] : [1.0, src.height / src.width],

		bgColor: opts.colors?.bgColor ?? [0.0, 0.0, 0.0, 0.0],
		fgColor: opts.colors?.fgColor ?? [1.0, 1.0, 1.0, 1.0],
		pulseColor: opts.colors?.pulseColor ?? [178 / 255, 76 / 255, 229 / 255, 1.0],
		dimColor: opts.colors?.dimColor ?? [0.0, 0.0, 0.0, 1.0],
	}

	context.clear()
	opts.shader[0].bind()
	context.render(opts.shader[1], params)

	dom.getContext("2d")?.drawImage(src, 0, 0, dom.width, dom.height)
}

export async function createPatternShader([width, height]: readonly [number, number], fragmentHref: string): Promise<PatternShader> {
	const dom = document.createElement("canvas")
	dom.width = width
	dom.height = height

	const fragment = await fetch(fragmentHref).then(r => { return r.text() })

	return await createPatternShaderFromText([width, height], fragment)
}

export async function createPatternShaderFromText([width, height]: readonly [number, number], fragment: string): Promise<PatternShader> {
	const dom = document.createElement("canvas")
	dom.width = width
	dom.height = height

	const webgl = new WebGLRef(dom)
	const vertex = await fetch("shaders/spiral.vs").then(r => { return r.text() })

	const buffer = webgl.createBuffer()
	if (!buffer.ok()) {
		console.error("failed to create buffer")
	}

	const program = webgl.createProgram(vertex, fragment)
	if (!program.ok()) {
		console.error("failed to create program")
	}
	return [buffer, program, dom]
}
