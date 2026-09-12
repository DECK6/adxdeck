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
const postsDir = path.join(root, 'blog/posts');
const publicPosts = JSON.parse(fs.readFileSync(path.join(root, 'blog/posts.json'), 'utf8'));
const sourceByContent = new Map(
    fs.readdirSync(postsDir)
        .filter(filename => filename.endsWith('.md'))
        .map(filename => {
            const content = fs.readFileSync(path.join(postsDir, filename), 'utf8');
            return [content, filename];
        })
);

function frontmatterScalar(markdown, key) {
    const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!frontmatter) return '';
    const field = frontmatter[1].match(new RegExp(`^${key}:\\s*(.*?)\\s*$`, 'm'));
    if (!field) return '';
    const value = field[1].trim();
    const quote = value[0];
    return value.length >= 2 && (quote === '"' || quote === "'") && value.at(-1) === quote
        ? value.slice(1, -1)
        : value;
}

function postsWithSourceClassifications() {
    return publicPosts.map(post => {
        const builtSource = fs.readFileSync(path.join(postsDir, post.file), 'utf8');
        const sourceFilename = sourceByContent.get(builtSource);
        assert.ok(sourceFilename, `no exact source copy for ${post.slug}`);
        const source = fs.readFileSync(path.join(postsDir, sourceFilename), 'utf8');
        return {
            ...post,
            _sourceFilename: sourceFilename,
            _mediaArtExplicitCategory: frontmatterScalar(source, 'mediaArtCategory')
        };
    });
}

function countsFromTaxonomyAndSource(posts) {
    const counts = Object.fromEntries(taxonomy.categories.map(category => [category.slug, 0]));
    const mappedSlugs = new Set(taxonomy.posts.map(row => row.slug));
    const categoryByLabel = new Map(taxonomy.categories.map(category => [category.label, category.slug]));

    for (const row of taxonomy.posts) {
        assert.ok(Object.hasOwn(counts, row.categorySlug), `unknown mapped category ${row.categorySlug}`);
        counts[row.categorySlug] += 1;
    }
    for (const post of posts) {
        if (post.track !== 'media-art' || mappedSlugs.has(post.slug)) continue;
        const categorySlug = categoryByLabel.get(String(post._mediaArtExplicitCategory || '').trim());
        assert.ok(categorySlug, `missing or unknown source mediaArtCategory for ${post.slug}`);
        counts[categorySlug] += 1;
    }
    return counts;
}

const posts = postsWithSourceClassifications();
const expectedCounts = Object.freeze(countsFromTaxonomyAndSource(posts));

test('approved mapping covers every current Media Art post exactly once', () => {
    const working = posts.map(post => ({ ...post }));
    const state = applyMediaArtTaxonomy(working, taxonomy);
    const mediaPosts = working.filter(post => post.track === 'media-art');
    const mappedSlugs = new Set(taxonomy.posts.map(row => row.slug));
    const explicitPosts = mediaPosts.filter(post => !mappedSlugs.has(post.slug));

    assert.equal(state.mappedCount, taxonomy.posts.length);
    assert.equal(mediaPosts.length, taxonomy.posts.length + explicitPosts.length);
    assert.deepEqual(
        state.categories.map(({ slug, label }) => ({ slug, label })),
        EXPECTED_CATEGORIES
    );
    assert.deepEqual(state.counts, expectedCounts);
    assert.equal(new Set(taxonomy.posts.map(row => row.slug)).size, taxonomy.posts.length);
    assert.ok(explicitPosts.every(post => String(post._mediaArtExplicitCategory || '').trim()));
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
    assert.equal(state.counts['technology-making'], expectedCounts['technology-making'] + 1);

    assert.throws(
        () => applyMediaArtTaxonomy([
            ...posts.map(post => ({ ...post })),
            { ...unclassified, _mediaArtExplicitCategory: '알 수 없는 분류' }
        ], taxonomy),
        /Invalid mediaArtCategory/
    );
});

test('invalid, missing, conflicting, and AI AX mapping inputs are rejected', () => {
    const mapped = taxonomy.posts[0];
    const invalidTaxonomy = {
        ...taxonomy,
        posts: taxonomy.posts.map(row => row === mapped ? { ...row, categorySlug: 'unknown-category' } : row)
    };
    assert.throws(() => applyMediaArtTaxonomy(posts.map(post => ({ ...post })), invalidTaxonomy), /Invalid category/);
    assert.throws(
        () => applyMediaArtTaxonomy(posts.filter(post => post.slug !== mapped.slug).map(post => ({ ...post })), taxonomy),
        /Mapped slug is missing from the Media Art feed/
    );
    assert.throws(
        () => applyMediaArtTaxonomy(posts.map(post => post.slug === mapped.slug ? { ...post, track: 'ai-ax' } : { ...post }), taxonomy),
        /Mapped slug is missing from the Media Art feed/
    );

    const conflictingCategory = taxonomy.categories.find(category => category.slug !== mapped.categorySlug);
    assert.throws(
        () => applyMediaArtTaxonomy(posts.map(post => post.slug === mapped.slug
            ? { ...post, _mediaArtExplicitCategory: conflictingCategory.label }
            : { ...post }), taxonomy),
        /Frontmatter and mapping disagree/
    );
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
        assert.equal((guide.match(new RegExp(`id="${category.slug}"`, 'g')) || []).length, 1);
        assert.equal((guide.match(new RegExp(`href="#${category.slug}"`, 'g')) || []).length, 1);
        assert.equal((guide.match(new RegExp(`href="\\/blog\\/\\?track=media-art(?:&amp;|&)field=${category.slug}"`, 'g')) || []).length, 1);
        assert.equal((archive.match(new RegExp(`data-field="${category.slug}"`, 'g')) || []).length, 1);
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
