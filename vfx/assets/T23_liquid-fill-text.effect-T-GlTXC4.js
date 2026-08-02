const t=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const text = String(ctx.params.text ?? 'LIQUID');
    const level = Number(ctx.params.level ?? 0.86);
    const wave = Number(ctx.params.wave ?? 10);
    const speed = Math.max(1, Math.round(Number(ctx.params.speed ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ((ctx.frame % duration) / duration) * TAU * speed;
    const fill = (0.5 - 0.5 * Math.cos(phase)) * level;
    const surface = 100 - fill * 94;
    const fontSize = Math.max(34, Math.min((ctx.width * 0.86) / Math.max(4, text.length * 0.62), ctx.height * 0.42));
    const textStyle = { position: 'absolute' as const, inset: 0, display: 'grid', placeItems: 'center', fontFamily: 'Inter, Arial, sans-serif', fontSize, fontWeight: 900, letterSpacing: '-0.05em', whiteSpace: 'nowrap' as const };

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '7%', right: '7%', top: '28%', bottom: '28%' }}>
          <div
            aria-hidden="true"
            data-layout-allow-overlap
            data-layout-allow-occlusion
            style={{ ...textStyle, color: '#0D0E10', WebkitTextFillColor: '#0D0E10', WebkitTextStroke: \`2px \${signal}80\`, textShadow: \`0 0 \${wave}px \${signal}24\` }}
          >
            {text}
          </div>
          <div
            data-layout-allow-overlap
            data-layout-allow-occlusion
            style={{
              ...textStyle,
              color: signal,
              clipPath: \`inset(\${surface}% 0 0 0)\`,
              filter: \`drop-shadow(0 0 \${wave * 1.2}px \${signal})\`,
            }}
          >
            {text}
          </div>
        </div>
        <div style={{ position: 'absolute', left: '22%', right: '22%', bottom: '20%', height: 2, background: signal, opacity: 0.22 + fill * 0.45, transform: \`scaleX(\${0.35 + fill * 0.65})\`, boxShadow: \`0 0 \${wave}px \${signal}\` }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
