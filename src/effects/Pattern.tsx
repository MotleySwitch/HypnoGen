import React from "react"

import useScreenSize from "./useScreenSize"
import useFile from "../util/useFile"
import useRequestAnimationFrame from "../util/useRequestAnimationFrame"

import WebGLRef, { BufferRef, ProgramRef, ShaderParams } from "./webgl/WebGLRef"
import { useRender } from "./Canvas"

export type PatternColors = {
	readonly bgColor: readonly [number, number, number, number],
	readonly fgColor: readonly [number, number, number, number],
	readonly pulseColor: readonly [number, number, number, number],
	readonly dimColor: readonly [number, number, number, number],
}

export type PatternProps = {
	readonly pattern: string | null
	readonly className?: string
	readonly style?: React.CSSProperties
	readonly speed?: number
	readonly colors?: Partial<PatternColors>
	readonly play?: boolean
	readonly zIndex?: number
	readonly timer: () => number
}

export default function Pattern({ timer, play, pattern, speed, colors, zIndex }: PatternProps) {
	const lastRender = React.useRef(Date.now() / 1000)

	const vertexShader = useFile("shaders/spiral.vs")
	const fragmentShader = useFile(pattern ? `shaders/${pattern}.fs` : null)

	const [context, setContext] = React.useState<WebGLRef | null>(null)

	const [screenWidth, screenHeight] = useScreenSize()
	const target = React.useMemo(() => document.createElement("canvas"), [])
	React.useEffect(() => {
		target.width = screenWidth
		target.height = screenHeight
	}, [screenWidth, screenHeight, target])

	React.useEffect(() => {
		setContext(new WebGLRef(target))
	}, [target])

	const [buffer, setBuffer] = React.useState<BufferRef | null>(null)
	React.useEffect(() => {
		if (context == null) {
			return
		}

		const buffer = context.createBuffer()
		setBuffer(buffer)
		return () => buffer.destroy()
	}, [context])

	const [program, setProgram] = React.useState<ProgramRef | null>(null)
	React.useEffect(() => {
		if (context == null || vertexShader == null || fragmentShader == null) {
			setProgram(null)
			return
		}

		const program = context.createProgram(vertexShader, fragmentShader)
		setProgram(program)
		return () => program.destroy()
	}, [context, vertexShader, fragmentShader])


	const parameters = React.useMemo<ShaderParams>(() => ({
		rotation: 1,
		direction: 1,
		branchCount: 4,

		resolution: [screenWidth, screenHeight],
		aspect: [screenWidth / screenHeight, 1.0],

		...({
			bgColor: [0.0, 0.0, 0.0, 0.0],
			fgColor: [1.0, 1.0, 1.0, 1.0],
			pulseColor: [0.7, 0.3, 0.9, 1.0],
			dimColor: [0.0, 0.0, 0.0, 1.0],
			...(colors ?? {})
		}),
	}), [screenWidth, screenHeight, colors])

	useRequestAnimationFrame(() => {
		if (context != null) {
			context.clear()

			if (pattern && buffer != null && buffer.ok() && program != null && program.ok()) {
				buffer.bind()

				const now = Date.now() / 1000
				const dt = play ? now - lastRender.current : 0
				lastRender.current = now

				const time = ((timer() + dt) * (speed ?? 1))
				context.render(program, { ...parameters, time })
			}
		}
	})

	useRender(zIndex ?? 0, (canvasContext, canvas) => {
		if (pattern) {
			canvasContext.drawImage(target, 0, 0, canvas.width, canvas.height)
		}
	})

	return (
		<React.Fragment />
	);
}
