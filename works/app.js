(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const byId = new Map(data.works.map(work => [work.id, work]));
  const seriesByFilm = new Map((data.series || []).flatMap(series => series.works.map(id => [id, series])));
  const works = data.order.map(id => byId.get(id)).filter(work => work && (!seriesByFilm.has(work.id) || seriesByFilm.get(work.id).id === work.id));
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const number = index => String(index + 1).padStart(2, '0');
  const duration = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const pageLocale = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'ko';
  const ui = {
    ko: {
      skip: '작품 목록으로 건너뛰기', home: 'DEXA 홈페이지', navigation: '주요 메뉴',
      works: '작품', artist: '작가', collaboration: '협업', pageLanguage: '페이지 언어',
      openingTitle: '빛과 소리로<br>남은 움직임.', openingAside: '보이지 않는 힘이<br>하나의 장면이 되는 순간.',
      featured: '대표 작품', watch: '전체 영상 보기', collection: '작품 모음',
      collectionHint: '장면을 선택해 전체 영상을 감상하세요.', filters: '작품 분류',
      all: '전체', confluence: '합류', individual: '개별 작품',
      collectionContext: '표기된 재생 시간은 현재 감상용 파일 기준입니다. 작품은 전시·상영 환경에 맞춰 조정하거나 확장할 수 있습니다.',
      alternateBio: 'Artist bio in English', visit: 'DEXA 방문 <span aria-hidden="true">↗</span>',
      collaborationTitle: '화면 너머의 공간으로.',
      collaborationBody: 'AI를 활용한 아나모픽 영상 제작과 커브드 스크린에 맞춘 출력을 돕는 제작 도구입니다. 미디어월 파일럿, 아티스트 워크숍, 스크린 사양에 맞춘 작품 제작을 함께 논의합니다.',
      demo: '소개와 데모 보기 <span aria-hidden="true">↗</span>', demoAria: 'Anamorphic Sim 소개와 데모 새 창에서 보기', demoAlt: 'Anamorphic Sim의 아나모픽 제작 화면',
      contactTitle: '작품과 공간이 만날 때.', contactBody: '작품 검토와 전시·제작 협업 문의',
      materials: '전시·상영 자료 문의 <span aria-hidden="true">↗</span>',
      close: '닫기 <span aria-hidden="true">×</span>', closeAria: '작품 닫기', previous: '이전 작품', next: '다음 작품',
      error: '영상을 불러오지 못했습니다. 아래 프리뷰 다운로드로 확인해 주세요.', descriptionLanguage: '작품 설명 언어',
      downloadPreview: '프리뷰 다운로드 <span aria-hidden="true">↓</span>', downloadPoster: '작품 이미지 다운로드 <span aria-hidden="true">↓</span>',
      resolution: '원본 해상도', frameRate: '프레임', duration: '재생 시간', sound: '사운드', repeat: '반복',
      withSound: '사운드 포함', silent: '무음', seamless: '심리스 루프', nonSeamless: '비심리스',
      view: title => `${title} 전체 영상 보기`, play: title => `${title} 전체 영상 재생`,
      still: title => `${title} 작품 장면`, video: (title, sound) => `${title} 전체 영상, ${sound ? '사운드 포함' : '무음'}`,
      seriesCount: count => `연작 · ${count}편`, seriesSelect: title => `${title} 영상 선택`, filmPlay: title => `${title} 재생`
    },
    en: {
      skip: 'Skip to works', home: 'DEXA home', navigation: 'Main navigation',
      works: 'Works', artist: 'Artist', collaboration: 'Collaboration', pageLanguage: 'Page language',
      openingTitle: 'Motion held<br>in light and sound.', openingAside: 'When invisible forces<br>become a scene.',
      featured: 'Featured work', watch: 'Watch full film', collection: 'Works',
      collectionHint: 'Select a scene to watch the full film.', filters: 'Filter works',
      all: 'All', confluence: 'Confluence', individual: 'Individual works',
      collectionContext: 'Durations describe the current preview files. Works can be adapted or extended for exhibition and screening environments.',
      alternateBio: 'Artist bio in Korean', visit: 'Visit DEXA <span aria-hidden="true">↗</span>',
      collaborationTitle: 'Beyond the screen.',
      collaborationBody: 'Anamorphic Sim is a production tool for creating anamorphic video with AI and preparing output for curved screens. Get in touch about media wall pilots, artist workshops and work adapted to your screen specifications.',
      demo: 'Explore the tool and demo <span aria-hidden="true">↗</span>', demoAria: 'Explore Anamorphic Sim and its demo in a new tab', demoAlt: 'Anamorphic Sim production interface',
      contactTitle: 'When works meet spaces.', contactBody: 'Artwork review, exhibitions and production collaborations',
      materials: 'Request exhibition and screening materials <span aria-hidden="true">↗</span>',
      close: 'Close <span aria-hidden="true">×</span>', closeAria: 'Close artwork', previous: 'Previous work', next: 'Next work',
      error: 'The video could not be loaded. Use the preview download below to watch it.', descriptionLanguage: 'Artwork description language',
      downloadPreview: 'Download preview <span aria-hidden="true">↓</span>', downloadPoster: 'Download artwork image <span aria-hidden="true">↓</span>',
      resolution: 'Resolution', frameRate: 'Frame rate', duration: 'Preview duration', sound: 'Sound', repeat: 'Repeat',
      withSound: 'With sound', silent: 'Silent', seamless: 'Seamless loop', nonSeamless: 'Non-seamless',
      view: title => `Watch ${title} in full`, play: title => `Play ${title} in full`,
      still: title => `Still from ${title}`, video: (title, sound) => `${title}, full film, ${sound ? 'with sound' : 'silent'}`,
      seriesCount: count => `Series · ${count} films`, seriesSelect: title => `Select a film from ${title}`, filmPlay: title => `Play ${title}`
    }
  };
  const copy = ui[pageLocale];
  const localized = (work, key) => pageLocale === 'en' ? work[`${key}En`] : work[key];
  const subtitle = work => pageLocale === 'en' && work.titleEn.toLowerCase().endsWith(work.subtitleEn.toLowerCase()) ? '' : localized(work, 'subtitle');
  const secondaryTitle = work => pageLocale === 'en' ? work.title : work.titleEn;
  const secondaryLocale = pageLocale === 'en' ? 'ko' : 'en';
  const dialog = $('#viewer');
  const video = $('#viewer-video');
  const videoSource = $('#viewer-video-source');
  let visibleWorks = works;
  let currentWork = null;
  let descriptionLanguage = pageLocale;
  let previousFocus = null;
  let previousHash = '';

  document.documentElement.lang = pageLocale;
  document.querySelectorAll('[data-copy]').forEach(element => { element.innerHTML = copy[element.dataset.copy]; });
  document.querySelectorAll('[data-copy-aria]').forEach(element => { element.setAttribute('aria-label', copy[element.dataset.copyAria]); });
  document.querySelectorAll('[data-copy-alt]').forEach(element => { element.alt = copy[element.dataset.copyAlt]; });

  function updateLanguageLinks() {
    document.querySelectorAll('[data-page-language]').forEach(link => {
      const query = new URLSearchParams(location.search);
      if (link.dataset.pageLanguage === 'en') query.set('lang', 'en');
      else query.delete('lang');
      link.href = `${location.pathname}${query.size ? `?${query}` : ''}${location.hash}`;
      link.setAttribute('aria-current', link.dataset.pageLanguage === pageLocale ? 'page' : 'false');
    });
  }

  if (pageLocale === 'en') {
    const canonical = 'https://dexa.art/works/?lang=en';
    const title = `Media art works | ${data.artist.nameEn} · DEXA`;
    const description = `Explore ${works.length} media artworks and ${data.works.length} films by ${data.artist.nameEn}, including Ink Breath, Gyeol and Harmonograph. Contact the artist about exhibitions, screenings and production collaborations.`;
    document.title = title;
    $('link[rel="canonical"]').href = canonical;
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) $(selector).setAttribute('content', title);
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) $(selector).setAttribute('content', description);
    $('meta[property="og:locale"]').setAttribute('content', 'en_US');
    $('meta[property="og:url"]').setAttribute('content', canonical);
    $('meta[property="og:image:alt"]').setAttribute('content', copy.still(localized(byId.get(data.featured) || works[0], 'title')));
    const schema = JSON.parse($('script[type="application/ld+json"]').textContent);
    const person = schema['@graph'].find(item => item['@type'] === 'Person');
    person.name = data.artist.nameEn;
    person.description = data.artist.bioEn;
    const collection = schema['@graph'].find(item => item['@type'] === 'CollectionPage');
    Object.assign(collection, { '@id': canonical, url: canonical, name: title, description, inLanguage: 'en' });
    for (const { item } of collection.mainEntity.itemListElement) {
      const work = byId.get(item.url.split('#work=')[1]);
      Object.assign(item, { '@id': `${canonical}#work=${work.id}`, url: `${canonical}#work=${work.id}`, name: work.titleEn, alternateName: work.title, description: work.captionEn });
    }
    $('script[type="application/ld+json"]').textContent = JSON.stringify(schema).replace(/</g, '\\u003c');
    $('.wordmark').href = '/en/';
  }

  function renderCollection(filter = 'all') {
    visibleWorks = works.filter(work => filter === 'all' || work.group === filter);
    $('#filter-count').textContent = `${String(visibleWorks.length).padStart(2, '0')} WORKS`;
    $('#work-grid').innerHTML = visibleWorks.map(work => `
      <article class="work-card" data-work="${escape(work.id)}">
        <button type="button" class="card-image" data-open="${escape(work.id)}" aria-label="${escape(copy.view(localized(work, 'title')))}">
          <img src="${escape(work.poster)}" width="1920" height="640" alt="${escape(copy.still(localized(work, 'title')))}" loading="lazy" decoding="async">
          <span class="card-play" aria-hidden="true">▶</span>
        </button>
        <div class="card-info"><span class="card-index">${number(works.indexOf(work))}</span><div>
          <h3><button type="button" class="card-title" data-open="${escape(work.id)}">${escape(localized(work, 'title'))}${subtitle(work) ? `<span class="card-subtitle">${escape(subtitle(work))}</span>` : ''}</button></h3>
          <p class="work-english" lang="${secondaryLocale}">${escape(secondaryTitle(work))}</p>
        </div><div class="card-spec">${seriesByFilm.has(work.id) ? copy.seriesCount(seriesByFilm.get(work.id).works.length) : duration(work.duration)}<br>${work.sound ? 'Sound' : 'Silent'}${work.loop ? ' · Loop' : ''}</div></div>
      </article>`).join('');
    document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  }

  const featured = byId.get(data.featured) || works[0];
  $('#featured').innerHTML = `
    <button type="button" class="featured-image" data-open="${escape(featured.id)}" aria-label="${escape(copy.play(localized(featured, 'title')))}">
      <img src="${escape(featured.poster)}" width="1920" height="640" alt="${escape(copy.still(localized(featured, 'title')))}" fetchpriority="high">
      <span class="featured-play"><span class="play-icon" aria-hidden="true">▶</span> ${copy.watch}</span>
      <span class="image-corner">${duration(featured.duration)} / ${featured.resolution[0]} × ${featured.resolution[1]}</span>
    </button>
    <div class="featured-caption"><div><h2>${escape(localized(featured, 'title'))}${subtitle(featured) ? `<span>${escape(subtitle(featured))}</span>` : ''}</h2><p class="work-english" lang="${secondaryLocale}">${escape(secondaryTitle(featured))} · ${featured.year}</p></div><p>${escape(localized(featured, 'caption'))}</p></div>`;
  $('#work-count').textContent = String(works.length).padStart(2, '0');
  $('#artist-name').textContent = localized(data.artist, 'name');
  $('#artist-signature').textContent = localized(data.artist, 'name');
  $('#artist-question').textContent = localized(data.artist, 'intro');
  $('#artist-bio').textContent = localized(data.artist, 'bio');
  $('#artist-bio-en').textContent = pageLocale === 'en' ? data.artist.bio : data.artist.bioEn;
  $('#artist-bio-en').lang = secondaryLocale;
  $('#artist-picture').alt = pageLocale === 'en' ? `Portrait of ${data.artist.nameEn}` : `${data.artist.name}(DECK) 작가 프로필`;
  $('#materials-link').href = data.materialsUrl;

  function renderDescription() {
    if (!currentWork) return;
    $('#viewer-description').textContent = currentWork.description[descriptionLanguage];
    $('#viewer-description').lang = descriptionLanguage;
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === descriptionLanguage)));
  }

  function renderSeries(work) {
    const series = seriesByFilm.get(work.id);
    const selector = $('#viewer-series');
    selector.hidden = !series;
    selector.innerHTML = series ? `<p class="eyebrow">${escape(localized(series, 'title'))} · ${copy.seriesCount(series.works.length)}</p><div class="series-films" role="group" aria-label="${escape(copy.seriesSelect(localized(series, 'title')))}">${series.works.map(id => {
      const film = byId.get(id);
      return `<button type="button" class="series-film" aria-pressed="${id === work.id}" data-open="${escape(id)}" aria-label="${escape(copy.filmPlay(localized(film, 'title')))}"><img src="${escape(film.poster)}" alt="" width="1920" height="640"><span>${escape(localized(film, 'title').split(' · ')[0])}</span></button>`;
    }).join('')}</div>` : '';
  }

  function openWork(id, { autoplay = true, updateUrl = true } = {}) {
    const work = byId.get(id);
    if (!work) return;
    if (!dialog.open) {
      previousFocus = document.activeElement;
      previousHash = location.hash.startsWith('#work=') ? '' : location.hash;
    }
    video.pause();
    currentWork = work;
    $('#video-error').hidden = true;
    video.poster = work.poster;
    // Explicit MP4 type lets Safari select media served through download redirects.
    videoSource.src = work.video;
    video.load();
    video.loop = work.loop;
    video.muted = false;
    video.setAttribute('aria-label', copy.video(localized(work, 'title'), work.sound));
    $('#viewer-title').textContent = localized(work, 'title');
    $('#viewer-subtitle').textContent = subtitle(work);
    $('#viewer-english').textContent = `${secondaryTitle(work)} · ${work.year}`;
    $('#viewer-english').lang = secondaryLocale;
    const entry = byId.get(seriesByFilm.get(work.id)?.id) || work;
    $('#viewer-position').textContent = `${number(works.indexOf(entry))} / ${String(works.length).padStart(2, '0')}`;
    const fields = [
      [copy.resolution, work.resolution.join(' × ')], [copy.frameRate, `${work.fps} fps`],
      [copy.duration, duration(work.duration)], [copy.sound, work.sound ? copy.withSound : copy.silent],
      [copy.repeat, work.loop ? copy.seamless : copy.nonSeamless]
    ];
    $('#viewer-specs').innerHTML = fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('');
    $('#viewer-credits').textContent = localized(work, 'credit');
    $('#download-preview').href = work.video;
    $('#download-preview').download = `${work.id}-preview.mp4`;
    $('#download-poster').href = work.poster;
    $('#download-poster').download = `${work.id}-still.jpg`;
    renderDescription();
    renderSeries(work);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('viewer-open');
    dialog.scrollTop = 0;
    if (updateUrl) history.replaceState(null, '', `#work=${encodeURIComponent(work.id)}`);
    updateLanguageLinks();
    if (autoplay) video.play().catch(() => {}); // Native controls remain available when autoplay is blocked.
  }

  function closeWork() { if (dialog.open) dialog.close(); }
  dialog.addEventListener('close', () => {
    video.pause();
    videoSource.removeAttribute('src');
    video.load();
    currentWork = null;
    document.body.classList.remove('viewer-open');
    if (location.hash.startsWith('#work=')) history.replaceState(null, '', location.pathname + location.search + previousHash);
    updateLanguageLinks();
    if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) closeWork(); });
  $('#close-viewer').addEventListener('click', closeWork);
  function stepWork(direction) {
    if (!currentWork) return;
    const entry = byId.get(seriesByFilm.get(currentWork.id)?.id) || currentWork;
    const sequence = visibleWorks.includes(entry) ? visibleWorks : works;
    const next = (sequence.indexOf(entry) + direction + sequence.length) % sequence.length;
    openWork(sequence[next].id);
  }
  $('#previous-work').addEventListener('click', () => stepWork(-1));
  $('#next-work').addEventListener('click', () => stepWork(1));
  const showVideoError = () => { if (currentWork) $('#video-error').hidden = false; };
  video.addEventListener('error', showVideoError);
  videoSource.addEventListener('error', showVideoError);
  document.addEventListener('click', event => {
    const open = event.target.closest('[data-open]');
    if (open) {
      const fromSeries = event.target.closest('#viewer-series');
      openWork(open.dataset.open);
      if (fromSeries) $('#viewer-series [aria-pressed="true"]').focus();
    }
    const filter = event.target.closest('[data-filter]');
    if (filter) renderCollection(filter.dataset.filter);
    const languageButton = event.target.closest('[data-language]');
    if (languageButton) { descriptionLanguage = languageButton.dataset.language; renderDescription(); }
  });
  function followHash() {
    if (location.hash.startsWith('#work=')) {
      try { openWork(decodeURIComponent(location.hash.slice(6)), { autoplay: false, updateUrl: false }); } catch { /* Ignore malformed fragment. */ }
    } else if (dialog.open) closeWork();
    updateLanguageLinks();
  }
  window.addEventListener('hashchange', followHash);
  renderCollection();
  followHash();
})();
