import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root = path.resolve(import.meta.dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'works/works.js'), 'utf8'), context);
const catalog = context.window.PORTFOLIO;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const selected = catalog.homeFeatured.map(id => {
  const work = catalog.works.find(work => work.id === id);
  if (!work) throw new Error(`Missing homepage film: ${id}`);
  return work;
});
function card(work, index, en) {
  const title = esc(en ? work.titleEn : work.title);
  const href = `/works/${en ? '?lang=en' : ''}#work=${encodeURIComponent(work.id)}`;
  const still = `<img src="${esc(work.poster)}" alt="${title}" width="1920" height="640" loading="lazy">`;
  const seconds = Math.round(work.duration * 10) / 10;
  if (en) {
    const description = work.description.en.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || work.description.en;
    return `<article class="work-card" data-home-film="${esc(work.id)}"><a class="work-image" href="${href}" aria-label="Watch ${title}">${still}</a><div class="work-copy"><p class="eyebrow">${String(index + 1).padStart(2, '0')} / Media art · ${work.year}</p><h3><a href="${href}">${title}</a></h3><p>${esc(description)}</p><p class="credit">${seconds} seconds · Sound · 6K original</p></div></article>`;
  }
  return `<a class="work-card film-card" data-home-film="${esc(work.id)}" href="${href}" aria-label="${title} 전체 영상 보기"><div class="frame">${still}</div><div class="caption"><span class="title">${title}</span><span class="spec"><span>${esc(work.subtitle)}</span><span>${seconds}s · Sound</span></span><p class="desc">${esc(work.caption)}</p></div></a>`;
}
let stale = false;
for (const [file, en] of [['index.html', false], ['en/index.html', true]]) {
  const target = path.join(root, file);
  const old = fs.readFileSync(target, 'utf8');
  const pattern = /<!-- HOME_FILMS:START -->[\s\S]*?<!-- HOME_FILMS:END -->/;
  if (!pattern.test(old)) throw new Error(`Missing homepage markers: ${file}`);
  const updated = old.replace(pattern, () => `<!-- HOME_FILMS:START -->\n        ${selected.map((work, index) => card(work, index, en)).join('\n        ')}\n        <!-- HOME_FILMS:END -->`);
  if (updated === old) continue;
  if (process.argv.includes('--check')) { console.error(`Stale homepage films: ${file}`); stale = true; }
  else fs.writeFileSync(target, updated);
}
if (stale) process.exitCode = 1;
