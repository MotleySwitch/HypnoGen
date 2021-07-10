import React from "react"

import cssx from "../util/cssx"

import useScreenSize from "./useScreenSize"
import useFile from "../util/useFile"
import useRequestAnimationFrame from "../util/useRequestAnimationFrame"
import useInterval from "../util/useInterval"

import { makeStyles } from "@material-ui/core"
import WebGLRef, { BufferRef, ProgramRef, ShaderParams } from "./webgl/WebGLRef"

const usePatternStyles = makeStyles({
	root: {
		position: "absolute",
		inset: 0,
		left: 0,
		right: 0,
		top: 0,
		bottom: 0
	}
})

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
}

export default function Pattern({ play, pattern, className, style, speed, colors }: PatternProps) {
	const timer = React.useRef(0)

	const ref = React.useRef<HTMLCanvasElement>(null)

	const vertexShader = useFile("shaders/spiral.vs")
	const fragmentShader = useFile(pattern ? `shaders/${pattern}.fs` : null)

	const [context, setContext] = React.useState<WebGLRef | null>(null)
	React.useEffect(() => {
		if (ref.current == null) {
			return
		}
		setContext(new WebGLRef(ref.current))
	}, [ref.current])

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

	const screenSize = useScreenSize()

	const parameters = React.useMemo<ShaderParams>(() => ({
		rotation: 1,
		direction: 1,
		branchCount: 4,

		resolution: screenSize,
		aspect: [screenSize[0] / screenSize[1], 1.0],

		...({
			bgColor: [0.0, 0.0, 0.0, 0.0],
			fgColor: [1.0, 1.0, 1.0, 1.0],
			pulseColor: [0.7, 0.3, 0.9, 1.0],
			dimColor: [0.0, 0.0, 0.0, 1.0],
			...(colors ?? {})
		}),
	}), [screenSize, colors])

	useRequestAnimationFrame(() => {
		if (context != null) {
			context.clear()

			if (buffer != null && program != null) {
				buffer.bind()
				context.render(program, { ...parameters, time: timer.current })
			}
		}
	})

	useInterval(() => {
		if (play) {
			timer.current = timer.current + 0.01 * (speed ?? 1)
		}
	}, 10)

	const { root } = usePatternStyles(0)

	return (
		<div>
			{pattern && <canvas
				ref={ref}
				className={cssx(root, className)} style={style}
				width={screenSize[0]} height={screenSize[1]} />}
		</div>
	);
}
