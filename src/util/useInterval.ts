import React from "react"

export default function useInterval(callback: () => void, ms: number, props: unknown[] = []) {
    const fn = React.useRef(callback)

    React.useEffect(() => { fn.current = callback }, [callback, ...props])

    React.useEffect(() => {
        const id = setInterval(() => {
            if (fn.current) {
                fn.current()
            }
        }, ms)
        return () => clearInterval(id)
    }, [ms])
}
