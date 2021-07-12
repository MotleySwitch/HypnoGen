import React from "react"
import random from "../util/random"
import useInterval from "../util/useInterval"
import AnimatedText from "./AnimatedText"

export type SubliminalProps = {
	readonly zIndex: number
	readonly values: ReadonlyArray<string>
	readonly speed?: number
	readonly animation?: "collapse" | "fade" | "grow" | "slide" | "zoom"
	readonly positionSelector?: (counter: number) => readonly [number, number]
	readonly play?: boolean
	readonly spacing?: number
}

export function RandomPosition(seed: number) {
	return function (counter: number): readonly [number, number] {
		const x = (random(seed, counter * 2) * 80 + 10) | 0
		const y = (random(seed, counter * 2 + 1) * 80 + 10) | 0
		return [x, y]
	}
}

export default function Subliminal({ zIndex, play, values, speed, spacing, animation, positionSelector }: SubliminalProps) {
	const subtick = (1000 / 4) / (speed || 1)
	const [currentCounter, setCurrentCounter] = React.useState(0)
	useInterval(() => {
		if ((speed ?? 1) > 0 && play && values.length > 0) {
			setCurrentCounter(currentCounter + 1)
		}
	}, subtick)

	const [position, setPosition] = React.useState<readonly [number, number]>((positionSelector ?? RandomPosition(0))(0))
	const [animationState, setAnimationState] = React.useState(0)
	const [textFrame, setTextFrame] = React.useState(0)
	React.useEffect(() => {
		const step = currentCounter % (3 + (spacing ?? 0) * 3)
		switch (step) {
			case 0:
				setPosition((positionSelector ?? RandomPosition(0))(currentCounter))
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
	}, [currentCounter, spacing])

	return (values.length > 0 && values[textFrame % values.length]
		? (
			<AnimatedText speed={speed} zIndex={zIndex} show={animationState >= 0 && animationState < 2} x={position[0]} y={position[1]} animation={animation}>
				{values[textFrame % values.length]}
			</AnimatedText>
		)
		: <></>)
}
