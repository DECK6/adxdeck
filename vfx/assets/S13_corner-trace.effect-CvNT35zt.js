const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const inset = Number(ctx.params.inset ?? 8) * 10;
    const arm = Number(ctx.params.armLength ?? 24) * 10;
    const traceLength = Number(ctx.params.traceLength ?? 0.34);
    const thickness = Number(ctx.params.thickness ?? 5);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = (ctx.frame % ctx.durationInFrames) / ctx.durationInFrames;
    const far = 1000 - inset;
    // Each corner is an L of two arms, total length 2*arm. pointAt(d) walks it (0..1).
    const cornerPoint = (index: number, u: number) => {
      const d = u * 2 * arm;
      const corners = [
        { sx: inset + arm, sy: inset, cx: inset, cy: inset, ex: inset, ey: inset + arm },
        { sx: far - arm, sy: inset, cx: far, cy: inset, ex: far, ey: inset + arm },
        { sx: far - arm, sy: far, cx: far, cy: far, ex: far, ey: far - arm },
        { sx: inset + arm, sy: far, cx: inset, cy: far, ex: inset, ey: far - arm },
      ][index];
      if (d <= arm) {
        const k = d / arm;
        return { x: corners.sx + (corners.cx - corners.sx) * k, y: corners.sy };
      }
      const k = (d - arm) / arm;
      return { x: corners.cx, y: corners.cy + (corners.ey - corners.cy) * k };
    };
    const paths = [
      \`M \${inset + arm} \${inset} H \${inset} V \${inset + arm}\`,
      \`M \${far - arm} \${inset} H \${far} V \${inset + arm}\`,
      \`M \${far - arm} \${far} H \${far} V \${far - arm}\`,
      \`M \${inset + arm} \${far} H \${inset} V \${far - arm}\`,
    ];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          {ctx.subjectNode}
        </div>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {paths.map((path, index) => {
            const localPhase = (phase + index * 0.25) % 1;
            return (
              <g key={path}>
                <path d={path} pathLength={1} fill="none" stroke={signal} strokeWidth={Math.max(1, thickness * 0.32)} opacity="0.2" />
                <path
                  d={path}
                  pathLength={1}
                  fill="none"
                  stroke={signal}
                  strokeWidth={thickness}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={\`\${traceLength} \${1 - traceLength}\`}
                  strokeDashoffset={-localPhase}
                  style={{ filter: \`drop-shadow(0 0 \${thickness * 2.2}px \${signal})\` }}
                />
                {/* trace head: geometry motion for the sweep fingerprint (dashoffset is paint-only) */}
                {(() => {
                  const head = cornerPoint(index, (localPhase + traceLength) % 1);
                  return <circle cx={head.x} cy={head.y} r={thickness * 1.5} fill={signal} />;
                })()}
              </g>
            );
          })}
        </svg>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
