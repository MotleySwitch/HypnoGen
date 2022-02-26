import React from "react"

export default function useRequestAnimationFrame(callback: (frame: number) => void, props: unknown[] = []) {
    const fn = React.useRef(callback)

	const frame = React.useRef(0)
    React.useEffect(() => { fn.current = callback }, [callback, ...props])

    React.useEffect(() => {
        let cancel = false
        let id = 0
        id = requestAnimationFrame(function loop() {
            if (cancel) {
                return
            }

            if (fn.current) {
                fn.current(frame.current)
                frame.current = frame.current + 1
            }
            id = requestAnimationFrame(loop)
        })
        return () => {
            cancelAnimationFrame(id)
            cancel = true
        }
    }, [])
}
