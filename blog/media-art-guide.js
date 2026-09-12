'use strict';

const EXPECTED_CATEGORIES = Object.freeze([
    Object.freeze({ slug: 'intro-concepts', label: '입문·개념' }),
    Object.freeze({ slug: 'artists-artworks', label: '작가·작품' }),
    Object.freeze({ slug: 'senses-forms', label: '감각·형식' }),
    Object.freeze({ slug: 'technology-making', label: '기술·제작' }),
    Object.freeze({ slug: 'society-power', label: '사회·권력' }),
    Object.freeze({ slug: 'institutions-infrastructure', label: '제도·인프라' })
]);

const STARTER_SLUGS = Object.freeze([
    'media-art-is-not-the-name-of-a-technology',
    'park-hyunki-and-the-material-weight-of-video',
    'laura-u-marks-and-haptic-visuality',
    'the-surface-is-the-first-medium',
    'machine-vision-does-not-see-everyone-equally',
    'when-a-five-day-festival-becomes-a-year-round-ecosystem'
]);

const REPRESENTATIVE_SLUGS = Object.freeze({
    'intro-concepts': Object.freeze([
        'media-art-is-not-the-name-of-a-technology',
        'history-of-media-art',
        'history-of-korean-media-art',
        'what-is-generative-art'
    ]),
    'artists-artworks': Object.freeze([
        'park-hyunki-and-the-material-weight-of-video',
        'yunchul-kim-and-the-nervous-system-of-matter',
        'nam-june-paik-and-the-uneven-satellite-stage',
        'when-dataset-labor-becomes-the-artwork'
    ]),
    'senses-forms': Object.freeze([
        'laura-u-marks-and-haptic-visuality',
        'the-image-travels-through-compression',
        'atmospheric-aesthetics-and-the-politics-of-mood',
        'why-presence-survives-reproduction'
    ]),
    'technology-making': Object.freeze([
        'emergence-and-local-rules-in-media-art',
        'who-describes-the-generative-canvas',
        'variable-media-and-the-identity-of-artworks',
        'the-surface-is-the-first-medium'
    ]),
    'society-power': Object.freeze([
        'machine-vision-does-not-see-everyone-equally',
        'when-enjoyment-becomes-platform-value',
        'cyberfeminism-and-networked-bodies',
        'what-is-data-colonialism'
    ]),
    'institutions-infrastructure': Object.freeze([
        'experiments-in-art-and-technology-as-collaboration-infrastructure',
        'how-seoul-mediacity-biennale-turns-the-city-into-a-medium',
        'when-a-five-day-festival-becomes-a-year-round-ecosystem',
        'nicole-starosielski-and-undersea-networks'
    ])
});

const GUIDE_TITLE = '미디어아트 읽기 가이드: 개념·작품·감각·제작·권력·인프라 | DEXA';
const GUIDE_DESCRIPTION = 'DEXA의 미디어아트 글을 입문·개념, 작가·작품, 감각·형식, 기술·제작, 사회·권력, 제도·인프라의 여섯 질문으로 읽는 독자 가이드입니다.';
const esc = value => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const postUrl = slug => `/blog/posts/${slug}/`;
const archiveUrl = slug => `/blog/?track=media-art&amp;field=${slug}`;

function categoryLookup(taxonomy) {
    if (!taxonomy || taxonomy.schemaVersion !== 1 || !Array.isArray(taxonomy.categories)) {
        throw new Error('[Media Art taxonomy] schemaVersion 1 with categories is required.');
    }
    const actual = taxonomy.categories.map(({ slug, label }) => ({ slug, label }));
    if (JSON.stringify(actual) !== JSON.stringify(EXPECTED_CATEGORIES)) {
        throw new Error('[Media Art taxonomy] The six category labels and order must remain stable.');
    }
    return new Map(taxonomy.categories.map(category => [category.slug, category]));
}

function applyMediaArtTaxonomy(posts, taxonomy) {
    const categories = categoryLookup(taxonomy);
    if (!Array.isArray(taxonomy.posts)) throw new Error('[Media Art taxonomy] posts must be an array.');

    const mapping = new Map();
    for (const row of taxonomy.posts) {
        if (!row || !row.slug || mapping.has(row.slug)) {
            throw new Error(`[Media Art taxonomy] Missing or duplicate slug: ${row && row.slug}`);
        }
        const category = categories.get(row.categorySlug);
        if (!category || category.label !== row.category) {
            throw new Error(`[Media Art taxonomy] Invalid category for ${row.slug}.`);
        }
        mapping.set(row.slug, row);
    }

    const bySlug = new Map(posts.map(post => [post.slug, post]));
    for (const row of mapping.values()) {
        const post = bySlug.get(row.slug);
        if (!post || post.track !== 'media-art') {
            throw new Error(`[Media Art taxonomy] Mapped slug is missing from the Media Art feed: ${row.slug}`);
        }
    }

    const byLabel = new Map([...categories.values()].map(category => [category.label, category]));
    for (const post of posts) {
        if (post.track !== 'media-art') continue;
        const row = mapping.get(post.slug);
        const explicit = String(post._mediaArtExplicitCategory || '').trim();
        const explicitCategory = explicit ? byLabel.get(explicit) : null;
        if (explicit && !explicitCategory) {
            throw new Error(`[Media Art taxonomy] Invalid mediaArtCategory "${explicit}" in ${post._sourceFilename}.`);
        }
        if (row && explicitCategory && row.categorySlug !== explicitCategory.slug) {
            throw new Error(`[Media Art taxonomy] Frontmatter and mapping disagree for ${post.slug}.`);
        }
        const category = row ? categories.get(row.categorySlug) : explicitCategory;
        if (!category) {
            throw new Error(`[Media Art taxonomy] Unclassified Media Art post: ${post.slug}. Add it to media-art-taxonomy.json or set one explicit mediaArtCategory value.`);
        }
        post.mediaArtCategory = category.label;
        post.mediaArtCategorySlug = category.slug;
        post.mediaArtTags = row ? [...row.secondaryTags] : [...post.tags];
    }

    const counts = Object.fromEntries([...categories.keys()].map(slug => [slug, 0]));
    posts.filter(post => post.track === 'media-art').forEach(post => { counts[post.mediaArtCategorySlug] += 1; });
    return { categories: [...categories.values()], counts, mappedCount: mapping.size };
}

function validateGuidePosts(posts, taxonomyState) {
    const bySlug = new Map(posts.map(post => [post.slug, post]));
    const required = [...new Set([...STARTER_SLUGS, ...Object.values(REPRESENTATIVE_SLUGS).flat()])];
    for (const slug of required) {
        const post = bySlug.get(slug);
        if (!post || post.track !== 'media-art') throw new Error(`[Media Art guide] Missing Media Art article: ${slug}`);
    }
    for (const category of taxonomyState.categories) {
        for (const slug of REPRESENTATIVE_SLUGS[category.slug] || []) {
            if (bySlug.get(slug).mediaArtCategorySlug !== category.slug) {
                throw new Error(`[Media Art guide] Representative article is in the wrong category: ${slug}`);
            }
        }
    }
    return bySlug;
}

function articleCard(post) {
    return `<li><a href="${postUrl(post.slug)}"><span class="ma-article-title">${esc(post.title)}</span><span class="ma-article-desc">${esc(post.description)}</span><span class="dx-more">글 읽기 →</span></a></li>`;
}

function mediaArtGuideHtml(posts, taxonomyState, shell) {
    const bySlug = validateGuidePosts(posts, taxonomyState);
    const canonical = 'https://dexa.art/blog/media-art/';
    const starterPosts = STARTER_SLUGS.map(slug => bySlug.get(slug));
    const schema = {
        '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': canonical,
        name: GUIDE_TITLE, description: GUIDE_DESCRIPTION, url: canonical, inLanguage: 'ko-KR',
        isPartOf: { '@type': 'Blog', '@id': 'https://dexa.art/blog/#blog' },
        mainEntity: { '@type': 'ItemList', itemListElement: starterPosts.map((post, index) => ({
            '@type': 'ListItem', position: index + 1, name: post.title, url: `https://dexa.art${postUrl(post.slug)}`
        })) }
    };
    const route = taxonomyState.categories.map(category =>
        `<a class="dx-tag-chip" href="#${category.slug}">${esc(category.label)} <span aria-hidden="true">${taxonomyState.counts[category.slug]}</span></a>`
    ).join('\n');
    const starter = starterPosts.map((post, index) =>
        `<li><span class="ma-step">0${index + 1}</span><a href="${postUrl(post.slug)}"><strong>${esc(post.mediaArtCategory)}</strong><span>${esc(post.title)}</span></a></li>`
    ).join('\n');
    const sections = taxonomyState.categories.map((category, index) => {
        const readings = REPRESENTATIVE_SLUGS[category.slug].map(slug => articleCard(bySlug.get(slug))).join('\n');
        return `<section class="ma-topic" id="${category.slug}" aria-labelledby="${category.slug}-title">
        <div class="ma-topic-intro">
            <span class="dx-kicker">0${index + 1} / ${taxonomyState.counts[category.slug]} ARTICLES</span>
            <h2 id="${category.slug}-title">${esc(category.label)}</h2>
            <h3>${esc(category.question)}</h3>
            <p>${esc(category.purpose)}</p>
            <a class="btn-ghost ma-all-link" href="${archiveUrl(category.slug)}">${esc(category.label)} 전체 ${taxonomyState.counts[category.slug]}편 보기 →</a>
        </div>
        <ul class="ma-reading-list">${readings}</ul>
    </section>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(GUIDE_TITLE)}</title>
    <meta name="description" content="${esc(GUIDE_DESCRIPTION)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(GUIDE_TITLE)}" />
    <meta property="og:description" content="${esc(GUIDE_DESCRIPTION)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="https://dexa.art/og-image.jpg" />
    <meta property="og:site_name" content="DEXA" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(GUIDE_TITLE)}" />
    <meta name="twitter:description" content="${esc(GUIDE_DESCRIPTION)}" />
    <meta name="twitter:image" content="https://dexa.art/og-image.jpg" />
    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
    <link rel="stylesheet" href="/dexa-theme.css" />
    <style>
        .ma-guide{padding-top:128px;overflow-wrap:anywhere;}
        .ma-guide h1{font-size:clamp(36px,5vw,64px);line-height:1.15;letter-spacing:-.04em;margin:20px 0;max-width:980px;}
        .ma-guide h1 span{color:var(--orange);}
        .ma-summary{max-width:880px;font-size:18px;line-height:1.8;color:var(--muted);}
        .ma-route{display:flex;flex-wrap:wrap;gap:10px;margin:30px 0 48px;}
        .ma-route a{padding:10px 14px;}
        .ma-start{border-left:3px solid var(--orange);padding:4px 24px;margin:36px 0 64px;max-width:980px;}
        .ma-start h2{font-size:24px;margin:0 0 12px;}
        .ma-start>p{color:var(--muted);line-height:1.8;}
        .ma-start-list{list-style:none;margin:24px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
        .ma-start-list li{display:flex;min-width:0;border-top:1px solid var(--line);padding:14px 0;gap:12px;}
        .ma-step{font:600 11px/1.5 'JetBrains Mono',monospace;color:var(--orange);flex:0 0 auto;}
        .ma-start-list a{display:flex;flex-direction:column;gap:5px;min-width:0;}
        .ma-start-list strong{font:600 11px/1.4 'JetBrains Mono',monospace;color:var(--muted);}
        .ma-start-list a span{font-weight:650;line-height:1.5;}
        .ma-topic{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:48px;padding:48px 0;border-top:1px solid var(--line);scroll-margin-top:90px;}
        .ma-topic h2{font-size:clamp(26px,3vw,36px);margin:12px 0 20px;letter-spacing:-.03em;}
        .ma-topic h3{font-size:18px;line-height:1.65;}
        .ma-topic-intro p{color:var(--muted);line-height:1.8;font-size:15px;}
        .ma-all-link{display:inline-flex;margin-top:14px;}
        .ma-reading-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}
        .ma-reading-list a{display:flex;flex-direction:column;gap:12px;padding:22px;border:1px solid var(--line);background:var(--paper);height:100%;}
        .ma-reading-list a:hover{background:var(--panel);border-color:var(--orange);}
        .ma-article-title{font-weight:650;font-size:17px;line-height:1.5;}
        .ma-article-desc{color:var(--muted);font-size:13px;line-height:1.7;}
        .ma-next{margin-top:32px;padding:32px;border:1px solid var(--line);background:var(--panel);}
        .ma-next p{line-height:1.8;color:var(--muted);max-width:850px;}
        .ma-next-links{display:flex;flex-wrap:wrap;gap:12px;}
        .ma-guide a:focus-visible{outline:2px solid var(--orange);outline-offset:4px;}
        @media(max-width:768px){.ma-topic{grid-template-columns:1fr;gap:22px;}.ma-guide{padding-top:104px;}.ma-summary{font-size:16px;}.ma-start{padding-left:18px;}.ma-start-list,.ma-reading-list{grid-template-columns:1fr;}.ma-next{padding:24px 20px;}}
    </style>
</head>
<body>
    <!-- SHARED_NAV_START -->
${shell.nav}
    <!-- SHARED_NAV_END -->
    <main class="dx-section ma-guide">
        <a class="btn-ghost" href="/blog/">← DEXA Blog</a>
        <p class="dx-kicker" style="margin-top:32px;">MEDIA ART / READER GUIDE</p>
        <h1>미디어아트는 기술이 아니라<span>.</span><br>감각·관계·사회를 조직하는 방법입니다</h1>
        <p class="ma-summary">미디어아트의 범위와 계보를 잡고, 작품과 작가를 만나고, 감각과 제작의 언어를 익힌 뒤 기술이 만든 권력과 생태계를 살펴봅니다. 최신순 목록은 그대로 두고, 독자가 던지는 여섯 질문을 두 번째 탐색축으로 엮었습니다.</p>
        <nav class="ma-route" aria-label="미디어아트 분야 바로가기">${route}</nav>
        <section class="ma-start" aria-labelledby="ma-start-title">
            <h2 id="ma-start-title">처음이라면 이 순서로 읽으세요</h2>
            <p>방향 잡기 → 구체 사례 → 관람 언어 → 작동 원리 → 비판적 쟁점 → 생태계의 순서입니다. 각 글을 읽은 뒤 같은 분야의 전체 목록으로 넓혀 보세요.</p>
            <ol class="ma-start-list">${starter}</ol>
        </section>
${sections}
        <section class="ma-next" aria-labelledby="ma-next-title">
            <span class="dx-kicker">KEEP EXPLORING</span>
            <h2 id="ma-next-title">최신 글과 다른 분야로 이어 읽기</h2>
            <p>한 글은 하나의 중심 분야에만 놓았지만, 인물·매체·기술·쟁점을 가로지르는 태그는 유지했습니다. 전체 목록은 최신순이며 분야 필터를 선택한 주소를 그대로 공유할 수 있습니다.</p>
            <div class="ma-next-links"><a class="btn-ghost" href="/blog/?track=media-art">미디어아트 전체 글 →</a><a class="btn-ghost" href="/blog/ax/">AX 실무 가이드 →</a></div>
        </section>
    </main>
    <!-- SHARED_FOOTER_START -->
${shell.footer}
    <!-- SHARED_FOOTER_END -->
    <script src="/blog/blog.js"></script>
</body>
</html>
`;
}

module.exports = {
    EXPECTED_CATEGORIES,
    STARTER_SLUGS,
    REPRESENTATIVE_SLUGS,
    GUIDE_TITLE,
    GUIDE_DESCRIPTION,
    applyMediaArtTaxonomy,
    validateGuidePosts,
    mediaArtGuideHtml
};
