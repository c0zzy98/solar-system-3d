// ─── SciFi Orbit Ring Shaders ─────────────────────────────────────────────

export const ORBIT_VERT = `
  attribute float aAngle;
  uniform float time;
  uniform float pulseSpeed;
  varying float vAlpha;
  #define PI2 6.2831853
  void main() {
    float n = aAngle / PI2;
    float t = mod(n - time * pulseSpeed, 1.0);
    float pulse = exp(-t * t * 22.0) * 2.1;
    float dash = step(0.38, fract(n * 32.0));
    vAlpha = 0.11 * dash + pulse * 0.78;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const ORBIT_FRAG = `
  uniform vec3 orbitColor;
  varying float vAlpha;
  void main() {
    vec3 c = mix(orbitColor, vec3(0.55, 0.88, 1.0), 0.28);
    gl_FragColor = vec4(c, clamp(vAlpha, 0.0, 1.0));
  }
`

// ─── Shooting Comets Shaders ─────────────────────────────────────────────

export const COMET_VERT = `
  attribute float aAlpha;
  attribute float aSize;
  attribute float aBrightness;
  varying float vAlpha;
  varying float vBrightness;
  void main() {
    vAlpha = aAlpha;
    vBrightness = aBrightness;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (210.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`

export const COMET_FRAG = `
  varying float vAlpha;
  varying float vBrightness;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv) * 2.0;
    if (r > 1.0) discard;
    float glow = pow(1.0 - r, 1.6);
    vec3 hotColor  = vec3(1.0, 0.97, 0.88);
    vec3 coolColor = vec3(0.55, 0.80, 1.0);
    vec3 col = mix(coolColor, hotColor, vBrightness);
    gl_FragColor = vec4(col, vAlpha * glow);
  }
`

// ─── Twinkle Stars Shaders ────────────────────────────────────────────────

export const TWINKLE_VERT = `
  attribute float aPhase;
  attribute float aFreq;
  uniform float time;
  varying float vAlpha;
  void main() {
    float t = sin(time * aFreq + aPhase) * 0.5 + 0.5;
    vAlpha = 0.25 + t * 0.75;
    gl_PointSize = 1.4 + t * 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const TWINKLE_FRAG = `
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv) * 2.0;
    if (r > 1.0) discard;
    float soft = 1.0 - r;
    gl_FragColor = vec4(0.92, 0.95, 1.0, vAlpha * soft);
  }
`
