uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

float rand(vec2 noise){
    return fract(sin(dot(noise.xy,vec2(10.998,98.233)))*12433.14159265359);
}

vec2 tex_coord(vec2 st) {
     return vec2(st.x, 1.0 - st.y);
}

void main()
{
    vec2 st = gl_FragCoord.xy / resolution.xy;
    vec2 uv2 = fract(gl_FragCoord.xy / resolution.xy * (0.5 + 0.5 * fract(sin(time * 1.0))));
    float strength = 1.0; //clamp(sin((time - 1.0) / 4.0), 0.0, 1.0);
    vec3 color = vec3(rand(uv2.xy)) * strength;
    vec4 bg = texture2D(texture, tex_coord(st));
    gl_FragColor = vec4(bg.rgb - color.rgb, bg.a);
}
