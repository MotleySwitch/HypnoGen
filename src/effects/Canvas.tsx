import React from "react"
import useRequestAnimationFrame from "../util/useRequestAnimationFrame"
import useScreenSize from "./useScreenSize"

const CanvasContext = React.createContext({
	canvas: (null as HTMLCanvasElement | null),
	renders: [] as (readonly [number, (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void, number])[],
	nextRenderId: 0
})

export function useRender(zIndex: number, render: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void) {
	const context = React.useContext(CanvasContext)

	const renderer = React.useRef(render)
	React.useEffect(() => { renderer.current = render }, [render])

	React.useEffect(() => {
		const id = context.nextRenderId++
		context.renders.push([id, render, zIndex])
		context.renders.sort(([_, __, z1], [___, ____, z2]) => z1 - z2)

		return () => { context.renders.splice(context.renders.findIndex(([t, _, __]) => t !== id, 1)) }
	}, [zIndex])
}

export function useCanvas() {
	const context = React.useContext(CanvasContext)

	return context.canvas
}

const CanvasRenderer = ({ canvas, children }: {
	readonly children: React.ReactChild
	readonly canvas: HTMLCanvasElement
}) => {
	const renders = React.useRef<(readonly [number, (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void, number])[]>([]).current
	const nextRenderId = React.useRef(0).current

	const context = React.useMemo(() => canvas.getContext("2d")!, [canvas])

	useRequestAnimationFrame(() => {
		context.clearRect(0, 0, canvas.width, canvas.height)
		renders.forEach(([_, render, i]) => {
			render(context, canvas)
		})
	})

	return (
		<CanvasContext.Provider value={{
			canvas,
			renders,
			nextRenderId
		 }}>
			 {children}
		 </CanvasContext.Provider>
	)
}

export type CanvasProps = {
	readonly children: React.ReactChild
	readonly className?: string
}

export function Canvas({ className, children }: CanvasProps) {
	const [sw, sh] = useScreenSize()
	const [ref, setRef] = React.useState<HTMLCanvasElement | null>(null)

	return (
		<canvas ref={setRef} width={sw} height={sh} className={className}>
			{ref && <CanvasRenderer canvas={ref}>{children}</CanvasRenderer>}
		</canvas>
	)
}
