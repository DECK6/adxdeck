const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const angle = Number(ctx.params.angle ?? 180);
    const perspective = Number(ctx.params.perspective ?? 2.2);
    const damping = Number(ctx.params.damping ?? 5.2);
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const p = clamp01(ctx.t / 0.4);
    const settle = 1 - Math.exp(-damping * p) * Math.cos(7.2 * p);
    const idle = Math.max(0, ctx.t - 0.4);
    const rotY = -angle * (1 - settle) + 2.2 * Math.sin(idle * Math.PI * 1.3);
    const rotX = 1.4 * Math.sin(idle * Math.PI * 0.9);
    const scale = 0.86 + clamp01(settle) * 0.14;

    // facing: +1 front, -1 back — drives back panel, specular sweep and edge glint
    const facing = Math.cos((rotY * Math.PI) / 180);
    const sweep = 50 + Math.sin((rotY * Math.PI) / 180) * 70;
    const glint = Math.pow(1 - Math.abs(facing), 6);
    const outro = clamp01((1 - ctx.t) / 0.1);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: outro }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '72%',
              width: ctx.height * 0.56 * Math.abs(facing) * scale,
              height: ctx.height * 0.07,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(0,0,0,0.8), rgba(0,0,0,0))',
              opacity: 0.5 + Math.abs(facing) * 0.5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '19%',
              top: '19%',
              width: '62%',
              height: '62%',
              perspective: ctx.width * perspective,
              perspectiveOrigin: '50% 48%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: \`rotateY(\${rotY}deg) rotateX(\${rotX}deg) scale(\${scale})\`,
              }}
            >
              {ctx.subjectNode}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: \`linear-gradient(105deg, rgba(255,255,255,0) \${sweep - 26}%, rgba(255,255,255,0.17) \${sweep}%, rgba(255,255,255,0) \${sweep + 26}%)\`,
                  opacity: clamp01(facing) * 0.9,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#15171B',
                  border: \`1px solid \${signal}\`,
                  opacity: clamp01(-facing) * 0.94,
                }}
              />
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '19%',
              width: Math.max(1, ctx.height * 0.012),
              height: '62%',
              transform: 'translateX(-50%)',
              background: signal,
              opacity: glint * 0.95,
              boxShadow: \`0 0 \${ctx.height * 0.08}px \${signal}\`,
            }}
          />
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
