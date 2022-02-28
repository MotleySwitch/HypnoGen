export type Color = readonly [number, number, number, number]

export function toCssStringRGB(r: number, g: number, b: number, a?: number) {
    function componentToHex(c: number) {
        const hex = (c | 0).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
    
    return `#${componentToHex(r * 255)}${componentToHex(g * 255)}${componentToHex(b * 255)}`
}
export function toCssStringRGBA(r: number, g: number, b: number, a?: number) {   
    return `rgba(${(r * 255) | 0}, ${(g * 255) | 0}, ${(b * 255) | 0}, ${a ?? 1})`
}

export function clamp_rgba([r, g, b, a]: Color): Color {
	return [
		Math.min(1, Math.max(0, r)),
		Math.min(1, Math.max(0, g)),
		Math.min(1, Math.max(0, b)),
		Math.min(1, Math.max(0, a))
	]
}

export function rgba(r: number, g: number, b: number, a: number): Color {
	return [r / 255, g / 255, b / 255, a / 255]
}
export function rgb(r: number, g: number, b: number): Color {
	return [r / 255, g / 255, b / 255, 1]
}

export function fade(amount: number, [r, g, b, a]: Color): Color {
	return [r, g, b, a * amount]
}
export function lighten(amount: number, [r, g, b, a]: Color): Color {
	return clamp_rgba([r * amount, g * amount, b * amount, a])
}

export const Colors = {
	amethyst: rgb(178, 76, 229),
	emerald: rgb(80, 200, 120),
	palegreen: rgb(175, 237, 152),
	paleyellow: rgb(246, 240, 224),
	goldyellow: rgb(255, 223, 0),
	pastelpink: rgb(255, 209, 219),
	purplepink: rgb(204, 141, 205),
	pink: rgb(255, 192, 203),
	deeppink: rgb(255, 20, 147),
	magenta: rgb(255, 0, 255),
	yellow: rgb(255, 255, 0),
	darkred: rgb(127, 0, 0),
	cyan: rgb(0, 255, 255),
	red: rgb(255, 0, 0),
	green: rgb(0, 255, 0),
	black: rgb(1, 1, 1),
	grey: rgb(127, 127, 127),
	white: rgb(255, 255, 255),
	transparent: rgba(0, 0, 0, 0),
	foxbrown: rgb(213, 172, 119),

	blue: rgb(0, 0, 255),
	paleblue: rgb(152, 251, 237),
	lightblue: rgb(173, 216, 230),
	periwinkle: rgb(204, 204, 255),
	babyblue: rgb(137, 207, 240),
	cornflowerBlue: rgb(100, 149, 237),
	deepblue: rgb(7, 42, 108),

	pumpkin: rgb(245, 118, 26),
	smashedpumpkin: rgb(253, 103, 58),
	darkorange: rgb(255, 140, 0),
	flame: rgb(227, 74, 39),
	papayawhip: rgb(255, 241, 215),
	ultramarine: rgb(64, 0, 255)
}
