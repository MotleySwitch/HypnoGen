import { Collapse, Fade, Grow, Slide, Typography, Zoom } from "@material-ui/core"
import React from "react"
import { useRender } from "./Canvas"
import useScreenSize from "./useScreenSize"

export type TextProps = {
	readonly show: boolean
	readonly x: number
	readonly y: number
	readonly children: string
	
	readonly zIndex?: number

	readonly animation?: "collapse" | "fade" | "grow" | "slide" | "zoom"
	readonly speed?: number
}

export default function useAnimatedText({ zIndex, speed, show, animation, x, y, children }: TextProps) {
	const screenSize = useScreenSize()
	const fontSize = React.useMemo(() => Math.min(Math.max(24, Math.min(...screenSize) / 25), 128), [...screenSize])

	useRender(zIndex ?? 0, (ctx, canvas) => {
		if (!show) {
			return
		}

		ctx.textAlign = "center"
		ctx.fillStyle = "white"
		ctx.font = `${fontSize}px "Roboto", "Helvetica", "Arial", sans-serif`

		const measure = ctx.measureText(children)

		let px = (x / 100) * canvas.width
		if (px < measure.width / 2) {
			px = px + measure.width / 2
		}
		if (px + measure.width / 2 > canvas.width) {
			px = px - measure.width / 2
		}
		let py = (y / 100) * canvas.height

		ctx.fillText(children, px, py)
	})
}
