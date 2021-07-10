import React from "react";

export default function useFile(src: string | null) {
    const [file, setVertexShader] = React.useState<string | null>(null)
    React.useEffect(() => {
        if (src == null) {
            return
        }

        let cancelled = false
            ; (async function () {
                const vertex = await fetch(src).then(function (r) { return r.text() })
                if (!cancelled) {
                    setVertexShader(vertex)
                }
            })()
        return () => { cancelled = true }
    }, [src])
    return file
}