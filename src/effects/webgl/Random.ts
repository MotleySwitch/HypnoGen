export function randomNumber(seed: number, index: number) {
    const r = Math.sin(Math.sqrt(seed * 12.9898 + index * 78.233)) * 43758.5453
    return (r - r | 0)
}
