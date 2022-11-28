import React from "react"

import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, IconButton, LinearProgress, Menu, MenuItem, Popover, Select, Slider, TextField, TextFieldProps, Typography } from "@mui/material"
import { ExpandMore, FileCopy, Delete, ArrowUpward, ArrowDownward, ContentPasteGo, AddCircle } from "@mui/icons-material"

import { SketchPicker } from "react-color"

import type { Assets, DrawCommand } from "../effects/webgl"
import { Color, toCssStringRGB, toCssStringRGBA } from "../effects/webgl/Color"
import { AvailableShaders } from "../effects/webgl/Shaders"
import type { TextAlign as FlashTextAlign, FlashTextStyle, TextStyle, SubliminalStyle } from "../effects/webgl/Text"
import { PatternEditor } from "./PatternEditor"
import { useCopyPaste } from "../util/useCopyPaste"

export type SetEditorProps<Value, Props = undefined> = {
	readonly label: string
	readonly value: readonly Value[]
	readonly onChange: (value: readonly Value[]) => void
	readonly props?: Props
}

export type MakeSetEditorArgs<Value, Key = string, Props = undefined> = {
	readonly create: () => Value
	readonly createOptions?: never
	readonly edit: (value: Value, onChange: (value: Value) => void, props?: Props) => JSX.Element
} | {
	readonly createOptions: readonly Key[]
	readonly optionName: (value: Key) => string
	readonly create: (value: Key) => Value
	readonly edit: (value: Value, onChange: (value: Value) => void, props?: Props) => JSX.Element
}

export const makeSetEditor = function <Value, Key = string, Props = undefined>(opts: MakeSetEditorArgs<Value, Key, Props>) {
	return ({ props, label, value, onChange }: SetEditorProps<Value, Props>) => {
		const [copy, setCopy] = useCopyPaste<Value>()
		const [add, setAdd] = React.useState<HTMLButtonElement | null>(null)
		return (
			<>
				<Typography variant="h4" paragraph>{label}</Typography>
				{value.map((v, i) => <Grid key={i} container spacing={3}>
					<Grid item style={{ width: "120px" }}>
						<IconButton color="secondary" onClick={() => onChange([...value.slice(0, Math.max(0, i - 1)), v, ...value.slice(i - 1, i), ...value.slice(i + 1)])}>
							<ArrowUpward />
						</IconButton>
						<IconButton color="secondary" onClick={() => onChange([...value.slice(0, Math.max(0, i)), ...value.slice(i + 1, i + 2), v, ...value.slice(i + 2)])}>
							<ArrowDownward />
						</IconButton>
					</Grid>
					<Grid item style={{ width: "calc(100% - 240px)" }}>
						{opts.edit(v, nv => onChange([...value.slice(0, i), nv, ...value.slice(i + 1)]), props)}
					</Grid>
					<Grid item style={{ width: "120px" }}>
						<IconButton color="secondary" onClick={() => setCopy(v)}>
							<FileCopy />
						</IconButton>
						<IconButton color="secondary" onClick={() => onChange([...value.slice(0, i), ...value.slice(i + 1)])}>
							<Delete />
						</IconButton>
					</Grid>
				</Grid>)}

				<Grid container spacing={3}>
					<Grid item style={{ flexGrow: 1 }} />
					<Grid item>
						<IconButton disabled={copy == null} onClick={e => {
							onChange([...value, copy!])
							setCopy(null)
						}}>
							<ContentPasteGo />
						</IconButton>
						{opts.createOptions && <Menu open={add != null} anchorEl={add} onClose={() => setAdd(null)}>
							{opts.createOptions.map((e, i) => <MenuItem key={i} onClick={() => {
								onChange([...value, opts.create(e)])
								setAdd(null)
							}}>{opts.optionName(e)}</MenuItem>)}
						</Menu>}
					</Grid>
					<Grid item>
						<IconButton onClick={e => {
							if (opts.createOptions) {
								setAdd(e.currentTarget)
							} else {
								onChange([...value, opts.create()])
							}
						}}>
							<AddCircle />
						</IconButton>
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

export type TextAlignSelectProps = {
	readonly label: string
	readonly value: FlashTextAlign
	readonly onChange: (value: FlashTextAlign) => void
}

export const TextAlignSelect = ({ label, value, onChange }: TextAlignSelectProps) => {
	return (
		<Select label={label} fullWidth value={value} onChange={e => onChange(e.target.value as FlashTextAlign)}>
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

export type TextStyleEditorProps = {
	readonly label: string
	readonly value: TextStyle
	readonly onChange: (value: TextStyle) => void
}

export const TextStyleEditor = ({ label, value, onChange }: TextStyleEditorProps) => {
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
					<Grid item xs={12}>
						<TextAlignSelect label="Align" value={value.align ?? "center"} onChange={align => onChange({ ...value, align })} />
					</Grid>
					<Grid item xs={12}>
						<CoordsEditor label="Offset" value={[value.offsetX ?? 0, value.offsetY ?? 0]} onChange={([offsetX, offsetY]) => onChange({ ...value, offsetX, offsetY })} />
					</Grid>
				</Grid>
			</AccordionDetails>
		</Accordion>
	)
}

export type SubliminalStyleEditorProps = {
	readonly label: string
	readonly value: SubliminalStyle
	readonly onChange: (value: SubliminalStyle) => void
}

export const SubliminalStyleEditor = ({ label, value, onChange }: TextStyleEditorProps) => {
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
				</Grid>
			</AccordionDetails>
		</Accordion>
	)
}



const AlignSetEditor = makeSetEditor<FlashTextAlign>({
	create: () => ("center" as FlashTextAlign),
	edit: (value, onChange) => <TextAlignSelect label="align" value={value} onChange={onChange} />
})

export type FlashTextStyleEditorProps = {
	readonly label: string
	readonly value: FlashTextStyle
	readonly onChange: (value: FlashTextStyle) => void
}

export const FlashTextStyleEditor = ({ label, value, onChange }: FlashTextStyleEditorProps) => {
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
					<Grid item xs={12}>
						<CoordsEditor label="Offset" value={[value.offsetX ?? 0, value.offsetY ?? 0]} onChange={([offsetX, offsetY]) => onChange({ ...value, offsetX, offsetY })} />
					</Grid>
					<Grid item xs={12}>
						<AlignSetEditor label="Align" value={value.align ?? []} onChange={align => onChange({ ...value, align })} />
					</Grid>
				</Grid>
			</AccordionDetails>
		</Accordion>
	)
}

export type DrawCommandEditorProps = {
	readonly assets: Assets
	readonly fps: number
	readonly value: DrawCommand
	readonly onChange: (value: DrawCommand) => void
}

export const DrawCommandEditor = ({ fps, assets, value, onChange }: DrawCommandEditorProps) => {
	const [open, setOpen] = React.useState(false)
	const [selectedSpiral, setSelectedSpiral] = React.useState("")
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
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
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
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "hide-after":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Hide After</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField inputProps={{ step: 1 }} fullWidth type="number" label="Frames" value={value.frames} onChange={e => onChange({ ...value, frames: parseInt(e.target.value || "0", 0) })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "show-after":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Show After</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField inputProps={{ step: 1 }} fullWidth type="number" label="Frames" value={value.frames} onChange={e => onChange({ ...value, frames: parseInt(e.target.value || "0", 0) })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "change-speed":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Change Speed</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField inputProps={{ min: 0, step: 0.25 }} fullWidth type="number" label="Factor" value={value.factor} onChange={e => onChange({ ...value, factor: parseFloat(e.target.value || "0") })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "rotate-by":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Rotate By</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField inputProps={{ min: 0, step: 0.25 }} fullWidth type="number" label="Angle" value={value.angle} onChange={e => onChange({ ...value, angle: parseFloat(e.target.value || "0") })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "rotating":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Rotating</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField inputProps={{ min: 0, step: 0.25 }} fullWidth type="number" label="Speed" value={value.speed} onChange={e => onChange({ ...value, speed: parseFloat(e.target.value || "0") })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
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
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "clip-rect":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Clip (Rect)</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3} alignItems="flex-end">
							<Grid item xs={6}>
								<CoordsEditor label="Origin" value={value.origin} onChange={origin => onChange({ ...value, origin })} />
							</Grid>
							<Grid item xs={6}>
								<CoordsEditor label="Size" value={value.size} onChange={size => onChange({ ...value, size })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "text":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Text</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
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

		case "fade-in":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Fade In</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField type="number" fullWidth label="Length" value={value.length ?? 60} onChange={length => onChange({ ...value, length: parseInt(length.target.value, 0) })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "fade-out":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Fade In</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField type="number" fullWidth label="Length" value={value.length ?? 60} onChange={length => onChange({ ...value, length: parseInt(length.target.value, 0) })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "flash":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Flash</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<StageEditor label="Stages" value={value.stages ?? [15, 15, 15, 15]} onChange={stages => onChange({ ...value, stages })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
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
								<TextField multiline fullWidth label="Messages" value={value.text.join("\n")} onChange={e => onChange({ ...value, text: e.target.value.split("\n") })} />
							</Grid>
							<Grid item xs={12}>
								<StageEditor label="Stages" value={value.stages ?? [15, 15, 15, 15]} onChange={stages => onChange({ ...value, stages })} />
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
								<SubliminalStyleEditor label="Styles" value={value.style ?? {}} onChange={style => onChange({ ...value, style })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "switch":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Switch</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField
									type="number" label="Step Length" fullWidth inputProps={{ min: 0, step: 1 }}
									value={value.stepLength ?? 60} onChange={v => onChange({ ...value, stepLength: parseInt(v.target.value || "0", 0) })} />
							</Grid>
							<Grid item xs={12}>
								<PatternEditor fps={fps} assets={assets} value={value.children} onChange={children => onChange({ ...value, children })} />
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

		case "local-pattern":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Pattern (GLSL)</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Select fullWidth label="Shader" value={selectedSpiral} onChange={async pattern => {
									await fetch(`shaders/${[pattern.target.value]}.fs`)
										.then($fragment => $fragment.text())
										.then(fragment => {
											onChange({
												...value,
												patternBody: fragment
											})
										})
									setSelectedSpiral(pattern.target.value as string)
								}}>
									{AvailableShaders.map(shader => <MenuItem key={shader.key} value={shader.key}>{shader.name}</MenuItem>)}
								</Select>
							</Grid>
							<Grid item xs={12}>
								<TextField label="Shader GLSL" value={value.patternBody} onChange={pattern => onChange({ ...value, patternBody: pattern.target.value })} fullWidth multiline />
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

		case "image":
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Image</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<BlurTextField fullWidth label="Href" value={value.image ?? ""} onChange={e => onChange({ ...value, image: e.target.value })} />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			)

		case "video":
			const videoElement = !!value.video && assets.videos[value.video]
			return (
				<Accordion expanded={open} onChange={(_, open) => setOpen(open)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h3">Video</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<BlurTextField fullWidth label="Href" value={value.video ?? ""} onChange={e => onChange({ ...value, video: e.target.value })} />
							</Grid>
							<Grid item xs={12}>
								{videoElement
									? <Typography variant="body1">Frames: {Math.ceil(videoElement.duration * fps)}</Typography>
									: <LinearProgress variant="indeterminate" color="primary" />
								}
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

const BlurTextField = (props: TextFieldProps) => {
	const [value, setValue] = React.useState(props.value ?? props.defaultValue)
	React.useEffect(() => {
		if (props.value != null) { setValue(value) }
	}, [props.value])
	React.useEffect(() => {
		if (props.defaultValue != null) { setValue(value) }
	}, [props.defaultValue])

	return <TextField {...props} value={value} onChange={e => setValue(e.currentTarget.value)} onBlur={props.onChange && (e => props.onChange!(e))} />
}
