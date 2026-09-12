#!/usr/bin/env node
/**
 * DEXA Blog Build Script
 * - Scans posts/*.md, parses Obsidian frontmatter, generates posts.json
 * - Pre-renders each post to blog/posts/[slug]/index.html (SEO-friendly)
 * - Generates sitemap.xml and robots.txt at repo root
 *
 * Usage: node blog/build.js
 */

const fs = require('fs');
const { validateAxTopics, axRelatedHtml, axGuideHtml } = require('./ax-guide');
const {
    applyMediaArtTaxonomy,
    mediaArtGuideHtml
} = require('./media-art-guide');
const mediaArtTaxonomy = require('./media-art-taxonomy.json');
const path = require('path');
const {
    extractGeneratedBlock,
    replaceGeneratedBlock,
    normalizeShellRoutes,
    markBlogNavigationActive
} = require('./shared-shell');

const REPO_ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT = path.join(__dirname, 'posts.json');
const SITE_URL = 'https://dexa.art';

const EDITORIAL_TRACKS = Object.freeze([
    Object.freeze({ slug: 'media-art', label: 'Media Art' }),
    Object.freeze({ slug: 'ai-ax', label: 'AI · AX' })
]);
const TRACK_BY_SLUG = new Map(EDITORIAL_TRACKS.map(track => [track.slug, track]));
const TRACK_ALIASES = new Map([
    ['media-art', 'media-art'],
    ['media art', 'media-art'],
    ['ai-ax', 'ai-ax'],
    ['ai · ax', 'ai-ax']
]);
const CONTENT_TYPE_TAGS = new Map([
    ['article', 'Article'],
    ['project', 'Project'],
    ['thought', 'Thought'],
    ['tutorial', 'Tutorial'],
    ['post', 'Post']
]);

// Legacy classification is intentionally ordered. Strong media-art signals
// win before generic AI signals so criticism about AI in art stays Media Art.
const MEDIA_ART_TAG_SIGNALS = new Set([
    'media-art', 'media-theory', 'media-art-theory', 'art-history',
    'new-media', 'digital-art', 'media-archaeology', 'korean-media-art',
    'installation', 'immersive', 'generative-art', 'interactive-art',
    'sound-art', 'video-art', 'net-art', 'data-art', 'software-art',
    'projection-mapping', 'light-installation'
]);
const STRONG_AI_AX_TAG_SIGNALS = new Set([
    'ai-agent', 'agent', 'agents', 'hermes', 'workflow',
    'automation', 'automation-blueprints', 'akm', 'knowledge-management',
    'knowledge-architecture', 'graph-engineering', 'governance',
    'data-governance', 'organizational-agent', 'cerebras', 'vibe-coding',
    'ai-coding', 'codex', 'claude-code', 'openclaw', 'openai', 'mcp',
    'gpt-5.4', 'gpt-5.5', 'gpt-image-2', 'image-generation'
]);
const MEDIA_ART_TEXT_SIGNALS = [
    /\bmedia[\s-]?art\b/i,
    /미디어\s*아트/,
    /전시|작품|예술|설치\s*작업/,
    /\bartist(?:ic)?\b|\b(?:art|media|interactive|immersive|digital|video|sound|light)\s+installation\b|\binstallation\s+art\b/i
];
const AI_AX_TEXT_SIGNALS = [
    /\bhermes\b|허미스/i,
    /\bakm\b|에이전트|\bagents?\b/i,
    /자동화|\bautomation\b/i,
    /지식\s*(?:관리|구조)|knowledge\s+(?:management|architecture)/i,
    /그래프\s*엔지니어링|graph\s+engineering/i,
    /거버넌스|\bgovernance\b/i,
    /셀레브레스|\bcerebras\b/i,
    /바이브\s*코딩|vibe\s*coding/i,
    /\bcodex\b|\bclaude\b|\bopenai\b|\bgpt(?:-|\s|\d)/i,
    /\bAI\b/i
];

function normalizeTag(tag) {
    return String(tag || '').normalize('NFKC').trim().toLowerCase();
}

function normalizeTrackAlias(value) {
    return String(value || '')
        .normalize('NFKC')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/\s*·\s*/g, ' · ');
}

function trackLabel(trackSlug) {
    const track = TRACK_BY_SLUG.get(trackSlug);
    if (!track) throw new Error(`Unknown resolved track: ${trackSlug}`);
    return track.label;
}

function resolveTrack(meta, tags, searchableText, filename) {
    const explicitValue = meta.track;
    const explicitIsEmpty = explicitValue == null
        || (Array.isArray(explicitValue) && explicitValue.length === 0)
        || (!Array.isArray(explicitValue) && String(explicitValue).trim() === '');

    if (!explicitIsEmpty) {
        if (Array.isArray(explicitValue)) {
            throw new Error(`[track] Invalid explicit track in ${filename}: track must be a single value.`);
        }
        const normalized = normalizeTrackAlias(explicitValue);
        const track = TRACK_ALIASES.get(normalized);
        if (!track) {
            const accepted = EDITORIAL_TRACKS.map(item => `${item.slug} / ${item.label}`).join(', ');
            throw new Error(`[track] Invalid explicit track "${explicitValue}" in ${filename}. Accepted values: ${accepted}.`);
        }
        return { track, source: 'explicit', reason: `frontmatter:${normalized}` };
    }

    const normalizedTags = tags.map(normalizeTag);
    const mediaTag = normalizedTags.find(tag => MEDIA_ART_TAG_SIGNALS.has(tag));
    if (mediaTag) return { track: 'media-art', source: 'fallback-media-art', reason: `tag:${mediaTag}` };

    const aiAxTag = normalizedTags.find(tag => STRONG_AI_AX_TAG_SIGNALS.has(tag));
    if (aiAxTag) return { track: 'ai-ax', source: 'fallback-ai-ax', reason: `tag:${aiAxTag}` };

    const mediaText = MEDIA_ART_TEXT_SIGNALS.find(pattern => pattern.test(searchableText));
    if (mediaText) return { track: 'media-art', source: 'fallback-media-art', reason: `text:${mediaText.source}` };

    if (normalizedTags.includes('ai')) {
        return { track: 'ai-ax', source: 'fallback-ai-ax', reason: 'tag:ai' };
    }

    const aiAxText = AI_AX_TEXT_SIGNALS.find(pattern => pattern.test(searchableText));
    if (aiAxText) return { track: 'ai-ax', source: 'fallback-ai-ax', reason: `text:${aiAxText.source}` };

    // Historical DEXA posts began as an art/creative-technology publication.
    // Unknown legacy material therefore defaults to Media Art. New posts
    // should always set track explicitly so they never depend on this catch-all.
    return { track: 'media-art', source: 'catch-all', reason: 'legacy-default:media-art' };
}

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return { meta: {}, body: content };

    const raw = match[1];
    const meta = {};

    let currentKey = null;
    let currentList = null;

    const parseScalar = (rawValue) => {
        let value = rawValue.trim();
        const quote = value[0];
        if (value.length >= 2 && (quote === '"' || quote === "'") && value.at(-1) === quote) {
            value = value.slice(1, -1);
        }
        return value.replace(/\[\[([^\]]+)\]\]/g, '$1');
    };

    for (const line of raw.split('\n')) {
        const listMatch = line.match(/^\s+-\s+(.+?)\s*$/);
        if (listMatch && currentKey) {
            if (!currentList) currentList = [];
            currentList.push(parseScalar(listMatch[1]));
            meta[currentKey] = currentList;
            continue;
        }

        const kvMatch = line.match(/^([^:]+):\s*(.*?)\s*$/);
        if (kvMatch) {
            currentKey = kvMatch[1].trim();
            if (kvMatch[2] === '') {
                currentList = [];
                meta[currentKey] = currentList;
            } else {
                meta[currentKey] = parseScalar(kvMatch[2]);
                currentList = null;
            }
        }
    }

    const body = content.slice(match[0].length).trim();
    return { meta, body };
}

function extractDescription(body, maxLen = 160) {
    const lines = body.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('#')) continue;
        if (trimmed.startsWith('![')) continue;
        if (trimmed.startsWith('>')) continue;
        if (trimmed.startsWith('---')) continue;
        const clean = trimmed
            .replace(/^!\[([^\]]*)\]\([^)]+\)$/, '$1')
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/\[\[([^\]]+)\]\]/g, '$1');
        if (clean.length > 10) {
            return clean.length > maxLen ? clean.slice(0, maxLen) + '...' : clean;
        }
    }
    return '';
}

function fileToSlug(filename) {
    return filename
        .replace(/\.md$/, '')
        .replace(/\s+/g, '-')
        .replace(/[()]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '');
}

function currentKstDate() {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
}

function toIsoDateOnly(value) {
    const str = String(value || '').trim();
    const match = str.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : '';
}

function normalizePostDate(filename, meta) {
    const today = currentKstDate();
    const explicit = toIsoDateOnly(meta['date created']) || toIsoDateOnly(meta['date modified']);
    const filenameDateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
    const filenameDate = filenameDateMatch ? filenameDateMatch[1] : '';

    const candidate = explicit || filenameDate || today;
    if (candidate > today) {
        return filenameDate && filenameDate <= today ? filenameDate : today;
    }
    return candidate;
}

function categoryFromTags(tags) {
    if (!Array.isArray(tags)) return 'Post';
    const normalizedTags = tags.map(normalizeTag);
    for (const [tag, label] of CONTENT_TYPE_TAGS) {
        if (normalizedTags.includes(tag)) return label;
    }
    return 'Post';
}

function slugToAscii(slug) {
    return slug
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\x00-\x7F]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase() || 'post';
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeAttr(str) {
    return escapeHtml(str);
}

// ─── Minimal Markdown → HTML renderer ───
// Covers: headings, paragraphs, bold, italic, code, links, images,
// lists (ul/ol), blockquotes, horizontal rules, fenced code blocks.
// Produces semantic HTML adequate for SEO indexing; the client-side
// marked.js will still render the interactive view on post.html.

function cleanWikiLinks(md) {
    md = md.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
    md = md.replace(/\[\[([^\]]+)\]\]/g, '$1');
    md = md.replace(/^> \[!(\w+)\]\s*(.*)$/gm, '> **$2**');
    return md;
}

function normalizeContentUrl(url) {
    if (/^(https?:|mailto:|tel:|#|\/)/i.test(url)) return url;
    const normalized = url.replace(/^\.?\//, '').replace(/^blog\//, '');
    return `/blog/${normalized}`;
}

function renderInline(text) {
    // Parse raw destinations before HTML escaping. Protect generated tags from
    // emphasis parsing so URL punctuation cannot turn into attribute markup.
    const fragments = [];
    const protect = html => `\u0000INLINE${fragments.push(html) - 1}\u0000`;
    const pattern = /`([^`]+)`|(!?)\[([^\]]*)\]\(/g;
    let out = '';
    let cursor = 0;
    let match;
    while ((match = pattern.exec(text))) {
        out += escapeHtml(text.slice(cursor, match.index));
        if (match[1] !== undefined) {
            out += protect(`<code>${escapeHtml(match[1])}</code>`);
        } else {
            // Balanced parentheses belong to the URL, including nested URLs.
            const start = pattern.lastIndex;
            let end = start;
            let depth = 1;
            for (; end < text.length; end++) {
                if (text[end] === '\\' && end + 1 < text.length) { end++; continue; }
                if (text[end] === '(') depth++;
                if (text[end] === ')' && --depth === 0) break;
            }
            if (depth !== 0) {
                out += escapeHtml(match[0]);
            } else {
                const url = escapeAttr(normalizeContentUrl(text.slice(start, end)));
                const label = match[3];
                out += protect(match[2]
                    ? `<img src="${url}" alt="${escapeAttr(label)}" loading="lazy">`
                    : `<a href="${url}">${renderInline(label)}</a>`);
                pattern.lastIndex = end + 1;
            }
        }
        cursor = pattern.lastIndex;
    }
    out += escapeHtml(text.slice(cursor));
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    return out.replace(/\u0000INLINE(\d+)\u0000/g, (_m, idx) => fragments[Number(idx)] || '');
}

function parseTableRow(line) {
    const trimmed = line.trim();
    if (!trimmed.includes('|')) return null;
    const body = trimmed.replace(/^\|/, '').replace(/\|$/, '');
    return body.split('|').map(cell => cell.trim());
}

function isTableSeparator(line) {
    const cells = parseTableRow(line);
    return Boolean(cells && cells.length > 1 && cells.every(cell => /^:?-{3,}:?$/.test(cell)));
}

function renderMarkdown(md) {
    md = cleanWikiLinks(md).replace(/\r\n/g, '\n');
    const lines = md.split('\n');
    const out = [];
    let i = 0;

    const flushParagraph = (buf) => {
        if (buf.length) {
            out.push('<p>' + renderInline(buf.join(' ')) + '</p>');
            buf.length = 0;
        }
    };

    let para = [];

    while (i < lines.length) {
        const line = lines[i];

        // Fenced code block
        if (/^```/.test(line)) {
            flushParagraph(para);
            const lang = line.slice(3).trim();
            const codeLines = [];
            i++;
            while (i < lines.length && !/^```/.test(lines[i])) {
                codeLines.push(lines[i]);
                i++;
            }
            i++;
            const langAttr = lang ? ` class="language-${escapeAttr(lang)}"` : '';
            out.push(`<pre><code${langAttr}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
            continue;
        }

        // Blank line → flush paragraph
        if (/^\s*$/.test(line)) {
            flushParagraph(para);
            i++;
            continue;
        }

        // Headings
        const hMatch = line.match(/^(#{1,6})\s+(.+?)\s*$/);
        if (hMatch) {
            flushParagraph(para);
            const level = hMatch[1].length;
            out.push(`<h${level}>${renderInline(hMatch[2])}</h${level}>`);
            i++;
            continue;
        }

        // Horizontal rule
        if (/^(---|\*\*\*|___)\s*$/.test(line)) {
            flushParagraph(para);
            out.push('<hr>');
            i++;
            continue;
        }

        // GitHub-style pipe table
        if (i + 1 < lines.length && parseTableRow(line) && isTableSeparator(lines[i + 1])) {
            flushParagraph(para);
            const headers = parseTableRow(line);
            i += 2;
            const rows = [];
            while (i < lines.length) {
                const cells = parseTableRow(lines[i]);
                if (!cells || cells.length < 2 || isTableSeparator(lines[i])) break;
                rows.push(cells);
                i++;
            }

            const thead = '<thead><tr>' + headers.map(cell => `<th>${renderInline(cell)}</th>`).join('') + '</tr></thead>';
            const tbody = rows.length
                ? '<tbody>' + rows.map(row => {
                    const padded = headers.map((_, idx) => row[idx] || '');
                    return '<tr>' + padded.map(cell => `<td>${renderInline(cell)}</td>`).join('') + '</tr>';
                }).join('') + '</tbody>'
                : '';
            out.push(`<div class="table-scroll"><table>${thead}${tbody}</table></div>`);
            continue;
        }

        // Blockquote
        if (/^>\s?/.test(line)) {
            flushParagraph(para);
            const quoteLines = [];
            while (i < lines.length && /^>\s?/.test(lines[i])) {
                quoteLines.push(lines[i].replace(/^>\s?/, ''));
                i++;
            }
            out.push('<blockquote>' + renderInline(quoteLines.join(' ')) + '</blockquote>');
            continue;
        }

        // Unordered list
        if (/^[-*+]\s+/.test(line)) {
            flushParagraph(para);
            const items = [];
            while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^[-*+]\s+/, ''));
                i++;
            }
            out.push('<ul>' + items.map(x => `<li>${renderInline(x)}</li>`).join('') + '</ul>');
            continue;
        }

        // Ordered list
        if (/^\d+\.\s+/.test(line)) {
            flushParagraph(para);
            const items = [];
            while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^\d+\.\s+/, ''));
                i++;
            }
            out.push('<ol>' + items.map(x => `<li>${renderInline(x)}</li>`).join('') + '</ol>');
            continue;
        }

        // Paragraph accumulation
        para.push(line.trim());
        i++;
    }

    flushParagraph(para);
    return out.join('\n');
}


function stripLeadingH1(md) {
    const lines = md.replace(/\r\n/g, '\n').split('\n');
    let firstContent = lines.findIndex(line => line.trim().length > 0);
    if (firstContent >= 0 && /^#\s+/.test(lines[firstContent])) {
        lines.splice(firstContent, 1);
    }
    return lines.join('\n').trim();
}

// ─── Static post page template ───

let sharedShell;

function loadSharedShell() {
    const home = fs.readFileSync(path.join(REPO_ROOT, 'index.html'), 'utf8');
    const nav = extractGeneratedBlock(home, 'SHARED_NAV_START', 'SHARED_NAV_END');
    const footer = extractGeneratedBlock(home, 'SHARED_FOOTER_START', 'SHARED_FOOTER_END');
    return {
        nav: markBlogNavigationActive(normalizeShellRoutes(nav, '/', SITE_URL), '/', SITE_URL),
        footer: normalizeShellRoutes(footer, '/', SITE_URL)
    };
}

function formatDateHuman(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateDots(dateStr) {
    return String(dateStr || '').replace(/-/g, '.');
}

function postPageHtml(post, bodyHtml, prev, next) {
    const canonical = `${SITE_URL}/blog/posts/${post.slug}/`;
    const ogImage = post.thumbnail
        ? `${SITE_URL}/blog/${post.thumbnail.replace(/^\/+/, '')}`
        : `${SITE_URL}/og-image.jpg`;
    const desc = post.description || `${post.title} — DEXA Blog`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'inLanguage': 'ko-KR',
        'headline': post.title,
        'description': desc,
        'image': ogImage,
        'datePublished': post.date,
        'dateModified': post.modified,
        'author': { '@type': 'Person', 'name': post.author || 'Deck' },
        'publisher': {
            '@type': 'Organization',
            'name': 'DEXA',
            'logo': { '@type': 'ImageObject', 'url': `${SITE_URL}/dexa_logo.jpg` }
        },
        'mainEntityOfPage': { '@type': 'WebPage', '@id': canonical },
        'articleSection': post.trackLabel,
        'keywords': (post.tags || []).join(', ')
    };

    const prevLink = prev
        ? `<a id="prev-post" href="/blog/posts/${prev.slug}/" class="spec-row" style="text-decoration:none;"><span class="k">← PREV</span><span>${escapeHtml(prev.title)}</span></a>`
        : '<span></span>';
    const nextLink = next
        ? `<a id="next-post" href="/blog/posts/${next.slug}/" class="spec-row" style="text-decoration:none;"><span>${escapeHtml(next.title)}</span><span class="k">NEXT →</span></a>`
        : '<span></span>';

    const tagsHtml = (post.tags || []).map(t =>
        `<span class="dx-tag-chip">${escapeHtml(t)}</span>`
    ).join('');

    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(post.title)} | DEXA Blog</title>
    <meta name="description" content="${escapeAttr(desc)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeAttr(post.title)}" />
    <meta property="og:description" content="${escapeAttr(desc)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${escapeAttr(ogImage)}" />
    <meta property="og:site_name" content="DEXA" />
    <meta property="article:published_time" content="${post.date}" />
    <meta property="article:modified_time" content="${post.modified}" />
    <meta property="article:author" content="${escapeAttr(post.author || 'Deck')}" />
    ${(post.tags || []).map(t => `<meta property="article:tag" content="${escapeAttr(t)}" />`).join('\n    ')}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(post.title)}" />
    <meta name="twitter:description" content="${escapeAttr(desc)}" />
    <meta name="twitter:image" content="${escapeAttr(ogImage)}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
    <link rel="stylesheet" href="/dexa-theme.css" />
</head>
<body>
    <!-- SHARED_NAV_START -->
${sharedShell.nav}
    <!-- SHARED_NAV_END -->
    <main style="padding:128px 24px 96px;">
        <article style="max-width:720px;margin:0 auto;">
            <div style="margin-bottom:40px;">
                <a href="/blog/" class="btn-ghost" style="padding-left:0;">← Back to Blog</a>
                <div class="dx-meta" style="margin-top:20px;">
                    <span class="dx-badge">${escapeHtml(post.trackLabel)}</span>
                    <span class="dx-date">${escapeHtml(post.category)} · ${formatDateDots(post.date)}</span>
                </div>
            </div>
            <div class="prose">
                <h1>${escapeHtml(post.title)}</h1>
                <p style="color:var(--muted);font-size:17px;">${escapeHtml(desc)}</p>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 8px;">${tagsHtml}</div>
${bodyHtml}
            </div>
${post.track === 'ai-ax' ? `            ${axRelatedHtml(post)}\n` : ''}            <nav class="spec-list" style="margin-top:64px;" aria-label="Post navigation">
                ${prevLink}
                ${nextLink}
            </nav>
        </article>
    </main>
    <!-- SHARED_FOOTER_START -->
${sharedShell.footer}
    <!-- SHARED_FOOTER_END -->
    <script src="/blog/blog.js"></script>
</body>
</html>
`;
}


function postImageSrc(post, prefix = '/blog/') {
    if (!post.thumbnail) return '';
    if (/^(https?:|\/)/i.test(post.thumbnail)) return post.thumbnail;
    return `${prefix}${post.thumbnail.replace(/^\/+/, '')}`;
}

function postImageAlt(post) {
    return `${post.title} — ${post.description || 'DEXA blog article cover image'}`.slice(0, 180);
}

function staticPostCardHtml(post) {
    const img = postImageSrc(post);
    const imageHtml = img
        ? `<div class="card-frame"><img src="${escapeAttr(img)}" alt="${escapeAttr(postImageAlt(post))}" loading="lazy"></div>`
        : '';
    const mediaArtField = post.mediaArtCategorySlug || '';
    const cardType = post.mediaArtCategory
        ? `${post.mediaArtCategory} · ${post.category}`
        : post.category;
    return `<a class="post-card panel-card" href="/blog/posts/${escapeAttr(post.slug)}/" data-track="${escapeAttr(post.track)}" data-category="${escapeAttr(post.category)}" data-media-art-field="${escapeAttr(mediaArtField)}" aria-label="Read ${escapeAttr(post.title)}">
  ${imageHtml}
  <span class="dx-meta"><span class="dx-badge">${escapeHtml(post.trackLabel)}</span><span class="dx-date">${escapeHtml(cardType)} · <time datetime="${escapeAttr(post.date)}">${escapeHtml(formatDateDots(post.date))}</time></span></span>
  <h3>${escapeHtml(post.title)}</h3>
  <p>${escapeHtml(post.description || '')}</p>
  <span class="dx-more">READ MORE →</span>
</a>`;
}

function syncSharedShellTemplate(templatePath) {
    let html = fs.readFileSync(templatePath, 'utf8');
    html = replaceGeneratedBlock(html, 'SHARED_NAV_START', 'SHARED_NAV_END', sharedShell.nav);
    html = replaceGeneratedBlock(html, 'SHARED_FOOTER_START', 'SHARED_FOOTER_END', sharedShell.footer);
    fs.writeFileSync(templatePath, trimTrailingWhitespace(html), 'utf8');
}

function trimTrailingWhitespace(text) {
    return text.replace(/[ \t]+$/gm, '');
}

function updateBlogIndex(postsPublic) {
    const blogIndexPath = path.join(__dirname, 'index.html');
    let html = fs.readFileSync(blogIndexPath, 'utf8');
    const filters = [
        `<button class="dx-tag-chip active" type="button" data-filter="all" aria-pressed="true">All</button>`,
        ...EDITORIAL_TRACKS.map(track => `<button class="dx-tag-chip" type="button" data-filter="${escapeAttr(track.slug)}" aria-pressed="false">${escapeHtml(track.label)}</button>`)
    ].join('\n                ');
    const mediaArtFilters = [
        `<button class="dx-tag-chip active" type="button" data-field="all" aria-pressed="true">미디어아트 전체 <span>${mediaArtTaxonomyState.mediaCount}</span></button>`,
        ...mediaArtTaxonomyState.categories.map(category => `<button class="dx-tag-chip" type="button" data-field="${escapeAttr(category.slug)}" aria-pressed="false">${escapeHtml(category.label)} <span>${mediaArtTaxonomyState.counts[category.slug]}</span></button>`)
    ].join('\n                ');
    const cards = postsPublic.map(staticPostCardHtml).join('\n                ');
    const blogJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${SITE_URL}/blog/#collection`,
                'name': 'DEXA Blog',
                'url': `${SITE_URL}/blog/`,
                'description': 'DEXA의 미디어아트와 AI·AX 기록. 업무 설계, 지식 관리, 자동화, 평가·거버넌스와 AI 활용 학습을 다룹니다.',
                'inLanguage': 'ko-KR',
                'isPartOf': { '@type': 'WebSite', '@id': `${SITE_URL}/#website` },
                'mainEntity': { '@id': `${SITE_URL}/blog/#blog` }
            },
            {
                '@type': 'Blog',
                '@id': `${SITE_URL}/blog/#blog`,
                'name': 'DEXA Blog',
                'url': `${SITE_URL}/blog/`,
                'blogPost': postsPublic.map(post => ({
                    '@type': 'BlogPosting',
                    'headline': post.title,
                    'url': `${SITE_URL}/blog/posts/${post.slug}/`,
                    'datePublished': post.date,
                    'articleSection': post.trackLabel,
                    'author': { '@type': 'Person', 'name': post.author || 'Deck' }
                }))
            }
        ]
    };
    html = replaceGeneratedBlock(html, 'STATIC_FILTERS_START', 'STATIC_FILTERS_END', filters);
    html = replaceGeneratedBlock(html, 'STATIC_MEDIA_ART_FILTERS_START', 'STATIC_MEDIA_ART_FILTERS_END', mediaArtFilters);
    html = replaceGeneratedBlock(html, 'STATIC_POSTS_START', 'STATIC_POSTS_END', cards);
    html = replaceGeneratedBlock(html, 'BLOG_SCHEMA_START', 'BLOG_SCHEMA_END', `    <script type="application/ld+json">${JSON.stringify(blogJsonLd)}</script>`);
    fs.writeFileSync(blogIndexPath, trimTrailingWhitespace(html), 'utf8');
}

function updateHomePreview(postsPublic) {
    const indexPath = path.join(REPO_ROOT, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    const cards = postsPublic.slice(0, 3).map(staticPostCardHtml).join('\n                ');
    html = replaceGeneratedBlock(html, 'STATIC_BLOG_PREVIEW_START', 'STATIC_BLOG_PREVIEW_END', cards);
    fs.writeFileSync(indexPath, trimTrailingWhitespace(html), 'utf8');
}

function classificationAudit(posts) {
    const trackCounts = Object.fromEntries(EDITORIAL_TRACKS.map(track => [track.slug, 0]));
    const sourceCounts = { explicit: 0, fallback: 0, 'catch-all': 0 };
    const categoryCounts = {};

    posts.forEach(post => {
        trackCounts[post.track] += 1;
        if (post._trackSource === 'explicit') sourceCounts.explicit += 1;
        else if (post._trackSource === 'catch-all') sourceCounts['catch-all'] += 1;
        else sourceCounts.fallback += 1;
        categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    });

    return { total: posts.length, trackCounts, sourceCounts, categoryCounts };
}

// ─── Main ───

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

// Parse and validate every source before replacing any generated output. This
// keeps a bad explicit track value from leaving a half-cleaned public build.
const posts = files.map(filename => {
    const content = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { meta, body } = parseFrontmatter(content);

    const tags = Array.isArray(meta.tags) ? meta.tags : [];
    const displayTags = tags.filter(tag => !CONTENT_TYPE_TAGS.has(normalizeTag(tag)));

    let title = meta.title;
    if (!title) {
        const headingMatch = body.match(/^#\s+(.+)$/m);
        if (headingMatch) title = headingMatch[1].trim();
    }
    if (!title) {
        title = (Array.isArray(meta.aliases) ? meta.aliases[0] : null) || filename.replace(/\.md$/, '');
    }

    const aliases = Array.isArray(meta.aliases) ? meta.aliases : [];
    const englishAlias = aliases.find(a => /^[a-zA-Z0-9\s\-_&]+$/.test(a));

    let asciiSlug;
    if (englishAlias) {
        asciiSlug = fileToSlug(englishAlias).toLowerCase();
    } else {
        asciiSlug = slugToAscii(fileToSlug(filename));
    }

    if (asciiSlug.length < 3) {
        asciiSlug = 'post-' + Buffer.from(filename).toString('hex').slice(0, 8);
    }

    const descriptionRaw = meta.description || extractDescription(body);
    const resolvedTrack = resolveTrack(meta, tags, `${title}\n${descriptionRaw}\n${filename}`, filename);

    return {
        slug: asciiSlug,
        file: '_built/' + asciiSlug + '.md',
        title,
        description: descriptionRaw,
        category: categoryFromTags(tags),
        track: resolvedTrack.track,
        trackLabel: trackLabel(resolvedTrack.track),
        tags: displayTags,
        date: normalizePostDate(filename, meta),
        modified: (() => {
            const published = normalizePostDate(filename, meta);
            const modified = toIsoDateOnly(meta['date modified']);
            return modified && modified >= published && modified <= currentKstDate() ? modified : published;
        })(),
        thumbnail: meta.thumbnail || '',
        author: Array.isArray(meta.author) ? meta.author[0] : (meta.author || 'Deck'),
        _body: body,
        _sourceFilename: filename,
        _trackSource: resolvedTrack.source,
        _trackReason: resolvedTrack.reason,
        _mediaArtExplicitCategory: meta.mediaArtCategory
    };
});

// Sort newest first, then by stable ASCII slug for reproducible equal-date order.
posts.sort((a, b) => {
    if (a.date !== b.date) return a.date > b.date ? -1 : 1;
    if (a.slug !== b.slug) return a.slug < b.slug ? -1 : 1;
    return 0;
});

// Validate curated links before writing any generated output.
validateAxTopics(posts);
const mediaArtTaxonomyState = applyMediaArtTaxonomy(posts, mediaArtTaxonomy);
mediaArtTaxonomyState.mediaCount = posts.filter(post => post.track === 'media-art').length;

// The root page is the only shared-shell source. Synchronize the two blog
// templates before generating static post pages so all derived routes use the
// same brand, desktop/mobile navigation, and footer markup.
sharedShell = loadSharedShell();
syncSharedShellTemplate(path.join(__dirname, 'index.html'));
syncSharedShellTemplate(path.join(__dirname, 'post.html'));

const BUILT_DIR = path.join(__dirname, 'posts', '_built');
if (!fs.existsSync(BUILT_DIR)) fs.mkdirSync(BUILT_DIR, { recursive: true });

// Update generated outputs in place. Never permanently delete routes during a
// routine build. Removed/renamed sources require an explicit redirect decision
// and moving obsolete output to the system Trash before rebuilding.
const expectedSlugs = new Set(posts.map(post => post.slug));
const staleBuilt = fs.readdirSync(BUILT_DIR)
    .filter(file => file.endsWith('.md') && !expectedSlugs.has(file.slice(0, -3)));
const staleRoutes = fs.readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name !== '_built' && !expectedSlugs.has(entry.name))
    .map(entry => entry.name);
if (staleBuilt.length || staleRoutes.length) {
    throw new Error(`Obsolete generated output detected. Review redirects and move it to the system Trash: ${[...staleBuilt, ...staleRoutes].join(', ')}`);
}
posts.forEach(post => {
    fs.copyFileSync(
        path.join(POSTS_DIR, post._sourceFilename),
        path.join(BUILT_DIR, post.slug + '.md')
    );
});

// Emit static post pages
posts.forEach((post, idx) => {
    const prev = posts[idx + 1];
    const next = posts[idx - 1];
    const bodyHtml = renderMarkdown(stripLeadingH1(post._body));
    const dir = path.join(POSTS_DIR, post.slug);
    fs.mkdirSync(dir, { recursive: true });
    const html = postPageHtml(post, bodyHtml, prev, next);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
});

// Write posts.json (for client-side listing & legacy post.html)
const postsPublic = posts.map(({ _body, _sourceFilename, _trackSource, _trackReason, _mediaArtExplicitCategory, ...rest }) => rest);
fs.writeFileSync(OUTPUT, JSON.stringify(postsPublic, null, 2), 'utf8');
updateBlogIndex(postsPublic);
updateHomePreview(postsPublic);
const axDir = path.join(__dirname, 'ax');
fs.mkdirSync(axDir, { recursive: true });
fs.writeFileSync(path.join(axDir, 'index.html'), axGuideHtml(postsPublic, sharedShell), 'utf8');
const mediaArtDir = path.join(__dirname, 'media-art');
fs.mkdirSync(mediaArtDir, { recursive: true });
fs.writeFileSync(path.join(mediaArtDir, 'index.html'), mediaArtGuideHtml(postsPublic, mediaArtTaxonomyState, sharedShell), 'utf8');

// Write sitemap.xml at repo root
const staticUrls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
    { loc: `${SITE_URL}/blog/`, priority: '0.9' },
    { loc: `${SITE_URL}/blog/media-art/`, lastmod: '2026-09-12', priority: '0.9' },
    { loc: `${SITE_URL}/blog/ax/`, lastmod: '2026-09-09', priority: '0.9' },
    { loc: `${SITE_URL}/learnmap/`, lastmod: '2026-09-09', priority: '0.7' },
    { loc: `${SITE_URL}/osmu/`, priority: '0.7' },
    { loc: `${SITE_URL}/osmu/fin.html`, priority: '0.6' },
    { loc: `${SITE_URL}/about-deck.html`, priority: '0.5' },
    { loc: `${SITE_URL}/clean/`, lastmod: '2026-08-11', priority: '0.6' },
    { loc: `${SITE_URL}/gptersakm/`, lastmod: '2026-08-16', priority: '0.8' },
    { loc: `${SITE_URL}/mice-safety/`, lastmod: '2026-09-09', priority: '0.8' },
    { loc: `${SITE_URL}/virme/`, lastmod: '2026-08-22', priority: '0.8' }
];
// Guard: build.js is the ONLY author of sitemap.xml. If a new top-level page
// directory is committed without registering it in staticUrls above, the next
// baseline build silently drops it from the sitemap and every daily publisher
// run halts with HOLD_BASELINE (observed 2026-09-01..09-05 for /virme/).
// Warn loudly here so the omission is caught in the same PR, not days later.
const SITEMAP_INTENTIONALLY_UNLISTED = new Set([
    'blog',            // emitted as post URLs below
    'docs', 'scripts', 'graphify-out', 'node_modules',
    'akm1w', 'akm2w', 'akm3w', 'akm4w',   // course/student pages, not for search
    'learning-coach-gem', 'mysuni-marketing',
    'ai-school', 'gapmap', 'gen', 'glsl', 'interactive',
    'luckydrop', 'nara', 'pitch-lab-v2', 'pitchlab', 'vfx', 'vibecheck'
]);
try {
    const listed = new Set(staticUrls.map(u => u.loc.replace(SITE_URL, '').replace(/^\/|\/$/g, '')));
    const unregistered = fs.readdirSync(REPO_ROOT, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('.'))
        .map(d => d.name)
        .filter(name => fs.existsSync(path.join(REPO_ROOT, name, 'index.html')))
        .filter(name => !listed.has(name) && !SITEMAP_INTENTIONALLY_UNLISTED.has(name));
    if (unregistered.length) {
        console.warn(`⚠ sitemap: top-level page(s) not registered in staticUrls -> ${unregistered.join(', ')}`);
        console.warn('  Add them to staticUrls in blog/build.js, or to SITEMAP_INTENTIONALLY_UNLISTED if they must stay out of the sitemap.');
        console.warn('  Leaving this unresolved causes sitemap drift and blocks the daily publishers.');
    }
} catch (err) {
    console.warn(`⚠ sitemap registration check skipped: ${err.message}`);
}

const postUrls = posts.map(p => ({
    loc: `${SITE_URL}/blog/posts/${p.slug}/`,
    lastmod: p.modified,
    priority: '0.8'
}));
const allUrls = [...staticUrls, ...postUrls];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `
    <lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(REPO_ROOT, 'sitemap.xml'), sitemapXml, 'utf8');

// Write robots.txt at repo root (only if missing or outdated)
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(REPO_ROOT, 'robots.txt'), robotsTxt, 'utf8');

const audit = classificationAudit(posts);
console.log(`✓ Generated posts.json — ${posts.length} post(s)`);
console.log(`✓ Generated ${posts.length} static post page(s) under blog/posts/[slug]/`);
console.log(`✓ Generated sitemap.xml (${allUrls.length} URLs) and robots.txt`);
console.log(`✓ Track audit — total=${audit.total}; ${EDITORIAL_TRACKS.map(track => `${track.slug}=${audit.trackCounts[track.slug]}`).join('; ')}`);
console.log(`  classification: explicit=${audit.sourceCounts.explicit}; fallback=${audit.sourceCounts.fallback}; catch-all=${audit.sourceCounts['catch-all']}`);
console.log(`  categories: ${Object.entries(audit.categoryCounts).sort(([a], [b]) => a.localeCompare(b)).map(([category, count]) => `${category}=${count}`).join('; ')}`);
posts.forEach(p => console.log(`  ${p.date}  ${p.slug.padEnd(40)}  ${p.title}`));
