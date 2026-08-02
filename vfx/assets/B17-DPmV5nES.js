const e=`var __defProp = Object.defineProperty;
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
var B17_schedule_board_effect_exports = {};
__export(B17_schedule_board_effect_exports, {
  default: () => B17_schedule_board_effect_default
});
module.exports = __toCommonJS(B17_schedule_board_effect_exports);
const kernel = {
  kind: "react",
  render: (ctx) => {
    const rowCount = Math.min(6, Math.max(3, Math.round(Number(ctx.params.rows ?? 5))));
    const pace = Math.min(3, Math.max(1, Math.round(Number(ctx.params.pace ?? 1))));
    const channel = String(ctx.params.label ?? "DEXA VFX");
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    const cycle = ctx.t * pace % 1;
    const active = Math.min(rowCount - 1, Math.floor(cycle * rowCount));
    const local = cycle * rowCount - active;
    const sweep = local * local * (3 - 2 * local);
    const programs = ["SIGNAL OPEN", "MOTION DESK", "FRAME REPORT", "VFX SESSION", "NIGHT OUTPUT", "LOOP CLOSE"];
    return /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#0D0E10", color: "#F4F7F8", fontFamily: "'JetBrains Mono', monospace" } }, /* @__PURE__ */ h("div", { style: { position: "absolute", inset: "14%", display: "grid", placeItems: "center", opacity: 0.11, filter: "grayscale(1)" } }, ctx.subjectNode), /* @__PURE__ */ h("div", { style: { position: "absolute", left: "8%", right: "8%", top: "10%", bottom: "10%", border: \`1px solid \${signal}4D\`, background: "#111419EB", boxShadow: "0 26px 70px #0000008C" } }, /* @__PURE__ */ h("div", { style: { height: "18%", padding: "0 4%", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: \`2px solid \${signal}\`, boxSizing: "border-box" } }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("div", { style: { color: signal, fontSize: Math.max(10, ctx.width * 0.012), fontWeight: 800, letterSpacing: "0.2em" } }, channel, " / PROGRAM"), /* @__PURE__ */ h("div", { style: { marginTop: 5, color: "#AEB8C0", fontSize: Math.max(8, ctx.width * 85e-4), letterSpacing: "0.14em" } }, "SIX SECOND BROADCAST GRID")), /* @__PURE__ */ h("div", { style: { border: \`1px solid \${signal}\`, padding: "7px 10px", color: "#F4F7F8", fontSize: Math.max(9, ctx.width * 9e-3), fontWeight: 800 } }, "CH 07")), /* @__PURE__ */ h("div", { style: { height: "82%", padding: "2.2% 4%", boxSizing: "border-box" } }, Array.from({ length: rowCount }, (_, index) => {
      const selected = index === active;
      const hour = 18 + index;
      return /* @__PURE__ */ h(
        "div",
        {
          key: index,
          style: {
            position: "relative",
            height: \`\${100 / rowCount}%\`,
            display: "grid",
            gridTemplateColumns: "18% 1fr 16%",
            alignItems: "center",
            borderBottom: "1px solid #FFFFFF1F",
            padding: "0 2%",
            boxSizing: "border-box",
            overflow: "hidden",
            background: selected ? \`\${signal}17\` : "transparent",
            color: selected ? "#FFFFFF" : "#C1C8CD"
          }
        },
        selected ? /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0, width: \`\${16 + sweep * 84}%\`, background: \`linear-gradient(90deg, \${signal}35, \${signal}0A)\` } }) : null,
        /* @__PURE__ */ h("span", { style: { position: "relative", color: selected ? signal : "#8E9AA3", fontSize: Math.max(9, ctx.width * 0.01), fontWeight: 800 } }, hour.toString().padStart(2, "0"), ":00"),
        /* @__PURE__ */ h("span", { style: { position: "relative", fontSize: Math.max(10, ctx.width * 0.013), fontWeight: selected ? 800 : 600, letterSpacing: "0.08em" } }, programs[index]),
        /* @__PURE__ */ h("span", { style: { position: "relative", textAlign: "right", color: selected ? "#FFFFFF" : "#8E9AA3", fontSize: Math.max(8, ctx.width * 85e-4) } }, selected ? "ON AIR" : \`\${42 + index * 7} MIN\`)
      );
    }))));
  }
};
var B17_schedule_board_effect_default = kernel;
`;export{e as default};
