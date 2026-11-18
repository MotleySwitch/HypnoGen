import React from "react"

import { DrawCommand, AvailableDrawCommands, DrawCommandDef, Assets } from "../effects/webgl"
import { DrawCommandEditor, makeSetEditor } from "./DrawCommandEditor"

export type PatternEditorProps = {
	readonly assets: Assets
	readonly fps: number

	readonly value: readonly DrawCommand[]
	readonly onChange: (value: readonly DrawCommand[]) => void
}

const PatternSetEditor = makeSetEditor<DrawCommand, DrawCommandDef, {
	readonly assets: Assets
	readonly fps: number
}>({
	create: v => DrawCommand(v.type),
	edit: (value, onChange, props) => <DrawCommandEditor fps={props?.fps ?? 0} assets={props?.assets ?? { images: {}, shaders: {}, videos: {} }} value={value} onChange={onChange} />,
	createOptions: AvailableDrawCommands,
	optionName: e => e.name
})

export const PatternEditor = ({ assets, fps, value, onChange }: PatternEditorProps) => {
	return (
		<PatternSetEditor props={{ assets, fps }} label="Patterns" value={value} onChange={onChange} />
	)
}
