const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { test } = require('node:test');

test('blog rebuild preserves approved public routes and is deterministic', () => {
    const root = path.resolve(__dirname, '..');
    const committed = execFileSync('git', ['show', 'HEAD:sitemap.xml'], { cwd: root, encoding: 'utf8' });
    const locations = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    execFileSync(process.execPath, ['blog/build.js'], { cwd: root, stdio: 'pipe' });
    const first = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
    const rebuilt = new Set(locations(first));
    const missing = locations(committed).filter(url => !rebuilt.has(url));
    assert.deepEqual(missing, [], 'build must preserve approved live sitemap routes');
    assert.ok(rebuilt.has('https://dexa.art/anamorphic-sim/'));
    assert.equal(rebuilt.size, locations(first).length, 'no duplicate sitemap URLs');
    execFileSync(process.execPath, ['blog/build.js'], { cwd: root, stdio: 'pipe' });
    assert.equal(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8'), first);
});
