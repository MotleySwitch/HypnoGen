uniform float time;
uniform vec2 resolution;
uniform vec4 fgColor;

const float PI = radians(180.0);
const float TAU = PI * 2.0;

float time_pos(float time) { return time * TAU; }
float uv_pos(vec2 uv) { return 24.0 * length(uv); }
float curve_pos(vec2 uv) { return 1.0 * atan(uv.y, uv.x); }
float constrict(float value) { return smoothstep(0.0, 0.6, value); }
float spiral(float time, vec2 uv) { return constrict(cos(time_pos(time) + uv_pos(uv) + curve_pos(uv))); }
float dim(vec2 uv) { return 1.0; }

void main(void) {
	vec2 uv = 2.0 * ((gl_FragCoord.xy - resolution.xy * 0.5) / max(resolution.x, resolution.y));

	gl_FragColor =  spiral(time, uv) * dim(uv) * fgColor;
}
