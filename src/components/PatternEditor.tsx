import React from "react"

import { DrawCommand, AvailableDrawCommands, DrawCommandDef } from "../effects/webgl"
import { DrawCommandEditor, makeSetEditor } from "./DrawCommandEditor"

export type PatternEditorProps = {
	readonly value: readonly DrawCommand[]
	readonly onChange: (value: readonly DrawCommand[]) => void
}

const PatternSetEditor = makeSetEditor<DrawCommand, DrawCommandDef>({
	create: v => DrawCommand(v.type),
	edit: (value, onChange) => <DrawCommandEditor value={value} onChange={onChange} />,
	createOptions: AvailableDrawCommands,
	optionName: e => e.name
})

export const PatternEditor = ({ value, onChange }: PatternEditorProps) => {
	return (
		<PatternSetEditor label="Patterns" value={value} onChange={onChange} />
	)
}
