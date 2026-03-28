#!/usr/bin/env node
/**
 * DEXA Blog Build Script
 * Scans posts/*.md, parses Obsidian frontmatter, generates posts.json
 *
 * Usage: node blog/build.js
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT = path.join(__dirname, 'posts.json');

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return { meta: {}, body: content };

    const raw = match[1];
    const meta = {};

    let currentKey = null;
    let currentList = null;

    for (const line of raw.split('\n')) {
        // List item
        const listMatch = line.match(/^\s+-\s+"?(.+?)"?\s*$/);
        if (listMatch && currentKey) {
            if (!currentList) currentList = [];
            // Clean Obsidian wiki-links
            currentList.push(listMatch[1].replace(/\[\[([^\]]+)\]\]/g, '$1'));
            meta[currentKey] = currentList;
            continue;
        }

        // Key-value pair
        const kvMatch = line.match(/^([^:]+):\s*"?(.+?)"?\s*$/);
        if (kvMatch) {
            currentKey = kvMatch[1].trim();
            const val = kvMatch[2].replace(/\[\[([^\]]+)\]\]/g, '$1').replace(/^"(.*)"$/, '$1');
            meta[currentKey] = val;
            currentList = null;
            continue;
        }

        // Key with no value (next lines are list)
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

function extractDescription(body, maxLen = 120) {
    // Get first meaningful paragraph (skip headings, blank lines)
    const lines = body.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('#')) continue;
        if (trimmed.startsWith('>')) continue;
        if (trimmed.startsWith('---')) continue;
        // Clean markdown formatting
        const clean = trimmed
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
    // Convert Korean slug to simple ASCII for GitHub Pages compatibility
    return slug
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // strip accents
        .replace(/[^\x00-\x7F]/g, '')  // remove non-ASCII
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase() || 'post';
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// --- Main ---

const BUILT_DIR = path.join(__dirname, 'posts', '_built');
if (!fs.existsSync(BUILT_DIR)) fs.mkdirSync(BUILT_DIR, { recursive: true });

// Clean old built files
fs.readdirSync(BUILT_DIR).filter(f => f.endsWith('.md')).forEach(f => {
    fs.unlinkSync(path.join(BUILT_DIR, f));
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

    // Build ASCII slug: prefer English alias → title ASCII parts → hash fallback
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

    // Copy .md to _built/ with ASCII filename (GitHub Pages can't serve Korean filenames)
    fs.copyFileSync(
        path.join(POSTS_DIR, filename),
        path.join(BUILT_DIR, asciiSlug + '.md')
    );

    return {
        slug: asciiSlug,
        file: '_built/' + asciiSlug + '.md',
        title,
        description: escapeHtml(extractDescription(body)),
        category: categoryFromTags(tags),
        tags: displayTags,
        date: meta['date created'] || meta['date modified'] || new Date().toISOString().split('T')[0],
        thumbnail: meta.thumbnail || '',
        author: Array.isArray(meta.author) ? meta.author[0] : (meta.author || 'Deck')
    };
});

// Sort by date descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(OUTPUT, JSON.stringify(posts, null, 2), 'utf8');

console.log(`✓ Generated posts.json — ${posts.length} post(s)`);
posts.forEach(p => console.log(`  ${p.date}  ${p.slug.padEnd(20)}  ${p.title}`));
