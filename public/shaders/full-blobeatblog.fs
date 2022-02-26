uniform float time;
uniform float branchCount;
uniform float direction;
uniform float rotation;

uniform vec2 resolution;
uniform vec2 aspect;

uniform vec4 bgColor;
uniform vec4 fgColor;
uniform vec4 pulseColor;
uniform vec4 dimColor;
uniform vec4 extraColor;

#define alpha 0.0
#define beta 10.0

vec4 getCornerColors(vec2 coord)
{
    vec4 cornerColors[4];
    cornerColors[0] = fgColor;
    cornerColors[1] = pulseColor;
    cornerColors[2] = dimColor;
    cornerColors[3] = extraColor;

    vec2 cornerCoords[4];
    cornerCoords[0] = vec2(0);
    cornerCoords[1] = vec2(1, 0);
    cornerCoords[2] = vec2(1);
    cornerCoords[3] = vec2(0, 1);

	vec4 result = vec4(0.0);

	float totalArea = dot(resolution.xy, resolution.xy);

	for(int i = 0; i < 4; i++)
	{
		vec2 cCoord = cornerCoords[i] * resolution.xy;

		vec2 diff = coord - cCoord;

		float area = dot(diff, diff);

		result += ((totalArea - area) / totalArea) * cornerColors[i];
	}

	return result;
}

vec4 spiral4(vec2 coord)
{	
	float alpha_t = alpha - time * 50.0;

	float x = coord.x;
	float y = coord.y;
	float r = sqrt(dot(coord, coord));

	float phi = atan(y, x);
	float phi_r = (r - alpha_t) / beta;
	float r_phi = alpha_t + (beta * phi);
	float remainder = abs(cos(phi) - cos(phi_r));

	if (remainder < 0.5)
	{
		return bgColor;
	}
	else
	{
		return vec4(vec3(remainder), 1.0);
	}
}

void main(void)
{
	vec2 uv = gl_FragCoord.xy - (resolution.xy * 0.5);
	//gl_FragColor = spiral4(uv) * vec4(uv,0.5+0.5*sin(time),1.0);
    gl_FragColor = spiral4(uv) * (getCornerColors(gl_FragCoord.xy) * 0.5);
}