import { Collapse, Fade, Grow, Slide, Typography, Zoom } from "@material-ui/core"
import React from "react"
import useScreenSize from "./useScreenSize"

export type TextProps = {
	readonly show: boolean
	readonly zIndex: number
	readonly x: number
	readonly y: number
	readonly children: React.ReactChild
	readonly animation?: "collapse" | "fade" | "grow" | "slide" | "zoom"
	readonly speed?: number
}

export default function Text({ zIndex, speed, show, animation, x, y, children }: TextProps) {
	function getAnimation(type?: "collapse" | "fade" | "grow" | "slide" | "zoom") {
		switch (type) {
			case "collapse": return Collapse
			case "fade": return Fade
			case "grow": return Grow
			case "slide": return Slide
			case "zoom": return Zoom
			default: return Fade
		}
	}
	const Animate = getAnimation(animation)

	const screenSize = useScreenSize()
	const fontSize = React.useMemo(() => Math.min(Math.max(32, Math.min(...screenSize) / 25), 128), [...screenSize])

	const lr: React.CSSProperties = x > 50 ? { right: `${100 - x}%` } : { left: `${x}%` }
	const tb: React.CSSProperties = y > 50 ? { bottom: `${100 - y}%` } : { top: `${y}%` }
	const direction = (y > 50) ? "up" : "down"

	return (
		<Animate
			direction={direction}
			in={show} appear
			timeout={160.0 / (speed || 1)}
			style={{ position: "absolute", ...{ ...lr, ...tb } }}>
			<Typography
				style={{ fontSize: `${fontSize}px`, color: "white" }}
				variant="body1">
				{children}
			</Typography>
		</Animate>
	)
}
