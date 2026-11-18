import React from "react";
import useSemaphore from "./useSemaphore";

export default function useFile(src: string | null) {
	const semaphore = useSemaphore("file-load")
	const [file, setVertexShader] = React.useState<string | null>(null)
	React.useEffect(() => {
		if (src == null) {
			return
		}

		semaphore.increment()
		let cancelled = false
		let loaded = false
			; (async function () {
				const vertex = await fetch(src).then(function (r) { return r.text() })
				if (!cancelled) {
					setVertexShader(vertex)
					semaphore.decrement()
				} else {
					loaded = true
				}
			})()
		return () => {
			cancelled = true
			if (!loaded) {
				semaphore.decrement()
			}
		}
	}, [src])
	return file
}
