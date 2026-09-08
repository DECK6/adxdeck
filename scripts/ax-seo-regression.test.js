'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { AX_TOPICS, validateAxTopics, axGuideHtml, axRelatedHtml } = require('../blog/ax-guide');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const posts = JSON.parse(read('blog/posts.json'));
const hub = read('blog/ax/index.html');
const changed = ['what-is-intermedia', 'ai-and-media-art', 'hermes-honcho-memory', 'hermes-petdex-mascots', 'agent-knowledge-management'];
const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));

test('AX curation covers five work topics with non-Hermes AI AX articles', () => {
    assert.equal(AX_TOPICS.length, 5);
    assert.equal(new Set(AX_TOPICS.map(t => t.id)).size, 5);
    const bySlug = validateAxTopics(posts);
    for (const slug of AX_TOPICS.flatMap(t => t.slugs)) {
        assert.equal(bySlug.get(slug).track, 'ai-ax');
        assert.doesNotMatch(bySlug.get(slug).title, /Hermes|허미스|헤르메스/i);
        assert.ok(fs.existsSync(path.join(root, 'blog/posts', slug, 'index.html')));
    }
});

test('missing or wrong-track curated article stops generation', () => {
    const slug = AX_TOPICS[0].slugs[0];
    assert.throws(() => validateAxTopics(posts.filter(p => p.slug !== slug)), /Missing AI/);
    assert.throws(() => validateAxTopics(posts.map(p => p.slug === slug ? { ...p, track: 'media-art' } : p)), /Missing AI/);
});

test('AX guide has one H1, canonical URL, valid schema and static links', () => {
    assert.equal((hub.match(/<h1\b/g) || []).length, 1);
    assert.match(hub, /<html lang="ko">/);
    assert.match(hub, /rel="canonical" href="https:\/\/dexa.art\/blog\/ax\/"/);
    const schema = schemas(hub)[0];
    assert.equal(schema['@type'], 'CollectionPage');
    assert.equal(schema.mainEntity.itemListElement.length, new Set(AX_TOPICS.flatMap(t => t.slugs)).size);
    for (const topic of AX_TOPICS) {
        assert.ok(hub.includes(`id="${topic.id}"`));
        for (const slug of topic.slugs) assert.ok(hub.includes(`href="/blog/posts/${slug}/"`));
    }
    assert.ok(read('sitemap.xml').includes('<loc>https://dexa.art/blog/ax/</loc>'));
});

test('AX rendering escapes article metadata and stays deterministic', () => {
    const fixture = posts.map(p => ({ ...p, title: p.title + '<script>bad</script>', description: '"<& test' }));
    const html = axGuideHtml(fixture, { nav: '', footer: '' });
    assert.doesNotMatch(html, /<script>bad<\/script>/);
    assert.ok(html.includes('&lt;script&gt;bad&lt;/script&gt;'));
    schemas(html);
    assert.equal(html, axGuideHtml(fixture, { nav: '', footer: '' }));
});

test('home and blog introduce the AX guide without removing legacy track filtering', () => {
    for (const file of ['index.html', 'blog/index.html']) assert.ok(read(file).includes('href="/blog/ax/"'));
    assert.ok(read('blog/index.html').includes('data-filter="ai-ax"'));
    assert.ok(hub.includes('href="/blog/?track=ai-ax"'));
    assert.doesNotMatch(read('blog/index.html').match(/<meta name="description"[^>]+>/)[0], /Hermes|허미스/i);
});

test('AI AX articles link to the guide; Media Art is not reclassified', () => {
    for (const post of posts) {
        const html = read(`blog/posts/${post.slug}/index.html`);
        if (post.track === 'ai-ax') assert.ok(html.includes('aria-label="AX 실무 읽기 안내"'), post.slug);
        else assert.ok(!html.includes('aria-label="AX 실무 읽기 안내"'), post.slug);
    }
    assert.equal(axRelatedHtml({ track: 'media-art' }), '');
    assert.deepEqual([...new Set(posts.map(p => p.track))].sort(), ['ai-ax', 'media-art']);
});

test('edited article descriptions are complete Korean and corrected text is retained', () => {
    for (const slug of changed) {
        const post = posts.find(p => p.slug === slug);
        assert.ok(post, slug);
        assert.match(post.description, /[가-힣]/);
        assert.doesNotMatch(post.description, /\.\.\.$|[\u0900-\u097f]/);
        const html = read(`blog/posts/${slug}/index.html`);
        assert.equal((html.match(/<h1\b/g) || []).length, 1);
        assert.doesNotMatch(html, /[\u0900-\u097f]/);
        assert.ok(html.includes(`https://dexa.art/blog/posts/${slug}/`));
    }
    const akm = read('blog/posts/_built/agent-knowledge-management.md');
    assert.doesNotMatch(akm, /00-system\/(?:ROUTER|LOOP)\.md|series: hermes-notes/);
    assert.match(akm, /99-system\/ROUTER\.md/);
});

test('publication dates stay distinct from actual modification dates and sitemap agrees', () => {
    const sitemap = read('sitemap.xml');
    for (const post of posts) {
        assert.match(post.modified, /^\d{4}-\d{2}-\d{2}$/);
        assert.ok(post.modified >= post.date);
        const article = schemas(read(`blog/posts/${post.slug}/index.html`)).find(x => x['@type'] === 'Article');
        assert.equal(article.datePublished, post.date);
        assert.equal(article.dateModified, post.modified);
        assert.ok(sitemap.includes(`<loc>https://dexa.art/blog/posts/${post.slug}/</loc>\n    <lastmod>${post.modified}</lastmod>`));
    }
    for (const slug of changed) assert.ok(posts.find(p => p.slug === slug).modified > posts.find(p => p.slug === slug).date);
});

test('local href targets and page anchors on the AX guide exist', () => {
    for (const [, href] of hub.matchAll(/href="([^"?]+)(?:\?[^"#]*)?"/g)) {
        if (/^(https?:|mailto:)/.test(href)) continue;
        const [pathname, anchor] = href.split('#');
        const file = pathname ? path.join(root, pathname, pathname.endsWith('/') ? 'index.html' : '') : path.join(root, 'blog/ax/index.html');
        assert.ok(fs.existsSync(file), href);
        if (anchor) assert.ok(fs.readFileSync(file, 'utf8').includes(`id="${anchor}"`), href);
    }
});

test('build has no destructive regeneration and CI tracks the AX generator', () => {
    assert.doesNotMatch(read('blog/build.js'), /fs\.(?:unlinkSync|rmSync)\(/);
    assert.ok(read('.github/workflows/blog-build.yml').includes("'blog/ax-guide.js'"));
    assert.ok(read('.github/workflows/blog-build.yml').includes('git add blog/ax/'));
});
