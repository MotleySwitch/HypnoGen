import React from "react"
import "@emotion/react"
import { createTheme, CssBaseline, ThemeProvider, ThemeOptions, Typography } from "@mui/material"
import { SearchProvider } from "./util/useQuery"
import { SemaphoreProvider } from "./util/useSemaphore"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { CopyPasteProvider } from "./util/useCopyPaste"

const theme: ThemeOptions = {
	components: {
		MuiTypography: {
			styleOverrides: {
				h1: {
					fontSize: "1.5rem"
				},
				h2: {
					fontSize: "1.2rem"
				},
				h3: {
					fontSize: "1.1rem"
				},
				h4: {
					fontSize: "1rem"
				},
				h5: {
					fontSize: "1rem"
				}
			}
		},
		MuiCssBaseline: {
			styleOverrides: {
				body: {
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
		<CopyPasteProvider>
			<DndProvider backend={HTML5Backend}>
				<SearchProvider>
					<SemaphoreProvider>
						<ThemeProvider theme={createTheme(theme)}>
							<CssBaseline />
							<React.Suspense fallback={<Typography variant="h1" align="center">...</Typography>}>
								{children}
							</React.Suspense>
						</ThemeProvider >
					</SemaphoreProvider>
				</SearchProvider>
			</DndProvider>
		</CopyPasteProvider>
	)
}
