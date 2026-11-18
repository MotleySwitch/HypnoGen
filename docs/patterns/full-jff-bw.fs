uniform float time;
uniform float branchCount;
uniform float direction;
uniform float rotation;

uniform vec2 resolution;
uniform vec2 aspect;

uniform vec4 bgColor;
uniform vec4 fgColor;

void main(void) {
    vec2 uv = (gl_FragCoord.xy - resolution.xy * 0.5) / resolution.x;

    float shag = 40.0;
    float col_v = (0.30 + 0.7*cos(-time * 30.4 + length(uv) * shag + 0.00000000000 - atan(uv.x, uv.y)));

    gl_FragColor = fgColor * col_v;
}
