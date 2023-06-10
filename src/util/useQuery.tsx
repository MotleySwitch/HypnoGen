import React from "react"

export type QueryParams = {
	readonly [key: string]: readonly string[] | undefined
}

const SearchContext = React.createContext({
	search: "",
	setSearch: (_: (value: string) => string) => { }
})

export const SearchProvider = ({ children }: { readonly children: React.ReactChild }) => {
	const [search, setSearch] = React.useState("")
	React.useEffect(() => { setSearch(window.location.search) }, [])
	//React.useEffect(() => {
	//	if (search.length < 2048) {
	//		history.pushState(null, "", search)
	//	}
	//}, [search])

	return (
		<SearchContext.Provider value={{ search, setSearch }}>
			{children}
		</SearchContext.Provider>
	)
}

export function useSearch(): [string, (setter: (value: string) => string) => void] {
	const ctx = React.useContext(SearchContext)

	return [ctx.search, ctx.setSearch]
}

export function toQueryString(params: QueryParams) {
	return `?${btoa(Object.keys(params).flatMap(key => (params[key] ?? []).map(value => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)).join("&"))}`
}


export function useQueryParams(): readonly [QueryParams, (key: string, value: readonly string[]) => void] {
	const [search, setSearch] = useSearch()

	function parseSearch(search: string) {
		if (search.startsWith("?")) {
			return atob(search.substring(1)).split("&").map(kv => {
				const [head, ...tail] = kv.split("=")
				const key = decodeURIComponent(head)
				const value = decodeURIComponent(tail.join("="))

				return [key, value] as readonly [string, string]
			}).reduce((state, [key, value]) => ({ ...state, [key]: [...(state[key] ?? []), value] }), {} as QueryParams)
		} else {
			return {}
		}
	}

	const value = React.useMemo(() => parseSearch(search), [search])
	const setSearchParams = (key: string, value: readonly string[]) => setSearch((search: string) =>  toQueryString({ ...parseSearch(search), [key]: value }))

	return [value, setSearchParams]
}
export function useQuery<T extends string>(key: string): readonly [readonly T[], (value: readonly T[]) => void] {
	const [params, setParam] = useQueryParams()
	const value = React.useMemo(() => params[key] || [], [params, key])

	return [value as readonly T[], next => setParam(key, next)]
}


export function useQueryString<T extends string>(key: string, defaultValue: T): readonly [T, (value: T) => void] {
	const [values, setValues] = useQuery<T>(key)
	const value = values.length > 0 ? values[0] : defaultValue

	return [value, next => { setValues([next]) }]
}

export function useQueryJson<T>(key: string, defaultValue: T): readonly [T, (value: T) => void] {
	const [values, setValues] = useQuery(key)
	const value = values.length > 0 ? values[0] : JSON.stringify(defaultValue)
	const parsed = React.useMemo(() => JSON.parse(value) as T, [value])

	return [parsed, next => { setValues([JSON.stringify(next)]) }]
}

export function useQueryNumber<T extends number>(key: string, defaultValue: T): readonly [T, (value: T) => void] {
	const [value, setValue] = useQueryString<string>(key, defaultValue.toString())
	const parsed = React.useMemo(() => parseFloat(value || defaultValue.toString()) as T, [value])

	return [parsed, (next: T) => { setValue(next.toString()) }]
}
