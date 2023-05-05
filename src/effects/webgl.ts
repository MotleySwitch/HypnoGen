import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"

import React from "react"
import useWindowResolution from "../util/useWindowResolution"
import defer from "../util/defer"
import type { Color } from "./webgl/Color"
import { clear, clipCircle, clipRect, fill, opacity, renderFadeInToCanvas, renderFadeOutToCanvas, renderFlashFillToCanvas, renderFlashToCanvas, renderSwitchToCanvas, rotate } from "./webgl/Draw"
import { loadImage, renderImageToCanvas } from "./webgl/Image"
import { createPatternShader, createPatternShaderFromText, PatternShader, renderEffectShaderToCanvas, renderSpiralShaderToCanvas } from "./webgl/Pattern"
import { TextAlign, FlashTextStyle, renderFlashTextToCanvas, renderSubliminalToCanvas, renderTextToCanvas, TextStyle, SubliminalStyle } from "./webgl/Text"
import { loadVideo, renderVideoToCanvas } from "./webgl/Video"
import type { RenderDef } from "./webgl/webgl.react"

const GIF = require("gif.js.optimized")

export type DrawCommandType =
	| "fill"
	| "opacity"
	| "frame-offset"
	| "change-speed"
	| "hide-after"
	| "show-after"
	| "rotate-by"
	| "rotating"
	| "clip-circle"
	| "clip-rect"
	| "pattern"
	| "local-pattern"
	| "text"
	| "subliminal"
	| "fade-in"
	| "fade-out"
	| "flash"
	| "flash-text"
	| "flash-fill"
	| "image"
	| "video"

export type DrawCommandDef = { readonly type: DrawCommandType; readonly name: string }

export const AvailableDrawCommands: readonly DrawCommandDef[] = ([
	{
		"type": "change-speed",
		"name": "Change Speed"
	},
	{
		"type": "clip-circle",
		"name": "Clip (Circle)"
	},
	{
		"type": "clip-rect",
		"name": "Clip (Rectangle)"
	},
	{
		"type": "fade-in",
		"name": "Fade In"
	},
	{
		"type": "fade-out",
		"name": "Fade Out"
	},
	{
		"type": "fill",
		"name": "Fill"
	},
	{
		"type": "flash",
		"name": "Flash"
	},
	{
		"type": "flash-fill",
		"name": "Flash (Fill)"
	},
	{
		"type": "flash-text",
		"name": "Flash (Text)"
	},
	{
		"type": "frame-offset",
		"name": "Frame Offset"
	},
	{
		"type": "hide-after",
		"name": "Hide After"
	},
	{
		"type": "image",
		"name": "Image"
	},
	{
		"type": "opacity",
		"name": "Opacity"
	},
	{
		"type": "pattern",
		"name": "Pattern"
	},
	{
		"type": "local-pattern",
		"name": "Pattern (GLSL)"
	},
	{
		"type": "effect",
		"name": "Effect (GLSL)"
	},
	{
		"type": "rotate-by",
		"name": "Rotate By"
	},
	{
		"type": "rotating",
		"name": "Rotating"
	},
	{
		"type": "show-after",
		"name": "Show After"
	},
	{
		"type": "subliminal",
		"name": "Subliminal"
	},
	{
		"type": "switch",
		"name": "Switch"
	},
	{
		"type": "text",
		"name": "Text"
	},
	{
		"type": "video",
		"name": "Video"
	}
] as DrawCommandDef[]).sort((a, b) => a.name > b.name ? 1 : -1)

export type DrawCommand =
	| { readonly type: "fill"; readonly color: Color }
	| { readonly type: "opacity"; readonly value: number; readonly children: readonly DrawCommand[] }
	| { readonly type: "frame-offset"; readonly by: number; readonly children: readonly DrawCommand[] }
	| { readonly type: "change-speed"; readonly factor: number; readonly children: readonly DrawCommand[] }
	| { readonly type: "show-after"; readonly frames: number; readonly children: readonly DrawCommand[] }
	| { readonly type: "hide-after"; readonly frames: number; readonly children: readonly DrawCommand[] }
	| {
		readonly type: "clip-circle"
		readonly origin: readonly [number, number]
		readonly radius: number
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "clip-rect"
		readonly origin: readonly [number, number]
		readonly size: readonly [number, number]
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "pattern"
		readonly pattern: string
		readonly colors: {
			readonly fg?: Color
			readonly bg?: Color
			readonly dim?: Color
			readonly pulse?: Color
			readonly extra?: Color
		}
	}
	| {
		readonly type: "local-pattern"
		readonly pattern: string
		readonly colors: {
			readonly fg?: Color
			readonly bg?: Color
			readonly dim?: Color
			readonly pulse?: Color
			readonly extra?: Color
		}
	}
	| {
		readonly type: "effect"
		readonly shader: string
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "text"
		readonly value: string
		readonly style?: TextStyle
	}
	| {
		readonly type: "rotating"
		readonly speed: number
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "rotate-by"
		readonly angle: number
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "fade-in"
		readonly length?: number
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "fade-out"
		readonly length?: number
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "flash"
		readonly stages?: readonly [number, number, number, number]
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "flash"
		readonly stages?: readonly [number, number, number, number]
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "flash-text"
		readonly text: readonly string[]
		readonly stages?: readonly [number, number, number, number]
		readonly style?: FlashTextStyle
		readonly align?: readonly TextAlign[]
	}
	| {
		readonly type: "subliminal"
		readonly text: readonly string[]
		readonly stages?: readonly [number, number, number, number]
		readonly style?: SubliminalStyle
	}
	| {
		readonly type: "switch"
		readonly stepLength?: number
		readonly children: readonly DrawCommand[]
	}
	| {
		readonly type: "flash-fill"
		readonly color: Color
		readonly stages?: readonly [number, number, number, number]
	}
	| {
		readonly type: "image"
		readonly image: string
	}
	| {
		readonly type: "video"
		readonly video: string
	}

export const DrawCommand = (value: string): DrawCommand => {
	switch (value) {
		case "fill": return { type: "fill", color: [0, 0, 0, 1] }
		case "opacity": return { type: "opacity", value: 1, children: [] }
		case "frame-offset": return { type: "frame-offset", by: 0, children: [] }
		case "hide-after": return { type: "hide-after", frames: 0, children: [] }
		case "show-after": return { type: "show-after", frames: 0, children: [] }
		case "rotate-by": return { type: "rotate-by", angle: 0, children: [] }
		case "rotating": return { type: "rotating", speed: 6, children: [] }
		case "clip-circle": return { type: "clip-circle", origin: [0, 0], radius: 1, children: [] }
		case "clip-rect": return { type: "clip-rect", origin: [0, 0], size: [1, 1], children: [] }
		case "pattern": return { type: "pattern", pattern: "full-archimedes", colors: {} }
		case "local-pattern": return {
			type: "local-pattern",
			pattern: `uniform float time;
uniform vec2 resolution;
uniform vec4 fgColor;

const float PI = radians(180.0);
const float TAU = PI * 2.0;

float time_pos(float time) { return time * TAU; }
float uv_pos(vec2 uv) { return 12.0 / sqrt(length(uv)); }
float curve_pos(vec2 uv) { return 1.0 * atan(uv.y, uv.x); }
float constrict(float value) { return max(0.0, value); }
float spiral(float time, vec2 uv) { return constrict(cos(time_pos(time) + uv_pos(uv) + curve_pos(uv))); }
float dim(vec2 uv) { return smoothstep(0.075, 0.4, length(uv)); }

void main(void) {
	vec2 uv = 2.0 * ((gl_FragCoord.xy - resolution.xy * 0.5) / max(resolution.x, resolution.y));

	gl_FragColor =  spiral(time, uv) * dim(uv) * fgColor;
}
`,
			colors: {}
		}
		case "effect": return {
			type: "effect",
			shader: `uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
/**
 Just messing around with different types of glitching effects.
*/

// try commenting/uncommenting these to isolate/combine different glitch effects.
#define ANALOG
#define DIGITAL
#define CRT

// amount of seconds for which the glitch loop occurs
#define DURATION 5.
// percentage of the duration for which the glitch is triggered
#define AMT .5 

#define SS(a, b, x) (smoothstep(a, b, x) * smoothstep(b, a, x))

// Hash by David_Hoskins
vec3 hash33(vec3 p)
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
			  dot(p,vec3(269.5,183.3,246.1)),
			  dot(p,vec3(113.5,271.9,124.6)));

	return fract(sin(p)*43758.5453123);
}

// Gradient noise by iq
float gnoise(vec3 x)
{
    // grid
    vec3 p = floor(x);
    vec3 w = fract(x);
    
    // quintic interpolant
    vec3 u = w * w * w * (w * (w * 6. - 15.) + 10.);
    
    // gradients
    vec3 ga = hash33(p + vec3(0., 0., 0.));
    vec3 gb = hash33(p + vec3(1., 0., 0.));
    vec3 gc = hash33(p + vec3(0., 1., 0.));
    vec3 gd = hash33(p + vec3(1., 1., 0.));
    vec3 ge = hash33(p + vec3(0., 0., 1.));
    vec3 gf = hash33(p + vec3(1., 0., 1.));
    vec3 gg = hash33(p + vec3(0., 1., 1.));
    vec3 gh = hash33(p + vec3(1., 1., 1.));
    
    // projections
    float va = dot(ga, w - vec3(0., 0., 0.));
    float vb = dot(gb, w - vec3(1., 0., 0.));
    float vc = dot(gc, w - vec3(0., 1., 0.));
    float vd = dot(gd, w - vec3(1., 1., 0.));
    float ve = dot(ge, w - vec3(0., 0., 1.));
    float vf = dot(gf, w - vec3(1., 0., 1.));
    float vg = dot(gg, w - vec3(0., 1., 1.));
    float vh = dot(gh, w - vec3(1., 1., 1.));
	
    // interpolation
    float gNoise = va + u.x * (vb - va) + 
           		u.y * (vc - va) + 
           		u.z * (ve - va) + 
           		u.x * u.y * (va - vb - vc + vd) + 
           		u.y * u.z * (va - vc - ve + vg) + 
           		u.z * u.x * (va - vb - ve + vf) + 
           		u.x * u.y * u.z * (-va + vb + vc - vd + ve - vf - vg + vh);
    
    return 2. * gNoise;
}

vec2 tex_coord(vec2 st) {
     return vec2(st.x, 1.0 - st.y);
}

// gradient noise in range [0, 1]
float gnoise01(vec3 x)
{
	return .5 + .5 * gnoise(x);   
}

// warp uvs for the crt effect
vec2 crt(vec2 uv)
{
    float tht  = atan(uv.y, uv.x);
    float r = length(uv);
    // curve without distorting the center
    r /= (1. - .1 * r * r);
    uv.x = r * cos(tht);
    uv.y = r * sin(tht);
    return .5 * (uv + 1.);
}


void main()
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float t = time;
    
    // smoothed interval for which the glitch gets triggered
    float glitchAmount = SS(DURATION * .001, DURATION * AMT, mod(t, DURATION));  
	float displayNoise = 0.;
    vec3 col = vec3(0.);
    vec2 eps = vec2(5. / resolution.x, 0.);
    vec2 st = vec2(0.);
#ifdef CRT
	uv = crt(uv * 2. - 1.); // warped uvs
    ++displayNoise;
#endif
    // analog distortion
    float y = uv.y * resolution.y;
    float distortion = gnoise(vec3(0., y * .01, t * 500.)) * (glitchAmount * 4. + .1);
    distortion *= gnoise(vec3(0., y * .02, t * 250.)) * (glitchAmount * 2. + .025);
#ifdef ANALOG
    ++displayNoise;
    distortion += smoothstep(.999, 1., sin((uv.y + t * 1.6) * 2.)) * .02;
    distortion -= smoothstep(.999, 1., sin((uv.y + t) * 2.)) * .02;
    st = uv + vec2(distortion, 0.);
    // chromatic aberration
    col.r += texture2D(texture, tex_coord(st + eps + distortion), 0.).r;
    col.g += texture2D(texture, tex_coord(st), 0.).g;
    col.b += texture2D(texture, tex_coord(st - eps - distortion), 0.).b;
#else
    col += texture2D(texture, tex_coord(uv), 0.).xyz;
#endif
    
#ifdef DIGITAL
    // blocky distortion
    float bt = floor(t * 30.) * 300.;
    float blockGlitch = .2 + .9 * glitchAmount;
    float blockNoiseX = step(gnoise01(vec3(0., uv.x * 3., bt)), blockGlitch);
    float blockNoiseX2 = step(gnoise01(vec3(0., uv.x * 1.5, bt * 1.2)), blockGlitch);
    float blockNoiseY = step(gnoise01(vec3(0., uv.y * 4., bt)), blockGlitch);
    float blockNoiseY2 = step(gnoise01(vec3(0., uv.y * 6., bt * 1.2)), blockGlitch);
    float block = blockNoiseX2 * blockNoiseY2 + blockNoiseX * blockNoiseY;
    st = vec2(uv.x + sin(bt) * hash33(vec3(uv, .5)).x, uv.y);
    col *= 1. - block;
    block *= 1.15;
    col.r += texture2D(texture, st + eps, 0.).r * block;
    col.g += texture2D(texture, st, 0.).g * block;
    col.b += texture2D(texture, st - eps, 0.).b * block;
#endif
    // white noise + scanlines
    displayNoise = clamp(displayNoise, 0., 1.);

    col += (.15 + .65 * glitchAmount) * (hash33(vec3(gl_FragCoord.xy, mod(time / 60.0, 1000.))).r) * displayNoise;
    col -= (.25 + .75 * glitchAmount) * (sin(4. * t + uv.y * resolution.y * 1.75))
					* displayNoise;
#ifdef CRT
    //crt vignette (from https://www.shadertoy.com/view/Ms23DR)
    float vig = 8.0 * uv.x * uv.y * (1.-uv.x) * (1.-uv.y);
	col *= vec3(pow(vig, .25)) * 1.5;
    if(uv.x < 0. || uv.x > 1.) col *= 0.;
#endif
    gl_FragColor = vec4(col, 1.0);
}
		`, children: []
		}
		case "text": return { type: "text", value: "" }
		case "fade-in": return { type: "fade-in", length: 60, children: [] }
		case "fade-out": return { type: "fade-out", length: 60, children: [] }
		case "flash": return { type: "flash", stages: [15, 15, 15, 15], children: [] }
		case "flash-text": return { type: "flash-text", text: [] }
		case "subliminal": return { type: "subliminal", text: [] }
		case "switch": return { type: "switch", stepLength: 60, children: [] }
		case "flash-fill": return { type: "flash-fill", color: [1, 1, 1, 1] }
		case "change-speed": return { type: "change-speed", factor: 1, children: [] }
		case "image": return { type: "image", image: "./assets/eyes.png" }
		case "video": return { type: "video", video: "./assets/base.mp4" }
		default:
			return { type: "text", value }
	}
}

export type ShaderStore = {
	readonly [name: string]: PatternShader | undefined
}

export type ImageStore = {
	readonly [name: string]: HTMLImageElement | undefined
}

export type VideoStore = {
	readonly [name: string]: HTMLVideoElement | undefined
}

export type Assets = {
	readonly shaders: ShaderStore
	readonly images: ImageStore
	readonly videos: VideoStore
}

async function forEachAsync<T>(items: readonly T[], lambda: (value: T) => Promise<void>) {
	for (const item of items) {
		await lambda(item)
	}
}

function hash(string: string): string {
	let hash = 0;
	if (string.length == 0) {
		return "";
	} else {
		for (let i = 0; i < string.length; i++) {
			let ch = string.charCodeAt(i);
			hash = ((hash << 5) - hash) + ch;
			hash = hash & hash;
		}
	}
	return btoa(hash.toString());
}

export async function renderTree(dom: HTMLCanvasElement, tree: DrawCommand, frame: number, assets: Assets, opts?: { readonly fps?: number }): Promise<void> {
	switch (tree.type) {
		case "fill":
			return fill(dom, tree.color)

		case "opacity":
			return await opacity(dom, tree.value, async dom => { forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)) })

		case "frame-offset":
			await forEachAsync(tree.children, async child => await renderTree(dom, child, frame + tree.by, assets, opts))
			return

		case "change-speed":
			await forEachAsync(tree.children, child => renderTree(dom, child, frame * tree.factor, assets, opts))
			return

		case "rotate-by":
			await rotate(dom, tree.angle, async dom => await forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))
			return


		case "rotating":
			await rotate(dom, tree.speed * frame, async dom => await forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))
			return

		case "hide-after":
			if (frame < tree.frames) {
				await forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts))
				return
			} else {
				return
			}

		case "show-after":
			if (frame >= tree.frames) {
				await forEachAsync(tree.children, child => renderTree(dom, child, frame - tree.frames, assets, opts))
				return
			} else {
				return
			}

		case "clip-circle":
			await clipCircle(dom, tree.origin, tree.radius, dom => forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))
			return

		case "clip-rect":
			await clipRect(dom, tree.origin, tree.size, dom => forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))
			return

		case "pattern":
			const shader = assets.shaders[tree.pattern]
			if (shader == null) {
				return
			} else {
				return renderSpiralShaderToCanvas(dom, frame, {
					shader,
					colors: {
						bgColor: tree.colors.bg,
						fgColor: tree.colors.fg,
						dimColor: tree.colors.dim,
						pulseColor: tree.colors.pulse
					},
					fps: opts?.fps
				})
			}

		case "local-pattern": {
			const shader = assets.shaders[hash(tree.pattern)]
			if (shader == null) {
				return
			} else {
				return renderSpiralShaderToCanvas(dom, frame, {
					shader,
					fps: opts?.fps,
					colors: {
						bgColor: tree.colors.bg,
						fgColor: tree.colors.fg,
						dimColor: tree.colors.dim,
						pulseColor: tree.colors.pulse
					},
				})
			}
		}

		case "effect": {
			const shader = assets.shaders[hash(tree.shader)]
			if (shader == null) {
				return
			} else {
				return renderEffectShaderToCanvas(dom, frame, {
					shader,
					fps: opts?.fps,
				}, dom => forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))
			}
		}

		case "text":
			return renderTextToCanvas(dom, {
				value: tree.value,
				style: tree.style
			})

		case "subliminal":
			return renderSubliminalToCanvas(dom, frame, {
				text: tree.text,
				stageLengths: tree.stages,
				style: tree.style
			})

		case "switch":
			return await renderSwitchToCanvas(dom, frame, {
				stepLength: tree.stepLength ?? 60,
				steps: tree.children.map(child => async (dom: HTMLCanvasElement) => renderTree(dom, child, frame, assets, opts))
			})

		case "fade-in":
			return await renderFadeInToCanvas(dom, frame, { length: tree.length }, dom => forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))

		case "fade-out":
			return await renderFadeOutToCanvas(dom, frame, { length: tree.length }, dom => forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))

		case "flash":
			return await renderFlashToCanvas(dom, frame, { stageLengths: tree.stages }, dom => forEachAsync(tree.children, child => renderTree(dom, child, frame, assets, opts)))

		case "flash-text":
			return renderFlashTextToCanvas(dom, frame, {
				text: tree.text,
				stageLengths: tree.stages,
				style: tree.style
			})

		case "flash-fill":
			return renderFlashFillToCanvas(dom, frame, {
				stageLengths: tree.stages,
				style: {
					backgroundColor: tree.color
				}
			})

		case "image":
			const image = assets.images[tree.image]
			if (image == null) {
				return
			} else {
				return renderImageToCanvas(dom, { image })
			}


		case "video":
			const video = assets.videos[tree.video]
			if (video == null) {
				return
			} else {
				return await renderVideoToCanvas(dom, frame, { video, fps: opts?.fps })
			}

		default:
			console.log("Unrecognized command type", tree)
	}
}

export async function render(
	targetBuffer: HTMLCanvasElement,
	commands: readonly DrawCommand[],
	frame: number,
	assets: Assets,
	opts?: { readonly fps?: number }
) {
	clear(targetBuffer)
	await forEachAsync(commands, command => renderTree(targetBuffer, command, frame, assets, opts))
}

export function extractUsedShaders(commands: readonly DrawCommand[]): readonly string[] {
	return commands.reduce((prev: readonly string[], curr: DrawCommand) => {
		switch (curr.type) {
			case "pattern":
				return [...prev, curr.pattern]

			default:
				const $curr = (curr as { readonly children?: DrawCommand[] })
				if ($curr.children != null) {
					return [...prev, ...extractUsedShaders($curr.children!)]
				} else {
					return prev
				}
		}
	}, [])
}


export function extractUsedLocalShaders(commands: readonly DrawCommand[]): readonly [string, string][] {
	return commands.reduce((prev: readonly [string, string][], curr: DrawCommand): readonly [string, string][] => {
		switch (curr.type) {
			case "local-pattern":
				return [...prev, [hash(curr.pattern), curr.pattern]]

			case "effect":
				return [...prev, [hash(curr.shader), curr.shader], ...extractUsedLocalShaders(curr.children)]

			default:
				const $curr = (curr as { readonly children?: DrawCommand[] })
				if ($curr.children != null) {
					return [...prev, ...extractUsedLocalShaders($curr.children!)]
				} else {
					return prev
				}
		}
	}, [])
}

export function extractUsedImages(commands: readonly DrawCommand[]): readonly string[] {
	return commands.reduce((prev: readonly string[], curr: DrawCommand) => {
		switch (curr.type) {
			case "image":
				return [...prev, curr.image]
			default:
				const $curr = (curr as { readonly children?: DrawCommand[] })
				if ($curr.children != null) {
					return [...prev, ...extractUsedImages($curr.children!)]
				} else {
					return prev
				}
		}
	}, [])
}


export function extractUsedVideos(commands: readonly DrawCommand[]): readonly string[] {
	return commands.reduce((prev: readonly string[], curr: DrawCommand) => {
		switch (curr.type) {
			case "video":
				return [...prev, curr.video]

			default:
				const $curr = (curr as { readonly children?: DrawCommand[] })
				if ($curr.children != null) {
					return [...prev, ...extractUsedVideos($curr.children!)]
				} else {
					return prev
				}
		}
	}, [])
}

export async function loadShaderAssets(size: readonly [number, number], shaders: readonly string[]): Promise<ShaderStore> {
	const results = await Promise.all(shaders.map(async shader => {
		try {
			return [shader, await createPatternShader(size, `shaders/${shader}.fs`)] as [string, PatternShader] | null
		} catch (err) {
			return null
		}
	}))

	return results
		.filter(f => f != null)
		.map(f => f!)
		.reduce((prev: ShaderStore, [s, d]) => ({ ...prev, [s]: d }), {} as ShaderStore)
}

export async function loadLocalShaderAssets(size: readonly [number, number], shaders: readonly [string, string][]): Promise<ShaderStore> {
	const results = await Promise.all(shaders.map(async ([shader, shaderBody]) => {
		try {
			return [shader, await createPatternShaderFromText(size, shaderBody)] as [string, PatternShader] | null
		} catch (err) {
			return null
		}
	}))

	return results
		.filter(f => f != null)
		.map(f => f!)
		.reduce((prev: ShaderStore, [s, d]) => ({ ...prev, [s]: d }), {} as ShaderStore)
}

export async function loadImageAssets(images: readonly string[]): Promise<ImageStore> {
	const results = await Promise.all(images.map(async image => {
		try {
			return [image, await loadImage(image)] as [string, HTMLImageElement] | null
		} catch (err) {
			return null
		}
	}))

	return results
		.filter(f => f != null)
		.map(f => f!)
		.reduce((prev: ImageStore, [s, d]) => ({ ...prev, [s]: d }), {} as ImageStore)
}

export async function loadVideoAssets(videos: readonly string[]): Promise<VideoStore> {
	const results = await Promise.all(videos.map(async video => {
		try {
			return [video, await loadVideo(video)] as [string, HTMLVideoElement] | null
		} catch (err) {
			return null
		}
	}))

	return results
		.filter(f => f != null)
		.map(f => f!)
		.reduce((prev: VideoStore, [s, d]) => ({ ...prev, [s]: d }), {} as VideoStore)
}

export type RenderingStatus = { readonly current: "no" } | {
	readonly current: "rendering" | "exporting" | "converting"
	readonly progress: number
}

export function useRenderVideo(def: RenderDef, assets: Assets): {
	readonly status: RenderingStatus,
	readonly export: (format: "GIF" | "MP4") => void,
	readonly isReady: boolean
} {
	const lpad = (value: string, length: number) => {
		while (value.length < length) {
			value = "0" + value
		}
		return value
	}

	const windowSize = useWindowResolution()
	const [rendering, setRendering] = React.useState<RenderingStatus>({ current: "no" })

	const [isFFMpegReady, setIsFFMpegReady] = React.useState(false)
	const ffmpeg = React.useMemo(() => createFFmpeg({ log: true }), [])
	React.useEffect(() => {
		ffmpeg.load().then(() => setIsFFMpegReady(true))
	}, [])

	return {
		status: rendering,
		export: async (format: "GIF" | "MP4") => {
			if (!isFFMpegReady) {
				alert("FFMPEG NOT READY YET")
				return
			}

			switch (format) {
				case "GIF": {
					setRendering({ current: "rendering", progress: 0 })

					const targetBuffer = document.createElement("canvas")
					targetBuffer.width = def.resolution[0] > 0 ? def.resolution[0] : windowSize[0]
					targetBuffer.height = def.resolution[1] > 0 ? def.resolution[1] : windowSize[1]

					const gif = new GIF({ workers: 8, quality: 10, repeat: 0 })
					const totalFrames = def.totalFrames || def.fps

					const frame_jump = def.fps
					for (let frame_step = 0; frame_step < totalFrames; frame_step += frame_jump) {
						await defer(async () => {
							for (let frame = frame_step; frame < frame_step + frame_jump && frame < totalFrames; ++frame) {

								await render(targetBuffer, def.pattern, frame, assets, { fps: def.fps })
								gif.addFrame(targetBuffer, { delay: 1000 / (def.speed * def.fps), copy: true })
							}
						})
						setRendering({ current: "rendering", progress: (frame_step / totalFrames) })
					}
					gif.on("progress", (e: number) => {
						setRendering({ current: "exporting", progress: e })
					})
					gif.on("finished", async (blob: Blob) => {
						window.open(URL.createObjectURL(blob))
						setRendering({ current: "no" })
					})
					gif.render()
					break;
				}

				case "MP4": {
					setRendering({ current: "rendering", progress: 0 })

					const targetBuffer = document.createElement("canvas")
					targetBuffer.width = def.resolution[0] > 0 ? def.resolution[0] : windowSize[0]
					targetBuffer.height = def.resolution[1] > 0 ? def.resolution[1] : windowSize[1]

					const totalFrames = def.totalFrames || def.fps

					const frame_jump = def.fps
					for (let frame_step = 0; frame_step < totalFrames; frame_step += frame_jump) {
						await defer(async () => {
							for (let frame = frame_step; frame < frame_step + frame_jump && frame < totalFrames; ++frame) {

								await render(targetBuffer, def.pattern, frame, assets, { fps: def.fps })
								await new Promise<void>(resolve => targetBuffer.toBlob(async blob => {
									if (blob) {
										ffmpeg.FS("writeFile", `frame-${lpad(frame.toString(), Math.floor(Math.log10(totalFrames) + 1))}.png`, await fetchFile(blob))
									}
									resolve()
								}, "image/png"))
							}
						})
						setRendering({ current: "rendering", progress: (frame_step / totalFrames) })
					}
					setRendering({ current: "exporting", progress: 0 })
					ffmpeg.setProgress(p => {
						setRendering({ "current": "exporting", progress: p.ratio })
					})
					await ffmpeg.run("-r", def.fps.toString(), "-framerate", def.fps.toString(), "-pix_fmt", "yuv420p", "-pattern_type", "glob", "-i", "frame-*.png", "output.mp4")

					const filedata = ffmpeg.FS("readFile", "output.mp4")
					window.open(URL.createObjectURL(new Blob([filedata.buffer], { type: "video/mp4" })))

					for (let frame = 0; frame < totalFrames; ++frame) {
						ffmpeg.FS("unlink", `frame-${lpad(frame.toString(), Math.floor(Math.log10(totalFrames) + 1))}.png`)
					}
					ffmpeg.FS("unlink", "output.mp4")

					setRendering({ current: "no" })
					break;
				}
			}
		},
		isReady: isFFMpegReady
	}
}
