import React from "react"

import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, IconButton, Menu, MenuItem, Popover, Select, Slider, TextField, Typography } from "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"

import { SketchPicker } from "react-color"

import type { DrawCommand } from "../effects/webgl"
import { Color, toCssStringRGB, toCssStringRGBA } from "../effects/webgl/Color"
import { AvailableShaders } from "../effects/webgl/Shaders"
import type { FlashTextAlign, FlashTextStyle, TextStyle } from "../effects/webgl/Text"
import { PatternEditor } from "./PatternEditor"

export type SetEditorProps<T, U = string> = {
	readonly value: readonly T[]
	readonly onChange: (value: readonly T[]) => void
	readonly children: (value: T, onChange: (value: T) => void) => JSX.Element
} & ({
	readonly create: () => T
	readonly createOptions: undefined
} | {
	readonly createOptions: readonly U[]
	readonly optionName: (value: U) => string
	readonly create: (value: U) => T
})

export const SetEditor = function <T, U = string>({ value, onChange, children, ...opts }: SetEditorProps<T, U>) {
	const [add, setAdd] = React.useState<HTMLButtonElement | null>(null)
	return (
		<>
			{value.map((v, i) => <Grid key={i} container spacing={3}>
				<Grid item style={{ width: "100px" }}>
					<IconButton color="secondary" onClick={() => onChange([...value.slice(0, Math.max(0, i - 1)), v, ...value.slice(i - 1, i), ...value.slice(i + 1)])}>/\</IconButton>
					<IconButton color="secondary" onClick={() => onChange([...value.slice(0, Math.max(0, i)), ...value.slice(i + 1, i + 2), v, ...value.slice(i + 2)])}>\/</IconButton>
				</Grid>
				<Grid item style={{ width: "calc(100% - 164px)" }}>
					{children(v, nv => onChange([...value.slice(0, i), nv, ...value.slice(i + 1)]))}
				</Grid>
				<Grid item style={{ width: "64px" }}>
					<IconButton color="secondary" onClick={() => onChange([...value.slice(0, i), ...value.slice(i + 1)])}>X</IconButton>
				</Grid>
			</Grid>)}

			<Grid container spacing={3}>
				<Grid item style={{ flexGrow: 1 }} />
				<Grid item>
					<IconButton onClick={e => {
						if (opts.createOptions) {
							setAdd(e.currentTarget)
						} else {
							onChange([...value, opts.create()])
						}
					}}>+</IconButton>
					{opts.createOptions && <Menu open={add != null} anchorEl={add} onClose={() => setAdd(null)}>
						{opts.createOptions.map((e, i) => <MenuItem key={i} onClick={() => {
							onChange([...value, opts.create(e)])
							setAdd(null)
						}}>{opts.optionName(e)}</MenuItem>)}
					</Menu>}
				</Grid>
			</Grid>
		</>
	)
}


export type StageEditorProps = {
	readonly label: string
	readonly value: readonly [number, number, number, number]
	readonly onChange: (value: readonly [number, number, number, number]) => void
}

export const StageEditor = ({ label, value, onChange }: StageEditorProps) => {
	return (
		<>
			<Grid container spacing={1}>
				<Grid item xs={12}>
					<Typography variant="h4" paragraph>{label}</Typography>
				</Grid>
				<Grid item xs={12} sm={3}>
					<TextField
						type="number" label="Hidden" fullWidth inputProps={{ min: 0, step: 1 }}
						value={value[0]} onChange={v => onChange([parseInt(v.target.value || "0", 0), value[1], value[2], value[3]])} />
				</Grid>
				<Grid item xs={12} sm={3}>
					<TextField
						type="number" label="Fade in" fullWidth inputProps={{ min: 0, step: 1 }}
						value={value[1]} onChange={v => onChange([value[0], parseInt(v.target.value || "0", 0), value[2], value[3]])} />
				</Grid>
				<Grid item xs={12} sm={3}>
					<TextField
						type="number" label="Visible" fullWidth inputProps={{ min: 0, step: 1 }}
						value={value[2]} onChange={v => onChange([value[0], value[1], parseInt(v.target.value || "0", 0), value[3]])} />
				</Grid>
				<Grid item xs={12} sm={3}>
					<TextField
						type="number" label="Fade out" fullWidth inputProps={{ min: 0, step: 1 }}
						value={value[3]} onChange={v => onChange([value[0], value[1], value[2], parseInt(v.target.value || "0", 0)])} />
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
			<Box component="div" style={{ width: "100%", background: toCssStringRGB(...value), padding: "1.5em 0", textAlign: "center" }}>
				<Button style={{ background: "white" }} variant="outlined" onClick={e => setOpen(e.currentTarget)}>{label}</Button>
			</Box>
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
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<Typography variant="h4" paragraph>{label}</Typography>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					type="number" label="X" fullWidth inputProps={{ step: 0.01 }}
					value={value[0]} onChange={v => onChange([parseFloat(v.target.value || "0"), value[1]])} />
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					type="number" label="Y" fullWidth inputProps={{ step: 0.01 }}
					value={value[1]} onChange={v => onChange([value[0], parseFloat(v.target.value || "0")])} />
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
						<TextField inputProps={{ min: 0, step: 0.1 }} type="number" label="Font size" fullWidth value={value.size ?? 1} onChange={v => onChange({ ...value, size: parseFloat(v.target.value || "0") })} />
					</Grid>
					<Grid item xs={6}>
						<TextField inputProps={{ min: 0, step: 1 }} type="number" label="Line width" fullWidth value={value.lineWidth ?? 1} onChange={v => onChange({ ...value, lineWidth: parseFloat(v.target.value || "0") })} />
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

export type FlashTextAlignSelectProps = {
	readonly value: FlashTextAlign
	readonly onChange: (value: FlashTextAlign) => void
}

export const FlashTextAlignSelect = ({ value, onChange }: FlashTextAlignSelectProps) => {
	return (
		<Select label="align" fullWidth value={value} onChange={e => onChange(e.target.value as FlashTextAlign)}>
			<MenuItem value="center">Center</MenuItem>
			<MenuItem value="top">Top</MenuItem>
			<MenuItem value="bottom">Bottom</MenuItem>
			<MenuItem value="left">Left</MenuItem>
			<MenuItem value="right">Right</MenuItem>
			<MenuItem value="top-left">Top Left</MenuItem>
			<MenuItem value="top-right">Top Right</MenuItem>
			<MenuItem value="bottom-left">Bottom Left</MenuItem>
			<MenuItem value="bottom-right">Bottom Right</MenuItem>
		</Select>
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

		case "opacity":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Opacity</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Slider valueLabelDisplay="auto" min={0} max={1} step={0.01} value={value.value} onChange={(_, opacity) => onChange({ ...value, value: opacity as number })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor value={value.children} onChange={children => onChange({ ...value, children })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "frame-offset":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Frame Offset</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField inputProps={{ step: 1 }} fullWidth type="number" label="By" value={value.by} onChange={e => onChange({ ...value, by: parseInt(e.target.value || "0", 0) })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor value={value.children} onChange={children => onChange({ ...value, children })} />
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
						<Grid container spacing={3} alignItems="flex-end">
							<Grid item xs={8}>
								<CoordsEditor label="Origin" value={value.origin} onChange={origin => onChange({ ...value, origin })} />
							</Grid>
							<Grid item xs={4}>
								<TextField
									type="number" label="Radius" fullWidth
									value={value.radius ?? 1} onChange={e => onChange({ ...value, radius: parseFloat(e.target.value || "0") })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor value={value.children} onChange={children => onChange({ ...value, children })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "text":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Flash Text</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<CoordsEditor label="Coords" value={value.coords} onChange={coords => onChange({ ...value, coords })} />
							</Grid>
							<Grid item xs={12}>
								<TextField fullWidth label="Value" value={value.value} onChange={e => onChange({ ...value, value: e.target.value })} />
							</Grid>
							<Grid item xs={12}>
								<TextStyleEditor label="Styles" value={value.style ?? {}} onChange={style => onChange({ ...value, style })} />
							</Grid>
						</Grid>
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
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<StageEditor label="Stages" value={value.stages ?? [15, 15, 15, 15]} onChange={stages => onChange({ ...value, stages })} />
							</Grid>
							<Grid item xs={12}>
								<ColorEditor label="Color" value={value.color} onChange={color => onChange({ ...value, color })} />
							</Grid>
						</Grid>
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
								{value.align != null
									&& value.align.map((align, i) => (
										<FlashTextAlignSelect key={i} value={align} onChange={align => onChange({ ...value, align: [...value.align!.slice(0, i), align, ...value.align!.slice(i + 1)] })} />
									))}
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

		case "subliminal":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Subliminals</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<StageEditor label="Stages" value={value.stages ?? [15, 15, 15, 15]} onChange={stages => onChange({ ...value, stages })} />
							</Grid>
							<Grid item xs={12}>
								<TextField multiline fullWidth label="Messages" value={value.text.join("\n")} onChange={e => onChange({ ...value, text: e.target.value.split("\n") })} />
							</Grid>
							<Grid item xs={12}>
								<TextStyleEditor label="Styles" value={value.style ?? {}} onChange={style => onChange({ ...value, style })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "pattern":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Pattern</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Select fullWidth label="Shader" value={value.pattern} onChange={pattern => onChange({ ...value, pattern: pattern.target.value as string })}>
									{AvailableShaders.map(shader => <MenuItem key={shader.key} value={shader.key}>{shader.name}</MenuItem>)}
								</Select>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="h4" paragraph>Properties</Typography>
								<Grid container>
									<Grid item xs={12} sm={6} md={3}>
										<ColorEditor label="Background" value={value.colors.bg ?? [0, 0, 0, 0]} onChange={bg => onChange({ ...value, colors: { ...value.colors, bg } })} />
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<ColorEditor label="Foreground" value={value.colors.fg ?? [1, 1, 1, 1]} onChange={fg => onChange({ ...value, colors: { ...value.colors, fg } })} />
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<ColorEditor label="Pulse" value={value.colors.pulse ?? [178 / 255, 76 / 255, 229 / 255, 1.0]} onChange={pulse => onChange({ ...value, colors: { ...value.colors, pulse } })} />
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<ColorEditor label="Dim" value={value.colors.dim ?? [0, 0, 0, 1]} onChange={dim => onChange({ ...value, colors: { ...value.colors, dim } })} />
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		default:
			return (
				<Typography variant="body1"> Unrecognized command type '{(value as { readonly type: string }).type}'</Typography>
			)
	}
}
