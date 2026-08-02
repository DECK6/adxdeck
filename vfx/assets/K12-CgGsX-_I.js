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
var K12_tile_scroll_effect_exports = {};
__export(K12_tile_scroll_effect_exports, {
  default: () => K12_tile_scroll_effect_default
});
module.exports = __toCommonJS(K12_tile_scroll_effect_exports);
const PATTERN_TILES = 16;
function positiveModulo(value, divisor) {
  return (value % divisor + divisor) % divisor;
}
function drawSkylineLayer(g, ctx, layer, tileSize, baseY, speed, signal) {
  const patternWidth = tileSize * PATTERN_TILES;
  const offset = ctx.t * speed * patternWidth;
  const firstWorldTile = Math.floor(offset / tileSize) - 2;
  const visibleTiles = Math.ceil(ctx.width / tileSize) + 4;
  for (let screenTile = 0; screenTile < visibleTiles; screenTile += 1) {
    const worldTile = firstWorldTile + screenTile;
    const patternTile = positiveModulo(worldTile, PATTERN_TILES);
    const x = worldTile * tileSize - offset;
    const variation = ctx.random(\`layer:\${layer}:tile:\${patternTile}\`);
    const height = tileSize * (1.2 + variation * (layer === 0 ? 2.2 : 3.4));
    g.fillStyle = layer === 0 ? "#14181D" : "#192128";
    g.fillRect(Math.floor(x), Math.floor(baseY - height), Math.ceil(tileSize + 1), Math.ceil(height));
    if ((patternTile + layer) % 3 === 0) {
      g.save();
      g.globalAlpha = layer === 0 ? 0.2 : 0.38;
      g.fillStyle = signal;
      const windowSize = Math.max(2, Math.floor(tileSize * 0.12));
      g.fillRect(Math.floor(x + tileSize * 0.26), Math.floor(baseY - height * 0.68), windowSize, windowSize);
      g.fillRect(Math.floor(x + tileSize * 0.62), Math.floor(baseY - height * 0.42), windowSize, windowSize);
      g.restore();
    }
  }
}
const kernel = {
  kind: "canvas",
  draw: (g, ctx) => {
    const tileSize = Math.min(48, Math.max(16, Math.round(Number(ctx.params.tileSize ?? 28))));
    const speed = Math.min(3, Math.max(1, Math.round(Number(ctx.params.speed ?? 1))));
    const depth = Math.min(1, Math.max(0.4, Number(ctx.params.depth ?? 0.8)));
    const signal = String(ctx.params.signal ?? "#5EE7F3");
    g.fillStyle = "#0D0E10";
    g.fillRect(0, 0, ctx.width, ctx.height);
    g.save();
    g.fillStyle = signal;
    for (let index = 0; index < 28; index += 1) {
      const x = ctx.random(\`star:\${index}:x\`) * ctx.width;
      const y = ctx.random(\`star:\${index}:y\`) * ctx.height * 0.58;
      const twinkle = 0.16 + (0.5 + 0.5 * Math.sin(ctx.t * Math.PI * 2 * speed + index * 1.7)) * 0.34;
      g.globalAlpha = twinkle;
      const size = index % 5 === 0 ? 2 : 1;
      g.fillRect(Math.floor(x), Math.floor(y), size, size);
    }
    g.restore();
    drawSkylineLayer(g, ctx, 0, tileSize * (0.48 + depth * 0.08), ctx.height * 0.72, speed, signal);
    drawSkylineLayer(g, ctx, 1, tileSize * (0.72 + depth * 0.12), ctx.height * 0.82, speed, signal);
    g.save();
    g.globalAlpha = 0.25;
    g.strokeStyle = signal;
    g.lineWidth = Math.max(1, tileSize * 0.06);
    const portalSize = Math.min(ctx.width, ctx.height) * (0.5 + depth * 0.16);
    g.strokeRect((ctx.width - portalSize) * 0.5, (ctx.height - portalSize) * 0.5, portalSize, portalSize);
    g.restore();
    if (ctx.subject.bitmap) {
      g.save();
      g.globalAlpha = 0.9;
      g.imageSmoothingEnabled = false;
      g.drawImage(ctx.subject.bitmap, 0, 0, ctx.width, ctx.height);
      g.restore();
    }
    const groundY = ctx.height * 0.82;
    const patternWidth = tileSize * PATTERN_TILES;
    const offset = ctx.t * speed * patternWidth;
    const firstWorldTile = Math.floor(offset / tileSize) - 2;
    const columns = Math.ceil(ctx.width / tileSize) + 4;
    const rows = Math.ceil((ctx.height - groundY) / tileSize) + 1;
    for (let column = 0; column < columns; column += 1) {
      const worldTile = firstWorldTile + column;
      const patternTile = positiveModulo(worldTile, PATTERN_TILES);
      const x = Math.floor(worldTile * tileSize - offset);
      const raised = ctx.random(\`ground:\${patternTile}:height\`) > 0.72 ? 1 : 0;
      for (let row = -raised; row < rows; row += 1) {
        const y = Math.floor(groundY + row * tileSize);
        g.fillStyle = (patternTile + row) % 2 === 0 ? "#1D2830" : "#172128";
        g.fillRect(x, y, tileSize + 1, tileSize + 1);
        g.save();
        g.globalAlpha = row <= 0 ? 0.68 : 0.2;
        g.strokeStyle = signal;
        g.lineWidth = Math.max(1, tileSize * 0.045);
        g.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);
        if ((patternTile + row) % 4 === 0) {
          g.fillStyle = signal;
          g.fillRect(x + tileSize * 0.28, y + tileSize * 0.28, tileSize * 0.18, tileSize * 0.18);
        }
        g.restore();
      }
    }
    g.save();
    g.fillStyle = "#0D0E10";
    g.globalAlpha = 0.76;
    g.fillRect(ctx.width * 0.38, ctx.height * 0.9, ctx.width * 0.24, Math.max(18, tileSize * 0.72));
    g.globalAlpha = 1;
    g.fillStyle = signal;
    g.font = \`700 \${Math.max(9, tileSize * 0.38)}px monospace\`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("STAGE 06", ctx.width * 0.5, ctx.height * 0.9 + Math.max(18, tileSize * 0.72) * 0.5);
    g.restore();
  }
};
var K12_tile_scroll_effect_default = kernel;
`;export{e as default};
