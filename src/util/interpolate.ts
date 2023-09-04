
export function linearInterpolate(y1: readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], y2: number, mu: number): readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number];
export function linearInterpolate(y1: number, y2: readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], mu: number): readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number];
export function linearInterpolate(y1: readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], y2: readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], mu: number): readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number];
export function linearInterpolate(y1: number, y2: number, mu: number): number;
export function linearInterpolate(y1: number | readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], y2: number | readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], mu: number): number | readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number] {
	if (Array.isArray(y1) && Array.isArray(y2)) {
		return y1.map((x1, i) => x1 + (y2[i] - x1) * mu)as any
	} else if (Array.isArray(y1) && !Array.isArray(y2)) {
		return y1.map((x1) => x1 + (y2 as number - x1) * mu)as any
	} else if (Array.isArray(y2) && !Array.isArray(y1)) {
		return y2.map((x2) => y1 as number + (x2 - (y1 as number)) * mu)as any
	} else {
		return (y1 as number) + (((y2 as number) - (y1 as number)) * mu)
	}
}

export function cosineInterpolate(y1: number, y2: readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], mu: number): number;
export function cosineInterpolate(y1: readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], y2: number, mu: number): number;
export function cosineInterpolate(y1: readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], y2: readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], mu: number): readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number];
export function cosineInterpolate(y1: number, y2: number, mu: number): number;
export function cosineInterpolate(y1: number | readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], y2: number | readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], mu: number): readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number] | number {
	function interpolate(y1: number, y2: number, mu: number): number {
		const mu2 = (1 - Math.cos(mu * Math.PI)) / 2
		return y1 * (1 - mu2) + y2 * mu2
	}

	if (Array.isArray(y1) && Array.isArray(y2)) {
		return y1.map((x1, i) => interpolate(x1, y2[i], mu))as any
	} else if (Array.isArray(y1) && !Array.isArray(y2)) {
		return y1.map((x1) => interpolate(x1, y2 as number, mu))as any
	} else if (Array.isArray(y2) && !Array.isArray(y1)) {
		return y2.map((x2) => interpolate(y1 as number, x2, mu))as any
	} else {
		return interpolate(y2 as number, y1 as number, mu)
	}
}

export function interpolate(mode: "cosine" | "linear" | "cosine-reverse" | "linear-reverse", y1: number, y2: number, mu: number): number;
export function interpolate(mode: "cosine" | "linear" | "cosine-reverse" | "linear-reverse", y1: number, y2: readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], mu: number): readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number];
export function interpolate(mode: "cosine" | "linear" | "cosine-reverse" | "linear-reverse", y1: readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], y2: number, mu: number): readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number];
export function interpolate(mode: "cosine" | "linear" | "cosine-reverse" | "linear-reverse", y1: readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], y2: readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], mu: number): readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number];
export function interpolate(mode: "cosine" | "linear" | "cosine-reverse" | "linear-reverse", y1: number | readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], y2: number | readonly  [number, number] | readonly  [number, number, number] | readonly [number, number, number, number], mu: number) {
	switch (mode) {
		case "cosine": return cosineInterpolate(y1 as any, y2 as any, mu)
		case "linear": return linearInterpolate(y1 as any, y2 as any, mu)
		case "cosine-reverse": return cosineInterpolate(y1 as any, y2 as any, mu > 0.5 ? (1.0 - mu) * 2 : mu * 2)
		case "linear-reverse": return linearInterpolate(y1 as any, y2 as any, mu > 0.5 ? (1.0 - mu) * 2 : mu * 2)
	}
}