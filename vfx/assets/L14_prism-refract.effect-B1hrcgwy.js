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
uniform float u_dispersion;
uniform float u_angle;
uniform float u_width;
uniform vec3 u_signal;

const float TAU = 6.28318530718;

void main() {
  float phase = u_t * TAU;
  vec2 direction = vec2(cos(u_angle + sin(phase) * 0.16), sin(u_angle + sin(phase) * 0.16));
  vec2 normal = vec2(-direction.y, direction.x);
  vec2 centered = v_uv - 0.5;
  float prismBand = 1.0 - smoothstep(u_width * 0.72, u_width, abs(dot(centered, normal)));
  float breathing = 0.78 + 0.22 * cos(phase);
  vec2 offset = direction * u_dispersion * breathing * prismBand;

  vec4 redTap = texture2D(u_subject, clamp(v_uv + offset * 1.15, 0.0, 1.0));
  vec4 yellowTap = texture2D(u_subject, clamp(v_uv + offset * 0.58, 0.0, 1.0));
  vec4 centerTap = texture2D(u_subject, v_uv);
  vec4 cyanTap = texture2D(u_subject, clamp(v_uv - offset * 0.52, 0.0, 1.0));
  vec4 blueTap = texture2D(u_subject, clamp(v_uv - offset * 1.12, 0.0, 1.0));

  vec3 spectrum = vec3(
    redTap.r * 0.82 + yellowTap.r * 0.18,
    yellowTap.g * 0.34 + centerTap.g * 0.38 + cyanTap.g * 0.28,
    cyanTap.b * 0.24 + blueTap.b * 0.76
  );
  float alpha = max(max(redTap.a, blueTap.a), max(centerTap.a, max(yellowTap.a, cyanTap.a)));
  float edge = clamp(abs(redTap.a - blueTap.a) + length(redTap.rgb - blueTap.rgb) * 0.22, 0.0, 1.0);
  vec3 background = vec3(0.05098, 0.05490, 0.06275);
  vec3 color = mix(background, spectrum, alpha);
  color += mix(vec3(0.82, 0.16, 0.38), u_signal, 0.58) * edge * prismBand * 0.28;
  gl_FragColor = vec4(color, 1.0);
}
\`,
    uniforms: (ctx) => ({
      u_dispersion: Math.min(0.12, Math.max(0.005, Number(ctx.params.dispersion ?? 0.0525))),
      u_angle: Math.min(90, Math.max(-90, Number(ctx.params.angle ?? 24))) * (Math.PI / 180),
      u_width: Math.min(0.8, Math.max(0.1, Number(ctx.params.width ?? 0.46))),
      u_signal: colorToRgb(ctx.params.signal),
    }),
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
