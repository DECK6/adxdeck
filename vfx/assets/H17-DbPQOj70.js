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
var H17_sun_rays_dust_effect_exports = {};
__export(H17_sun_rays_dust_effect_exports, {
  default: () => H17_sun_rays_dust_effect_default
});
module.exports = __toCommonJS(H17_sun_rays_dust_effect_exports);
const TAU = Math.PI * 2;
const kernel = {
  kind: "react",
  render: (ctx) => {
    const rayCount = Math.max(5, Math.round(Number(ctx.params.rayCount ?? 9)));
    const dust = Math.max(12, Math.round(Number(ctx.params.dust ?? 28)));
    const drift = Number(ctx.params.drift ?? 1);
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const duration = Math.max(1, ctx.durationInFrames);
    const phase = ctx.frame % duration / duration * TAU;
    const rayStops = Array.from({ length: rayCount * 2 }, (_, index) => {
      const position = index / (rayCount * 2) * 100;
      return \`\${index % 2 === 0 ? \`\${signal}20\` : "transparent"} \${position}%\`;
    }).join(", ");
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "linear-gradient(145deg, #111B20 0%, #0D0E10 54%, #08090B 100%)" } }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "-58%",
          top: "-115%",
          width: "190%",
          aspectRatio: "1",
          borderRadius: "50%",
          background: \`conic-gradient(from \${-18 + Math.sin(phase) * 2.5}deg, \${rayStops})\`,
          filter: "blur(7px)",
          opacity: 0.72,
          transform: \`rotate(\${Math.sin(phase) * 1.4}deg)\`,
          transformOrigin: "50% 50%"
        }
      }
    ), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "-9%", top: "-13%", width: "34%", aspectRatio: "1", borderRadius: "50%", background: \`radial-gradient(circle, #FFFFFFC8 0%, \${signal}5C 12%, \${signal}18 38%, transparent 70%)\`, filter: "blur(4px)" } }), Array.from({ length: dust }, (_, index) => {
      const startX = ctx.random(\`dust:\${index}:x\`);
      const startY = ctx.random(\`dust:\${index}:y\`);
      const radius = 1 + ctx.random(\`dust:\${index}:r\`) * 2.4;
      const orbit = (0.012 + ctx.random(\`dust:\${index}:orbit\`) * 0.035) * drift;
      const offset = ctx.random(\`dust:\${index}:phase\`) * TAU;
      const x = (startX + Math.sin(phase + offset) * orbit + 1) % 1;
      const y = (startY + Math.cos(phase + offset) * orbit * 0.62 + 1) % 1;
      return /* @__PURE__ */ h("span", { key: index, style: { position: "absolute", left: x * 100 + "%", top: y * 100 + "%", width: radius, height: radius, borderRadius: "50%", background: index % 4 === 0 ? signal : "#F7FAFC", opacity: 0.18 + ctx.random(\`dust:\${index}:alpha\`) * 0.42, boxShadow: \`0 0 \${radius * 4}px \${signal}\` } });
    }), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: 0.26, transform: "scale(0.94)" } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(circle at 48% 46%, transparent 20%, #0D0E105C 72%, #0D0E10C8 100%)" } }));
  }
};
var H17_sun_rays_dust_effect_default = kernel;
`;export{t as default};
