#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const ROOT = path.join(__dirname, '..');
const SHARED_HELPERS = path.join(ROOT, 'blog', 'shared-shell.js');
const BUILD_SCRIPT = path.join(ROOT, 'blog', 'build.js');
const SITE_ORIGIN = 'https://dexa.art';
const PRIMARY_LABELS = ['HOME', 'STUDIO', 'SOLUTIONS', 'BLOG', 'ABOUT', 'CONTACT'];

function loadBuildFallback() {
    const source = fs.readFileSync(BUILD_SCRIPT, 'utf8');
    const mainMarker = '// ─── Main ───';
    const mainOffset = source.indexOf(mainMarker);
    assert.notEqual(mainOffset, -1, 'build.js main marker must remain discoverable for the RED fallback');

    const names = [
        'replaceGeneratedBlock',
        'extractGeneratedBlock',
        'routeTarget',
        'normalizeShellRoutes',
        'markBlogNavigationActive',
        'sharedShellSignature',
        'sameShellSignature',
        'markerPairCounts',
        'activeBlogLinkCount'
    ];
    const expose = names
        .map(name => `this.__helpers.${name} = typeof ${name} === 'function' ? ${name} : undefined;`)
        .join('\n');
    const context = {
        require,
        console,
        Buffer,
        URL,
        Intl,
        Date,
        __dirname: path.join(ROOT, 'blog'),
        __filename: BUILD_SCRIPT,
        process: { env: process.env }
    };
    context.global = context;
    context.__helpers = {};
    vm.createContext(context);
    vm.runInContext(`${source.slice(0, mainOffset)}\n${expose}`, context, { filename: BUILD_SCRIPT });
    return context.__helpers;
}

function helpers() {
    if (fs.existsSync(SHARED_HELPERS)) {
        delete require.cache[require.resolve(SHARED_HELPERS)];
        return require(SHARED_HELPERS);
    }
    return loadBuildFallback();
}

function read(relativePath) {
    return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function exactMarkerPair(html, start, end, name) {
    const startMarker = `<!-- ${start} -->`;
    const endMarker = `<!-- ${end} -->`;
    const startCount = html.split(startMarker).length - 1;
    const endCount = html.split(endMarker).length - 1;
    assert.equal(startCount, 1, `${name} must contain exactly one ${start} marker`);
    assert.equal(endCount, 1, `${name} must contain exactly one ${end} marker`);
    assert.ok(html.indexOf(startMarker) < html.indexOf(endMarker), `${name} marker order must be ${start} then ${end}`);
}

function shellFixture() {
    return `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="/dexa-theme.css"></head><body>
<!-- SHARED_NAV_START -->
<nav class="dx-nav">
  <a href="/" class="dx-nav-brand"><svg aria-hidden="true"><path d="brand"></path></svg><span class="wordmark">DEXA<span class="dot">.</span></span><span class="dx-nav-tag">AI × MEDIA ART STUDIO</span></a>
  <div class="dx-nav-links"><a href="/">HOME</a><a href="#studio">STUDIO</a><a href="#solutions">SOLUTIONS</a><a href="/blog/">BLOG</a><a href="about-deck.html">ABOUT</a><a href="#contact">CONTACT</a></div>
  <button id="mobile-menu-btn" class="dx-menu-btn" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-menu"><svg aria-hidden="true"><path d="menu"></path></svg></button>
</nav>
<nav id="mobile-menu" class="dx-mobile-menu hidden"><a href="/">HOME</a><a href="#studio">STUDIO</a><a href="#solutions">SOLUTIONS</a><a href="/blog/">BLOG</a><a href="about-deck.html">ABOUT</a><a href="#contact">CONTACT</a></nav>
<!-- SHARED_NAV_END -->
<!-- SHARED_FOOTER_START -->
<footer class="dx-footer"><img src="dexa_logo_light.svg" alt="DEXA"><h4>Sitemap</h4><a href="/">Home</a><a href="#studio">Studio</a><a href="#solutions">Solutions</a><a href="/blog/">Blog</a><a href="#contact">Contact</a><h4>Legal</h4><p>Where AI Meets Art. © 2025 DEXA. All rights reserved. (formerly ADX Worklab)</p></footer>
<!-- SHARED_FOOTER_END -->
</body></html>`;
}

test('generated-block replacement keeps every JavaScript replacement token byte-literal', () => {
    const { replaceGeneratedBlock } = helpers();
    assert.equal(typeof replaceGeneratedBlock, 'function', 'replaceGeneratedBlock helper must exist');
    const literal = "$& | $1 | $` | $' | $$";
    const input = '<!-- TEST_START -->\nold\n<!-- TEST_END -->';
    const output = replaceGeneratedBlock(input, 'TEST_START', 'TEST_END', literal);
    assert.ok(output.includes(literal), `replacement tokens were interpreted instead of preserved: ${output}`);
});

test('generated-block replacement rejects duplicate and out-of-order marker pairs', () => {
    const { replaceGeneratedBlock } = helpers();
    assert.equal(typeof replaceGeneratedBlock, 'function', 'replaceGeneratedBlock helper must exist');
    const duplicate = '<!-- X_START -->a<!-- X_END --><!-- X_START -->b<!-- X_END -->';
    const reversed = '<!-- X_END -->a<!-- X_START -->';
    assert.throws(() => replaceGeneratedBlock(duplicate, 'X_START', 'X_END', 'new'), /exactly one|1.*1|marker/i);
    assert.throws(() => replaceGeneratedBlock(reversed, 'X_START', 'X_END', 'new'), /order|marker/i);
});

test('route normalization collapses same-origin routes but preserves external origins', () => {
    const { routeTarget, normalizeShellRoutes } = helpers();
    assert.equal(typeof routeTarget, 'function', 'routeTarget helper must exist');
    assert.equal(typeof normalizeShellRoutes, 'function', 'normalizeShellRoutes helper must exist');
    assert.equal(routeTarget('#studio', '/', SITE_ORIGIN), '/#studio');
    assert.equal(routeTarget('about-deck.html', '/', SITE_ORIGIN), '/about-deck.html');
    assert.equal(routeTarget('https://dexa.art/blog/', '/', SITE_ORIGIN), '/blog/');
    assert.equal(routeTarget('https://other.example/blog/', '/', SITE_ORIGIN), 'https://other.example/blog/');
    assert.notEqual(routeTarget('https://other.example/blog/', '/', SITE_ORIGIN), routeTarget('/blog/', '/', SITE_ORIGIN));

    const normalized = normalizeShellRoutes('<a href="https://other.example/blog/">external</a><a href="#studio">internal</a>', '/', SITE_ORIGIN);
    assert.match(normalized, /href="https:\/\/other\.example\/blog\/"/);
    assert.match(normalized, /href="\/#studio"/);
});

test('semantic signature covers brand, mobile control, mobile links, footer, and theme assets', () => {
    const { sharedShellSignature } = helpers();
    assert.equal(typeof sharedShellSignature, 'function', 'sharedShellSignature helper must exist');
    const fixture = shellFixture();
    const signature = sharedShellSignature(fixture, '/', SITE_ORIGIN);
    const mutations = [
        fixture.replace('class="dx-nav"', 'class="broken-nav"'),
        fixture.replace('class="dx-mobile-menu hidden"', 'class="broken-mobile-menu hidden"'),
        fixture.replace('AI × MEDIA ART STUDIO', 'BROKEN BRAND'),
        fixture.replace('aria-controls="mobile-menu"', 'aria-controls="wrong-menu"'),
        fixture.replace('<nav id="mobile-menu" class="dx-mobile-menu hidden"><a href="/">HOME</a>', '<nav id="mobile-menu" class="dx-mobile-menu hidden"><a href="/">BROKEN</a>'),
        fixture.replace('<h4>Legal</h4>', '<h4>Missing</h4>'),
        fixture.replace('src="dexa_logo_light.svg"', 'src="wrong-logo.svg"'),
        fixture.replace('href="/dexa-theme.css"', 'href="/wrong-theme.css"')
    ];
    for (const mutated of mutations) {
        assert.notDeepEqual(sharedShellSignature(mutated, '/', SITE_ORIGIN), signature, 'shell mutation must change the semantic signature');
    }
});

test('blog-route state marks exactly desktop and mobile BLOG links active and current', () => {
    const { extractGeneratedBlock, markBlogNavigationActive, activeBlogLinkCount } = helpers();
    assert.equal(typeof extractGeneratedBlock, 'function', 'extractGeneratedBlock helper must exist');
    assert.equal(typeof markBlogNavigationActive, 'function', 'markBlogNavigationActive helper must exist');
    assert.equal(typeof activeBlogLinkCount, 'function', 'activeBlogLinkCount helper must exist');
    const neutral = extractGeneratedBlock(shellFixture(), 'SHARED_NAV_START', 'SHARED_NAV_END');
    const active = markBlogNavigationActive(neutral, '/', SITE_ORIGIN);
    assert.equal(activeBlogLinkCount(neutral, '/', SITE_ORIGIN), 0);
    assert.equal(activeBlogLinkCount(active, '/blog/', SITE_ORIGIN), 2);
    assert.equal((active.match(/aria-current="page"/g) || []).length, 2);
});

test('shared theme owns responsive navigation behavior for every generated route', () => {
    const theme = read('dexa-theme.css');
    assert.match(theme, /\.dx-menu-btn\s*\{[^}]*display\s*:\s*none[^}]*\}/s, 'desktop theme must hide the menu button');
    const mobile = theme.match(/@media\s*\(max-width\s*:\s*768px\)\s*\{([\s\S]*?)\n\}/);
    assert.ok(mobile, 'theme must define the shared 768px mobile navigation breakpoint');
    assert.match(mobile[1], /\.dx-nav-links\s*\{[^}]*display\s*:\s*none[^}]*\}/s, 'mobile theme must hide desktop navigation links');
    assert.match(mobile[1], /\.dx-menu-btn\s*\{[^}]*display\s*:\s*inline-flex[^}]*\}/s, 'mobile theme must show the menu button');
    const desktop = theme.match(/@media\s*\(min-width\s*:\s*769px\)\s*\{([\s\S]*?)\n\}/);
    assert.ok(desktop, 'theme must define the shared desktop navigation breakpoint');
    assert.match(desktop[1], /#mobile-menu\s*\{[^}]*display\s*:\s*none\s*!important[^}]*\}/s, 'desktop theme must keep the mobile panel hidden');
});

test('all committed blog surfaces derive a complete shell from canonical root markers', () => {
    const {
        sharedShellSignature,
        sameShellSignature,
        activeBlogLinkCount
    } = helpers();
    assert.equal(typeof sharedShellSignature, 'function', 'sharedShellSignature helper must exist');
    assert.equal(typeof sameShellSignature, 'function', 'sameShellSignature helper must exist');
    assert.equal(typeof activeBlogLinkCount, 'function', 'activeBlogLinkCount helper must exist');

    const manifest = JSON.parse(read('blog/posts.json'));
    const manifestSlugs = manifest.map(post => post.slug).sort();
    const generatedSlugs = fs.readdirSync(path.join(ROOT, 'blog', 'posts'), { withFileTypes: true })
        .filter(entry => entry.isDirectory() && entry.name !== '_built' && fs.existsSync(path.join(ROOT, 'blog', 'posts', entry.name, 'index.html')))
        .map(entry => entry.name)
        .sort();
    assert.deepEqual(generatedSlugs, manifestSlugs, 'static post slug set must exactly match posts.json');

    const surfaces = [
        { name: 'home', route: '/', html: read('index.html'), active: 0, script: 'script.js' },
        { name: 'blog/index.html', route: '/blog/', html: read('blog/index.html'), active: 2, script: 'blog.js' },
        { name: 'blog/post.html', route: '/blog/post.html', html: read('blog/post.html'), active: 2, script: 'blog.js' },
        ...manifest.map(post => ({
            name: `blog/posts/${post.slug}/index.html`,
            route: `/blog/posts/${post.slug}/`,
            html: read(`blog/posts/${post.slug}/index.html`),
            active: 2,
            script: '/blog/blog.js'
        }))
    ];

    const home = surfaces[0];
    exactMarkerPair(home.html, 'SHARED_NAV_START', 'SHARED_NAV_END', home.name);
    exactMarkerPair(home.html, 'SHARED_FOOTER_START', 'SHARED_FOOTER_END', home.name);
    const canonicalSignature = sharedShellSignature(home.html, home.route, SITE_ORIGIN);
    assert.deepEqual(canonicalSignature.primaryNav.map(link => link.label), PRIMARY_LABELS);
    assert.deepEqual(canonicalSignature.mobileNav.map(link => link.label), PRIMARY_LABELS);
    assert.deepEqual(canonicalSignature.footer.headings, ['Sitemap', 'Legal']);
    assert.deepEqual(canonicalSignature.footer.logos, ['/dexa_logo_light.svg']);
    assert.deepEqual(canonicalSignature.themeAssets, ['/dexa-theme.css']);

    for (const surface of surfaces) {
        exactMarkerPair(surface.html, 'SHARED_NAV_START', 'SHARED_NAV_END', surface.name);
        exactMarkerPair(surface.html, 'SHARED_FOOTER_START', 'SHARED_FOOTER_END', surface.name);
        assert.equal(activeBlogLinkCount(surface.html, surface.route, SITE_ORIGIN), surface.active, `${surface.name} BLOG active/current count`);
        assert.ok(sameShellSignature(canonicalSignature, sharedShellSignature(surface.html, surface.route, SITE_ORIGIN)), `${surface.name} shared shell must match canonical root`);
        assert.ok(surface.html.includes(surface.script), `${surface.name} must load ${surface.script} for its interactive shell`);
    }
});
