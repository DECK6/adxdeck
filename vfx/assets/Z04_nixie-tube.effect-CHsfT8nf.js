const t=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const tubes = Math.max(2, Math.round(Number(ctx.params.tubes ?? 4)));
    const warmth = Math.min(1, Math.max(0, Number(ctx.params.warmth ?? 0.82)));
    const flicker = Math.min(1, Math.max(0, Number(ctx.params.flicker ?? 0.18)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % Math.max(1, ctx.durationInFrames)) / Math.max(1, ctx.durationInFrames);
    const count = Math.floor(phase * 10000) % Math.pow(10, tubes);
    const values = String(count).padStart(tubes, '0').split('').map(Number);
    const tubeWidth = Math.min(ctx.width * 0.13, ctx.height * 0.2);
    const tubeHeight = tubeWidth * 1.7;
    const ember = warmth > 0.55 ? '#FF8A32' : '#FFD06A';

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: '4% 8% 30%', opacity: 0.17, filter: \`sepia(\${warmth}) drop-shadow(0 0 10px \${ember})\` }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '50%', top: '62%', transform: 'translate(-50%, -50%)', display: 'flex', gap: tubeWidth * 0.12 }}>
          {values.map((digit, tubeIndex) => {
            const noise = ctx.random(\`cathode:\${Math.floor(ctx.frame / 3)}:\${tubeIndex}\`);
            const power = 1 - flicker * (noise < 0.14 ? 0.48 : noise * 0.08);
            return (
              <div key={tubeIndex} style={{ position: 'relative', width: tubeWidth, height: tubeHeight, overflow: 'hidden', border: '2px solid #3B4044', borderRadius: \`\${tubeWidth * 0.44}px \${tubeWidth * 0.44}px \${tubeWidth * 0.18}px \${tubeWidth * 0.18}px\`, background: 'linear-gradient(90deg, #070809, #1A1512 48%, #08090A)', boxShadow: \`inset \${tubeWidth * 0.1}px 0 \${tubeWidth * 0.18}px #FFFFFF12, inset \${-tubeWidth * 0.1}px 0 \${tubeWidth * 0.18}px #000, 0 0 \${tubeWidth * 0.12}px \${signal}22\` }}>
                <div style={{ position: 'absolute', left: '22%', right: '22%', top: '9%', bottom: '8%', border: '1px dashed #74706A44', borderRadius: '45%' }} />
                {Array.from({ length: 10 }, (_, number) => {
                  const active = number === digit;
                  if (!active) return null;
                  return <div key={number} style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', transform: \`translateX(\${(number - 4.5) * 0.16}px) scaleX(\${0.78 + number * 0.004})\`, color: active ? ember : '#5C4638', opacity: active ? power : 0.07, fontFamily: 'Georgia, serif', fontSize: tubeHeight * 0.56, fontWeight: 400, textShadow: active ? \`0 0 3px #FFF1C9, 0 0 \${tubeWidth * 0.18}px \${ember}, 0 0 \${tubeWidth * 0.45}px \${ember}\` : 'none', zIndex: active ? 4 : 1 }}>{number}</div>;
                })}
                <div style={{ position: 'absolute', left: '18%', top: '4%', width: '22%', height: '78%', borderLeft: '2px solid #FFFFFF1F', borderRadius: '50%', transform: 'rotate(8deg)', zIndex: 7 }} />
                <div style={{ position: 'absolute', left: '27%', right: '27%', bottom: 0, height: '9%', background: '#26282B', borderTop: \`1px solid \${signal}55\`, zIndex: 8 }} />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
