#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
};
const pass = (message) => console.log(`✓ ${message}`);
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const count = (text, re) => (text.match(re) || []).length;

const index = read('index.html');
const blog = read('blog/index.html');
const posts = JSON.parse(read('blog/posts.json'));

if (/<meta\s+name="description"\s+content="[^"]{80,}"/i.test(index)) pass('home has a substantial meta description');
else fail('home is missing a substantial meta description');

if (/"@type"\s*:\s*"Organization"/.test(index) && /"@type"\s*:\s*"WebSite"/.test(index)) pass('home has Organization and WebSite JSON-LD');
else fail('home is missing Organization/WebSite JSON-LD');

if (!/href="(?:\.\.\/)?(?:index|blog\/index)\.html(?:#[^"]*)?"/.test(index + blog)) pass('primary home/blog links use canonical paths');
else fail('index.html or blog/index.html links remain in primary pages');

const staticPostLinks = count(blog, /href="\/blog\/posts\/[^"]+\/"/g);
if (staticPostLinks >= Math.min(posts.length, 20)) pass(`blog index includes static post links (${staticPostLinks})`);
else fail(`blog index has too few static post links (${staticPostLinks})`);

if (/"@type"\s*:\s*"CollectionPage"/.test(blog) && /"@type"\s*:\s*"Blog"/.test(blog)) pass('blog index has CollectionPage/Blog JSON-LD');
else fail('blog index is missing CollectionPage/Blog JSON-LD');

if (/aria-label="Open navigation menu"/.test(index) && /aria-expanded="false"/.test(index)) pass('home mobile menu button has accessible state labels');
else fail('home mobile menu button lacks aria-label/aria-expanded');

let badDates = [];
for (const post of posts) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) badDates.push(`${post.slug}:${post.date}`);
}
if (!badDates.length) pass('all posts use YYYY-MM-DD dates');
else fail(`posts have non-normalized dates: ${badDates.slice(0, 5).join(', ')}`);

let badH1 = [];
let missingLang = [];
for (const post of posts) {
  const rel = `blog/posts/${post.slug}/index.html`;
  const html = read(rel);
  const h1Count = count(html, /<h1\b/g);
  if (h1Count !== 1) badH1.push(`${post.slug}:${h1Count}`);
  if (!/"inLanguage"\s*:\s*"ko-KR"/.test(html)) missingLang.push(post.slug);
}
if (!badH1.length) pass('all static post pages have exactly one h1');
else fail(`post pages with invalid h1 count: ${badH1.slice(0, 8).join(', ')}`);

if (!missingLang.length) pass('all Article JSON-LD includes inLanguage');
else fail(`Article JSON-LD missing inLanguage: ${missingLang.slice(0, 8).join(', ')}`);

if (process.exitCode) process.exit(process.exitCode);
