import React from "react"

import { DrawCommand, DrawCommandTypes } from "../effects/webgl"
import { DrawCommandEditor, SetEditor } from "./DrawCommandEditor"

export type PatternEditorProps = {
	readonly value: readonly DrawCommand[]
	readonly onChange: (value: readonly DrawCommand[]) => void
}

export const PatternEditor = ({ value, onChange }: PatternEditorProps) => {
	return (
		<SetEditor value={value} onChange={onChange} createOptions={DrawCommandTypes} optionName={e => e.name} create={v => DrawCommand(v.type)}>
			{(value, onChange) => <DrawCommandEditor value={value} onChange={onChange} />}
		</SetEditor>
	)
}
