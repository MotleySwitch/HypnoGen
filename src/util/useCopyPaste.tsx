import React, { useContext } from "react"

export const CopyPasteContext = React.createContext<{
    readonly value: unknown | null
    readonly onCopy: (value: unknown | null) => void
}>({
    value: null,
    onCopy: _ => { }
})

export const CopyPasteProvider = ({ children }: { readonly children: React.ReactElement }) => {
    const [value, setValue] = React.useState<unknown | null>(null)
    return (
        <CopyPasteContext.Provider value={{ value, onCopy: setValue }}>
            {children}
        </CopyPasteContext.Provider>
    )
}

export function useCopyPaste<T>(): readonly [T, (value: T | null) => void] {
    const ctx = useContext(CopyPasteContext)

    return [ctx.value as T, (value: T | null) => ctx.onCopy(value)]
}
