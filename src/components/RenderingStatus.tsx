import { CircularProgress, Dialog, DialogContent } from "@material-ui/core"
import React from "react"
import type { RenderingStatus } from "../effects/webgl"

export const RenderingSpinner = ({ className, status }: { readonly className?: string; readonly status: RenderingStatus }) => {
	return (
		<Dialog open={status.current !== "no"}>
			<DialogContent>
				<CircularProgress
					className={className} size={360}
					color={status.current === "rendering" ? "primary" : "secondary"} variant="determinate"
					value={(status.current === "rendering" ? 0 : 50) + (status.current !== "no" ? (status.progress * 50) : 0)} />
			</DialogContent>
		</Dialog>
	)
}
