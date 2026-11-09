import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
const root = path.resolve(import.meta.dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'works/works.js'), 'utf8'), context);
const catalog = context.window.PORTFOLIO;
const projects = JSON.parse(fs.readFileSync(path.join(root, 'projects.json'), 'utf8')).filter(project => project.section === 'work');
for (const project of projects) {
  if (!project.en?.title || !project.en.description || !project.en.credit || !project.en.imageAlt) {
    throw new Error(`Missing English project metadata: ${project.id}`);
  }
}
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const selected = catalog.homeFeatured.map(id => {
  const work = catalog.works.find(work => work.id === id);
  if (!work) throw new Error(`Missing homepage film: ${id}`);
  return work;
});
const byId = new Map(catalog.works.map(work => [work.id, work]));
const seriesByFilm = new Map((catalog.series || []).flatMap(series => series.works.map(id => [id, series])));
const collection = catalog.order
  .filter(id => !seriesByFilm.has(id) || seriesByFilm.get(id).id === id)
  .map(id => {
    if (!byId.has(id)) throw new Error(`Missing collection film: ${id}`);
    return byId.get(id);
  });
const featured = byId.get(catalog.featured) || collection[0];
const canonical = 'https://dexa.art/works/';
const number = index => String(index + 1).padStart(2, '0');
const duration = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

function filmSchema(work) {
  return {
    '@type': 'CreativeWork',
    '@id': `${canonical}#work=${encodeURIComponent(work.id)}`,
    url: `${canonical}#work=${encodeURIComponent(work.id)}`,
    name: work.title,
    alternateName: work.titleEn,
    description: work.caption,
    image: new URL(work.poster, canonical).href,
    creator: { '@id': `${canonical}#artist` }
  };
}

function galleryMetadata() {
  const title = '미디어아트 작품 | 육대근(DECK) · DEXA';
  const description = `육대근(DECK)의 미디어아트 영상 ${catalog.works.length}편과 전시·프로젝트 ${projects.length}개. 먹의 호흡, 결, 하모노그래프와 전시·설치·페스티벌 프로젝트를 살펴보고 협업을 문의하세요.`;
  const image = new URL(featured.poster, canonical).href;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person', '@id': `${canonical}#artist`,
        name: catalog.artist.name, alternateName: catalog.artist.alias,
        url: 'https://dexa.art/about-deck.html', description: catalog.artist.bio
      },
      {
        '@type': 'CollectionPage', '@id': canonical, url: canonical,
        name: title, description, inLanguage: 'ko-KR',
        publisher: { '@id': 'https://dexa.art/#organization' },
        mainEntity: {
          '@type': 'ItemList', numberOfItems: collection.length,
          itemListElement: collection.map((work, index) => {
            const item = filmSchema(work);
            const parts = seriesByFilm.get(work.id)?.works.filter(id => id !== work.id);
            if (parts?.length) item.hasPart = parts.map(id => {
              if (!byId.has(id)) throw new Error(`Missing series film: ${id}`);
              return filmSchema(byId.get(id));
            });
            return { '@type': 'ListItem', position: index + 1, item };
          })
        }
      }
    ]
  };
  return `<title>${esc(title)}</title>
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="ko" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${canonical}?lang=en">
  <link rel="alternate" hreflang="x-default" href="${canonical}">
  <meta name="description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="DEXA">
  <meta property="og:locale" content="ko_KR">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${esc(image)}">
  <meta property="og:image:alt" content="${esc(featured.title)} 작품 장면">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(image)}">
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
}

function galleryCard(work, index) {
  return `<article class="work-card" data-work="${esc(work.id)}">
          <a class="card-image" href="${esc(work.video)}" aria-label="${esc(work.title)} 전체 영상 보기">
            <img src="${esc(work.poster)}" width="1920" height="640" alt="${esc(work.title)} 작품 장면" loading="lazy" decoding="async">
            <span class="card-play" aria-hidden="true">▶</span>
          </a>
          <div class="card-info"><span class="card-index">${number(index)}</span><div>
            <h3><a class="card-title" href="${esc(work.video)}">${esc(work.title)}<span class="card-subtitle">${esc(work.subtitle)}</span></a></h3>
            <p class="work-english" lang="en">${esc(work.titleEn)}</p>
          </div><div class="card-spec">${seriesByFilm.has(work.id) ? `연작 · ${seriesByFilm.get(work.id).works.length}편` : duration(work.duration)}<br>${work.sound ? 'Sound' : 'Silent'}${work.loop ? ' · Loop' : ''}</div></div>
        </article>`;
}

function projectCard(project, index, locale, homepage = false) {
  const en = locale === 'en';
  const title = esc(en ? project.en.title : project.title);
  const image = esc(`/${project.image}`);
  const imageLabel = en ? `View full image of ${title}` : `${title} 이미지 크게 보기`;
  const alt = esc(en ? project.en.imageAlt : `${project.title} 프로젝트 이미지`);
  const links = (project.links || []).map(link => `<a class="text-link" href="${esc(link.url)}">${esc(link.label)} <span aria-hidden="true">↗</span></a>`).join('');
  return `<article class="work-card project-card${homepage && index === 0 ? ' featured' : ''}" data-project="${esc(project.id)}"><a class="${homepage ? 'work-image' : 'project-image'}" href="${image}" aria-label="${imageLabel}"><img src="${image}" alt="${alt}" loading="lazy" decoding="async"></a><div class="${homepage ? 'work-copy' : 'project-copy'}"><p class="eyebrow" lang="en">${number(index)} / ${esc(project.category)}</p><h3>${title}</h3><p>${esc(en ? project.en.description : project.description)}</p>${en ? `<p class="${homepage ? 'credit' : 'project-credit'}">${esc(project.en.credit)}</p>` : ''}${links}</div></article>`;
}

function replaceBlock(html, name, content) {
  const start = `<!-- ${name}:START -->`;
  const end = `<!-- ${name}:END -->`;
  if (html.split(start).length !== 2 || html.split(end).length !== 2 || html.indexOf(start) >= html.indexOf(end)) {
    throw new Error(`Missing or ambiguous generated block: ${name}`);
  }
  return html.replace(new RegExp(`${start}[\\s\\S]*?${end}`), () => `${start}\n  ${content}\n  ${end}`);
}

function galleryPage(html) {
  html = replaceBlock(html, 'PORTFOLIO_SEO', galleryMetadata());
  html = replaceBlock(html, 'PORTFOLIO_SECTIONS', `<nav class="portfolio-sections" aria-label="포트폴리오 섹션" data-copy-aria="portfolioSections"><a href="#works"><span data-copy="films">영상 작품</span><span class="mono">${number(catalog.works.length - 1)}</span></a><a href="#projects"><span data-copy="projects">전시·프로젝트</span><span class="mono">${number(projects.length - 1)}</span></a></nav>`);
  html = replaceBlock(html, 'PORTFOLIO_FEATURED', `<section id="featured" class="featured" aria-label="대표 작품" data-copy-aria="featured">
        <a class="featured-image" href="${esc(featured.video)}" aria-label="${esc(featured.title)} 전체 영상 재생">
          <img src="${esc(featured.poster)}" width="1920" height="640" alt="${esc(featured.title)} 작품 장면" fetchpriority="high">
          <span class="featured-play"><span class="play-icon" aria-hidden="true">▶</span> 전체 영상 보기</span>
          <span class="image-corner">${duration(featured.duration)} / ${featured.resolution.join(' × ')}</span>
        </a>
        <div class="featured-caption"><div><h2>${esc(featured.title)}<span>${esc(featured.subtitle)}</span></h2><p class="work-english" lang="en">${esc(featured.titleEn)} · ${featured.year}</p></div><p>${esc(featured.caption)}</p></div>
      </section>`);
  html = replaceBlock(html, 'PORTFOLIO_COLLECTION', `<div id="work-grid" class="work-grid">\n        ${collection.map(galleryCard).join('\n        ')}\n        </div>`);
  html = replaceBlock(html, 'PORTFOLIO_PROJECTS', `<section id="projects" class="projects-section" aria-labelledby="projects-title" data-project-count="${projects.length}">
        <div class="section-heading"><div><p class="eyebrow">EXHIBITIONS &amp; PROJECTS</p><h2 id="projects-title"><span data-copy="projects">전시·프로젝트</span> <sup>${number(projects.length - 1)}</sup></h2></div><p class="section-note" data-copy="projectsHint">전시, 설치, 페스티벌과 오디오비주얼 작업.</p></div>
        <div id="project-grid" class="project-grid">\n          ${projects.map((project, index) => projectCard(project, index, 'ko')).join('\n          ')}\n        </div>
        <template id="projects-en">\n          ${projects.map((project, index) => projectCard(project, index, 'en')).join('\n          ')}\n        </template>
      </section>`);
  for (const [id, value] of [['work-count', number(collection.length - 1)], ['filter-count', `${number(collection.length - 1)} FILMS`], ['artist-question', catalog.artist.intro], ['artist-bio', catalog.artist.bio], ['artist-bio-en', catalog.artist.bioEn]]) {
    const element = new RegExp(`(<(?:p|sup|span)\\b[^>]*id="${id}"[^>]*>)[\\s\\S]*?(<\\/(?:p|sup|span)>)`);
    if (!element.test(html)) throw new Error(`Missing gallery field: ${id}`);
    html = html.replace(element, (_match, open, close) => `${open}${esc(value)}${close}`);
  }
  html = html.replace(/<a\b[^>]*\bid="materials-link"[^>]*>/, tag => tag.replace(/href="[^"]*"/, `href="${esc(catalog.materialsUrl)}"`));
  for (const file of ['styles.css', 'works.js', 'app.js']) {
    const hash = createHash('sha256').update(fs.readFileSync(path.join(root, 'works', file))).digest('hex').slice(0, 10);
    html = html.replace(new RegExp(`((?:src|href)="${file.replace('.', '\\.')}\\?v=)[^"]+`), `$1${hash}`);
  }
  return html;
}
function card(work, index, en) {
  const title = esc(en ? work.titleEn : work.title);
  const href = `/works/${en ? '?lang=en' : ''}#work=${encodeURIComponent(work.id)}`;
  const still = `<img src="${esc(work.poster)}" alt="${title}" width="1920" height="640" loading="lazy">`;
  const seconds = Math.round(work.duration * 10) / 10;
  if (en) {
    const description = work.description.en.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || work.description.en;
    return `<article class="work-card" data-home-film="${esc(work.id)}"><a class="work-image" href="${href}" aria-label="Watch ${title}">${still}</a><div class="work-copy"><p class="eyebrow">${String(index + 1).padStart(2, '0')} / Media art · ${work.year}</p><h3><a href="${href}">${title}</a></h3><p>${esc(description)}</p><p class="credit">Preview ${seconds} seconds · Sound · 6K original</p></div></article>`;
  }
  return `<a class="work-card film-card" data-home-film="${esc(work.id)}" href="${href}" aria-label="${title} 전체 영상 보기"><div class="frame">${still}</div><div class="caption"><span class="title">${title}</span><span class="spec"><span>${esc(work.subtitle)}</span><span>${seconds}s · Sound</span></span><p class="desc">${esc(work.caption)}</p></div></a>`;
}
let stale = false;
for (const [file, en] of [['index.html', false], ['en/index.html', true], ['works/index.html', false]]) {
  const target = path.join(root, file);
  const old = fs.readFileSync(target, 'utf8');
  const pattern = /<!-- HOME_FILMS:START -->[\s\S]*?<!-- HOME_FILMS:END -->/;
  if (file !== 'works/index.html' && !pattern.test(old)) throw new Error(`Missing homepage markers: ${file}`);
  let updated = file === 'works/index.html' ? galleryPage(old) : old.replace(pattern, () => `<!-- HOME_FILMS:START -->\n        ${selected.map((work, index) => card(work, index, en)).join('\n        ')}\n        <!-- HOME_FILMS:END -->`);
  if (en) {
    updated = replaceBlock(updated, 'HOME_PROJECTS', projects.map((project, index) => projectCard(project, index, 'en', true)).join('\n        '));
    const allWorks = /<a class="text-link portfolio-link" href="[^"]*">[\s\S]*?<\/a>/;
    if (!allWorks.test(updated)) throw new Error(`Missing all-works link: ${file}`);
    updated = updated.replace(allWorks, `<a class="text-link portfolio-link" href="/works/?lang=en">View all ${catalog.works.length} films <span aria-hidden="true">↗</span></a>`);
  }
  if (updated === old) continue;
  if (process.argv.includes('--check')) { console.error(`Stale portfolio content: ${file}`); stale = true; }
  else fs.writeFileSync(target, updated);
}
if (stale) process.exitCode = 1;
