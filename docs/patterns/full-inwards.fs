uniform float time;
uniform vec2 resolution;
uniform vec2 aspect;
uniform vec4 bgColor;
uniform vec4 fgColor;

float spiral(vec2 m) {
	float t = mod(time, 0.6);
	float r = length(m);
	float a = atan(m.y, m.x);
	float v = sin(100. * (sqrt(r) - 0.02 * a - .3 * -t));
	return clamp(v, 0., 1.);
}

void main(void) {
	float offsetA = ((16. / 9.) - aspect.x) * 0.5;
	float offsetX = resolution.x * offsetA;
	vec2 uv = vec2(gl_FragCoord.x + offsetX, gl_FragCoord.y) / resolution.y;
	float v = spiral(vec2(.9, .5) - uv.xy);

	gl_FragColor = bgColor + (fgColor - bgColor) * v;
}
