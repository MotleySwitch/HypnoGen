import React from "react"

import { SketchPicker } from "react-color"
import { Accordion, AccordionDetails, AccordionSummary, Button, Grid, Popover, TextField, Typography } from "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import { Color, toCssStringRGBA } from "../effects/webgl/Color"
import type { DrawCommand } from "../effects/webgl"
import { PatternEditor } from "./PatternEditor"
import type { FlashTextStyle, TextStyle } from "src/effects/webgl/Text"

export type StageEditorProps = {
	readonly label: string
	readonly value: readonly [number, number, number, number]
	readonly onChange: (value: readonly [number, number, number, number]) => void
}

export const StageEditor = ({ label, value, onChange }: StageEditorProps) => {
	return (
		<>
			<Grid container>
				<Grid item xs={12}>
					<Typography variant="h4" paragraph>{label}</Typography>
				</Grid>
				<Grid item xs={12} sm={3}>
					<TextField
						type="number" label="Hidden" fullWidth
						value={value[0]} onChange={v => onChange([parseInt(v.target.value, 0), value[1], value[2], value[3]])} />
				</Grid>
				<Grid item xs={12} sm={3}>
					<TextField
						type="number" label="Fade in" fullWidth
						value={value[1]} onChange={v => onChange([value[0], parseInt(v.target.value, 0), value[2], value[3]])} />
				</Grid>
				<Grid item xs={12} sm={3}>
					<TextField
						type="number" label="Visible" fullWidth
						value={value[2]} onChange={v => onChange([value[0], value[1], parseInt(v.target.value, 0), value[3]])} />
				</Grid>
				<Grid item xs={12} sm={3}>
					<TextField
						type="number" label="Fade out" fullWidth
						value={value[3]} onChange={v => onChange([value[0], value[1], value[2], parseInt(v.target.value, 0)])} />
				</Grid>
			</Grid>
		</>
	)
}

export type ColorEditorProps = {
	readonly label: string
	readonly value: Color
	readonly onChange: (value: Color) => void
}

export const ColorEditor = ({ label, value, onChange }: ColorEditorProps) => {
	const [open, setOpen] = React.useState<HTMLButtonElement | null>(null)
	return (
		<>
			<Button color="primary" onClick={e => setOpen(e.currentTarget)}>{label}</Button>
			<Popover open={open != null} onClose={() => setOpen(null)} anchorEl={open} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
				<SketchPicker
					color={toCssStringRGBA(...value)}
					onChange={e => onChange([e.rgb.r / 255, e.rgb.g / 255, e.rgb.b / 255, e.rgb.a ?? 1])} />
			</Popover>
		</>
	)
}

export type CoordsEditorProps = {
	readonly label: string
	readonly value: readonly [number, number]
	readonly onChange: (value: readonly [number, number]) => void
}

export const CoordsEditor = ({ label, value, onChange }: CoordsEditorProps) => {
	return (
		<Grid container>
			<Grid item xs={12}>
				<Typography variant="h4" paragraph>{label}</Typography>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					type="number" label="X" fullWidth
					value={value[0]} onChange={v => onChange([parseFloat(v.target.value), value[1]])} />
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					type="number" label="Y" fullWidth
					value={value[1]} onChange={v => onChange([value[0], parseFloat(v.target.value)])} />
			</Grid>
		</Grid>
	)
}

export type TextStyleEditorProps = {
	readonly label: string
	readonly value: TextStyle
	readonly onChange: (value: TextStyle) => void

	readonly children?: React.ReactNode
}

export const TextStyleEditor = ({ label, value, onChange, children }: TextStyleEditorProps) => {
	const [open, setOpen] = React.useState(false)
	return (
		<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
			<AccordionSummary expandIcon={<ExpandMore />}>
				<Typography variant="h3">{label}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<TextField type="number" label="Font size" fullWidth value={value.size} onChange={v => onChange({ ...value, size: parseFloat(v.target.value) })} />
					</Grid>
					<Grid item xs={6}>
						<TextField type="number" label="Line width" fullWidth value={value.lineWidth} onChange={v => onChange({ ...value, lineWidth: parseFloat(v.target.value) })} />
					</Grid>
					<Grid item xs={6}>
						<ColorEditor label="Fill Color" value={value.fillColor ?? [1, 1, 1, 1]} onChange={fillColor => onChange({ ...value, fillColor })} />
					</Grid>
					<Grid item xs={6}>
						<ColorEditor label="Stroke Color" value={value.strokeColor ?? [0, 0, 0, 1]} onChange={strokeColor => onChange({ ...value, strokeColor })} />
					</Grid>
					{children}
				</Grid>
			</AccordionDetails>
		</Accordion>
	)
}

export type FlashTextStyleEditorProps = {
	readonly label: string
	readonly value: FlashTextStyle
	readonly onChange: (value: FlashTextStyle) => void
}

export const FlashTextStyleEditor = ({ label, value, onChange }: FlashTextStyleEditorProps) => {
	return (
		<TextStyleEditor label={label} value={value} onChange={b => onChange({ ...value, ...b })}>
			<Grid item xs={12}>
				<CoordsEditor label="Offset" value={[value.offsetX ?? 0, value.offsetY ?? 0]} onChange={([offsetX, offsetY]) => onChange({ ...value, offsetX, offsetY })} />
			</Grid>
		</TextStyleEditor>
	)
}

export type DrawCommandEditorProps = {
	readonly value: DrawCommand
	readonly onChange: (value: DrawCommand) => void
}

export const DrawCommandEditor = ({ value, onChange }: DrawCommandEditorProps) => {
	const [open, setOpen] = React.useState(false)
	switch (value.type) {
		case "fill":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Fill</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<ColorEditor label="Color" value={value.color} onChange={color => onChange({ ...value, color })} />
					</AccordionDetails>
				</Accordion>
			)

		case "flash-fill":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Flash Fill</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<StageEditor label="Stages" value={value.stages ?? [15, 15, 15, 15]} onChange={stages => onChange({ ...value, stages })} />
						<ColorEditor label="Color" value={value.color} onChange={color => onChange({ ...value, color })} />
					</AccordionDetails>
				</Accordion>
			)

		case "flash-text":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Flash Text</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<StageEditor label="Stages" value={value.stages ?? [15, 15, 15, 15]} onChange={stages => onChange({ ...value, stages })} />
							</Grid>
							<Grid item xs={12}>
								{value.align}
							</Grid>
							<Grid item xs={12}>
								<TextField multiline fullWidth label="Messages" value={value.text.join("\n")} onChange={e => onChange({ ...value, text: e.target.value.split("\n") })} />
							</Grid>
							<Grid item xs={12}>
								<FlashTextStyleEditor label="Styles" value={value.style ?? {}} onChange={style => onChange({ ...value, style })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "clip-circle":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Clip (Circle)</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<CoordsEditor label="Origin" value={value.origin} onChange={origin => onChange({ ...value, origin })} />
							</Grid>
							<Grid item xs={12}>
								<TextField
									type="number" label="Radius" fullWidth
									value={value.radius} onChange={e => onChange({ ...value, radius: parseFloat(e.target.value) })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor value={value.children} onChange={children => onChange({ ...value, children })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		default:
			return (
				<Typography variant="body1"> Unrecognized command type '{value.type}'</Typography>
			)
	}
}
