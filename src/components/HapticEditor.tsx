import React from "react"

import { Button, Grid, Slider, Typography } from "@material-ui/core"
import { useButtplugDevices, useButtplugScan } from "../util/Buttplug"

export default () => {
    const scan = useButtplugScan()
    const devices = useButtplugDevices()
    const [vibration, setVibration] = React.useState(0)

    React.useEffect(() => {
        devices.forEach(device => {
            device.vibrate(vibration)
        })
    }, [vibration, devices])

    return (
        <Grid container spacing={2} alignItems="center">
            {devices.map((device, index) => (
                <Grid item xs={12} key={index}>
                    <Grid container spacing={2}>
                        <Grid item>
                            {device.Name}
                        </Grid>
                        <Grid item style={{ flexGrow: 1 }}>
                            <Slider
                                value={vibration}
                                min={0} max={1} step={0.01}
                                onChange={(_, e) => { setVibration(e as number) }} />
                        </Grid>
                        <Grid item>
                            <Typography>{(vibration * 100) | 0}%</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            ))}
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={() => scan()}>
                    Add device
                </Button>
            </Grid>
        </Grid>

    )
}