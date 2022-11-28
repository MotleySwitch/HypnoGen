import { Button, LinearProgress } from "@mui/material";
import React from "react"

function getBase64(file: File): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			resolve(reader.result?.toString() ?? "")
		}
		reader.onerror = function (error) {
			console.error(error)
			reject(error)
		}
	})
}


export default ({ accept, onUpload }: { readonly accept: string; readonly onUpload: (base64: string) => void }) => {
	const [uploading, setUploading] = React.useState(false)
	return (
		<>
			<Button variant="contained" component="label">
				Upload
				<input
					type="file" accept={accept}
					hidden
					onChange={async e => {
						if (e.target.files) {
							setUploading(true)
							try {
								onUpload(await getBase64(e.target.files[0]))
							} finally {
								setUploading(false)
							}
						}
					}} />
			</Button>

			{uploading && <LinearProgress color="primary" variant="indeterminate" />}
		</>
	)
}
