// resources:
// - http://iquilezles.org/www/articles/mset_smooth/mset_smooth.htm
// - http://colorpalettes.net/color-palette-3885/

uniform float time;
uniform float branchCount;
uniform float direction;
uniform float rotation;

uniform vec2 resolution;
uniform vec2 aspect;

uniform vec4 bgColor;
uniform vec4 fgColor;
uniform vec4 pulseColor;
uniform vec4 dimColor;

// Color palettes
struct palette {
    vec3 c0, c1, c2, c3, c4;
};

palette palette1() {
    palette p;
    p.c0 = vec3(0);
    p.c1 = bgColor.xyz;
    p.c2 = fgColor.xyz;
    p.c3 = pulseColor.xyz;
    p.c4 = dimColor.xyz;
    return p;
}

palette palette2() {
    palette p;
    p.c0 = vec3(0);
    p.c1 = bgColor.xyz;
    p.c2 = fgColor.xyz;
    p.c3 = pulseColor.xyz;
    p.c4 = dimColor.xyz;
    return p;
}

// Complex math

vec2 cpow ( vec2 z ) { return mat2(z, -z.y, z.x) * z; }
//vec2 cmul( vec2 z1, vec2 z2 ) { return vec2( z1.x*z2.x -z1.y*z2.y, 2.*z1.x*z1.y ); } + z2.x*z2.y :/
//vec2 cmul( vec2 z1, vec2 z2 ) { return mat2(z2, -z2.y, z2.x) * z1; }
vec2 cmul( vec2 z1, vec2 z2 ) { return mat2(z1, -z1.y, z1.x) * z2; }

/* missed one iter
vec2 cpown (vec2 z, int n) {
    mat2 m = mat2(z, -z.y, z.x);
    for(int i=0; i<n;++i) 
    	z *= m;
   	return z;
}*/
vec2 cpown11 (vec2 z) {
    mat2 m = mat2(z, -z.y, z.x);
    for(int n = 11; n > 0; --n) z *= m;
   	return z;
}
vec2 cpown5 (vec2 z) {
    mat2 m = mat2(z, -z.y, z.x);
    for(int n = 5; n > 0; --n) z *= m;
   	return z;
}
vec2 cpown3 (vec2 z) {
    mat2 m = mat2(z, -z.y, z.x);
    for(int n = 3; n > 0; --n) z *= m;
   	return z;
}

float cmod( vec2 z ) {
	//return ri.x * ri.x + ri.y * ri.y;    
    return dot(z,z);
}

// Mapping

#define ZOOM
vec2 map ( vec2 uv ) {
    #ifdef ZOOM
    return 1./exp(mod(time/2.,80.))*uv;
    #else
	return 2.*uv;
    #endif
}

vec3 cmap( float t, palette p ) {
    //t=fract(t);
    vec3 col = vec3(0);
    col = mix( p.c0,  p.c1, smoothstep(0. , .2, t));
    col = mix( col, p.c2, smoothstep(.2, .4 , t));
    col = mix( col, p.c3, smoothstep(.4 , .6, t));
    col = mix( col, p.c4, smoothstep(.6,  .8, t));
    col = mix( col, vec3(0), smoothstep(.8, 1.,  t));
    return col;
}


// Polynomials

vec2 fMandelbrot( vec2 z, vec2 c) { return cpow(z) + c; }
vec2 fCPoly1 ( vec2 z, vec2 c ) { return cpown11(z) + cmul((vec2(1.,0.)-c),cpown5(z)) + cmul((c+1.+vec2(0,1)),z) + c; }
vec2 fCPoly2 ( vec2 z, vec2 c ) { return cpown5(z) + cmul((vec2(1.,0.)-c),cpown3(z)) + cmul((c+1.+vec2(0,1)),z) + c; }

//Display the color map.
//#define CMAP
#define ROTATE

// Main

void main()
{
    palette p = palette2(); // palette1
    #ifdef CMAP
    fragColor = vec4(cmap(gl_FragCoord.x/gl_FragCoord.x, p), 1.); return; 
    #endif
    
    float t = time/4.;
    vec2 R = resolution.xy;
    vec2 uv = (2. * gl_FragCoord.xy - R) / resolution.y;

    #ifdef ROTATE
    float angle = -2.*t;
    mat2 rot = mat2(cos(angle),sin(angle),-sin(angle),cos(angle));
    uv *= rot;
    #endif

	vec3 col = vec3(0);
    vec2 z = vec2(0);
    vec2 c = map(uv);
    float threshold = 4.;
    
    for(float n = 0.; n < 200. ; ++n) {
        z = fCPoly1(z,c);
        if(cmod(z) > threshold) break;
    }
    
    gl_FragColor = vec4(cmap( fract(-log(log(dot(z,z))/log(11.))/log(11.) + t), p ),1.0);
}
