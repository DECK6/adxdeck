const n=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const from = String(ctx.params.from ?? 'left');
    const distance = Number(ctx.params.distance ?? 0.75);
    const damping = Number(ctx.params.damping ?? 5.6);
    const signal = String(ctx.params.signal ?? '#5EE7F3');

    const horiz = from === 'left' || from === 'right';
    const sign = from === 'left' || from === 'top' ? -1 : 1;
    const span = horiz ? ctx.width : ctx.height;

    const p = clamp01(ctx.t / 0.34);
    const decay = Math.exp(-damping * p);
    const settle = 1 - decay * Math.cos(9.4 * p);
    const velocity = decay * Math.sin(9.4 * p);
    const speed = Math.abs(velocity);

    const idle = Math.max(0, ctx.t - 0.34);
    const drift = Math.sin(idle * Math.PI * 1.4) * span * 0.004;
    const offset = (1 - settle) * distance * span * sign + drift;
    const dx = horiz ? offset : 0;
    const dy = horiz ? 0 : offset;

    // leading-edge stretch along the travel axis reads as motion blur
    const stretch = 1 + speed * 0.3;
    const squash = 1 - speed * 0.14;
    const scaleX = horiz ? stretch : squash;
    const scaleY = horiz ? squash : stretch;

    const cx = ctx.width * 0.5 + dx;
    const cy = ctx.height * 0.486 + dy;
    const dir = offset >= 0 ? 1 : -1;
    const pad = horiz ? ctx.width * 0.1 : ctx.height * 0.17;
    const thickness = Math.max(1, ctx.height * 0.008);
    const lift = clamp01(Math.abs(dy) / (ctx.height * 0.5));
    const outro = clamp01((1 - ctx.t) / 0.1);

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: outro }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '69%',
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(247,250,252,0.05), rgba(247,250,252,0))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: ctx.width * 0.5 + dx,
              top: '70%',
              width: ctx.height * (0.5 + lift * 0.3),
              height: ctx.height * 0.08,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(0,0,0,0.82), rgba(0,0,0,0))',
              opacity: 0.85 - lift * 0.5,
            }}
          />
          {[0, 1, 2, 3].map((index) => {
            const lane = (index - 1.5) * 0.075 * (horiz ? ctx.height : ctx.width);
            const length = speed * (0.14 + index * 0.05) * span;
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: horiz ? (dir > 0 ? cx + pad : cx - pad - length) : cx + lane,
                  top: horiz ? cy + lane : dir > 0 ? cy + pad : cy - pad - length,
                  width: horiz ? length : thickness,
                  height: horiz ? thickness : length,
                  background: signal,
                  opacity: speed * (0.7 - index * 0.11),
                }}
              />
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: '19%',
              top: '19%',
              width: '62%',
              height: '62%',
              transform: \`translate3d(\${dx}px, \${dy}px, 0) scale(\${scaleX}, \${scaleY})\`,
              transformOrigin: '50% 47.8%',
            }}
          >
            {ctx.subjectNode}
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
