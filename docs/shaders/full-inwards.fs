uniform float time;
uniform vec2 resolution;
uniform vec4 bgColor;
uniform vec4 fgColor;

float spiral(vec2 m) {
	float r = length(m);
	float a = atan(m.y, m.x);
	float v = sin(100. * (sqrt(r) - 0.02 * a - .3 * -time));
	return clamp(v, 0., 1.);
}

void main(void) {
	vec2 uv = gl_FragCoord.xy / resolution.y;
	vec2 m = vec2(.9, .5);
	float v = spiral(m.xy - uv.xy);
	m = vec2(.9, .5);

	gl_FragColor = bgColor + (fgColor - bgColor) * v;
}
