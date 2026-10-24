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

test('the twelve-film catalog has valid stills, public media, sound and individual loop settings', () => {
  assert.equal(catalog.works.length, 12);
  assert.equal(new Set(catalog.order).size, 12);
  for (const work of catalog.works) {
    assert.ok(catalog.order.includes(work.id));
    assert.ok(fs.existsSync(path.join(root, work.poster)), work.poster);
    assert.match(work.video, /^https:\/\/github.com\/DECK6\/adxdeck\/releases\/download\/art-films-20261024\/[\w-]+\.mp4$/);
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

test('Four Seasons is one collection entry with all five films selectable inside', () => {
  const page = galleryHarness();
  const cards = [...page.element('#work-grid').innerHTML.matchAll(/data-work="([^"]+)"/g)].map(m => m[1]);
  assert.equal(cards.length, 8);
  assert.ok(cards.includes('four-seasons'));
  for (const id of ['spring', 'summer', 'autumn', 'winter']) assert.ok(!cards.includes(id));
  page.open('four-seasons');
  const choices = [...page.element('#viewer-series').innerHTML.matchAll(/data-open="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(choices, ['four-seasons', 'spring', 'summer', 'autumn', 'winter']);
  for (const id of choices) {
    page.open(id);
    assert.ok(page.element('#viewer-video').src.endsWith(`/${id}.mp4`));
    assert.equal(page.element('#viewer-series').hidden, false);
    assert.equal(page.location.hash, `#work=${id}`);
  }
  page.next();
  assert.equal(page.element('#viewer-title').textContent, '결구');
  assert.equal(page.element('#viewer-series').hidden, true);
});

test('direct links to a season retain its series selector and pause until the user plays', () => {
  const page = galleryHarness('#work=summer');
  assert.ok(page.element('#viewer-video').src.endsWith('/summer.mp4'));
  assert.equal(page.element('#viewer-series').hidden, false);
  assert.match(page.element('#viewer-series').innerHTML, /aria-pressed="true"[^>]*data-open="summer"/);
  assert.equal(page.element('#viewer-video').playCount, 0);
});
