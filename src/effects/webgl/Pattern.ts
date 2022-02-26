import type { BufferRef, ProgramRef, ShaderParams } from "./WebGLRef"
import WebGLRef from "./WebGLRef"

export type PatternColors = {
	readonly bgColor: readonly [number, number, number, number],
	readonly fgColor: readonly [number, number, number, number],
	readonly pulseColor: readonly [number, number, number, number],
	readonly dimColor: readonly [number, number, number, number],
	readonly extraColor: readonly [number, number, number, number],
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

		...({
			bgColor: [0.0, 0.0, 0.0, 0.0],
			fgColor: [1.0, 1.0, 1.0, 1.0],
			pulseColor: [178 / 255, 76 / 255, 229 / 255, 1.0],
			dimColor: [0.0, 0.0, 0.0, 0.0],
			extraColor: [0.0, 0.0, 0.0, 0.0],
			...(opts.colors ?? {})
		}),
	}

	context.clear()
	opts.shader[0].bind()
	context.render(opts.shader[1], params)

	dom.getContext("2d")?.drawImage(src, 0, 0, dom.width, dom.height)
}

export async function createPatternShader(source: HTMLCanvasElement, vertexHref: string, fragmentHref: string): Promise<PatternShader> {
	const dom = document.createElement("canvas")
	dom.width = source.width
	dom.height = source.height

	const webgl = new WebGLRef(dom)
	const $vertex = fetch(vertexHref).then(r => { return r.text() })
	const $fragment = fetch(fragmentHref).then(r => { return r.text() })
	const [vertex, fragment] = await Promise.all([$vertex, $fragment])

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
