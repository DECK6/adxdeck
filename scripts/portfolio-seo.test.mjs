import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'works/index.html'), 'utf8');
const catalogContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'works/works.js'), 'utf8'), catalogContext);
const videos = new Map(catalogContext.window.PORTFOLIO.works.map(work => [work.id, work.video]));
const entries = ['ink-breath', 'gyeol', 'sand-pendulum', 'yunseul', 'nakhwa', 'gyeong', 'four-seasons', 'joinery'];

test('a crawler receives all eight collection entries and usable video links without running JavaScript', () => {
  const collection = html.match(/<div id="work-grid"[^>]*>([\s\S]*?)<\/section>/)?.[1] || '';
  assert.deepEqual([...collection.matchAll(/data-work="([^"]+)"/g)].map(match => match[1]), entries);
  for (const id of entries) {
    assert.ok(collection.includes(`href="${videos.get(id)}"`), id);
  }
  assert.match(collection, /먹의 호흡/);
  assert.match(collection, /하모노그래프/);
});

test('the initial document includes its featured artwork, artist biography and inquiry destination', () => {
  const featured = html.match(/<section id="featured"[^>]*>([\s\S]*?)<\/section>/)?.[1] || '';
  assert.match(featured, /<h2>먹의 호흡/);
  assert.match(featured, /src="\/works\/assets\/posters\/ink-breath.jpg"/);
  assert.match(html, /id="artist-bio">[^<]*실시간 시뮬레이션/);
  assert.match(html, /<a[^>]*href="mailto:deck@dexa.art[^\"]*"[^>]*id="materials-link"/);
});

test('search and social metadata describe the real gallery and its canonical preview image', () => {
  assert.match(html, /<title>[^<]*미디어아트[^<]*육대근[^<]*DEXA<\/title>/);
  const content = property => html.match(new RegExp(`<meta (?:property|name)="${property}" content="([^"]+)"`))?.[1];
  assert.equal(content('og:url'), 'https://dexa.art/works/');
  assert.equal(content('og:type'), 'website');
  assert.equal(content('og:image'), 'https://dexa.art/works/assets/posters/ink-breath.jpg');
  assert.equal(content('twitter:card'), 'summary_large_image');
  assert.equal(content('twitter:image'), content('og:image'));
  assert.ok(fs.existsSync(path.join(root, new URL(content('og:image')).pathname)));
});

test('collection structured data preserves eight entries and all twelve distinct films without a self-referencing series', () => {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const graph = scripts.flatMap(value => value['@graph'] || [value]);
  const collection = graph.find(value => value['@type'] === 'CollectionPage');
  assert.ok(collection, 'gallery must have CollectionPage structured data');
  assert.equal(collection.url, 'https://dexa.art/works/');
  assert.equal(collection.inLanguage, 'ko-KR');
  assert.equal(collection.mainEntity.numberOfItems, 8);
  const items = collection.mainEntity.itemListElement;
  assert.deepEqual(items.map(value => value.position), [1, 2, 3, 4, 5, 6, 7, 8]);
  const films = items.flatMap(value => [value.item, ...(value.item.hasPart || [])]);
  assert.equal(new Set(films.map(film => film.url)).size, 12);
  assert.ok(films.every(film => film.image.startsWith('https://dexa.art/works/assets/posters/')));
  assert.ok(films.every(film => film.creator['@id'] === 'https://dexa.art/works/#artist'));
  assert.ok(films.every(film => !film.hasPart?.some(part => part['@id'] === film['@id'])));
  assert.ok(graph.some(value => value['@type'] === 'Person' && value.name === '육대근'));
});
