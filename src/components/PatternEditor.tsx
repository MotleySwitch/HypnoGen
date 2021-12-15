import { Grid, MenuItem, Select, Slider, Typography } from "@material-ui/core"
import React from "react"

export default function PatternEditor({ patterns, pattern, speed, onChange }: {
    readonly pattern: string
    readonly speed: number
    readonly onChange: (value: {
        readonly pattern: string
        readonly speed: number
    }) => void

    readonly patterns: readonly string[]
}) {
    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
                <Select label="Background Effect" fullWidth value={pattern} onChange={e => onChange({ speed, pattern: e.target.value as string})}>
                    <MenuItem value="">None</MenuItem>
                    {patterns?.map((bg, i) => <MenuItem key={i} value={bg}>{bg}</MenuItem>)}
                </Select>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Typography variant="body1"><strong>Speed</strong></Typography>
                    </Grid>
                    <Grid item xs>
                        <Slider
                            value={speed}
                            min={0} max={6} step={0.25}
                            onChange={(_, e) => { onChange({ pattern, speed: e as number}) }} />
                    </Grid>
                    <Grid item>
                        <Typography style={{ minWidth: "2em" }} variant="body1">{speed}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}