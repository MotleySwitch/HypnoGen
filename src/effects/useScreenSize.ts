import React from "react"

export default function useScreenSize() {
    const [screenSize, setScreenSize] = React.useState<readonly [number, number]>([1280, 720])
    React.useEffect(() => {
        const refresh = () => setScreenSize([document.body.clientWidth, document.body.clientHeight])
        refresh()
        window.addEventListener("resize", refresh)
        return () => window.removeEventListener("resize", refresh)
    }, [])
    return screenSize
}
