const n=`import type { FxKernel } from '../../src/fx/types';

const DIGIT_SEGMENTS = [
  'abcedf',
  'bc',
  'abdeg',
  'abcdg',
  'bcfg',
  'acdfg',
  'acdefg',
  'abc',
  'abcdefg',
  'abcdfg',
];

const SEGMENTS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const digits = Math.min(6, Math.max(3, Math.round(Number(ctx.params.digits ?? 4))));
    const intensity = Math.min(1, Math.max(0.35, Number(ctx.params.intensity ?? 0.82)));
    const pulse = Math.min(4, Math.max(1, Math.round(Number(ctx.params.pulse ?? 2))));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const cycle = 0.5 - 0.5 * Math.cos(ctx.t * Math.PI * 2);
    const value = Math.round(cycle * (10 ** digits - 1));
    const values = String(value).padStart(digits, '0').slice(-digits).split('').map(Number);
    const flicker = 0.9 + Math.sin(ctx.t * Math.PI * 2 * pulse) * 0.1;
    const digitHeight = Math.max(54, Math.min(ctx.height * 0.42, ctx.width / digits * 1.24));
    const digitWidth = digitHeight * 0.58;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12 + cycle * 0.1, filter: \`blur(0.6px) contrast(1.25)\` }}>
          {ctx.subjectNode}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: digitWidth * 0.12,
            padding: \`\${digitHeight * 0.28}px \${digitWidth * 0.38}px\`,
            border: \`1px solid \${signal}55\`,
            borderRadius: digitHeight * 0.18,
            background: \`linear-gradient(180deg, \${signal}0A, #050607F5 32%, #030405F8 72%, \${signal}0D)\`,
            boxShadow: \`inset 0 0 \${digitHeight * 0.38}px #000000, inset 0 1px 0 \${signal}44, 0 0 \${digitHeight * 0.18}px #000000\`,
          }}
        >
          <div style={{ position: 'absolute', left: '4%', top: '12%', color: signal, opacity: 0.74, fontFamily: 'JetBrains Mono, monospace', fontSize: Math.max(7, digitHeight * 0.1), letterSpacing: '0.18em' }}>
            VFD / SIGNAL
          </div>
          {values.map((digit, digitIndex) => (
            <div
              key={digitIndex}
              style={{
                position: 'relative',
                width: digitWidth,
                height: digitHeight,
                flex: '0 0 auto',
                borderLeft: \`1px solid \${signal}16\`,
                borderRight: \`1px solid \${signal}16\`,
                backgroundImage: \`radial-gradient(circle, \${signal}18 0 1px, transparent 1.5px)\`,
                backgroundSize: '5px 5px',
              }}
            >
              {SEGMENTS.map((segment) => {
                const horizontal = segment === 'a' || segment === 'd' || segment === 'g';
                const active = DIGIT_SEGMENTS[digit].includes(segment);
                const top = segment === 'a' ? '4%' : segment === 'g' ? '46%' : segment === 'd' ? '88%' : segment === 'b' || segment === 'f' ? '11%' : '52%';
                const left = horizontal ? '17%' : segment === 'b' || segment === 'c' ? '78%' : '5%';
                return (
                  <span
                    key={segment}
                    style={{
                      position: 'absolute',
                      left,
                      top,
                      width: horizontal ? '66%' : '14%',
                      height: horizontal ? '9%' : '35%',
                      borderRadius: 999,
                      background: active ? signal : \`\${signal}14\`,
                      opacity: active ? intensity * flicker : 0.45,
                      boxShadow: active ? \`0 0 \${digitHeight * 0.1}px \${signal}, 0 0 \${digitHeight * 0.24}px \${signal}99\` : 'none',
                      transform: horizontal ? 'skewX(-10deg)' : 'skewY(-10deg)',
                    }}
                  />
                );
              })}
            </div>
          ))}
          <div style={{ position: 'absolute', inset: '3%', pointerEvents: 'none', borderRadius: digitHeight * 0.14, background: 'linear-gradient(116deg, #FFFFFF10 0 12%, transparent 25% 72%, #FFFFFF08 88%)' }} />
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
