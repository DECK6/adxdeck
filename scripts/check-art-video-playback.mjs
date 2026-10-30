// Safari/WebKit smoke test against the real gallery and media delivery.
// Install Playwright + WebKit, then run with ART_SITE_URL=http://127.0.0.1:4383.
// ART_PLAYWRIGHT_MODULE can point to an existing playwright-core installation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const moduleName = process.env.ART_PLAYWRIGHT_MODULE || 'playwright';
const moduleUrl = path.isAbsolute(moduleName)
  ? pathToFileURL(path.join(moduleName, 'index.mjs')).href : moduleName;
const { webkit, devices } = await import(moduleUrl);
const base = process.env.ART_SITE_URL || 'https://dexa.art';
const report = [];
const browser = await webkit.launch({ headless: true });

try {
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();
  page.setDefaultTimeout(25000);
  await page.goto(`${base}/works/`, { waitUntil: 'domcontentloaded' });
  const ids = process.env.ART_VIDEO_IDS?.split(',') || await page.evaluate(() => window.PORTFOLIO.order);

  for (const id of ids) {
    // Seasonal films are reached through the series controls in the open viewer.
    if (['spring', 'summer', 'autumn', 'winter'].includes(id)) {
      if (!await page.locator('#viewer-series').isVisible()) {
        if (await page.locator('#viewer').evaluate(node => node.open)) await page.locator('#close-viewer').click();
        await page.locator('.card-image[data-open="four-seasons"]').click();
      }
      await page.locator(`#viewer-series [data-open="${id}"]`).click();
    } else {
      if (await page.locator('#viewer').evaluate(node => node.open)) await page.locator('#close-viewer').click();
      await page.locator(`.card-image[data-open="${id}"]`).click();
    }

    await page.waitForFunction(() => {
      const video = document.querySelector('#viewer-video');
      return video.currentTime > 0.5 || video.error;
    }, null, { timeout: 25000 });
    const initial = await page.locator('#viewer-video').evaluate(video => ({
      time: video.currentTime, width: video.videoWidth, height: video.videoHeight,
      paused: video.paused, muted: video.muted, readyState: video.readyState,
      error: video.error && { code: video.error.code, message: video.error.message }
    }));
    report.push({ id, initial });
    assert.equal(initial.error, null, `${id}: Safari must accept the delivered video`);
    assert.ok(initial.time > 0.5 && initial.width > 0 && !initial.paused, `${id}: playback must advance`);
    assert.equal(initial.muted, false, `${id}: artwork sound must stay enabled`);

    await page.locator('#viewer-video').evaluate(video => { video.currentTime = 30; });
    await page.waitForFunction(() => {
      const video = document.querySelector('#viewer-video');
      return video.currentTime > 30.2 && !video.seeking && video.readyState >= 2;
    }, null, { timeout: 25000 });
    report.at(-1).seek = await page.locator('#viewer-video').evaluate(video => ({ time: video.currentTime, readyState: video.readyState }));
    console.log(`PASS ${id}: sound-enabled playback and seek`);
  }

  // A link from the homepage opens a paused player; the native Play action must work.
  await page.goto(`${base}/works/#work=breath-beneath-the-tide`, { waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('#viewer-video').evaluate(video => video.paused), true);
  // Tap the native central Play control, as on an iPhone without a keyboard.
  await page.locator('#viewer-video').tap();
  await page.waitForFunction(() => document.querySelector('#viewer-video').currentTime > 0.3, null, { timeout: 25000 });
  report.push({ directLink: 'breath-beneath-the-tide', manualPlay: true });
  console.log('PASS direct link: manual playback');

  await page.locator('#close-viewer').click();
  await page.waitForFunction(() => {
    const video = document.querySelector('#viewer-video');
    return video.paused && video.readyState === 0 && !video.querySelector('source').hasAttribute('src');
  });
  report.push({ close: 'playback stopped and media released' });

  // Source-element errors must retain the visible download fallback.
  await page.route('**/ink-breath.mp4', route => route.abort());
  await page.locator('.card-image[data-open="ink-breath"]').click();
  await page.locator('#video-error').waitFor({ state: 'visible' });
  assert.match(await page.locator('#download-preview').getAttribute('href'), /\/ink-breath\.mp4$/);
  report.push({ failedSource: 'download fallback visible' });
  console.log('PASS close cleanup and failed-source fallback');
} finally {
  if (process.env.ART_VIDEO_REPORT) fs.writeFileSync(process.env.ART_VIDEO_REPORT, JSON.stringify(report, null, 2));
  await browser.close();
}
