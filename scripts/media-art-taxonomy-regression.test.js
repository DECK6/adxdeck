'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const taxonomy = require('../blog/media-art-taxonomy.json');
const {
    EXPECTED_CATEGORIES,
    REPRESENTATIVE_SLUGS,
    applyMediaArtTaxonomy,
    validateGuidePosts
} = require('../blog/media-art-guide');

const root = path.join(__dirname, '..');
const posts = JSON.parse(fs.readFileSync(path.join(root, 'blog/posts.json'), 'utf8'));
const expectedCounts = Object.freeze({
    'intro-concepts': 27,
    'artists-artworks': 29,
    'senses-forms': 16,
    'technology-making': 13,
    'society-power': 29,
    'institutions-infrastructure': 13
});

test('approved mapping covers every current Media Art post exactly once', () => {
    const working = posts.map(post => ({ ...post }));
    const state = applyMediaArtTaxonomy(working, taxonomy);
    const mediaPosts = working.filter(post => post.track === 'media-art');

    assert.equal(taxonomy.posts.length, 127);
    assert.equal(mediaPosts.length, 127);
    assert.deepEqual(
        state.categories.map(({ slug, label }) => ({ slug, label })),
        EXPECTED_CATEGORIES
    );
    assert.deepEqual(state.counts, expectedCounts);
    assert.equal(new Set(taxonomy.posts.map(row => row.slug)).size, 127);
    assert.equal(mediaPosts.filter(post => !post.mediaArtCategorySlug).length, 0);
    assert.ok(mediaPosts.every(post => Array.isArray(post.mediaArtTags)));
});

test('new Media Art posts fail closed unless explicitly classified', () => {
    const unclassified = {
        slug: 'future-unclassified-media-art-post',
        track: 'media-art',
        tags: [],
        _sourceFilename: 'future-unclassified-media-art-post.md'
    };
    assert.throws(
        () => applyMediaArtTaxonomy([...posts.map(post => ({ ...post })), unclassified], taxonomy),
        /Unclassified Media Art post/
    );

    const explicit = {
        ...unclassified,
        _mediaArtExplicitCategory: '기술·제작'
    };
    const state = applyMediaArtTaxonomy([...posts.map(post => ({ ...post })), explicit], taxonomy);
    assert.equal(state.counts['technology-making'], 14);
});

test('guide representatives exist in their approved primary categories', () => {
    const working = posts.map(post => ({ ...post }));
    const state = applyMediaArtTaxonomy(working, taxonomy);
    const bySlug = validateGuidePosts(working, state);

    for (const [categorySlug, slugs] of Object.entries(REPRESENTATIVE_SLUGS)) {
        for (const slug of slugs) assert.equal(bySlug.get(slug).mediaArtCategorySlug, categorySlug);
    }
});

test('generated guide and archive expose all six working category routes', () => {
    const guide = fs.readFileSync(path.join(root, 'blog/media-art/index.html'), 'utf8');
    const archive = fs.readFileSync(path.join(root, 'blog/index.html'), 'utf8');
    const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');

    assert.match(guide, /<link rel="canonical" href="https:\/\/dexa\.art\/blog\/media-art\/"/);
    assert.equal((guide.match(/<h1\b/g) || []).length, 1);
    assert.match(archive, /href="\/blog\/media-art\/"/);
    assert.match(archive, /id="media-art-filter-bar"/);
    assert.match(archive, /#post-grid \.post-card\[hidden\] \{ display: none !important; \}/);
    assert.match(sitemap, /<loc>https:\/\/dexa\.art\/blog\/media-art\/<\/loc>/);

    for (const category of taxonomy.categories) {
        assert.match(guide, new RegExp(`id="${category.slug}"`));
        assert.match(guide, new RegExp(`href="\\/blog\\/\\?track=media-art&amp;field=${category.slug}"|href="\\/blog\\/\\?track=media-art&field=${category.slug}"`));
        assert.match(archive, new RegExp(`data-field="${category.slug}"`));
        assert.equal(
            (archive.match(new RegExp(`data-media-art-field="${category.slug}"`, 'g')) || []).length,
            expectedCounts[category.slug]
        );
    }
});

test('all generated local guide links and fragment targets resolve', () => {
    const guidePath = path.join(root, 'blog/media-art/index.html');
    const guide = fs.readFileSync(guidePath, 'utf8');
    const ids = new Set([...guide.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
    const hrefs = [...guide.matchAll(/\bhref="([^"]+)"/g)].map(match => match[1]);

    for (const href of hrefs) {
        if (href.startsWith('#')) assert.ok(ids.has(href.slice(1)), `missing fragment ${href}`);
        if (href.startsWith('/blog/posts/')) {
            const target = path.join(root, href.replace(/^\//, ''), 'index.html');
            assert.ok(fs.existsSync(target), `missing article target ${href}`);
        }
    }
});
