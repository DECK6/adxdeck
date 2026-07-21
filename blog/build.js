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
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT = path.join(__dirname, 'posts.json');
const SITE_URL = 'https://dexa.art';

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return { meta: {}, body: content };

    const raw = match[1];
    const meta = {};

    let currentKey = null;
    let currentList = null;

    for (const line of raw.split('\n')) {
        const listMatch = line.match(/^\s+-\s+"?(.+?)"?\s*$/);
        if (listMatch && currentKey) {
            if (!currentList) currentList = [];
            currentList.push(listMatch[1].replace(/\[\[([^\]]+)\]\]/g, '$1'));
            meta[currentKey] = currentList;
            continue;
        }

        const kvMatch = line.match(/^([^:]+):\s*"?(.+?)"?\s*$/);
        if (kvMatch) {
            currentKey = kvMatch[1].trim();
            const val = kvMatch[2].replace(/\[\[([^\]]+)\]\]/g, '$1').replace(/^"(.*)"$/, '$1');
            meta[currentKey] = val;
            currentList = null;
            continue;
        }

        const keyOnly = line.match(/^([^:]+):\s*$/);
        if (keyOnly) {
            currentKey = keyOnly[1].trim();
            currentList = [];
            meta[currentKey] = currentList;
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
    if (tags.includes('article')) return 'Article';
    if (tags.includes('project')) return 'Project';
    if (tags.includes('thought')) return 'Thought';
    if (tags.includes('tutorial')) return 'Tutorial';
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
    // Escape HTML first
    let out = escapeHtml(text);
    // Protect inline code before emphasis parsing so `ha_*` does not become broken italic HTML.
    const codeSpans = [];
    out = out.replace(/`([^`]+)`/g, (_m, code) => {
        const token = `\u0000CODE${codeSpans.length}\u0000`;
        codeSpans.push(`<code>${code}</code>`);
        return token;
    });
    // Images: ![alt](url)
    out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) =>
        `<img src="${escapeAttr(normalizeContentUrl(url))}" alt="${escapeAttr(alt)}" loading="lazy">`);
    // Links: [text](url)
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, txt, url) =>
        `<a href="${escapeAttr(normalizeContentUrl(url))}">${txt}</a>`);
    // Bold: **text**
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    // Restore inline code spans.
    out = out.replace(/\u0000CODE(\d+)\u0000/g, (_m, idx) => codeSpans[Number(idx)] || '');
    return out;
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
        'dateModified': post.date,
        'author': { '@type': 'Person', 'name': post.author || 'Deck' },
        'publisher': {
            '@type': 'Organization',
            'name': 'DEXA',
            'logo': { '@type': 'ImageObject', 'url': `${SITE_URL}/dexa_logo.jpg` }
        },
        'mainEntityOfPage': { '@type': 'WebPage', '@id': canonical },
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
    <nav class="dx-nav">
        <a href="/" class="dx-nav-brand">
            <svg viewBox="4 4 112 98" width="34" height="30" aria-hidden="true">
                <g stroke-linejoin="round">
                    <path d="M60 10 109 95H11Z" fill="none" stroke="#17181B" stroke-width="5.5"></path>
                    <path d="M60 20 79 53H41Z" fill="#17181B"></path>
                    <path d="M36 57 55 90H17Z" fill="#17181B"></path>
                    <path d="M84 57 103 90H65Z" fill="#FF5A1F"></path>
                    <path d="M60 51 79 84H41Z" fill="#F5F1E6" stroke="#17181B" stroke-width="3.5"></path>
                </g>
            </svg>
            <span class="wordmark">DEXA<span class="dot">.</span></span>
            <span class="dx-nav-tag">AI × MEDIA ART STUDIO</span>
        </a>
        <div class="dx-nav-links">
            <a href="/">HOME</a>
            <a href="/#studio">STUDIO</a>
            <a href="/blog/" class="active">BLOG</a>
            <a href="/about-deck.html">ABOUT</a>
            <a href="/#contact">CONTACT</a>
        </div>
    </nav>
    <main style="padding:128px 24px 96px;">
        <article style="max-width:720px;margin:0 auto;">
            <div style="margin-bottom:40px;">
                <a href="/blog/" class="btn-ghost" style="padding-left:0;">← Back to Blog</a>
                <div class="dx-kicker" style="margin-top:20px;">${escapeHtml(post.category)} · ${formatDateDots(post.date)}</div>
            </div>
            <div class="prose">
                <h1>${escapeHtml(post.title)}</h1>
                <p style="color:var(--muted);font-size:17px;">${escapeHtml(desc)}</p>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 8px;">${tagsHtml}</div>
${bodyHtml}
            </div>
            <nav class="spec-list" style="margin-top:64px;" aria-label="Post navigation">
                ${prevLink}
                ${nextLink}
            </nav>
        </article>
    </main>
    <footer class="dx-footer" style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;">
        <a href="/" style="display:flex;align-items:center;gap:10px;">
            <svg viewBox="4 4 112 98" width="28" height="24" aria-hidden="true">
                <g stroke-linejoin="round">
                    <path d="M60 10 109 95H11Z" fill="none" stroke="#17181B" stroke-width="5.5"></path>
                    <path d="M60 20 79 53H41Z" fill="#17181B"></path>
                    <path d="M36 57 55 90H17Z" fill="#17181B"></path>
                    <path d="M84 57 103 90H65Z" fill="#FF5A1F"></path>
                    <path d="M60 51 79 84H41Z" fill="#F5F1E6" stroke="#17181B" stroke-width="3.5"></path>
                </g>
            </svg>
        </a>
        <p class="dx-footer-note" style="margin:0;text-align:right;">Where AI Meets Art.<br />&copy; 2025 DEXA. All rights reserved.</p>
    </footer>
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
    return `<a class="post-card panel-card" href="/blog/posts/${escapeAttr(post.slug)}/" data-category="${escapeAttr(post.category)}" aria-label="Read ${escapeAttr(post.title)}">
  ${imageHtml}
  <span class="dx-meta"><span class="dx-badge">${escapeHtml(post.category)}</span><time datetime="${escapeAttr(post.date)}" class="dx-date">${escapeHtml(formatDateDots(post.date))}</time></span>
  <h3>${escapeHtml(post.title)}</h3>
  <p>${escapeHtml(post.description || '')}</p>
  <span class="dx-more">READ MORE →</span>
</a>`;
}

function replaceGeneratedBlock(html, start, end, content) {
    const re = new RegExp(`(<!-- ${start} -->)[\\s\\S]*?(<!-- ${end} -->)`, 'm');
    if (!re.test(html)) throw new Error(`Missing generated block markers: ${start}/${end}`);
    return html.replace(re, `$1\n${content}\n                $2`);
}

function trimTrailingWhitespace(text) {
    return text.replace(/[ \t]+$/gm, '');
}

function updateBlogIndex(postsPublic) {
    const blogIndexPath = path.join(__dirname, 'index.html');
    let html = fs.readFileSync(blogIndexPath, 'utf8');
    const categories = [...new Set(postsPublic.map(p => p.category).filter(Boolean))];
    const filters = [
        `<button class="dx-tag-chip active" type="button" data-filter="all">All</button>`,
        ...categories.map(cat => `<button class="dx-tag-chip" type="button" data-filter="${escapeAttr(cat)}">${escapeHtml(cat)}</button>`)
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
                'description': 'DEXA essays on AI, media art, creative technology, and agentic operations.',
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
                    'author': { '@type': 'Person', 'name': post.author || 'Deck' }
                }))
            }
        ]
    };
    html = replaceGeneratedBlock(html, 'STATIC_FILTERS_START', 'STATIC_FILTERS_END', filters);
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

// ─── Main ───

const BUILT_DIR = path.join(__dirname, 'posts', '_built');
if (!fs.existsSync(BUILT_DIR)) fs.mkdirSync(BUILT_DIR, { recursive: true });

// Clean old built .md files
fs.readdirSync(BUILT_DIR).filter(f => f.endsWith('.md')).forEach(f => {
    fs.unlinkSync(path.join(BUILT_DIR, f));
});

// Clean old static post directories (only directories directly under posts/, excluding _built)
const postsEntries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
postsEntries.forEach(ent => {
    if (ent.isDirectory() && ent.name !== '_built') {
        fs.rmSync(path.join(POSTS_DIR, ent.name), { recursive: true, force: true });
    }
});

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

const posts = files.map(filename => {
    const content = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { meta, body } = parseFrontmatter(content);

    const tags = Array.isArray(meta.tags) ? meta.tags : [];
    const displayTags = tags.filter(t => !['article', 'project', 'thought', 'tutorial', 'post'].includes(t));

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

    fs.copyFileSync(
        path.join(POSTS_DIR, filename),
        path.join(BUILT_DIR, asciiSlug + '.md')
    );

    const descriptionRaw = meta.description || extractDescription(body);

    return {
        slug: asciiSlug,
        file: '_built/' + asciiSlug + '.md',
        title,
        description: descriptionRaw,
        category: categoryFromTags(tags),
        tags: displayTags,
        date: normalizePostDate(filename, meta),
        thumbnail: meta.thumbnail || '',
        author: Array.isArray(meta.author) ? meta.author[0] : (meta.author || 'Deck'),
        _body: body
    };
});

// Sort newest first
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

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
const postsPublic = posts.map(({ _body, ...rest }) => ({
    ...rest,
    description: escapeHtml(rest.description)
}));
fs.writeFileSync(OUTPUT, JSON.stringify(postsPublic, null, 2), 'utf8');
updateBlogIndex(postsPublic);
updateHomePreview(postsPublic);

// Write sitemap.xml at repo root
const staticUrls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
    { loc: `${SITE_URL}/blog/`, priority: '0.9' },
    { loc: `${SITE_URL}/about-deck.html`, priority: '0.5' },
    { loc: `${SITE_URL}/mice-safety/`, lastmod: '2026-05-24', priority: '0.8' },
    { loc: `${SITE_URL}/virtume/`, lastmod: '2026-06-21', priority: '0.8' }
];
const postUrls = posts.map(p => ({
    loc: `${SITE_URL}/blog/posts/${p.slug}/`,
    lastmod: p.date,
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

console.log(`✓ Generated posts.json — ${posts.length} post(s)`);
console.log(`✓ Generated ${posts.length} static post page(s) under blog/posts/[slug]/`);
console.log(`✓ Generated sitemap.xml (${allUrls.length} URLs) and robots.txt`);
posts.forEach(p => console.log(`  ${p.date}  ${p.slug.padEnd(40)}  ${p.title}`));
