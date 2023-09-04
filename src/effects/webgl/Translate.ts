import { interpolate } from "../../util/interpolate"

export type TweenPositionProps = {
    readonly startFrame: number
    readonly length: number
    readonly startPosition: readonly [number, number]
    readonly endPosition: readonly [number, number]
    readonly interpolation: "linear" | "cosine"
    readonly render: (dom: HTMLCanvasElement) => Promise<void>
}

export async function renderTweenPositionWithCanvas(dom: HTMLCanvasElement, frame: number, opts: TweenPositionProps): Promise<void> {
    if (frame < opts.startFrame) {
        await renderTranslateWithCanvas(dom, {
            render: opts.render,
            position: opts.startPosition
        })
    } else if (frame > opts.startFrame + opts.length) {
        await renderTranslateWithCanvas(dom, {
            render: opts.render,
            position: opts.endPosition
        })
    } else {
        const percentage = (frame - opts.startFrame) / opts.length
        await renderTranslateWithCanvas(dom, {
            position: interpolate(opts.interpolation, opts.startPosition, opts.endPosition, percentage) as readonly [number, number],
            render: opts.render
        })
    }
}

export type TranslateProps = {
    readonly position: readonly [number, number]
    readonly render: (dom: HTMLCanvasElement) => Promise<void>
}

export async function renderTranslateWithCanvas(dom: HTMLCanvasElement, opts: TranslateProps): Promise<void> {
    const context = dom.getContext("2d")!
    context.save()
    context.translate(dom.width * opts.position[0], dom.height * opts.position[1])
    opts.render(dom)
    context.restore()
}