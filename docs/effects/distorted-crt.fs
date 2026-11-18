uniform float time;
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