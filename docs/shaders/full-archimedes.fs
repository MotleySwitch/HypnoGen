uniform float time;
uniform vec2 resolution;
uniform vec4 fgColor;

void main(void) {
    gl_FragColor = vec4(1.0);
    
    vec2 center = resolution.xy / 2.0;
    vec2 dist = center - gl_FragCoord.xy;
    float r = length(dist);
    float theta = -time * 4.0 + atan(dist.y, dist.x) / (2.0*3.14);
    
    float d = 100.0;
    float v = r - d * theta;
    float c = v / d;
    gl_FragColor =  vec4(c) * fgColor;
}
