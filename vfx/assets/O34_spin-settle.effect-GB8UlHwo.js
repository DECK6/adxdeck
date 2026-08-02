const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const turns = Math.max(3, Math.round(Number(ctx.params.turns ?? 7)));
    const damping = Number(ctx.params.damping ?? 4.6);
    const maxTilt = Number(ctx.params.tilt ?? 64);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const lead = 0.06;
    const span = 0.78;
    const u = Math.min(1, Math.max(0, (ctx.t - lead) / span));
    const decay = Math.exp(-damping * u);
    const fullDecay = 1 - Math.exp(-damping);
    const spin = 360 * turns * ((1 - decay) / Math.max(0.001, fullDecay));
    const wobble = maxTilt * Math.pow(1 - u, 1.65) * Math.cos(TAU * (2.5 * u + 1.5 * u * u));
    const rim = Math.max(0.08, Math.abs(Math.cos((wobble * Math.PI) / 180)));
    const lift = ctx.height * 0.055 * Math.pow(1 - u, 1.4) * Math.abs(Math.sin(TAU * 3 * u));
    const visible = Math.min(1, ctx.t / lead, Math.max(0, (1 - ctx.t) / lead));
    const coinSize = Math.min(ctx.width * 0.38, ctx.height * 0.54);
    const ground = ctx.height * 0.79;
    const speed01 = Math.min(1, decay * 1.5);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', perspective: 900 }}>
        <div
          style={{
            position: 'absolute',
            left: ctx.width / 2,
            top: ground,
            width: coinSize * (0.35 + rim * 0.48),
            height: coinSize * 0.12 * (0.4 + rim * 0.6),
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: \`radial-gradient(closest-side, \${signal}55, transparent)\`,
            opacity: (0.42 - speed01 * 0.16) * visible,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: ctx.width / 2 - coinSize / 2,
            top: ground - coinSize - lift,
            width: coinSize,
            height: coinSize,
            border: \`2px solid \${signal}\`,
            borderRadius: '50%',
            background: '#111417',
            opacity: visible,
            overflow: 'hidden',
            transform: \`rotateZ(\${spin}deg) rotateX(\${wobble}deg) rotateY(\${wobble * 0.32}deg)\`,
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 100%',
            boxShadow: \`inset 0 0 \${coinSize * 0.08}px \${signal}55, 0 0 \${6 + speed01 * 18}px \${signal}55\`,
          }}
        >
          {ctx.subjectNode}
          <div
            style={{
              position: 'absolute',
              inset: '8%',
              borderRadius: '50%',
              border: \`1px dashed \${signal}\`,
              opacity: 0.32,
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: '7%',
            bottom: '7%',
            color: signal,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: Math.max(8, ctx.width * 0.014),
            letterSpacing: '0.16em',
            opacity: 0.7 * visible,
          }}
        >
          RPM {Math.round(speed01 * turns * 120).toString().padStart(4, '0')} / SETTLE
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
