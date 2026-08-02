const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const phrase = String(ctx.params.phrase ?? 'DEXA SIGNAL').toUpperCase();
    const speed = Number(ctx.params.speed ?? 1.15);
    const bend = Number(ctx.params.bend ?? 0.55);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const travel = phase + Math.sin(phase * Math.PI * 2) * (speed - 1) * 0.08;
    const group = \`\${phrase}  ·  \`;
    const repeated = group.repeat(6);
    const fontSize = Math.max(20, Math.min(ctx.width * 0.055, ctx.height * 0.14));
    const amplitude = ctx.height * 0.06 * bend;
    const pitch = fontSize * 0.69;
    const groupWidth = group.length * pitch;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', perspective: ctx.width }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, transform: \`scale(\${0.98 + 0.02 * Math.sin(phase * Math.PI * 2)})\` }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '-12%', top: '50%', width: '124%', height: fontSize * 2.9, transform: \`translateY(-50%) rotateZ(\${-3 + Math.sin(phase * Math.PI * 2) * bend}deg) rotateY(\${Math.sin(phase * Math.PI * 2) * bend * 4}deg)\`, transformStyle: 'preserve-3d' }}>
          <div style={{ position: 'absolute', inset: \`\${fontSize * 0.28}px 0\`, background: \`linear-gradient(180deg, \${signal}, #1C8492 58%, #0B3D45)\`, clipPath: 'polygon(0 18%, 5% 0, 95% 0, 100% 18%, 96% 82%, 100% 100%, 5% 100%, 0 82%, 4% 50%)', boxShadow: \`0 \${fontSize * 0.28}px \${fontSize * 0.45}px #000A, inset 0 2px 1px #FFFFFF70, inset 0 -4px 8px #062B31\` }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', display: 'flex', alignItems: 'center', color: '#071012', fontFamily: 'JetBrains Mono, monospace', fontSize, fontWeight: 900, letterSpacing: '0.08em', lineHeight: 1, whiteSpace: 'pre', transform: \`translate3d(\${-groupWidth * (2 + travel)}px, -50%, 20px)\` }}>
            {repeated.split('').map((character, index) => {
              const wave = Math.sin(index * 0.48 + phase * Math.PI * 2) * amplitude;
              const tilt = Math.cos(index * 0.48 + phase * Math.PI * 2) * bend * 5;
              return <span key={index} style={{ display: 'inline-block', width: character === ' ' ? pitch * 0.6 : pitch, transform: \`translateY(\${wave}px) rotateZ(\${tilt}deg)\`, textAlign: 'center', textShadow: '0 1px 0 #FFFFFF45' }}>{character}</span>;
            })}
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
