export function toCssStringRGB(r: number, g: number, b: number, a?: number) {
    function componentToHex(c: number) {
        const hex = (c | 0).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
    
    return `#${componentToHex(r * 255)}${componentToHex(g * 255)}${componentToHex(b * 255)}`
}
