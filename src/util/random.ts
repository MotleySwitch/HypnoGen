export function random_int32(seed: number, n: number) {
    n = n | 0
    seed = seed

    let rshift = (j: number, n: number) => n ^ (n >> j)
    let lshift = (j: number, n: number) => n ^ (n << j)
    n = (n * 0xb5297a4d)
    n = (n + seed)
    n = rshift(8, n)
    n = (n + 0x68e31da4)
    n = lshift(8, n)
    n = (n * 0x1b56c4e9)
    n = rshift(8, n)
    return n
}

export default function random(seed: number, n: number) {
    return ((random_int32(seed, n) & 0x000fff00) >> 8) / 0x00000fff
}

export function hash(value: string) {
    let hash = 0;
    let i = 0;
    let chr = 0;
    if (value.length === 0) return hash;
    for (i = 0; i < value.length; i++) {
        chr = value.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}
