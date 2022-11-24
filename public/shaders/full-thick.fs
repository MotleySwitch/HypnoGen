uniform float time;
uniform vec2 resolution;
uniform vec2 aspect;
uniform vec4 fgColor;

mat2 rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c,-s,s,c);
}

void main(void) {
	vec2 uv = (gl_FragCoord.xy - resolution.xy * 0.5) / resolution.y * 2.0;
        vec2 tv = uv * rot(sqrt(length(uv))*3.1415926535*5.5);
        vec2 sv = tv * rot(-time * 6.0);
        vec2 wv = vec2(sv);
        vec3 col = vec3(pow(sin(wv.y*3.14159265*1.0)/2.0+0.5, 2.0));

       gl_FragColor = vec4(col.r, col.r, col.r, col.r) * fgColor;
}
