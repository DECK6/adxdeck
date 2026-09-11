#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');
const root = path.join(__dirname, '..');
const buildPath = path.join(root, 'blog/build.js');
const source = fs.readFileSync(buildPath, 'utf8');
const mainOffset = source.indexOf('// ─── Main ───');
assert.ok(mainOffset > 0);
const context = { require: createRequire(buildPath), __dirname: path.dirname(buildPath), console, Intl, Date };
vm.createContext(context);
vm.runInContext(source.slice(0, mainOffset), context, { filename: buildPath });
const { renderInline, renderMarkdown } = context;
const fixtures = require('./fixtures/renderer-urls.json');
// Independent HTML parser: decode attributes exactly once, not with renderer helpers.
function elements(html) {
    const result = spawnSync('python3', ['-c', `
import json, sys
from html.parser import HTMLParser
class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.nodes = []
    def handle_starttag(self, tag, attrs):
        self.nodes.append({'tag': tag, 'attrs': dict(attrs)})
p = Parser()
p.feed(sys.stdin.read())
print(json.dumps(p.nodes))
`], { input: html, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
}
for (const fixture of fixtures) {
    for (const image of [false, true]) {
        test(`${image ? 'image src' : 'link href'} round trips raw ${fixture.name}`, () => {
            const label = `A &amp; B & "C" 'D' <safe>`;
            const html = renderInline(`${image ? '!' : ''}[${label}](${fixture.url})`);
            const nodes = elements(html);
            assert.equal(nodes.length, 1, html);
            assert.equal(nodes[0].tag, image ? 'img' : 'a');
            assert.equal(nodes[0].attrs[image ? 'src' : 'href'], fixture.normalized, html);
            assert.deepEqual(Object.keys(nodes[0].attrs).sort(), image ? ['alt', 'loading', 'src'] : ['href']);
            if (image) assert.equal(nodes[0].attrs.alt, label);
            assert.doesNotMatch(html, /<safe>/);
        });
    }
}
test('all block consumers preserve inline destinations', () => {
    const url = fixtures[0].url;
    const link = `[source](${url})`;
    const md = `# ${link}\n\n${link}\n\n> ${link}\n\n- ${link}\n\n1. ${link}\n\n| source | note |\n| --- | --- |\n| ${link} | ok |`;
    const links = elements(renderMarkdown(md)).filter(node => node.tag === 'a');
    assert.equal(links.length, 6);
    for (const node of links) assert.equal(node.attrs.href, url);
});
test('code stays literal and labels retain formatting without unsafe markup', () => {
    assert.equal(renderInline('`[x](https://x.test/?a=1&b=2) ha_* <x>`'), '<code>[x](https://x.test/?a=1&amp;b=2) ha_* &lt;x&gt;</code>');
    assert.equal(renderInline('[**bold** and *italic*](https://x.test/)'), '<a href="https://x.test/"><strong>bold</strong> and <em>italic</em></a>');
    assert.equal(renderInline('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    for (const url of ['javascript:alert(1)', 'data:text/html,<svg>']) {
        assert.ok(elements(renderInline(`[x](${url})`))[0].attrs.href.startsWith('/blog/'));
    }
});
