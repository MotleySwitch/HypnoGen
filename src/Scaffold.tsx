import { createTheme, CssBaseline, MuiThemeProvider, ThemeOptions, Typography } from "@material-ui/core"
import React from "react"
import { ButtplugProvider } from "./util/Buttplug"
import { SearchProvider } from "./util/useQuery"
import { SemaphoreProvider } from "./util/useSemaphore"

const theme: ThemeOptions = {
    overrides: {
        MuiTypography: {
            h1: { fontSize: "2rem", fontWeight: 600 },
            h2: { fontSize: "1.5rem", fontWeight: 600 },
            h3: { fontSize: "1.25rem", fontWeight: 600 },
            h4: { fontSize: "1rem" },
            h5: { fontSize: "0.75rem" },
        },
        MuiCssBaseline: {
            "@global": {
                "body": {
                    position: "absolute",
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "black",
                    overflow: "hidden"
                }
            }
        }
    }
}

export default function Scaffold({ children }: { readonly children: React.ReactChild }) {
    return (
        <ButtplugProvider>
            <SearchProvider>
                <SemaphoreProvider>
                    <MuiThemeProvider theme={createTheme(theme)}>
                        <CssBaseline>
                            <React.Suspense fallback={<Typography variant="h1" align="center">...</Typography>}>
                                {children}
                            </React.Suspense>
                        </CssBaseline>
                    </MuiThemeProvider >
                </SemaphoreProvider>
            </SearchProvider>
        </ButtplugProvider>
    )
}
