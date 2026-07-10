#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, mkdtemp, readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const HOST = "127.0.0.1";
const STORAGE_KEY = "dexa.learnmap.v1";
const EXPECTED = Object.freeze({ nodes: "1,956", edges: "1,894", standards: "620" });
const MIME_TYPES = Object.freeze({
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
});

let failDataRequest = false;
const serverRequests = [];
const networkRequests = [];
const browserProfile = await mkdtemp(path.join(tmpdir(), "dexa-learnmap-browser-"));
const browserPath = await findBrowser();
const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${HOST}`);
  serverRequests.push({ method: request.method ?? "GET", path: requestUrl.pathname });

  if (failDataRequest && requestUrl.pathname === "/learnmap/data/learnmap.json") {
    response.writeHead(503, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "intentional browser-test failure" }));
    return;
  }

  try {
    const relativePath = requestUrl.pathname.endsWith("/")
      ? `${requestUrl.pathname}index.html`
      : requestUrl.pathname;
    const filePath = path.resolve(ROOT, `.${relativePath}`);
    if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
      throw new Error("path outside repository root");
    }
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) {
      throw new Error("not a file");
    }
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": MIME_TYPES[path.extname(filePath)] ?? "application/octet-stream",
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, HOST, resolve);
});

const address = server.address();
assert(address && typeof address === "object");
const origin = `http://${HOST}:${address.port}`;
const browser = spawn(
  browserPath,
  [
    "--headless=new",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-features=MediaRouter,OptimizationHints",
    "--disable-sync",
    "--metrics-recording-only",
    "--no-first-run",
    "--no-sandbox",
    "--remote-debugging-port=0",
    `--user-data-dir=${browserProfile}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);

let browserError = "";
browser.stderr.on("data", (chunk) => {
  browserError += chunk.toString();
});

let cdp;
try {
  const portFile = path.join(browserProfile, "DevToolsActivePort");
  await waitUntil(async () => {
    try {
      await access(portFile);
      return true;
    } catch {
      return false;
    }
  }, "Chromium DevTools port");

  const [debugPort] = (await readFile(portFile, "utf8")).trim().split("\n");
  const targets = await fetch(`http://${HOST}:${debugPort}/json/list`).then((response) => response.json());
  const pageTarget = targets.find((target) => target.type === "page");
  assert(pageTarget?.webSocketDebuggerUrl, "Chromium page target was not available");

  cdp = await CDPClient.connect(pageTarget.webSocketDebuggerUrl);
  cdp.on("Network.requestWillBeSent", ({ request }) => {
    networkRequests.push({ method: request.method, url: request.url });
  });
  await Promise.all([
    cdp.send("Page.enable"),
    cdp.send("Runtime.enable"),
    cdp.send("Network.enable"),
  ]);

  await navigate(`${origin}/learnmap/`);
  await waitForAppState("ready");
  assert.deepEqual(
    await evaluate(`({
      nodes: document.querySelector("#metric-nodes").textContent,
      edges: document.querySelector("#metric-edges").textContent,
      standards: document.querySelector("#metric-standards").textContent,
      visible: document.querySelector("#visible-nodes").textContent,
    })`),
    { ...EXPECTED, visible: EXPECTED.nodes },
  );

  await evaluate(`(() => {
    const nickname = document.querySelector("#profile-nickname");
    nickname.value = "별이";
    nickname.dispatchEvent(new Event("input", { bubbles: true }));
    const grade = document.querySelector("#profile-grade");
    grade.value = "3-4";
    grade.dispatchEvent(new Event("change", { bubbles: true }));
    document.querySelector('[data-profile-subject-id="Mathematics"]').click();
    document.querySelector("#toggle-list-view").click();
  })()`);
  await waitFor(`document.querySelectorAll("#topic-list button").length > 0`, "topic list");
  const selectedNodeId = await evaluate(`(() => {
    const topic = document.querySelector("#topic-list button");
    const nodeId = topic.dataset.nodeId;
    topic.click();
    document.querySelector('[data-status-value="practicing"]').click();
    document.querySelector("#toggle-favorite").click();
    return nodeId;
  })()`);

  const savedProfile = await evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)}))`);
  assert.equal(savedProfile.version, 1);
  assert.equal(savedProfile.nickname, "별이");
  assert.equal(savedProfile.grade, "3-4");
  assert.deepEqual(savedProfile.subjects, ["Mathematics"]);
  assert.equal(savedProfile.statuses[selectedNodeId], "practicing");
  assert(savedProfile.favorites.includes(selectedNodeId));

  await cdp.send("Page.reload", { ignoreCache: true });
  await waitForAppState("ready");
  assert.deepEqual(
    await evaluate(`({
      nickname: document.querySelector("#profile-nickname").value,
      grade: document.querySelector("#profile-grade").value,
      subject: document.querySelector('[data-profile-subject-id="Mathematics"]').checked,
      saved: JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})),
    })`),
    { nickname: "별이", grade: "3-4", subject: true, saved: savedProfile },
  );

  const parentCounts = await evaluate(`(() => {
    document.querySelector('#mode-path').click();
    const pathCount = document.querySelectorAll('#parent-topic-grid .parent-topic-card').length;
    document.querySelector('#mode-week').click();
    const weekCount = document.querySelectorAll('#parent-topic-grid .parent-topic-card').length;
    return {
      pathCount,
      weekCount,
      title: document.querySelector('#parent-panel-title').textContent,
      hidden: document.querySelector('#parent-panel').hidden,
    };
  })()`);
  assert(parentCounts.pathCount > 0 && parentCounts.pathCount <= 18);
  assert(parentCounts.weekCount > 0 && parentCounts.weekCount <= 6);
  assert.equal(parentCounts.title, "별이의 이번 주 집에서 해볼 것");
  assert.equal(parentCounts.hidden, false);

  await evaluate(`document.querySelector("#clear-local-data").click()`);
  assert.deepEqual(
    await evaluate(`({
      stored: localStorage.getItem(${JSON.stringify(STORAGE_KEY)}),
      nickname: document.querySelector("#profile-nickname").value,
      grade: document.querySelector("#profile-grade").value,
      checked: document.querySelectorAll("[data-profile-subject-id]:checked").length,
      statuses: document.querySelectorAll("[data-status-value][aria-pressed=true]").length,
      clearDisabled: document.querySelector("#clear-local-data").disabled,
    })`),
    { stored: null, nickname: "", grade: "", checked: 0, statuses: 0, clearDisabled: true },
  );

  await evaluate(`localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, "{broken-json")`);
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitForAppState("ready");
  assert.deepEqual(
    await evaluate(`({
      stored: localStorage.getItem(${JSON.stringify(STORAGE_KEY)}),
      clearDisabled: document.querySelector("#clear-local-data").disabled,
      indicator: document.querySelector("#saved-indicator").textContent,
    })`),
    { stored: null, clearDisabled: true, indicator: "이 브라우저에만 저장" },
  );

  failDataRequest = true;
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitForAppState("error");
  assert.deepEqual(
    await evaluate(`({
      retryVisible: !document.querySelector("#retry-data").hidden,
      status: document.querySelector("#data-status").textContent,
    })`),
    { retryVisible: true, status: "데이터 오류 · learnmap.json 요청 실패 (503)" },
  );
  failDataRequest = false;

  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await cdp.send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitForAppState("ready");
  const mobileState = await evaluate(`({
    width: window.innerWidth,
    touchPoints: navigator.maxTouchPoints,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    canvasHeight: document.querySelector(".graph-panel").getBoundingClientRect().height,
    profileColumns: getComputedStyle(document.querySelector(".profile-block")).gridTemplateColumns,
  })`);
  assert.equal(mobileState.width, 390);
  assert(mobileState.touchPoints > 0);
  assert.equal(mobileState.reducedMotion, true);
  assert(mobileState.canvasHeight > 300);
  assert(!mobileState.profileColumns.includes(" "), "narrow mobile profile must use one column");

  const relevantNetworkRequests = networkRequests.filter(({ url }) => !url.startsWith("data:"));
  assert(relevantNetworkRequests.length > 0, "expected browser network requests");
  for (const request of relevantNetworkRequests) {
    assert.equal(request.method, "GET", `unexpected browser request method: ${request.method} ${request.url}`);
    assert.equal(new URL(request.url).origin, origin, `unexpected request origin: ${request.url}`);
  }
  for (const request of serverRequests) {
    assert.equal(request.method, "GET", `unexpected server request method: ${request.method} ${request.path}`);
  }

  console.log(
    `learnmap parent browser: PASS (${EXPECTED.nodes} nodes / reload + clear / path ${parentCounts.pathCount} / week ${parentCounts.weekCount} / mobile touch + reduced motion / GET only)`,
  );
} catch (error) {
  if (browserError.trim()) {
    error.message += `\nChromium stderr:\n${browserError.trim().slice(-3000)}`;
  }
  throw error;
} finally {
  cdp?.close();
  browser.kill("SIGTERM");
  await new Promise((resolve) => server.close(resolve));
}

async function findBrowser() {
  const candidates = [
    process.env.CHROMIUM_PATH,
    process.env.CHROME_PATH,
    "/opt/homebrew/bin/chromium",
    "/usr/local/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next common browser location.
    }
  }
  throw new Error("Chromium was not found. Set CHROMIUM_PATH to a Chromium-compatible browser.");
}

async function navigate(url) {
  await cdp.send("Page.navigate", { url });
  await waitFor(`location.href === ${JSON.stringify(url)}`, `navigation to ${url}`);
}

async function waitForAppState(expected) {
  await waitFor(
    `document.querySelector("#app")?.dataset.state === ${JSON.stringify(expected)}`,
    `app state ${expected}`,
    20_000,
  );
}

async function waitFor(expression, label, timeout = 10_000) {
  await waitUntil(() => evaluate(`Boolean(${expression})`), label, timeout);
}

async function waitUntil(check, label, timeout = 10_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    if (await check()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function evaluate(expression) {
  const response = await cdp.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
  }
  return response.result.value;
}

class CDPClient {
  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    });
    return new CDPClient(socket);
  }

  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) {
          return;
        }
        this.pending.delete(message.id);
        if (message.error) {
          pending.reject(new Error(`${message.error.message} (${message.method ?? "CDP"})`));
        } else {
          pending.resolve(message.result ?? {});
        }
        return;
      }
      for (const listener of this.listeners.get(message.method) ?? []) {
        listener(message.params ?? {});
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
    this.socket.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) ?? [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  close() {
    this.socket.close();
  }
}
