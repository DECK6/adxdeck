const n=`var __defProp = Object.defineProperty;
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
var O12_gravity_toss_effect_exports = {};
__export(O12_gravity_toss_effect_exports, {
  default: () => O12_gravity_toss_effect_default
});
module.exports = __toCommonJS(O12_gravity_toss_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const heightRatio = Number(ctx.params.height ?? 0.38);
    const spin = Number(ctx.params.spin ?? 1);
    const bounce = Math.max(0.3, Math.min(0.68, Number(ctx.params.bounce ?? 0.5)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const launch = 0.08;
    const flight = 0.36;
    const hop1 = flight * bounce;
    const hop2 = hop1 * bounce;
    const land1 = launch + flight;
    const land2 = land1 + hop1;
    const land3 = land2 + hop2;
    const airSpan = flight + hop1 + hop2;
    const peak = ctx.height * heightRatio;
    const boxWidth = ctx.width * 0.3;
    const boxHeight = ctx.height * 0.38;
    const ground = ctx.height * 0.84;
    const reach = ctx.width * 0.28;
    const liftAt = (at) => {
      if (at >= launch && at < land1) {
        const u = (at - launch) / flight;
        return peak * 4 * u * (1 - u);
      }
      if (at >= land1 && at < land2) {
        const u = (at - land1) / hop1;
        return peak * bounce * bounce * 4 * u * (1 - u);
      }
      if (at >= land2 && at < land3) {
        const u = (at - land2) / hop2;
        return peak * Math.pow(bounce, 4) * 4 * u * (1 - u);
      }
      return 0;
    };
    const flownAt = (at) => {
      const u = Math.min(1, Math.max(0, (at - launch) / airSpan));
      return 1 - Math.pow(1 - u, 1.6);
    };
    const driftAt = (at) => -reach + 2 * reach * flownAt(at);
    const lift = liftAt(ctx.t);
    const drift = driftAt(ctx.t);
    const height01 = Math.min(1, lift / Math.max(1, peak));
    const climbRate = (liftAt(ctx.t) - liftAt(ctx.t - 0.012)) / 0.012;
    const launchRate = 4 * peak / flight;
    const stretch = Math.max(-0.2, Math.min(0.2, climbRate / launchRate * 0.22));
    const anticipation = ctx.t < launch ? Math.sin(ctx.t / launch * Math.PI) * 0.24 : 0;
    const landings = [land1, land2, land3];
    const impact = landings.reduce((sum, landing, index) => {
      const age = ctx.t - landing;
      if (age < 0 || age > 0.2) return sum;
      return sum + 0.3 * Math.pow(bounce, index) * Math.exp(-age / 0.026);
    }, 0);
    const squash = Math.max(-0.28, Math.min(0.4, anticipation + impact - Math.abs(stretch)));
    const scaleY = 1 - squash;
    const scaleX = 1 + squash * 0.7;
    const rotation = spin * 360 * flownAt(ctx.t);
    const intro = Math.min(1, ctx.t / 0.04);
    const outro = Math.min(1, Math.max(0, (1 - ctx.t) / 0.12));
    const visible = intro * outro;
    const arc = Array.from({ length: 44 }, (_, index) => {
      const at = launch + index / 43 * airSpan;
      return \`\${(ctx.width / 2 + driftAt(at)).toFixed(1)},\${(ground - liftAt(at)).toFixed(1)}\`;
    }).join(" ");
    const shadowWidth = boxWidth * (0.62 - height01 * 0.26) * (1 + squash * 0.5);
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10" } }, /* @__PURE__ */ h(
      "svg",
      {
        viewBox: \`0 0 \${ctx.width} \${ctx.height}\`,
        preserveAspectRatio: "none",
        style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
      },
      /* @__PURE__ */ h(
        "polyline",
        {
          points: arc,
          fill: "none",
          stroke: signal,
          strokeWidth: "1",
          strokeDasharray: "3 8",
          opacity: 0.28 * visible
        }
      )
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "8%",
          right: "8%",
          top: ground,
          height: 1,
          background: signal,
          opacity: 0.25 * visible
        }
      }
    ), landings.map((landing, index) => {
      const age = ctx.t - landing;
      if (age <= 0 || age > 0.16) return null;
      const spread = age / 0.16;
      const dust = boxWidth * (0.4 + spread * 1.4) * Math.pow(bounce, index * 0.5);
      return /* @__PURE__ */ h(
        "div",
        {
          key: landing,
          style: {
            position: "absolute",
            left: ctx.width / 2 + driftAt(landing) - dust / 2,
            top: ground - dust * 0.1,
            width: dust,
            height: dust * 0.2,
            border: \`1.5px solid \${signal}\`,
            borderRadius: "50%",
            opacity: (1 - spread) * 0.55 * visible
          }
        }
      );
    }), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: ctx.width / 2 + drift - shadowWidth / 2,
          top: ground - Math.max(3, ctx.height * 0.012),
          width: shadowWidth,
          height: Math.max(6, ctx.height * 0.026 * (1 - height01 * 0.3)),
          borderRadius: "50%",
          background: \`radial-gradient(closest-side, \${signal}55, #00000000)\`,
          opacity: (0.6 - height01 * 0.36) * visible
        }
      }
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: ctx.width / 2 + drift - boxWidth / 2,
          top: ground - boxHeight,
          width: boxWidth,
          height: boxHeight,
          transform: \`translate3d(0, \${-lift}px, 0) scale(\${scaleX}, \${scaleY})\`,
          transformOrigin: "center bottom",
          opacity: visible
        }
      },
      /* @__PURE__ */ h(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            transform: \`rotate(\${rotation}deg)\`,
            transformOrigin: "center",
            filter: \`drop-shadow(0 0 \${5 + height01 * 18}px \${signal}55)\`
          }
        },
        ctx.subjectNode
      )
    ), /* @__PURE__ */ h(
      "div",
      {
        style: {
          position: "absolute",
          left: "7%",
          bottom: "7%",
          color: signal,
          fontFamily: "JetBrains Mono, monospace",
          fontSize: Math.max(8, ctx.width * 0.014),
          letterSpacing: "0.16em",
          opacity: 0.7 * visible
        }
      },
      "ALT ",
      Math.round(height01 * 100).toString().padStart(3, "0"),
      " / SPIN ",
      Math.round(rotation),
      "\\xB0"
    ));
  }
};
var O12_gravity_toss_effect_default = kernel;
`;export{n as default};
