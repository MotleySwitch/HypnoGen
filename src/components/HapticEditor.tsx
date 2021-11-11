import React from "react"

import { Button, Grid } from "@material-ui/core"
import { useButtplugDevices, useButtplugScan } from "../util/Buttplug"

export default () => {
    const [scanning, scan] = useButtplugScan()
    const devices = useButtplugDevices()

    return (
        <Grid container spacing={2} alignItems="center">
            {devices.map((device, index) => (
                <Grid item xs={12} key={index}>
                    <Grid container spacing={2}>
                        <Grid item style={{ flexGrow: 1 }}>
                            {device.Name}
                        </Grid>
                    </Grid>
                </Grid>
            ))}
            <Grid item xs={12}>
                <Button disabled={scanning} variant="contained" color="primary" onClick={scan}>
                    Add device
                </Button>
            </Grid>
        </Grid>
    )
}
