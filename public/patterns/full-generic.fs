uniform float time;
uniform vec2 resolution;
uniform float branchCount;
uniform float rotation;
uniform float direction;
uniform vec4 bgColor;
uniform vec4 fgColor;

const float PI = radians(180.0);
const float TAU = PI * 2.0;

float time_pos(float time) { return direction * time * TAU; }
float uv_pos(vec2 uv) { return (rotation * 12.0) / sqrt(length(uv)); }
float curve_pos(vec2 uv) { return branchCount * atan(uv.y, uv.x); }
float constrict(float value) { return smoothstep(0.25, 0.75, value); }
float spiral(float time, vec2 uv) { return constrict(cos(time_pos(time) + uv_pos(uv) + curve_pos(uv))); }
float dim(vec2 uv) { return smoothstep(0.075, 0.4, length(uv)); }

void main(void) {
	vec2 uv = 2.0 * ((gl_FragCoord.xy - resolution.xy * 0.5) / max(resolution.x, resolution.y));

	gl_FragColor =  mix(bgColor, fgColor, spiral(time, uv) * dim(uv));
}
