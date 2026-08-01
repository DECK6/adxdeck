const t=`var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var P03_spark_shower_effect_exports = {};
__export(P03_spark_shower_effect_exports, {
  default: () => P03_spark_shower_effect_default
});
module.exports = __toCommonJS(P03_spark_shower_effect_exports);
function spawn(index, cycle, ctx, age = 0) {
  const spread = Math.min(1, Math.max(0.1, Number(ctx.params.spread ?? 0.58)));
  const key = \`s:\${index}:\${cycle}\`;
  const x = ctx.width * (0.5 + (ctx.random(\`\${key}:x\`) - 0.5) * 0.16);
  const y = ctx.height * (0.1 + ctx.random(\`\${key}:y\`) * 0.08);
  const vx = (ctx.random(\`\${key}:vx\`) * 2 - 1) * ctx.width * 0.24 * spread;
  const vy = ctx.height * (0.12 + ctx.random(\`\${key}:vy\`) * 0.28);
  const life = 0.65 + ctx.random(\`\${key}:life\`) * 1.25;
  return {
    x,
    y,
    previousX: x,
    previousY: y,
    vx,
    vy,
    age,
    life,
    cycle,
    width: 0.6 + ctx.random(\`\${key}:width\`) * 1.5
  };
}
const stateful = {
  init: (ctx) => {
    const count = Math.min(180, Math.max(20, Math.round(Number(ctx.params.count ?? 84))));
    const particles = Array.from({ length: count }, (_, index) => {
      const spark = spawn(index, 0, ctx);
      const warmup = ctx.random(\`s:\${index}:warmup\`) * spark.life;
      const steps = Math.floor(warmup * ctx.fps);
      const gravity = Math.min(2, Math.max(0.2, Number(ctx.params.gravity ?? 0.9))) * ctx.height * 0.48;
      const dt = 1 / ctx.fps;
      let warmed = spark;
      for (let step = 0; step < steps; step += 1) {
        const previousX = warmed.x;
        const previousY = warmed.y;
        const vy = warmed.vy + gravity * dt;
        warmed = {
          ...warmed,
          previousX,
          previousY,
          x: warmed.x + warmed.vx * dt,
          y: warmed.y + vy * dt,
          vy,
          age: warmed.age + dt
        };
      }
      return warmed;
    });
    return { particles };
  },
  step: (state, ctx) => {
    const dt = 1 / ctx.fps;
    const gravity = Math.min(2, Math.max(0.2, Number(ctx.params.gravity ?? 0.9))) * ctx.height * 0.48;
    return {
      particles: state.particles.map((particle, index) => {
        if (particle.age >= particle.life || particle.y > ctx.height * 1.08) {
          return spawn(index, particle.cycle + 1, ctx);
        }
        const vy = particle.vy + gravity * dt;
        return {
          ...particle,
          previousX: particle.x,
          previousY: particle.y,
          x: particle.x + particle.vx * dt,
          y: particle.y + vy * dt,
          vy,
          age: particle.age + dt
        };
      })
    };
  },
  render: (g, state, ctx) => {
    const glow = Math.min(24, Math.max(0, Number(ctx.params.glow ?? 12)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    if (ctx.subject.bitmap) g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
    g.save();
    g.globalCompositeOperation = "screen";
    g.strokeStyle = signal;
    g.shadowColor = signal;
    g.shadowBlur = glow;
    g.lineCap = "round";
    for (const particle of state.particles) {
      const life = Math.max(0, 1 - particle.age / particle.life);
      g.globalAlpha = life * (0.45 + particle.width * 0.22);
      g.lineWidth = particle.width;
      const trail = 2.4 + particle.width * 1.8;
      g.beginPath();
      g.moveTo(particle.x, particle.y);
      g.lineTo(
        particle.x - (particle.x - particle.previousX) * trail,
        particle.y - (particle.y - particle.previousY) * trail
      );
      g.stroke();
    }
    g.restore();
  }
};
const kernel = {
  kind: "canvas",
  stateful
};
var P03_spark_shower_effect_default = kernel;
`;export{t as default};
