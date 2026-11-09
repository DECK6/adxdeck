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
    assert.ok(read(file).includes(`href="/works/${file.startsWith('en/') ? '?lang=en' : ''}"`));
  }
});

test('the eight-film catalog has valid stills, public media, sound and individual loop settings', () => {
  assert.equal(catalog.works.length, 8);
  assert.equal(new Set(catalog.order).size, 8);
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

function galleryHarness(hash = '', search = '') {
  const elements = new Map();
  const handlers = new Map();
  const nodes = [];
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      innerHTML: '', textContent: '', hidden: false, open: false, playCount: 0, loadCount: 0, pauseCount: 0,
      attributes: {}, dataset: {}, currentTime: 0,
      setAttribute(name, value) { this.attributes[name] = value; },
      getAttribute(name) { return this.attributes[name]; },
      removeAttribute(name) { delete this.attributes[name]; },
      pause() { this.pauseCount++; }, load() { this.loadCount++; },
      play() { this.playCount++; return Promise.resolve(); },
      showModal() { this.open = true; },
      close() { this.open = false; handlers.get(`${selector}:close`)?.(); },
      addEventListener(name, callback) { handlers.set(`${selector}:${name}`, callback); }
    });
    return elements.get(selector);
  };
  const html = read('works/index.html');
  for (const match of html.matchAll(/<[a-z][\w-]*\b([^>]*\bdata-(?:copy|page-language|language|filter)[^>]*)>/g)) {
    const attributes = Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
    const key = attributes.id ? `#${attributes.id}` : match[0];
    const node = element(key);
    node.attributes = attributes;
    node.dataset = Object.fromEntries(Object.entries(attributes).filter(([name]) => name.startsWith('data-')).map(([name, value]) => [name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()), value]));
    nodes.push(node);
  }
  element('script[type="application/ld+json"]').textContent = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  const location = { hash, search, pathname: '/works/' };
  const document = {
    documentElement: { lang: 'ko' }, title: html.match(/<title>(.*?)<\/title>/)[1],
    querySelector: element,
    querySelectorAll(selector) {
      const attribute = selector.match(/^\[([^\]]+)\]$/)?.[1];
      return attribute ? nodes.filter(node => attribute in node.attributes) : [];
    },
    activeElement: null, body: { classList: { add() {}, remove() {} } },
    addEventListener(name, callback) { handlers.set(`document:${name}`, callback); }
  };
  const sandbox = {
    window: { PORTFOLIO: catalog, addEventListener(name, callback) { handlers.set(`window:${name}`, callback); } }, URLSearchParams, location, document,
    history: { replaceState(_state, _title, url) {
      const next = new URL(url, `http://localhost${location.pathname}${location.search}${location.hash}`);
      Object.assign(location, { pathname: next.pathname, search: next.search, hash: next.hash });
    } }
  };
  vm.runInNewContext(read('works/app.js'), sandbox);
  const click = (selector, dataset) => handlers.get('document:click')({ target: { closest: query => query === selector ? { dataset } : null } });
  return {
    element, location, document,
    copy(key) { return nodes.find(node => node.dataset.copy === key); },
    languageLink(locale) { return nodes.find(node => node.dataset.pageLanguage === locale); },
    open(id) { click('[data-open]', { open: id }); },
    descriptionLanguage(language) { click('[data-language]', { language }); },
    filter(filter) { click('[data-filter]', { filter }); },
    next() { handlers.get('#next-work:click')(); },
    close() { handlers.get('#close-viewer:click')(); },
    hash(value) { location.hash = value; handlers.get('window:hashchange')(); }
  };
}

test('the gallery replaces Yunseul and the whole seasonal series with the new ocean artwork', () => {
  const page = galleryHarness();
  const cards = [...page.element('#work-grid').innerHTML.matchAll(/data-work="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(cards, ['ink-breath','gyeol','sand-pendulum','breath-beneath-the-tide','nakhwa','gyeong','joinery','weave']);
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

test('Weave publishes the actual monochrome preview without inventing a 6K master', () => {
  const work = catalog.works.find(work => work.id === 'weave');
  assert.ok(work, 'Weave must be in the public catalog');
  assert.deepEqual(Array.from(work.resolution), [1920, 640]);
  assert.equal(work.loop, false);
  assert.equal(work.sound, true);
  assert.ok(Math.abs(work.duration - 70.033333) < 0.001);
  assert.match(work.description.ko, /빛과 그림자/);
  const page = galleryHarness('#work=weave');
  assert.equal(page.element('#viewer-title').textContent, '직조');
  assert.equal(page.element('#viewer-video').playCount, 0);
  assert.match(page.element('#viewer-specs').innerHTML, /1920 × 640/);
});

test('direct English links initialize the shell, artwork player and metadata in English', () => {
  const page = galleryHarness('#work=ink-breath', '?lang=en');
  assert.equal(page.document.documentElement.lang, 'en');
  assert.equal(page.document.title, 'Media art works | Deck · DEXA');
  assert.equal(page.copy('works').innerHTML, 'Works');
  assert.match(page.element('#opening-title').innerHTML, /light and sound/);
  assert.equal(page.element('#artist-name').textContent, 'Deck');
  assert.match(page.element('#artist-bio').textContent, /^Deck is a media artist/);
  assert.match(page.element('#featured').innerHTML, /Watch full film/);
  assert.match(page.element('#work-grid').innerHTML, /Watch Harmonograph in full/);
  assert.equal(page.element('#viewer-title').textContent, 'Ink Breath');
  assert.equal(page.element('#viewer-subtitle').textContent, 'Two landscapes, one breath');
  assert.equal(page.element('#viewer-description').lang, 'en');
  assert.match(page.element('#viewer-credits').textContent, /programming by Deck/);
  assert.doesNotMatch(page.element('#viewer-credits').textContent, /[가-힣]/);
  assert.match(page.element('#viewer-specs').innerHTML, /Preview duration/);
  assert.equal(page.element('#previous-work').getAttribute('aria-label'), 'Previous work');
  assert.equal(page.element('#viewer-video').getAttribute('aria-label'), 'Ink Breath, full film, with sound');
  assert.equal(page.element('#viewer-video').playCount, 0);
  assert.match(page.copy('downloadPreview').innerHTML, /Download preview/);
  assert.equal(page.element('meta[property="og:locale"]').getAttribute('content'), 'en_US');
  const schema = JSON.parse(page.element('script[type="application/ld+json"]').textContent);
  const collection = schema['@graph'].find(item => item['@type'] === 'CollectionPage');
  assert.equal(collection.inLanguage, 'en');
  assert.equal(collection.mainEntity.itemListElement[0].item.name, 'Ink Breath');
  assert.match(collection.mainEntity.itemListElement[0].item.url, /\?lang=en#work=ink-breath$/);
});

test('page language links retain the current work and other query parameters through navigation', () => {
  const page = galleryHarness('#work=ink-breath', '?lang=en&source=review');
  assert.equal(page.languageLink('ko').href, '/works/?source=review#work=ink-breath');
  assert.equal(page.languageLink('en').getAttribute('aria-current'), 'page');
  page.next();
  assert.equal(page.element('#viewer-title').textContent, 'Gyeol — Wind over the Grass');
  assert.equal(page.languageLink('ko').href, '/works/?source=review#work=gyeol');
  assert.equal(page.languageLink('en').href, '/works/?lang=en&source=review#work=gyeol');
  page.close();
  assert.equal(page.languageLink('en').href, '/works/?lang=en&source=review');
  page.hash('#artist');
  assert.equal(page.languageLink('ko').href, '/works/?source=review#artist');
});

test('description-only language changes preserve playback and the page language', () => {
  for (const search of ['', '?lang=en']) {
    const page = galleryHarness('#work=ink-breath', search);
    const video = page.element('#viewer-video');
    const source = page.element('#viewer-video-source').src;
    video.currentTime = 17;
    const loads = video.loadCount;
    const pauses = video.pauseCount;
    page.descriptionLanguage(search ? 'ko' : 'en');
    assert.equal(page.element('#viewer-description').lang, search ? 'ko' : 'en');
    assert.equal(page.element('#viewer-title').textContent, search ? 'Ink Breath' : '먹의 호흡');
    assert.equal(page.document.documentElement.lang, search ? 'en' : 'ko');
    assert.equal(video.currentTime, 17);
    assert.equal(video.loadCount, loads);
    assert.equal(video.pauseCount, pauses);
    assert.equal(page.element('#viewer-video-source').src, source);
  }
});

test('Korean remains the default and English filters keep the eight-work order and file durations', () => {
  const korean = galleryHarness('#work=gyeol', '?lang=unknown');
  assert.equal(korean.document.documentElement.lang, 'ko');
  assert.equal(korean.element('#viewer-title').textContent, '결');
  assert.equal(korean.copy('works').innerHTML, '작품');
  const english = galleryHarness('', '?lang=en');
  english.filter('confluence');
  const cards = [...english.element('#work-grid').innerHTML.matchAll(/data-work="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(cards, ['gyeol', 'nakhwa']);
  assert.equal(english.element('#filter-count').textContent, '02 WORKS');
  assert.deepEqual(Array.from(catalog.order, id => {
    const work = catalog.works.find(work => work.id === id);
    return [id, work.duration];
  }), [['ink-breath',59.5],['gyeol',60],['sand-pendulum',60],['breath-beneath-the-tide',90],['nakhwa',60],['gyeong',60],['joinery',60],['weave',70.033333]]);
  assert.match(english.copy('collectionContext').innerHTML, /current preview files/);
  assert.match(read('works/index.html'), /<source id="viewer-video-source" type="video\/mp4">/);
});

test('English titles retain existing artist wording without repeating their subtitles', () => {
  const page = galleryHarness('', '?lang=en');
  for (const id of ['gyeol', 'gyeong', 'weave']) {
    const work = catalog.works.find(work => work.id === id);
    page.open(id);
    assert.equal(page.element('#viewer-title').textContent, work.titleEn);
    assert.equal(page.element('#viewer-subtitle').textContent, '');
    const card = page.element('#work-grid').innerHTML.match(new RegExp(`<article class="work-card" data-work="${id}">([\\s\\S]*?)</article>`))[1];
    assert.doesNotMatch(card, /class="card-subtitle"/);
    const korean = galleryHarness('#work=' + id);
    assert.equal(korean.element('#viewer-subtitle').textContent, work.subtitle);
  }
});
