const e=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const width = Math.min(110, Math.max(28, Number(ctx.params.width ?? 68)));
    const passes = Math.min(3, Math.max(1, Math.round(Number(ctx.params.passes ?? 3))));
    const roughness = Math.min(1.5, Math.max(0.4, Number(ctx.params.roughness ?? 1)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const erase = Math.pow(Math.sin(Math.PI * ctx.t), 1.35);
    const paths = [
      'M 120 185 C 245 118, 345 245, 486 168 S 735 127, 900 210',
      'M 105 300 C 235 235, 362 350, 510 278 S 755 241, 915 323',
      'M 126 414 C 255 348, 374 463, 512 390 S 742 350, 894 430',
    ];
    const maskPaths = paths.slice(0, passes).map((path, index) => \`<path d='\${path}' pathLength='1' fill='none' stroke='black' stroke-width='\${width * (1 + index * 0.06)}' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='\${Math.max(0, erase - index * 0.08)} 1'/>\`).join('');
    const maskSvg = encodeURIComponent(\`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 576' preserveAspectRatio='none'><rect width='1024' height='576' fill='white'/>\${maskPaths}</svg>\`);
    const maskImage = \`url("data:image/svg+xml,\${maskSvg}")\`;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: maskImage, maskImage, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1024 576" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
          {paths.slice(0, passes).map((path, index) => {
            const drawn = Math.max(0, Math.min(1, erase - index * 0.08));
            return (
              <path
                key={path}
                d={path}
                pathLength={1}
                fill="none"
                stroke={signal}
                strokeWidth={Math.max(2, 5 * roughness)}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1"
                strokeDashoffset={1 - drawn}
                opacity={0.22 + (1 - erase) * 0.45}
                style={{ filter: \`drop-shadow(0 0 \${4 + roughness * 5}px \${signal})\` }}
              />
            );
          })}
        </svg>
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: \`\${18 + erase * 12}%\`, height: 1, background: signal, opacity: 0.6 * (1 - erase), transform: 'translate(-50%, -50%)' }} />
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{e as default};
