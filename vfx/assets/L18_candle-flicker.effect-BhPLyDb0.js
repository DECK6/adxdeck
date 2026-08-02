const n=`import type { FxKernel } from '../../src/fx/types';

const TAU = Math.PI * 2;

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const intensity = Math.min(1, Math.max(0.15, Number(ctx.params.intensity ?? 0.74)));
    const flicker = Math.min(1, Math.max(0.1, Number(ctx.params.flicker ?? 0.68)));
    const radius = Math.min(72, Math.max(20, Number(ctx.params.radius ?? 48)));
    const shadow = Math.min(24, Math.max(0, Number(ctx.params.shadow ?? 12)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;
    const flutter = Math.sin(phase * 7) * 0.52 + Math.sin(phase * 13 + 0.8) * 0.28 + Math.cos(phase * 19) * 0.2;
    const glow = intensity * (0.78 + flutter * flicker * 0.18);
    const sway = flutter * flicker;
    const flameScaleY = 0.92 + sway * 0.1;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: \`radial-gradient(ellipse \${radius}% \${radius * 0.82}% at \${50 + sway * 1.4}% 67%, rgba(255,159,67,\${glow * 0.34}) 0%, rgba(255,109,41,\${glow * 0.13}) 43%, \${signal}0a 67%, transparent 78%)\`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.2 + flicker * 0.18,
            filter: 'brightness(0)',
            transform: \`translateX(\${sway * shadow}px) skewX(\${sway * 2.5}deg) scale(1.012)\`,
            transformOrigin: '50% 80%',
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            filter: \`drop-shadow(\${sway * 2}px 0 \${9 + glow * 10}px rgba(255,159,67,0.72)) drop-shadow(0 0 4px \${signal})\`,
            opacity: 0.82 + glow * 0.18,
          }}
        >
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: \`calc(50% + \${sway * 3}px)\`,
            top: '69%',
            width: 12,
            height: 31,
            transform: \`translate(-50%, -100%) rotate(\${sway * 5}deg) scaleY(\${flameScaleY})\`,
            transformOrigin: '50% 100%',
            borderRadius: '52% 48% 46% 54% / 68% 70% 30% 32%',
            background: 'radial-gradient(ellipse at 50% 72%, #FFF7CC 0 16%, #FFC45C 28%, #FF7A2D 62%, transparent 72%)',
            filter: \`drop-shadow(0 0 \${8 + glow * 8}px #FF9F43)\`,
            opacity: 0.9 + glow * 0.1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '69%',
            width: 3,
            height: 8,
            transform: 'translate(-50%, -2px)',
            borderRadius: 2,
            background: '#28231F',
          }}
        />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
