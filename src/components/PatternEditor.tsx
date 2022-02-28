import React from "react"

import type { DrawCommand } from "../effects/webgl"
import { DrawCommandEditor } from "./DrawCommandEditor"

export type PatternEditorProps = {
	readonly value: readonly DrawCommand[]
	readonly onChange: (value: readonly DrawCommand[]) => void
}

export const PatternEditor = ({ value, onChange }: PatternEditorProps) => {
	return (
		<>
			{value.map((v, i) => (
				<DrawCommandEditor key={i}
					value={v} onChange={e => onChange([...value.slice(0, i), e, ...value.slice(i + 1)])} />
			))}
		</>
	)
}
