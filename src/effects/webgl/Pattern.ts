import type { BufferRef, ProgramRef, ShaderParams } from "./WebGLRef"
import WebGLRef from "./WebGLRef"

export type PatternColors = {
	readonly bgColor: readonly [number, number, number, number],
	readonly fgColor: readonly [number, number, number, number],
	readonly pulseColor: readonly [number, number, number, number],
	readonly dimColor: readonly [number, number, number, number],
}

export function renderSpiralShaderToCanvas(dom: HTMLCanvasElement, frame: number, opts: {
    readonly shader: ProgramRef
	readonly colors?: Partial<PatternColors>
    readonly fps?: number
}) {
    const context = new WebGLRef(dom)

    const params: ShaderParams = {
        time: (frame / (opts.fps ?? 60)),
		rotation: 1,
		direction: 1,
		branchCount: 4,

		resolution: [dom.width, dom.height],
		aspect: dom.width > dom.height ? [dom.width / dom.height, 1.0] : [1.0, dom.height / dom.width],

		...({
			bgColor: [0.0, 0.0, 0.0, 0.0],
			fgColor: [1.0, 1.0, 1.0, 1.0],
			pulseColor: [178 / 255, 76 / 255, 229 / 255, 1.0],
			dimColor: [0.0, 0.0, 0.0, 0.0],
			...(opts.colors ?? {})
		}),
	}
    context.render(opts.shader, params)
}

export async function createPatternShader(webgl: WebGLRef, vertexHref: string, fragmentHref: string): Promise<readonly [BufferRef, ProgramRef]> {
	const $vertex = fetch(vertexHref).then(r => { return r.text() })
	const $fragment = fetch(fragmentHref).then(r => { return r.text() })
	const [vertex, fragment] = await Promise.all([ $vertex, $fragment ])

	const buffer = webgl.createBuffer()
	if (!buffer.ok()) {
		console.error("failed to create buffer")
	}

	const program = webgl.createProgram(vertex, fragment)
	if (!program.ok()) {
		console.error("failed to create program")
	}
	return [buffer, program]
}
