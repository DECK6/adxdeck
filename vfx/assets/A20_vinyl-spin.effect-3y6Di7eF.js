const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;
const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const turns = Math.min(4, Math.max(1, Math.round(Number(ctx.params.turns ?? 2))));
    const sensitivity = Math.min(2.5, Math.max(0.5, Number(ctx.params.sensitivity ?? 1.3)));
    const groove = Math.min(8, Math.max(2, Math.round(Number(ctx.params.groove ?? 4))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const bands = Array.from({ length: 8 }, (_, index) => clamp01(ctx.audio?.bands[index] ?? 0));
    const rms = clamp01(ctx.audio?.rms ?? 0);
    const bass = (bands[0] + bands[1]) * 0.5;
    const energy = clamp01((rms * 0.45 + bass * 0.55) * sensitivity);
    const size = Math.min(ctx.width * 0.62, ctx.height * 0.78);
    const armVibration = Math.sin(ctx.t * TAU * 12) * energy * 2.8;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0A0B0E' }}>
        <div
          style={{
            position: 'absolute',
            left: '44%',
            top: '50%',
            width: size,
            height: size,
            borderRadius: '50%',
            background: \`repeating-radial-gradient(circle, #08090B 0px, #08090B \${groove}px, #22272C \${groove + 1}px, #0C0E11 \${groove + 2}px)\`,
            border: \`2px solid \${signal}55\`,
            boxShadow: \`0 18px 34px #000000AA, 0 0 \${8 + energy * 22}px \${signal}44\`,
            transform: \`translate(-50%, -50%) rotate(\${ctx.t * turns * 360}deg) scale(\${1 + energy * 0.025})\`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '31%',
              overflow: 'hidden',
              borderRadius: '50%',
              background: signal,
              opacity: 0.78 + rms * 0.18,
              boxShadow: \`0 0 16px \${signal}\`,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, opacity: 0.72, transform: 'scale(1.8)' }}>{ctx.subjectNode}</div>
          </div>
          <div style={{ position: 'absolute', left: '48%', top: '48%', width: '4%', height: '4%', borderRadius: '50%', background: '#F7FAFC' }} />
        </div>
        <div
          style={{
            position: 'absolute',
            right: '12%',
            top: '16%',
            width: Math.max(18, size * 0.13),
            height: Math.max(18, size * 0.13),
            borderRadius: '50%',
            border: \`3px solid \${signal}\`,
            background: '#171B20',
            boxShadow: \`0 0 \${6 + energy * 12}px \${signal}\`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '43%',
              top: '50%',
              width: Math.max(5, size * 0.035),
              height: size * 0.62,
              borderRadius: 999,
              background: 'linear-gradient(90deg, #75808B, #F7FAFC, #58616A)',
              boxShadow: \`0 0 \${3 + energy * 8}px \${signal}\`,
              transformOrigin: '50% 0%',
              transform: \`rotate(\${-18 + energy * 9 + armVibration}deg)\`,
            }}
          >
            <div style={{ position: 'absolute', left: '-45%', bottom: '-4%', width: '190%', height: '12%', borderRadius: 2, background: signal }} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: '7%', bottom: '7%', color: signal, fontFamily: 'JetBrains Mono, monospace', fontSize: Math.max(8, ctx.height * 0.045), fontWeight: 800, letterSpacing: '0.14em', opacity: 0.55 + energy * 0.4 }}>
          33⅓ / RMS {Math.round(rms * 99).toString().padStart(2, '0')}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
