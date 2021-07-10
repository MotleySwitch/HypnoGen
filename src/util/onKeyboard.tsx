import React from "react"

export enum KeyState { Down, Up }

export default function onKeyboard(callback: (state: KeyState, code: string) => void) {
    const invoker = React.useRef(callback)
    React.useEffect(() => { invoker.current = callback }, [callback])

    React.useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            invoker.current(KeyState.Down, e.code)
        }
        function onKeyUp(e: KeyboardEvent) {
            invoker.current(KeyState.Up, e.code)
        }

        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("keyup", onKeyUp)

        return () => {
            window.removeEventListener("keydown", onKeyDown)
            window.removeEventListener("keyup", onKeyUp)
        }
    }, [])
}