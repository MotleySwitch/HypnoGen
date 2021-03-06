import useJsonFile from "src/util/useJsonFile"

export const useAvailableBackgrounds = () => useJsonFile<readonly string[]>("shaders/backgrounds.json")
export const useAvailableForegrounds = () => useJsonFile<readonly string[]>("shaders/foregrounds.json")
