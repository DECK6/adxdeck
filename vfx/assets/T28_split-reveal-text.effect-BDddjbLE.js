const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? 'DEXA VFX');
    const gap = Number(ctx.params.gap ?? 0.24);
    const skew = Number(ctx.params.skew ?? 7);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const lock = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
    const eased = 1 - Math.pow(1 - lock, 3);
    const offset = (1 - eased) * ctx.width * gap;
    const size = Math.max(28, Math.min(ctx.width * 0.12, ctx.height * 0.28));
    const common = { position: 'absolute' as const, inset: 0, display: 'grid', placeItems: 'center', color: '#F4F7F8', fontFamily: 'Inter, Arial, sans-serif', fontSize: size, fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1, whiteSpace: 'nowrap' as const };

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 + eased * 0.12 }}>{ctx.subjectNode}</div>
        <div data-layout-allow-overflow data-layout-allow-overlap style={{ ...common, clipPath: 'inset(0 0 50% 0)', transform: \`translate3d(\${-offset}px, \${-(1 - eased) * size * 0.16}px, 0) skewX(\${-skew * (1 - eased)}deg)\`, textShadow: \`0 -2px 16px \${signal}70\` }}>{phrase}</div>
        <div data-layout-allow-overflow data-layout-allow-overlap style={{ ...common, clipPath: 'inset(50% 0 0 0)', transform: \`translate3d(\${offset}px, \${(1 - eased) * size * 0.16}px, 0) skewX(\${skew * (1 - eased)}deg)\`, textShadow: \`0 2px 16px \${signal}70\` }}>{phrase}</div>
        <div style={{ position: 'absolute', left: '12%', right: '12%', top: '50%', height: 1, background: signal, opacity: 0.18 + (1 - eased) * 0.72, boxShadow: \`0 0 12px \${signal}\`, transform: \`scaleX(\${0.25 + eased * 0.75})\` }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
