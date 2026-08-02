const n=`import type { FxKernel } from '../../src/fx/types';

const MARKERS = [
  { lat: -0.42, lon: 0.18 },
  { lat: 0.16, lon: 1.25 },
  { lat: 0.52, lon: 2.72 },
  { lat: -0.08, lon: 4.08 },
  { lat: 0.31, lon: 5.34 },
];

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const grid = Math.min(12, Math.max(5, Math.round(Number(ctx.params.grid ?? 8))));
    const sizeRatio = Math.min(0.7, Math.max(0.34, Number(ctx.params.size ?? 0.54)));
    const turns = Math.max(1, Math.round(Number(ctx.params.turns ?? 1)));
    const markerSize = Math.min(12, Math.max(3, Number(ctx.params.markerSize ?? 6)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const diameter = Math.min(ctx.width * sizeRatio, ctx.height * sizeRatio * 1.65);
    const radius = diameter / 2;
    const phase = ctx.t * Math.PI * 2 * turns;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          background: '#0D0E10',
          perspective: ctx.width * 1.8,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: diameter,
            height: diameter,
            border: \`1px solid \${signal}\`,
            borderRadius: '50%',
            transformStyle: 'preserve-3d',
            transform: \`rotateX(-16deg) rotateY(\${phase}rad)\`,
            boxShadow: \`inset 0 0 \${diameter * 0.18}px \${signal}1f, 0 0 \${diameter * 0.11}px \${signal}35\`,
          }}
        >
          {Array.from({ length: grid }, (_, index) => {
            const angle = (index / grid) * 180;
            return (
              <div
                key={\`lon:\${index}\`}
                style={{
                  position: 'absolute',
                  inset: -1,
                  border: \`1px solid \${signal}\`,
                  borderRadius: '50%',
                  opacity: 0.38,
                  transform: \`rotateY(\${angle}deg)\`,
                }}
              />
            );
          })}
          {Array.from({ length: grid - 1 }, (_, index) => {
            const latitude = -Math.PI / 2 + ((index + 1) / grid) * Math.PI;
            const ringSize = diameter * Math.cos(latitude);
            const y = radius * Math.sin(latitude);
            return (
              <div
                key={\`lat:\${index}\`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: ringSize,
                  height: ringSize,
                  border: \`1px solid \${signal}\`,
                  borderRadius: '50%',
                  opacity: 0.34,
                  transform: \`translate(-50%, -50%) translateY(\${y}px) rotateX(90deg)\`,
                }}
              />
            );
          })}
          <div
            style={{
              position: 'absolute',
              inset: '19%',
              opacity: 0.13,
              transform: 'translateZ(0px)',
              overflow: 'hidden',
              borderRadius: '50%',
            }}
          >
            {ctx.subjectNode}
          </div>
          {MARKERS.map((marker, index) => {
            const horizontal = Math.cos(marker.lat) * radius;
            const x = Math.sin(marker.lon) * horizontal;
            const y = -Math.sin(marker.lat) * radius;
            const z = Math.cos(marker.lon) * horizontal;
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: markerSize,
                  height: markerSize,
                  borderRadius: '50%',
                  background: signal,
                  transform: \`translate3d(\${x - markerSize / 2}px, \${y - markerSize / 2}px, \${z}px)\`,
                  boxShadow: \`0 0 \${markerSize * 2.6}px \${signal}\`,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
