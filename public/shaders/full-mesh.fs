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
uniform vec4 extraColor;

void main(void)
{
    vec2 g = gl_FragCoord.xy;
    vec4 f = vec4(resolution, 1, 1);
	g = (g + g - f.xy) / f.y;
    
    g = vec2(atan(g.x,g.y)/3.14159, length(g));
    g.y -= time * .25;
    g.x += g.y * .9;
    
    vec2 k = mod(g + .25, 0.5) - .25;
	g = mod(g, .5) - .25;
    
	float 
        m = sin(g.y)*g.y/dot(g,g),
        l = sin(k.y)*k.y/dot(k,k);
	
	f -= f - smoothstep(m,m*2.2,1.) * smoothstep(l, l*2.2, 1.);
    f = vec4(1) - vec4(f.xyz, 1);

    gl_FragColor = bgColor + (fgColor - bgColor) * f;
}