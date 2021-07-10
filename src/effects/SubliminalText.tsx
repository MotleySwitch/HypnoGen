import { Collapse, Fade, Grow, Slide, Typography, Zoom } from "@material-ui/core"
import React from "react"
import random from "../util/rand"
import useInterval from "../util/useInterval"
import useScreenSize from "./useScreenSize"

export type SubliminalProps = {
	readonly values: ReadonlyArray<string>
	readonly speed: number
	readonly animation?: "collapse" | "fade" | "grow" | "slide" | "zoom"
	readonly play?: boolean
	readonly seed?: number
	readonly spacing?: number
}

const getAnimation = (type?: "collapse" | "fade" | "grow" | "slide" | "zoom") => {
	switch (type) {
		case "collapse": return Collapse
		case "fade": return Fade
		case "grow": return Grow
		case "slide": return Slide
		case "zoom": return Zoom
		default: return Fade
	}
}

export default function Subliminal({ seed, play, values, speed, spacing, animation }: SubliminalProps) {
	const subtick = speed * 333.3333
	const Animate = getAnimation(animation)
	const [currentCounter, setCurrentCounter] = React.useState(0)
	useInterval(() => {
		if (play && values.length > 0) {
			setCurrentCounter(currentCounter + 1)
		}
	}, subtick)

	const [direction, setDirection] = React.useState<"up" | "down" | "left" | "right">("up")
	const [positionStyles, setPositionStyles] = React.useState<React.CSSProperties>({ display: "none" })
	const [animationState, setAnimationState] = React.useState(2)
	const [textFrame, setTextFrame] = React.useState(0)
	React.useEffect(() => {
		const step = currentCounter % (3 + (spacing ?? 0) * 3)
		switch (step) {
			case 0:
				const x = random(seed ?? 0, currentCounter * 2) * 80 + 10
				const y = random(seed ?? 0, currentCounter * 2 + 1) * 80 + 10
				const lr: React.CSSProperties = x > 50 ? { right: `${x - 50}%` } : { left: `${x}%` }
				const tb: React.CSSProperties = y > 50 ? { bottom: `${y - 50}%` } : { top: `${y}%` }
				if (y > 50) {
					setDirection("up")
				} else {
					setDirection("down")
				}
				setPositionStyles({ ...lr, ...tb })
				setAnimationState(0)
				setTextFrame(textFrame + 1)
				break

			case 1:
				setAnimationState(1)
				break

			case 2:
				setAnimationState(2)
				break

			default:
				break;

		}
	}, [currentCounter, spacing, seed])

	const screenSize = useScreenSize()
	const fontSize = Math.min(Math.max(32, Math.min(...screenSize) / 25), 128)

	return (values.length > 0 && values[textFrame % values.length]
		? (<>
			<Animate
			    direction={direction}
				in={animationState < 2} appear
				timeout={{ appear: subtick / 3, enter: subtick / 3, exit: subtick / 3 }}>
				<Typography
					style={{ opacity: 0.75, fontSize: `${fontSize}px`, color: "white", position: "absolute", ...positionStyles }}
					variant="body1">
					{values[textFrame % values.length]}
				</Typography>
			</Animate>
		</>)
		: <></>)
}
