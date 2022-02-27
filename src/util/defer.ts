export default function (callback?: () => void | Promise<void>, opt?: { readonly active?: boolean }) {
	return new Promise<void>((resolve, reject) => {
		if (opt?.active) {
			requestAnimationFrame(async () => {
				if (callback) {
					await callback()
				}
				resolve()
			})
		} else {
			setTimeout(async () => {
				if (callback) {
					await callback()
				}
				resolve()
			}, 0)
		}
	})
}

export function delay(ms: number): Promise<void> {
	return new Promise<void>((resolve) => { setTimeout(resolve, ms) })
}
