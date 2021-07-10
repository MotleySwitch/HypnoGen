import React from "react"

export default function useRequestAnimationFrame(callback: () => void, props: unknown[] = []) {
    const fn = React.useRef(callback)

    React.useEffect(() => { fn.current = callback }, [callback, ...props])

    React.useEffect(() => {
        let cancel = false
        let id = 0
        id = requestAnimationFrame(function loop() {
            if (cancel) {
                return
            }

            if (fn.current) {
                fn.current()
            }
            id = requestAnimationFrame(loop)
        })
        return () => {
            cancelAnimationFrame(id)
            cancel = true
        }
    }, [])
}
