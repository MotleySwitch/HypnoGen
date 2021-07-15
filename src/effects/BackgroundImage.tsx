import React from "react"
import { useRender } from "./Canvas"

export type BackgroundImageProps = {
	readonly href: string
	readonly zIndex: number
}

export default function BackgroundImage({ href, zIndex }: BackgroundImageProps) {
	const [loaded, setLoaded] = React.useState(false)
	const img = React.useMemo(() => {
		const dom = new Image()
		dom.src = href
		return dom
	}, [href])
	React.useEffect(() => {
		if (img.loading) {
			setLoaded(false)
			function onLoad() {
				setLoaded(true)
			}
			img.addEventListener("load", onLoad)
			return () => img.removeEventListener("load", onLoad)
		} else {
			setLoaded(true)
		}
	}, [img])


	useRender(zIndex, (ctx, canvas) => {
		if (loaded) {
			const w = canvas.width / img.width
			const h = canvas.height / img.height
			const [tw, th] = ((): readonly [number, number] => {
				if (w > h) {
					return [canvas.width, img.height * w | 0]
				} else {
					return [img.width * h, canvas.height]
				}
			})()

			ctx.drawImage(img, (- tw) / 2, (canvas.height - th) / 2, tw, th)
		}
	})

	return <React.Fragment />
}
