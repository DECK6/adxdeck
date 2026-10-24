'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const english = read('en/index.html');
const home = read('index.html');
const source = read('en/script.js');
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1];
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(m => m[0]);

test('English edition is indexable and has reciprocal canonical language alternatives', () => {
  assert.match(english, /<html\s+lang="en"/);
  assert.equal((english.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(english, /noindex/i);
  const expected = { ko: 'https://dexa.art/', en: 'https://dexa.art/en/', 'x-default': 'https://dexa.art/' };
  for (const [html, canonical] of [[english, expected.en], [home, expected.ko]]) {
    const links = tags(html, 'link');
    assert.equal(links.filter(t => attr(t, 'rel') === 'canonical').length, 1);
    assert.equal(attr(links.find(t => attr(t, 'rel') === 'canonical'), 'href'), canonical);
    for (const [lang, url] of Object.entries(expected)) {
      const matches = links.filter(t => attr(t, 'hreflang') === lang);
      assert.equal(matches.length, 1, `one ${lang} alternate`);
      assert.equal(attr(matches[0], 'href'), url);
    }
  }
  const jsonld = [...english.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(jsonld.length);
  jsonld.forEach(m => JSON.parse(m[1]));
  assert.match(read('blog/build.js'), /loc: `\$\{SITE_URL\}\/en\/`/);
  assert.equal((read('sitemap.xml').match(/<loc>https:\/\/dexa\.art\/en\/<\/loc>/g) || []).length, 1);
});

test('language switches and content remain accessible without JavaScript', () => {
  assert.match(home, /class="home-language-switch"/);
  assert.match(home, /href="\/en\/"[^>]*aria-label="View the English website"/);
  assert.match(english, /href="\/"[^>]*hreflang="ko"/);
  const ids = tags(english, '[a-z][a-z0-9]*').map(t => attr(t, 'id')).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length, 'unique IDs');
  for (const a of tags(english, 'a')) {
    const href = attr(a, 'href');
    if (href?.startsWith('#')) assert.ok(ids.includes(href.slice(1)), `anchor ${href}`);
  }
  assert.equal((english.match(/<article class="work-card/g) || []).length, 3);
  for (const title of ['Ink Breath', 'Gyeol — Wind over the Grass', 'Harmonograph']) assert.ok(english.includes(title));
  assert.match(english, /AI agent and MCP/);
  assert.match(english, /knowledge-management/);
  assert.match(english, /Korean/);
  assert.doesNotMatch(english, /within 24 hours|100% satisfaction/i);
});

test('English page local assets exist and contact fields match existing public integration', () => {
  for (const tag of [...tags(english, 'img'), ...tags(english, 'script'), ...tags(english, 'link')]) {
    const url = attr(tag, 'src') || (attr(tag, 'rel') === 'stylesheet' || attr(tag, 'rel') === 'icon' ? attr(tag, 'href') : null);
    if (url?.startsWith('/') && !url.startsWith('//')) assert.ok(fs.existsSync(path.join(ROOT, url.split('?')[0])), `asset ${url}`);
  }
  const form = tags(english, 'form')[0];
  assert.equal(attr(form, 'action'), 'https://api.web3forms.com/submit');
  assert.equal(attr(form, 'method').toLowerCase(), 'post');
  const publicKey = html => attr(tags(html, 'input').find(t => attr(t, 'name') === 'access_key'), 'value');
  assert.ok(publicKey(english));
  assert.equal(publicKey(english) === publicKey(home), true, 'reuse existing public form integration');
  for (const name of ['name', 'email', 'message']) {
    const field = [...tags(english, 'input'), ...tags(english, 'textarea')].find(t => attr(t, 'name') === name);
    assert.ok(/\brequired\b/.test(field));
    assert.ok(tags(english, 'label').some(t => attr(t, 'for') === attr(field, 'id')));
  }
  assert.match(english, /role="status"/);
  assert.match(english, /role="alert"/);
  assert.match(read('en/styles.css'), /prefers-reduced-motion/);
});

function harness({ hostname = 'localhost', valid = true, bot = false, fetch: fetchImpl = async () => ({ ok: true, json: async () => ({ success: true }) }) } = {}) {
  const state = { calls: [], timers: [], appended: [], resets: 0, attrs: {}, listener: null };
  const fields = [{ value: 'Test visitor', disabled: false }, { value: 'test@example.com', disabled: false }, { value: 'Local mock only', disabled: false }];
  const button = { disabled: false, textContent: 'Send inquiry' };
  const success = { textContent: '' }, error = { textContent: '' };
  const form = {
    action: 'https://api.web3forms.com/submit', elements: { botcheck: { checked: bot } },
    addEventListener: (name, fn) => { if (name === 'submit') state.listener = fn; },
    reportValidity: () => valid,
    querySelectorAll: () => fields,
    setAttribute: (k, v) => { state.attrs[k] = v; },
    removeAttribute: k => { delete state.attrs[k]; },
    reset: () => { state.resets++; fields.forEach(f => { f.value = ''; }); }
  };
  const elements = { 'contact-form': form, 'submit-btn': button, 'success-message': success, 'error-message': error };
  const window = { location: { hostname }, setTimeout: (fn, ms) => { state.timers.push({ fn, ms }); return state.timers.length; }, clearTimeout: id => { state.timers[id - 1].cleared = true; } };
  const context = {
    window, AbortController, Date,
    document: { getElementById: id => elements[id], createElement: () => ({}), head: { appendChild: el => state.appended.push(el) } },
    FormData: class { constructor() { this.values = fields.filter(f => !f.disabled).map(f => f.value); } },
    fetch: (url, options) => { state.calls.push({ url, options }); return fetchImpl(url, options); }
  };
  vm.runInNewContext(source, context, { filename: 'en/script.js' });
  return { state, fields, button, success, error, window, submit: () => state.listener({ preventDefault() {} }) };
}

test('analytics does not load for local preview but retains production measurement', () => {
  for (const hostname of ['localhost', '127.0.0.1', '[::1]', '']) {
    const h = harness({ hostname });
    assert.equal(h.state.appended.length, 0);
    assert.equal(h.window.gtag, undefined);
  }
  const h = harness({ hostname: 'dexa.art' });
  assert.equal(h.state.appended.length, 1);
  assert.match(h.state.appended[0].src, /^https:\/\/www\.googletagmanager\.com\/gtag\/js\?/);
});

test('valid inquiry is snapshotted before disabling, then reset only on confirmed success', async () => {
  const h = harness();
  await h.submit();
  assert.equal(h.state.calls.length, 1);
  assert.equal(h.state.calls[0].options.body.values.length, 3);
  assert.equal(h.state.resets, 1);
  assert.match(h.success.textContent, /has been sent/);
  assert.equal(h.error.textContent, '');
  assert.equal(h.button.disabled, false);
  assert.ok(h.fields.every(f => !f.disabled));
  assert.equal(h.state.attrs['aria-busy'], undefined);
  assert.equal(h.state.timers[0].ms, 20000);
  assert.equal(h.state.timers[0].cleared, true);
});

test('API rejection, HTTP error, invalid JSON and network failure preserve inquiry', async () => {
  const cases = [
    async () => ({ ok: true, json: async () => ({ success: false }) }),
    async () => ({ ok: false, json: async () => ({ success: true }) }),
    async () => ({ ok: true, json: async () => { throw new SyntaxError('bad JSON'); } }),
    async () => { throw new Error('offline'); }
  ];
  for (const fetch of cases) {
    const h = harness({ fetch });
    await h.submit();
    assert.equal(h.state.resets, 0);
    assert.equal(h.fields[2].value, 'Local mock only');
    assert.match(h.error.textContent, /could not confirm/);
    assert.equal(h.success.textContent, '');
    assert.equal(h.button.disabled, false);
  }
});

test('pending inquiries cannot be submitted twice', async () => {
  let resolve;
  const h = harness({ fetch: () => new Promise(r => { resolve = r; }) });
  const pending = h.submit();
  assert.equal(h.button.disabled, true);
  assert.equal(h.state.attrs['aria-busy'], 'true');
  await h.submit();
  assert.equal(h.state.calls.length, 1);
  resolve({ ok: true, json: async () => ({ success: true }) });
  await pending;
  assert.equal(h.button.disabled, false);
});

test('timeout aborts pending inquiry, preserves input and allows retry', async () => {
  const h = harness({ fetch: (url, { signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(Object.assign(new Error('timeout'), { name: 'AbortError' })))) });
  const pending = h.submit();
  h.state.timers[0].fn();
  await pending;
  assert.match(h.error.textContent, /timed out/);
  assert.equal(h.fields[2].value, 'Local mock only');
  assert.equal(h.state.resets, 0);
  assert.equal(h.button.disabled, false);
});

test('invalid fields and honeypot never reach network', async () => {
  for (const options of [{ valid: false }, { bot: true }]) {
    const h = harness(options);
    await h.submit();
    assert.equal(h.state.calls.length, 0);
    assert.equal(h.state.resets, 0);
    assert.equal(h.button.disabled, false);
  }
});
