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
