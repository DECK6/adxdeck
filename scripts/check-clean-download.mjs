import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const expectedSha256 = "8fae54b13b6d51f323e0f6f2b40e9228bf5da1007283fe5876d5fbf7417d84c5";

const [html, css, batch, buildScript, sitemap] = await Promise.all([
  readFile("clean/index.html", "utf8"),
  readFile("clean/styles.css", "utf8"),
  readFile("clean/windows-codex-cleanup.bat"),
  readFile("blog/build.js", "utf8"),
  readFile("sitemap.xml", "utf8"),
]);

assert.match(html, /<html\s+lang="ko"/i, "page language must be Korean");
assert.match(html, /<link\s+rel="canonical"\s+href="https:\/\/dexa\.art\/clean\/"/i);
assert.match(
  html,
  /href="\.\/windows-codex-cleanup\.bat"[^>]*\sdownload="windows-codex-cleanup\.bat"/i,
  "download button must use a same-origin downloadable batch file",
);
assert.match(html, /미리보기/, "page must explain preview mode");
assert.match(html, /CLEANUP/, "page must explain the apply confirmation token");
assert.match(html, /유령 프로세스는 PID 확인 후 강제 종료/, "page must disclose approved ghost-process termination");
assert.match(html, /Chrome·Edge 기록도 정리/, "page must disclose browser-history cleanup");
assert.match(html, /쿠키·비밀번호·북마크는 보존/, "page must disclose preserved browser data");
assert.match(html, /사용자가 별도 승인한 Codex·ChatGPT 유령 프로세스 강제 종료/, "page must disclose the separate approval boundary");
assert.match(html, new RegExp(expectedSha256), "page must show the artifact checksum");
assert.match(css, /:focus-visible/, "download page must include a visible keyboard focus state");
assert.match(css, /@media\s*\(max-width:\s*700px\)/, "download page must be responsive");
assert.match(
  buildScript,
  /\$\{SITE_URL\}\/clean\//,
  "the generated sitemap source must keep the clean route",
);
assert.equal(
  (sitemap.match(/<loc>https:\/\/dexa\.art\/clean\/<\/loc>/g) ?? []).length,
  1,
  "sitemap must contain the clean route exactly once",
);

const actualSha256 = createHash("sha256").update(batch).digest("hex");
assert.equal(actualSha256, expectedSha256, "published batch must be byte-identical to the verified artifact");
assert.ok(batch.includes(Buffer.from("\r\n")), "batch file must keep CRLF line endings");

console.log(`clean download page: PASS (${batch.byteLength} bytes / sha256 ${actualSha256})`);
