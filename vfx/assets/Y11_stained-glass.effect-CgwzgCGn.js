const n=`import type { FxKernel } from '../../src/fx/types';

interface Point { x: number; y: number }

const TAU = Math.PI * 2;

function clipCell(polygon: Point[], site: Point, other: Point): Point[] {
  const nx = other.x - site.x;
  const ny = other.y - site.y;
  const midpoint = (other.x * other.x + other.y * other.y - site.x * site.x - site.y * site.y) * 0.5;
  const output: Point[] = [];
  for (let index = 0; index < polygon.length; index += 1) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    const da = a.x * nx + a.y * ny - midpoint;
    const db = b.x * nx + b.y * ny - midpoint;
    if (da <= 0) output.push(a);
    if ((da <= 0) !== (db <= 0)) {
      const mix = da / (da - db);
      output.push({ x: a.x + (b.x - a.x) * mix, y: a.y + (b.y - a.y) * mix });
    }
  }
  return output;
}

function pathPolygon(g: CanvasRenderingContext2D, polygon: Point[]): void {
  g.beginPath();
  g.moveTo(polygon[0].x, polygon[0].y);
  for (let index = 1; index < polygon.length; index += 1) g.lineTo(polygon[index].x, polygon[index].y);
  g.closePath();
}

const kernel = {
  kind: 'canvas',
  draw: (g, ctx) => {
    const cellCount = Math.min(34, Math.max(14, Math.round(Number(ctx.params.cells ?? 23))));
    const lead = Math.min(7, Math.max(1.5, Number(ctx.params.lead ?? 3.5)));
    const transmission = Math.min(1, Math.max(0.2, Number(ctx.params.transmission ?? 0.72)));
    const signal = String(ctx.params.signal ?? '#5EE7F3');
    const phase = ctx.t * TAU;

    let subjectPixels: ImageData | undefined;
    if (ctx.subject.bitmap) {
      g.clearRect(0, 0, ctx.width, ctx.height);
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      subjectPixels = g.getImageData(0, 0, ctx.width, ctx.height);
    }

    const sites = Array.from({ length: cellCount }, (_, index) => ({
      x: ctx.width * (0.03 + ctx.random(\`glass:\${index}:x\`) * 0.94),
      y: ctx.height * (0.03 + ctx.random(\`glass:\${index}:y\`) * 0.94),
    }));
    const cells = sites.map((site) => {
      let polygon: Point[] = [
        { x: 0, y: 0 }, { x: ctx.width, y: 0 },
        { x: ctx.width, y: ctx.height }, { x: 0, y: ctx.height },
      ];
      for (const other of sites) {
        if (other !== site) polygon = clipCell(polygon, site, other);
        if (polygon.length === 0) break;
      }
      return polygon;
    });

    g.fillStyle = '#0D0E10';
    g.fillRect(0, 0, ctx.width, ctx.height);
    const backlightX = ctx.width * (0.5 + Math.cos(phase) * 0.34);
    const backlightY = ctx.height * (0.5 + Math.sin(phase) * 0.28);
    const backlight = g.createRadialGradient(backlightX, backlightY, 0, backlightX, backlightY, Math.max(ctx.width, ctx.height) * 0.68);
    backlight.addColorStop(0, \`\${signal}38\`);
    backlight.addColorStop(1, '#0D0E1000');
    g.fillStyle = backlight;
    g.fillRect(0, 0, ctx.width, ctx.height);

    for (let index = 0; index < cells.length; index += 1) {
      const polygon = cells[index];
      if (polygon.length < 3) continue;
      const site = sites[index];
      const sampleX = Math.min(ctx.width - 1, Math.max(0, Math.round(site.x)));
      const sampleY = Math.min(ctx.height - 1, Math.max(0, Math.round(site.y)));
      const offset = (sampleY * ctx.width + sampleX) * 4;
      const red = subjectPixels ? subjectPixels.data[offset] : 35;
      const green = subjectPixels ? subjectPixels.data[offset + 1] : 110;
      const blue = subjectPixels ? subjectPixels.data[offset + 2] : 120;
      const alpha = subjectPixels ? subjectPixels.data[offset + 3] / 255 : 0.22;
      const rayAngle = Math.atan2(site.y - backlightY, site.x - backlightX);
      const refraction = transmission * (1.2 + ctx.random(\`glass:\${index}:refract\`) * 2.4);
      const shiftX = Math.cos(rayAngle) * refraction;
      const shiftY = Math.sin(rayAngle) * refraction;

      g.save();
      pathPolygon(g, polygon);
      g.clip();
      g.fillStyle = \`rgba(\${Math.round(red * 0.44)}, \${Math.round(green * 0.58)}, \${Math.round(blue * 0.64)}, \${0.26 + transmission * 0.34})\`;
      g.fillRect(0, 0, ctx.width, ctx.height);
      if (ctx.subject.bitmap) {
        g.globalAlpha = (0.48 + alpha * 0.42) * transmission;
        g.filter = \`saturate(\${1.25 + transmission * 0.75}) contrast(1.18) brightness(1.08)\`;
        g.drawImage(ctx.subject.bitmap, shiftX, shiftY, ctx.width, ctx.height);
      }
      g.globalCompositeOperation = 'screen';
      g.globalAlpha = 0.08 + ctx.random(\`glass:\${index}:tint\`) * 0.16;
      g.fillStyle = signal;
      g.fillRect(0, 0, ctx.width, ctx.height);
      g.restore();

      g.save();
      pathPolygon(g, polygon);
      g.lineJoin = 'round';
      g.strokeStyle = '#050608';
      g.lineWidth = lead;
      g.shadowColor = '#000000';
      g.shadowBlur = lead * 1.2;
      g.stroke();
      g.restore();
      g.save();
      g.globalAlpha = 0.16 + transmission * 0.18;
      g.strokeStyle = signal;
      g.lineWidth = Math.max(0.5, lead * 0.18);
      g.stroke();
      g.restore();
    }
  },
} satisfies FxKernel;

export default kernel;
`;export{n as default};
