import { createTheme, CssBaseline, MuiThemeProvider, ThemeOptions, Typography } from "@material-ui/core"
import React from "react"
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
					backgroundImage: "linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)",
					backgroundSize: "20px 20px",
					backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
					overflow: "hidden"
				}
			}
		}
	}
}

export default function Scaffold({ children }: { readonly children: React.ReactChild }) {
	return (
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
	)
}
