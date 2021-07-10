import useFile from "./useFile";

export default function useJsonFile<T>(src: string | null) {
    const file = useFile(src)

    if (file != null) {
        return JSON.parse(file) as T
    } else {
        return null
    }
}