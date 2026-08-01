const n=`import type { FxKernel } from '../../src/fx/types';

function colorToRgb(value: unknown): number[] {
  const hex = String(value ?? '#5EE7F3').replace('#', '');
  const valid = /^[0-9a-f]{6}$/i.test(hex) ? hex : '5EE7F3';
  return [0, 2, 4].map((offset) => Number.parseInt(valid.slice(offset, offset + 2), 16) / 255);
}

const kernel = {
  kind: 'webgl',
  shader: {
    frag: \`
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_subject;
uniform vec2 u_resolution;
uniform float u_frame;
uniform float u_t;
uniform float u_fps;
uniform float u_seed;
uniform float u_scale;
uniform float u_intensity;
uniform float u_refraction;
uniform float u_speed;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

vec2 hash22(vec2 p) {
  p += u_seed;
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float voronoiRidge(vec2 p, vec2 drift) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  float nearest = 8.0;
  float second = 8.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 seed = hash22(cell + neighbor);
      seed = 0.5 + 0.42 * sin(TAU * (seed + drift));
      float distanceToSeed = length(neighbor + seed - local);
      if (distanceToSeed < nearest) {
        second = nearest;
        nearest = distanceToSeed;
      } else if (distanceToSeed < second) {
        second = distanceToSeed;
      }
    }
  }
  return 1.0 - smoothstep(0.02, 0.16, second - nearest);
}

void main() {
  float phase = u_t * TAU * u_speed;
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 p = v_uv * aspect * u_scale;
  vec2 drift = vec2(sin(phase), cos(phase)) * 0.22;
  float cells = voronoiRidge(p, drift);
  float interference = 0.5 + 0.5 * sin(p.x * 2.1 + sin(p.y * 1.7 + phase) * 2.2 - phase);
  float caustic = pow(clamp(cells * (0.58 + interference * 0.62), 0.0, 1.0), 2.2);

  vec2 gradient = vec2(
    sin(p.y * 1.9 + phase) + cos(p.x * 1.3 - phase),
    cos(p.x * 1.7 + phase) - sin(p.y * 1.5 - phase)
  );
  vec2 refractedUv = clamp(v_uv + gradient * u_refraction * (0.25 + caustic), 0.0, 1.0);
  vec4 subject = texture2D(u_subject, refractedUv);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, subject.rgb, subject.a);
  float projection = caustic * u_intensity * (0.18 + subject.a * 0.82);
  color += u_signal * projection * 0.68;
  color += vec3(0.42, 0.66, 0.72) * caustic * u_intensity * 0.08;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_scale: Math.min(14, Math.max(3, Number(ctx.params.scale ?? 7.5))),
      u_intensity: Math.min(1.5, Math.max(0, Number(ctx.params.intensity ?? 0.9))),
      u_refraction: Math.min(0.08, Math.max(0, Number(ctx.params.refraction ?? 0.028))),
      u_speed: Math.min(2, Math.max(0.5, Number(ctx.params.speed ?? 1))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
