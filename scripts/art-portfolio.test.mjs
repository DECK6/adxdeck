import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {} };
vm.runInNewContext(read('works/works.js'), context);
const catalog = context.window.PORTFOLIO;
const ids = ['ink-breath', 'gyeol', 'sand-pendulum'];

test('both homepages show exactly the requested three films in order', () => {
  for (const file of ['index.html', 'en/index.html']) {
    const actual = [...read(file).matchAll(/data-home-film="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(actual, ids, file);
    assert.match(read(file), /href="\/works\/"/);
  }
});

test('the seven-film catalog has valid stills, public media, sound and individual loop settings', () => {
  assert.equal(catalog.works.length, 7);
  assert.equal(new Set(catalog.order).size, 7);
  for (const work of catalog.works) {
    assert.ok(catalog.order.includes(work.id));
    assert.ok(fs.existsSync(path.join(root, work.poster)), work.poster);
    assert.match(work.video, /^https:\/\/github.com\/DECK6\/adxdeck\/releases\/download\/art-films-\d{8}\/[\w-]+\.mp4$/);
    assert.equal(work.sound, true);
    assert.ok(work.description.ko && work.description.en);
  }
  for (const id of ['joinery', 'sand-pendulum', 'ink-breath']) {
    assert.equal(catalog.works.find(work => work.id === id).loop, false);
  }
});

test('public pages present artwork without an LED.ART association or private delivery links', () => {
  for (const file of ['works/index.html', 'works/works.js']) {
    assert.doesNotMatch(read(file), /LED\.ART|drive\.google|\/Volumes\/|\/Users\//i);
  }
  assert.match(read('works/index.html'), /rel="canonical" href="https:\/\/dexa.art\/works\/"/);
  assert.match(read('index.html'), /id="project-archive-grid"/);
});


test('existing portfolios remain directly visible below the featured films in both languages', () => {
  for (const file of ['index.html', 'en/index.html']) {
    const html = read(file);
    const portfolio = html.match(/<section[^>]*id="portfolio"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(portfolio, `${file}: existing portfolio must remain a visible section`);
    assert.doesNotMatch(portfolio, /<details\b|<[^>]*\shidden(?:\s|=|>)/);
    assert.ok(html.indexOf('id="portfolio"') > html.lastIndexOf('data-home-film='));
  }
  const english = read('en/index.html');
  for (const title of ['Ultraviolet', 'Afterimage of the Hand', 'Breath of Chaos', 'Christmas at the Incinerator', 'PRECTXE']) {
    assert.ok(english.includes(title), `English portfolio retains ${title}`);
  }
});

function galleryHarness(hash = '') {
  const elements = new Map();
  const handlers = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      innerHTML: '', textContent: '', hidden: false, open: false, playCount: 0,
      setAttribute() {}, removeAttribute() {}, pause() {}, load() {},
      play() { this.playCount++; return Promise.resolve(); },
      showModal() { this.open = true; },
      addEventListener(name, callback) { handlers.set(`${selector}:${name}`, callback); }
    });
    return elements.get(selector);
  };
  const location = { hash, search: '', pathname: '/works/' };
  const sandbox = {
    window: { PORTFOLIO: catalog, addEventListener() {} }, URLSearchParams, location,
    history: { replaceState(_state, _title, url) { location.hash = url.startsWith('#') ? url : ''; } },
    document: {
      querySelector: element, querySelectorAll: () => [], activeElement: null,
      body: { classList: { add() {}, remove() {} } },
      addEventListener(name, callback) { handlers.set(`document:${name}`, callback); }
    }
  };
  vm.runInNewContext(read('works/app.js'), sandbox);
  return {
    element, location,
    open(id) { handlers.get('document:click')({ target: { closest: selector => selector === '[data-open]' ? { dataset: { open: id } } : null } }); },
    next() { handlers.get('#next-work:click')(); }
  };
}

test('the gallery replaces Yunseul and the whole seasonal series with the new ocean artwork', () => {
  const page = galleryHarness();
  const cards = [...page.element('#work-grid').innerHTML.matchAll(/data-work="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(cards, ['ink-breath','gyeol','sand-pendulum','breath-beneath-the-tide','nakhwa','gyeong','joinery']);
  for (const id of ['yunseul','four-seasons','spring','summer','autumn','winter']) {
    assert.ok(!catalog.works.some(w=>w.id===id));
    assert.doesNotMatch(read('works/index.html'), new RegExp('data-work="'+id+'"'));
  }
  assert.doesNotMatch(read('works/index.html'), /data-filter="seasons"/);
  page.open('breath-beneath-the-tide');
  assert.equal(page.element('#viewer-title').textContent, '수면의 호흡');
  assert.equal(page.element('#viewer-series').hidden, true);
  assert.match(page.element('#viewer-specs').innerHTML, /6144 × 2048/);
  assert.match(page.element('#viewer-specs').innerHTML, /01:30/);
  assert.equal(page.element('#viewer-video').loop, false);
  page.next();
  assert.equal(page.element('#viewer-title').textContent, '낙화');
});

test('ocean direct link waits for play and removed artwork direct links do not reopen retired films', () => {
  const page = galleryHarness('#work=breath-beneath-the-tide');
  assert.ok(page.element('#viewer-video-source').src.endsWith('/breath-beneath-the-tide.mp4'));
  assert.equal(page.element('#viewer-video').playCount, 0);
  for (const id of ['yunseul','four-seasons','summer']) {
    const retired=galleryHarness('#work='+id);
    assert.equal(retired.element('#viewer').open, false);
  }
});
