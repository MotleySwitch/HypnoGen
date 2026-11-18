import React from "react"

export default () => {
    const [windowSize, setWindowSize] = React.useState([window.innerWidth, window.innerHeight])
    React.useEffect(() => {
        const handler = () => {
            setWindowSize([window.innerWidth, window.innerHeight])
        }
        window.addEventListener("resize", handler)
        return () => window.removeEventListener("resize", handler)
    }, [])
    return windowSize

}
