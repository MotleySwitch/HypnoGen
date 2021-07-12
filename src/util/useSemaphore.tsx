import React from "react"

export const SemaphoreContext = React.createContext<{ [key: string]: number | undefined }>({})

export function SemaphoreProvider({ children }: { readonly children: React.ReactChild }) {
	return (
		<SemaphoreContext.Provider value={{}}>
			{children}
		</SemaphoreContext.Provider>
	)
}

export default function useSemaphore(key: string): {
	readonly increment: () => void
	readonly decrement: () => boolean
	readonly value: () => number
} {
	const ctx = React.useContext(SemaphoreContext)

	return {
		value: () => ctx[key] ?? 0,
		increment: () => ctx[key] = (ctx[key] ?? 0) + 1,
		decrement: () => {
			if (ctx[key]) {
				ctx[key] = (ctx[key] ?? 0) - 1
				return true
			}
			return false
		}
	}
}
