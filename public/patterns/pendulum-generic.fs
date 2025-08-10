uniform float time;
uniform vec2 resolution;
uniform vec4 bgColor;
uniform vec4 fgColor;
uniform vec4 pulseColor;

const float PI = radians(180.0);
const float TAU = PI * 2.0;

vec2 closest_to_line_segment(vec2 uv, vec2 a, vec2 b) {
	vec2 e = b - a;
	vec2 p = uv - a;
	float d = max(0.0, min(1.0, dot(e, p) / (length(e) * length(e))));
        return a + e * d;
}

float distance_to_line_segment(vec2 uv, vec2 a, vec2 b) {
    return length(uv - closest_to_line_segment(uv, a, b));
}

float time_pos(float time) { return time * TAU; }
float uv_pos(vec2 uv) { return 32.0 * sqrt(length(uv)); }
float curve_pos(vec2 uv) { return 1.0 * atan(uv.y, uv.x); }
float constrict(float value) { return smoothstep(0.0, 0.25, value); }
float spiral(float time, vec2 uv) { return constrict(cos(time_pos(time) + uv_pos(uv) + curve_pos(uv))); }
float dim(vec2 uv) { return smoothstep(0.2, 0.19, length(uv)); }

void main(void) {
	vec2 uv = 2.0 * ((gl_FragCoord.xy - resolution.xy * 0.5) / max(resolution.x, resolution.y));
    vec2 st = vec2(0.55 * cos(time * TAU * 0.25), -0.15 * pow(sin(time * TAU * 0.25), 2.0));

    vec4 bg = smoothstep(0.22, 0.21, length(uv - st)) * pulseColor;
    vec4 sp =  smoothstep(0.2, 0.19, length(uv - st)) * spiral(time, (uv - st) / 0.2) * fgColor;
    vec4 line = smoothstep(0.02, 0.01, distance_to_line_segment(uv, st, vec2(0.0, 1.0))) * bgColor;
       
    vec4 l1 = mix(line, bg, bg.a);
    vec4 l2 = mix(l1, sp, sp.a);
	gl_FragColor = l2;
}
