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

function renderInline(text) {
    // Escape HTML first
    let out = escapeHtml(text);
    // Images: ![alt](url)
    out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) =>
        `<img src="${escapeAttr(url)}" alt="${escapeAttr(alt)}" loading="lazy">`);
    // Links: [text](url)
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, txt, url) =>
        `<a href="${escapeAttr(url)}">${txt}</a>`);
    // Bold: **text**
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    // Inline code: `code`
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
    return out;
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

// ─── Static post page template ───

function formatDateHuman(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function postPageHtml(post, bodyHtml, prev, next) {
    const canonical = `${SITE_URL}/blog/posts/${post.slug}/`;
    const ogImage = post.thumbnail
        ? `${SITE_URL}/blog/${post.thumbnail.replace(/^\/+/, '')}`
        : `${SITE_URL}/dexa_logo.jpg`;
    const desc = post.description || `${post.title} — DEXA Blog`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
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
        ? `<a id="prev-post" href="/blog/posts/${prev.slug}/" class="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00F0FF] transition-colors"><span class="material-symbols-outlined text-lg">arrow_back</span><span>${escapeHtml(prev.title)}</span></a>`
        : '<span></span>';
    const nextLink = next
        ? `<a id="next-post" href="/blog/posts/${next.slug}/" class="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00F0FF] transition-colors"><span>${escapeHtml(next.title)}</span><span class="material-symbols-outlined text-lg">arrow_forward</span></a>`
        : '<span></span>';

    const tagsHtml = (post.tags || []).map(t =>
        `<span class="text-[10px] font-mono text-gray-600 bg-white/5 px-2 py-0.5 rounded">${escapeHtml(t)}</span>`
    ).join('');

    return `<!DOCTYPE html>
<html class="dark" lang="ko">
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
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        primary: "#00F0FF", "primary-hover": "#00C2CC",
                        "background-light": "#000000", "background-dark": "#000000",
                        "card-dark": "#0A0A0A", "accent-green": "#39FF14", "accent-purple": "#BC13FE"
                    },
                    fontFamily: {
                        display: ['"Noto Sans KR"', '"Inter"', "sans-serif"],
                        body: ['"Noto Sans KR"', '"Inter"', "sans-serif"]
                    }
                }
            }
        };
    </script>
    <style>
        body { font-family: 'Noto Sans KR', 'Inter', sans-serif; background-color: #000; color: #e5e7eb; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 0; }
        ::-webkit-scrollbar-thumb:hover { background: #00F0FF; }
        .prose-dexa h1 { font-size: 2.5rem; font-weight: 900; color: #fff; letter-spacing: -0.025em; margin-bottom: 1.5rem; line-height: 1.1; }
        .prose-dexa h2 { font-size: 1.5rem; font-weight: 700; color: #fff; margin-top: 2.5rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,.1); }
        .prose-dexa h3 { font-size: 1.2rem; font-weight: 600; color: #e5e7eb; margin-top: 2rem; margin-bottom: 0.75rem; }
        .prose-dexa p { color: #9ca3af; line-height: 1.8; margin-bottom: 1.25rem; }
        .prose-dexa strong { color: #fff; font-weight: 600; }
        .prose-dexa em { color: #6b7280; }
        .prose-dexa a { color: #00F0FF; text-decoration: none; border-bottom: 1px solid rgba(0,240,255,.3); transition: border-color .2s; }
        .prose-dexa a:hover { border-bottom-color: #00F0FF; }
        .prose-dexa ul, .prose-dexa ol { color: #9ca3af; margin-bottom: 1.25rem; padding-left: 1.5rem; }
        .prose-dexa li { margin-bottom: 0.5rem; line-height: 1.7; }
        .prose-dexa ul li::marker, .prose-dexa ol li::marker { color: #00F0FF; }
        .prose-dexa blockquote { border-left: 3px solid #00F0FF; padding-left: 1.25rem; margin: 1.5rem 0; color: #6b7280; font-style: italic; }
        .prose-dexa pre { background: #0a0a0a; border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 1.25rem; overflow-x: auto; margin: 1.5rem 0; }
        .prose-dexa code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.875rem; }
        .prose-dexa p code { background: rgba(0,240,255,.1); color: #00F0FF; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.85em; }
        .prose-dexa pre code { background: none; color: #e5e7eb; padding: 0; }
        .prose-dexa hr { border: none; border-top: 1px solid rgba(255,255,255,.1); margin: 2.5rem 0; }
        .prose-dexa img { border-radius: 8px; border: 1px solid rgba(255,255,255,.1); margin: 1.5rem 0; max-width: 100%; height: auto; }
    </style>
</head>
<body class="text-gray-300 antialiased selection:bg-[#00F0FF] selection:text-black">
    <nav class="fixed w-full z-50 bg-black border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <a href="/" class="flex-shrink-0 flex items-center gap-3 group cursor-pointer">
                    <img src="/dexa_logo.svg" alt="DEXA Logo" class="h-16 w-auto group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all">
                </a>
                <div class="hidden md:flex space-x-10 items-center">
                    <a class="text-sm font-semibold uppercase tracking-wider text-gray-400 hover:text-[#00F0FF] transition-colors" href="/">HOME</a>
                    <a class="text-sm font-semibold uppercase tracking-wider text-gray-400 hover:text-[#00F0FF] transition-colors" href="/#studio">STUDIO</a>
                    <a class="text-sm font-semibold uppercase tracking-wider text-[#00F0FF] drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]" href="/blog/">BLOG</a>
                    <a class="text-sm font-semibold uppercase tracking-wider text-gray-400 hover:text-[#00F0FF] transition-colors" href="/about-deck.html">ABOUT</a>
                    <a class="text-sm font-semibold uppercase tracking-wider text-gray-400 hover:text-[#BC13FE] transition-colors" href="/#contact">CONTACT</a>
                </div>
            </div>
        </div>
    </nav>
    <main class="pt-32 pb-24 lg:pt-40">
        <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-10">
                <a href="/blog/" class="inline-flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-[#00F0FF] transition-colors mb-6 uppercase tracking-wider">
                    <span class="material-symbols-outlined text-sm">arrow_back</span> Back to Blog
                </a>
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-[#00F0FF] font-mono text-xs uppercase tracking-widest border border-[#00F0FF]/30 px-2 py-1 rounded-sm bg-[#00F0FF]/5">${escapeHtml(post.category)}</span>
                    <span class="text-gray-600 font-mono text-xs">${formatDateHuman(post.date)}</span>
                </div>
                <div class="flex flex-wrap gap-2 mt-4">${tagsHtml}</div>
            </div>
            <div class="prose-dexa">
${bodyHtml}
            </div>
            <nav class="mt-16 pt-8 border-t border-white/10 flex justify-between items-center" aria-label="Post navigation">
                ${prevLink}
                ${nextLink}
            </nav>
        </article>
    </main>
    <footer class="bg-black text-white pt-12 pb-8 border-t border-[#1a1a1a]">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <a href="/" class="flex items-center gap-3"><img src="/dexa_logo.svg" alt="DEXA" class="h-12 w-auto"></a>
                <p class="text-[10px] text-gray-700 font-mono text-center md:text-right">Where AI Meets Art.<br />&copy; 2025 DEXA. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>
`;
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
        date: meta['date created'] || meta['date modified'] || new Date().toISOString().split('T')[0],
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
    const bodyHtml = renderMarkdown(post._body);
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

// Write sitemap.xml at repo root
const staticUrls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
    { loc: `${SITE_URL}/blog/`, priority: '0.9' },
    { loc: `${SITE_URL}/about-deck.html`, priority: '0.5' }
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
