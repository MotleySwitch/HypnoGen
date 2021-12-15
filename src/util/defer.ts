export default function (callback?: () => void | Promise<void>) {
    return new Promise<void>((resolve, reject) => {
        requestAnimationFrame(async () => {
            if (callback) {
                await callback()
            }
            resolve()
        })
    })
}

export function delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => { setTimeout(resolve, ms) })
}
