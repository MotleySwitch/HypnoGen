uniform float time;
uniform float branchCount;
uniform float direction;

uniform vec2 resolution;
uniform vec2 aspect;

uniform vec4 bgColor;
uniform vec4 fgColor;
uniform vec4 pulseColor;
uniform vec4 dimColor;

float getComputedPosition(vec2 start, vec2 end, vec2 point, float maxLength) {
	if(length(end - point) < length(start - point))
		return 0.0;
	float distanceFromLine = abs((end.y - start.y) * point.x - (end.x - start.x) * point.y + end.x * start.y - end.y * start.x)
		/ sqrt((end.y - start.y) * (end.y - start.y) + (end.x - start.x) * (end.x - start.x));
	if(distanceFromLine > maxLength)
		return 0.0;
	if(distanceFromLine == 0.0)
		return 1.0;
	return exp(- 1.0 / (maxLength - distanceFromLine));
}

// Main method : entry point of the application.
void main(void) {
	// This variable is used for time manipulation.
	// Stays at a constant "60.0" spin speed.
	float timespeedup = mod(60.0*time, 120.0);
	// Used when freezing time for tests.
	// float timespeedup = mod(60.0*0.0, 120.0);
	
	// This is the pendulum position
	vec2 timePositionOffset = vec2(1.0*sin(timespeedup * 0.0523), 0.09 * pow(cos(timespeedup * 0.0523), 2.0));
	// Transform (x, y) into (r, a) coordinates based on the position offset defined as above
	vec2 position = -aspect.xy + 2.0 * gl_FragCoord.xy / resolution.xy * aspect.xy + timePositionOffset;
	float radius = length(position);

	vec2 pendulumStart = vec2(resolution.x / 2.0, resolution.y * 3.0);
	vec2 pendulumEnd = vec2(resolution.x / 2.0, - 2.0 * resolution.y) - timePositionOffset * resolution.xy / aspect.xy;
	float worldLayerValue = getComputedPosition(pendulumStart, pendulumEnd, gl_FragCoord.xy, 5.0);
	
	vec4 worldLayer = mix(vec4(0.0, 0.0, 0.0, 0.0), fgColor, worldLayerValue);

	float spinValue = min(radius * 5.0, 1.0);

	// This is the color value at a given point of the spin
	vec4 spinVector = mix(bgColor, fgColor, spinValue);

	// Compute the edge of the pendulum
	float globalAlphaValue = 0.0;
	if(radius > 0.3)
	{
		globalAlphaValue = 1.0;
	}
	else if(radius > 0.2)
	{
		float radiusValue = (radius - 0.2) * 10.0;
		float h = exp(- 1.0 / (radiusValue));
		float hp = exp(- 1.0 / (1.0 - radiusValue));
		globalAlphaValue = h / (h + hp);
	}

	// Mix the spin vector and the flare. This is the final step.
	gl_FragColor = mix(spinVector, worldLayer, globalAlphaValue);
}
