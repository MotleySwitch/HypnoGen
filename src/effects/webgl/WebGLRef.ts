export type ShaderParams = {
	readonly [key: string]: number | readonly [number, number] | readonly [number, number, number] | readonly [number, number, number, number]
}

export default class WebGLRef {
	private gl: WebGLRenderingContext

	constructor(private canvas: HTMLCanvasElement) {
		this.gl = (canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl") ?? ((): RenderingContext => { throw new Error("") })()) as WebGLRenderingContext
	}

	public ref() {
		return this.gl
	}

	public createBuffer() {
		const buffer = this.gl.createBuffer()
		if (buffer == null) {
			throw new Error("")
		}
		return new BufferRef(this.gl, buffer)
	}

	public createProgram(vertex: string, fragment: string) {
		const program = this.gl.createProgram()
		if (program == null) {
			throw new Error("")
		}

		const vs = this.createShader(vertex, this.gl.VERTEX_SHADER)
		this.gl.attachShader(program, vs)
		this.gl.deleteShader(vs)

		const fs = this.createShader("precision highp float;\n\n" + fragment, this.gl.FRAGMENT_SHADER)
		this.gl.attachShader(program, fs)
		this.gl.deleteShader(fs)

		this.gl.linkProgram(program)
		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
			throw new Error(`VALIDATE_STATUS: ${this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS)} ERROR: ${this.gl.getError()}`)
		}
		return new ProgramRef(this.gl, program)
	}

	public clear() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT)
		this.gl.clearColor(0, 0, 0, 1)
	}

	public render(programRef: ProgramRef, parameters: ShaderParams) {
		const program = programRef.ref()
		this.gl.useProgram(program)

		Object.keys(parameters).forEach(key => {
			const value = parameters[key]
			const location = this.gl.getUniformLocation(program, key)
			if (location) {
				if (Array.isArray(value)) {
					switch (value.length) {
						case 2:
							this.gl.uniform2f(location, value[0], value[1])
							break
						case 3:
							this.gl.uniform3f(location, value[0], value[1], value[2])
							break
						case 4:
							this.gl.uniform4f(location, value[0], value[1], value[2], value[3])
							break
					}
				} else {
					this.gl.uniform1f(location, value as number)
				}
			} else {
			}
		})
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
	}

	private createShader(src: string, type: number) {
		const shader = this.gl.createShader(type)
		if (shader == null) {
			throw new Error("")
		}

		this.gl.shaderSource(shader, src)
		this.gl.compileShader(shader)
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			throw new Error((type == this.gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT") + " SHADER:\n" + this.gl.getShaderInfoLog(shader))
		}
		return shader
	}

	public width() {
		return this.canvas.clientWidth
	}
	
	public height() {
		return this.canvas.clientHeight
	}
}

export class ProgramRef {
	private destroyed: boolean = false

	constructor(private gl: WebGLRenderingContext, private program: WebGLProgram) {
	}

	public ref() { return this.program }

	public ok() { return !this.destroyed }

	public destroy() {
		this.gl.deleteProgram(this.program)
		this.destroyed = true
	}
}

export class BufferRef {
	private destroyed: boolean = false

	constructor(private gl: WebGLRenderingContext, private buffer: WebGLBuffer) {
	}

	public ref() {
		return this.buffer
	}

	public ok() {
		return !this.destroyed
	}

	public bind() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]), this.gl.STATIC_DRAW)
		
		this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0)
		this.gl.enableVertexAttribArray(0)
	}

	public destroy() {
		this.gl.deleteBuffer(this.buffer)
		this.destroyed = true
	}
}
