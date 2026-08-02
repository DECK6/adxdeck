const t=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const text = String(ctx.params.text ?? 'POP');
    const depth = Math.max(4, Math.round(Number(ctx.params.depth ?? 11)));
    const angle = Number(ctx.params.angle ?? -6);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ((ctx.frame % duration) / duration) * TAU;
    const pulse = Math.pow(0.5 - 0.5 * Math.cos(phase), 0.42);
    const rotation = angle + Math.sin(phase) * 4;
    const fontSize = Math.max(48, Math.min(ctx.width * 0.25, ctx.height * 0.48));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', perspective: ctx.width }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>{ctx.subjectNode}</div>
        <div data-layout-allow-overlap style={{ position: 'absolute', left: '50%', top: '50%', transform: \`translate(-50%, -50%) rotateZ(\${rotation}deg) scale(\${0.58 + pulse * 0.42})\`, transformStyle: 'preserve-3d', fontFamily: 'Inter, Arial, sans-serif', fontSize, fontWeight: 950, letterSpacing: '-0.08em', whiteSpace: 'nowrap' }}>
          {Array.from({ length: depth }, (_, index) => {
            const layer = depth - index;
            return <span key={index} aria-hidden={index !== depth - 1} data-layout-allow-overlap style={{ position: 'absolute', left: 0, top: 0, color: index === depth - 1 ? '#F7FAFC' : signal, opacity: index === depth - 1 ? 1 : 0.18 + index / depth * 0.44, transform: \`translate3d(\${layer * pulse * 1.5}px, \${layer * pulse * 1.7}px, \${-layer}px)\`, textShadow: index === depth - 1 ? \`0 0 \${10 + depth}px \${signal}\` : 'none' }}>{text}</span>;
          })}
          <span style={{ position: 'relative', color: '#F7FAFC', opacity: 0 }}>{text}</span>
        </div>
        <div style={{ position: 'absolute', left: '26%', right: '26%', bottom: '20%', height: 8, borderRadius: '50%', background: \`radial-gradient(ellipse, \${signal}72, transparent 70%)\`, filter: 'blur(4px)', opacity: pulse * 0.65, transform: \`scaleX(\${0.4 + pulse * 0.6})\` }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
