const n=`import type { FxKernel } from '../../src/fx/types';

const kernel = {
  kind: 'react',
  render: (ctx) => {
    const density = Math.max(3, Math.min(6, Math.round(Number(ctx.params.density ?? 5))));
    const heightScale = Number(ctx.params.height ?? 0.9);
    const orbit = Number(ctx.params.orbit ?? 0.55);
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = (ctx.frame % duration) / duration;
    const theta = phase * Math.PI * 2;
    const sceneSize = Math.min(ctx.width, ctx.height) * 0.63;
    const blockSize = sceneSize / density;
    const yaw = -45 + Math.sin(theta) * orbit * 12;
    const pitch = 57 + Math.cos(theta) * orbit * 3;

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0D0E10', perspective: ctx.width * 1.45 }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.055, filter: 'grayscale(1)' }}>{ctx.subjectNode}</div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '56%',
            width: sceneSize,
            height: sceneSize,
            transformStyle: 'preserve-3d',
            transform: \`translate(-50%, -50%) rotateX(\${pitch}deg) rotateZ(\${yaw}deg)\`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-8%',
              backgroundImage: \`linear-gradient(\${signal}26 1px, transparent 1px), linear-gradient(90deg, \${signal}26 1px, transparent 1px)\`,
              backgroundSize: \`\${blockSize}px \${blockSize}px\`,
              border: \`1px solid \${signal}55\`,
              transform: 'translateZ(-2px)',
            }}
          />
          {Array.from({ length: density * density }, (_, index) => {
            const row = Math.floor(index / density);
            const column = index % density;
            const seed = ctx.random(\`building:\${index}\`);
            const baseHeight = blockSize * (0.35 + seed * 1.55) * heightScale;
            const delay = (row + column) / Math.max(1, density * 2 - 2);
            const grow = 0.12 + 0.88 * (0.5 - 0.5 * Math.cos(theta - delay * Math.PI * 1.4));
            const towerHeight = Math.max(8, baseHeight * grow);
            const footprint = blockSize * (0.48 + ctx.random(\`footprint:\${index}\`) * 0.24);
            const inset = (blockSize - footprint) / 2;
            const left = column * blockSize + inset;
            const top = row * blockSize + inset;
            const bright = 0.26 + seed * 0.28;

            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width: footprint,
                  height: footprint,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: \`translateZ(\${towerHeight}px)\`,
                    background: \`linear-gradient(135deg, \${signal}\${Math.round(bright * 255).toString(16).padStart(2, '0')}, #151A20)\`,
                    border: \`1px solid \${signal}\`,
                    boxSizing: 'border-box',
                    boxShadow: \`0 0 \${8 + seed * 12}px \${signal}44\`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: footprint,
                    width: footprint,
                    height: towerHeight,
                    transformOrigin: 'top',
                    transform: 'rotateX(-90deg)',
                    background: \`repeating-linear-gradient(90deg, #10141A 0 8px, \${signal}40 9px 10px)\`,
                    border: \`1px solid \${signal}88\`,
                    boxSizing: 'border-box',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: footprint,
                    top: 0,
                    width: towerHeight,
                    height: footprint,
                    transformOrigin: 'left',
                    transform: 'rotateY(90deg)',
                    background: \`repeating-linear-gradient(0deg, #090C11 0 8px, \${signal}2E 9px 10px)\`,
                    border: \`1px solid \${signal}66\`,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
