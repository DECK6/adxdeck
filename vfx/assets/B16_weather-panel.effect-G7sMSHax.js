const t=`import type { FxKernel } from '../../src/fx/types';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (value: number) => 1 - Math.pow(1 - clamp01(value), 3);

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const temperature = Math.round(Number(ctx.params.temperature ?? 24));
    const condition = String(ctx.params.condition ?? 'CLOUD');
    const units = String(ctx.params.units ?? 'C');
    const wind = Math.round(Number(ctx.params.wind ?? 12));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const intro = easeOut(ctx.t * 4.8);
    const metricsIn = easeOut((ctx.t - 0.17) * 4.2);
    const outro = clamp01((1 - ctx.t) / 0.09);
    const morph = 0.5 + 0.5 * Math.sin(ctx.t * Math.PI * 2);
    const cloudAmount = condition === 'CLEAR' ? morph * 0.18 : condition === 'CLOUD' ? 0.58 + morph * 0.22 : 0.78 + morph * 0.12;
    const rainAmount = condition === 'RAIN' ? 0.55 + morph * 0.45 : 0;
    const displayTemperature = units === 'F' ? Math.round((temperature * 9) / 5 + 32) : temperature;
    const forecasts = [
      { day: 'NOW', temp: displayTemperature, level: 0.82 },
      { day: '+01', temp: displayTemperature + 2, level: 0.64 },
      { day: '+02', temp: displayTemperature - 1, level: 0.48 },
      { day: '+03', temp: displayTemperature + 1, level: 0.7 },
    ];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', fontFamily: "'JetBrains Mono', monospace", color: '#F4F7F8' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 * outro }}>{ctx.subjectNode}</div>
        <div style={{ position: 'absolute', left: '7%', right: '7%', top: '10%', bottom: '10%', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', background: '#111418EC', border: \`1px solid \${signal}42\`, transform: \`translateY(\${(1 - intro) * ctx.height * 0.09}px)\`, opacity: intro * outro, boxShadow: \`0 24px 70px #00000077, inset 0 0 45px \${signal}08\` }}>
          <div style={{ position: 'relative', borderRight: \`1px solid \${signal}2F\`, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '8%', top: '9%', color: signal, fontSize: Math.max(8, ctx.height * 0.022), letterSpacing: '0.18em' }}>DEXA WEATHER // SEOUL</div>
            <svg viewBox="0 0 420 260" style={{ position: 'absolute', left: '5%', top: '18%', width: '60%', height: '48%', overflow: 'visible' }}>
              <g style={{ transform: \`translate(\${cloudAmount * 22}px, \${cloudAmount * 13}px) scale(\${1 - cloudAmount * 0.18})\`, transformOrigin: '180px 120px', opacity: 1 - cloudAmount * 0.55 }}>
                <circle cx="155" cy="105" r="48" fill="none" stroke={signal} strokeWidth="8" style={{ filter: \`drop-shadow(0 0 10px \${signal})\` }} />
                {Array.from({ length: 8 }, (_, index) => {
                  const angle = (index / 8) * Math.PI * 2;
                  return <line key={index} x1={155 + Math.cos(angle) * 64} y1={105 + Math.sin(angle) * 64} x2={155 + Math.cos(angle) * (78 + morph * 8)} y2={105 + Math.sin(angle) * (78 + morph * 8)} stroke={signal} strokeWidth="6" strokeLinecap="round" />;
                })}
              </g>
              <g style={{ transform: \`translateY(\${(1 - cloudAmount) * 14}px) scale(\${0.82 + cloudAmount * 0.18})\`, transformOrigin: '190px 145px', opacity: cloudAmount }}>
                <path d="M86 174C86 141 112 120 143 121C155 91 183 76 214 87C236 95 250 113 252 135C285 134 307 153 307 181C307 209 284 224 253 224H137C107 224 86 207 86 174Z" fill="#171C21" stroke={signal} strokeWidth="7" strokeLinejoin="round" />
              </g>
              {Array.from({ length: 4 }, (_, index) => (
                <line key={index} x1={132 + index * 42} y1="236" x2={122 + index * 42} y2={252 + morph * 8} stroke={signal} strokeWidth="6" strokeLinecap="round" opacity={rainAmount} style={{ transform: \`translateY(\${((morph + index * 0.2) % 1) * 8}px)\` }} />
              ))}
            </svg>
            <div style={{ position: 'absolute', left: '8%', bottom: '13%', display: 'flex', alignItems: 'flex-start', fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ fontSize: Math.max(64, ctx.height * 0.28), lineHeight: 0.82, fontWeight: 800, letterSpacing: '-0.09em' }}>{displayTemperature}</span>
              <span style={{ marginLeft: '0.22em', color: signal, fontSize: Math.max(18, ctx.height * 0.08), fontWeight: 700 }}>°{units}</span>
            </div>
            <div style={{ position: 'absolute', right: '7%', bottom: '14%', color: '#C6CDD0', fontSize: Math.max(8, ctx.height * 0.026), lineHeight: 1.7, textAlign: 'right', letterSpacing: '0.1em' }}><span style={{ color: signal, fontWeight: 800 }}>{condition}</span><br />WIND {wind} KM/H<br />HUM 64%</div>
          </div>
          <div style={{ position: 'relative', padding: '13% 11%', opacity: metricsIn }}>
            <div style={{ color: '#B9C1C5', fontSize: Math.max(8, ctx.height * 0.021), letterSpacing: '0.18em' }}>NEXT // 03 HOURS</div>
            <div style={{ position: 'absolute', left: '11%', right: '11%', top: '25%', bottom: '15%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '5%' }}>
              {forecasts.map((forecast, index) => (
                <div key={forecast.day} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '0.65em' }}>
                  <div style={{ color: '#F4F7F8', fontSize: Math.max(9, ctx.height * 0.028), fontWeight: 700 }}>{forecast.temp}°</div>
                  <div style={{ width: '48%', height: \`\${forecast.level * 66}%\`, minHeight: 5, background: index === 0 ? signal : \`\${signal}4D\`, boxShadow: index === 0 ? \`0 0 13px \${signal}66\` : undefined, transform: \`scaleY(\${metricsIn})\`, transformOrigin: 'bottom' }} />
                  <div style={{ color: index === 0 ? signal : '#B9C1C5', fontSize: Math.max(7, ctx.height * 0.019), letterSpacing: '0.08em' }}>{forecast.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{t as default};
