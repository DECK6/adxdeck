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
  const dialog = $('#viewer');
  const video = $('#viewer-video');
  const videoSource = $('#viewer-video-source');
  let visibleWorks = works;
  let currentWork = null;
  let language = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'ko';
  let previousFocus = null;
  let previousHash = '';

  function renderCollection(filter = 'all') {
    visibleWorks = works.filter(work => filter === 'all' || work.group === filter);
    $('#filter-count').textContent = `${String(visibleWorks.length).padStart(2, '0')} WORKS`;
    $('#work-grid').innerHTML = visibleWorks.map(work => `
      <article class="work-card" data-work="${escape(work.id)}">
        <button type="button" class="card-image" data-open="${escape(work.id)}" aria-label="${escape(work.title)} 전체 영상 보기">
          <img src="${escape(work.poster)}" width="1920" height="640" alt="${escape(work.title)} 작품 장면" loading="lazy" decoding="async">
          <span class="card-play" aria-hidden="true">▶</span>
        </button>
        <div class="card-info"><span class="card-index">${number(works.indexOf(work))}</span><div>
          <h3><button type="button" class="card-title" data-open="${escape(work.id)}">${escape(work.title)}<span class="card-subtitle">${escape(work.subtitle)}</span></button></h3>
          <p class="work-english" lang="en">${escape(work.titleEn)}</p>
        </div><div class="card-spec">${seriesByFilm.has(work.id) ? `연작 · ${seriesByFilm.get(work.id).works.length}편` : duration(work.duration)}<br>${work.sound ? 'Sound' : 'Silent'}${work.loop ? ' · Loop' : ''}</div></div>
      </article>`).join('');
    document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  }

  const featured = byId.get(data.featured) || works[0];
  $('#featured').innerHTML = `
    <button type="button" class="featured-image" data-open="${escape(featured.id)}" aria-label="${escape(featured.title)} 전체 영상 재생">
      <img src="${escape(featured.poster)}" width="1920" height="640" alt="${escape(featured.title)} 작품 장면" fetchpriority="high">
      <span class="featured-play"><span class="play-icon" aria-hidden="true">▶</span> 전체 영상 보기</span>
      <span class="image-corner">${duration(featured.duration)} / ${featured.resolution[0]} × ${featured.resolution[1]}</span>
    </button>
    <div class="featured-caption"><div><h2>${escape(featured.title)}<span>${escape(featured.subtitle)}</span></h2><p class="work-english" lang="en">${escape(featured.titleEn)} · ${featured.year}</p></div><p>${escape(featured.caption)}</p></div>`;
  $('#work-count').textContent = String(works.length).padStart(2, '0');
  $('#artist-question').textContent = data.artist.intro;
  $('#artist-bio').textContent = data.artist.bio;
  $('#artist-bio-en').textContent = data.artist.bioEn;
  $('#materials-link').href = data.materialsUrl;

  function renderDescription() {
    if (!currentWork) return;
    $('#viewer-description').textContent = currentWork.description[language];
    $('#viewer-description').lang = language;
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  }

  function renderSeries(work) {
    const series = seriesByFilm.get(work.id);
    const selector = $('#viewer-series');
    selector.hidden = !series;
    selector.innerHTML = series ? `<p class="eyebrow">${escape(series.title)} · ${series.works.length}편</p><div class="series-films" role="group" aria-label="${escape(series.title)} 영상 선택">${series.works.map(id => {
      const film = byId.get(id);
      return `<button type="button" class="series-film" aria-pressed="${id === work.id}" data-open="${escape(id)}" aria-label="${escape(film.title)} 재생"><img src="${escape(film.poster)}" alt="" width="1920" height="640"><span>${escape(film.title.split(' · ')[0])}</span></button>`;
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
    video.setAttribute('aria-label', `${work.title} 전체 영상${work.sound ? ', 사운드 포함' : ', 무음'}`);
    $('#viewer-title').textContent = work.title;
    $('#viewer-subtitle').textContent = work.subtitle;
    $('#viewer-english').textContent = `${work.titleEn} · ${work.year}`;
    const entry = byId.get(seriesByFilm.get(work.id)?.id) || work;
    $('#viewer-position').textContent = `${number(works.indexOf(entry))} / ${String(works.length).padStart(2, '0')}`;
    const fields = [
      ['원본 해상도', work.resolution.join(' × ')], ['프레임', `${work.fps} fps`],
      ['재생 시간', duration(work.duration)], ['사운드', work.sound ? '사운드 포함' : '무음'],
      ['반복', work.loop ? '심리스 루프' : '비심리스']
    ];
    $('#viewer-specs').innerHTML = fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('');
    $('#viewer-credits').textContent = work.credit;
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
    if (languageButton) { language = languageButton.dataset.language; renderDescription(); }
  });
  function followHash() {
    if (location.hash.startsWith('#work=')) {
      try { openWork(decodeURIComponent(location.hash.slice(6)), { autoplay: false, updateUrl: false }); } catch { /* Ignore malformed fragment. */ }
    } else if (dialog.open) closeWork();
  }
  window.addEventListener('hashchange', followHash);
  renderCollection();
  followHash();
})();
