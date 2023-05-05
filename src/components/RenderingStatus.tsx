import { CircularProgress, Dialog, DialogContent } from "@mui/material"
import React from "react"
import type { RenderingStatus } from "../effects/webgl"

export const RenderingSpinner = ({ className, status }: { readonly className?: string; readonly status: RenderingStatus }) => {
	return (
		<Dialog open={status.current !== "no"}>
			<DialogContent style={{ overflow: "hidden", position: "relative" }}>
				{status.current == "rendering" && <CircularProgress
					className={className} size={360}
					color="primary" variant="determinate"
					value={status.progress * 50} />}

				{status.current == "exporting" && <CircularProgress
					className={className} size={360}
					color="secondary" variant="determinate"
					value={50 + (status.progress * 50)} />}

				{status.current == "converting" && <CircularProgress
					className={className} size={360}
					color="secondary" variant="indeterminate" />}

				<div style={{ position: "absolute", top: "50%", left: 0, right: 0, textAlign: "center"}}>
					{status.current}
				</div>
			</DialogContent>
		</Dialog>
	)
}
