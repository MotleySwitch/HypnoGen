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
    vec3 col_v = vec3(
        (0.30 + 0.7*cos(-time * 30.4 + length(uv) * shag + 0.00000000000 - atan(uv.x, uv.y))), 
        (0.30 + 0.7*cos(-time * 14.5 + length(uv) * shag + 4.18879020479 - atan(uv.x, uv.y))), 
        (0.30 + 0.7*cos(-time * 20.0 + length(uv) * shag + 2.09439510239 - atan(uv.x, uv.y)))
    );

    gl_FragColor = vec4(fgColor.rgb * col_v, fgColor.a);
}
