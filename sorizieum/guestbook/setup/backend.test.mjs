import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const source = fs.readFileSync(new URL('./Code.gs', import.meta.url), 'utf8');
function setup({ busy = false, broken = false } = {}) {
  const rows = [['headers']];
  let releases = 0;
  const context = {
    LockService: { getScriptLock: () => ({ tryLock: () => !busy, releaseLock: () => releases++ }) },
    SpreadsheetApp: {
      openById: () => ({ getSheetByName: () => broken ? null : ({
        getLastRow: () => rows.length,
        getRange: () => ({ createTextFinder: id => ({ matchEntireCell: () => ({ findNext: () => rows.some(row => row[0] === id) ? {} : null }) }) }),
        appendRow: row => rows.push(row),
      }) }),
      flush() {},
    },
    Utilities: { formatDate: (_date, zone, pattern) => { assert.equal(zone, 'Asia/Seoul'); assert.equal(pattern, 'yyyy-MM-dd HH:mm:ss'); return '2026-11-06 12:00:00'; } },
    ContentService: { MimeType: { JSON: 'JSON' }, createTextOutput: value => ({ setMimeType: () => JSON.parse(value) }) },
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  return { send: data => context.doPost({ parameter: data }), rows, releases: () => releases };
}
const valid = { requestId: '0cbfabfc-03de-4e3b-9f5d-65bfc5070182', gender: '남', ageGroup: '성인', consent: '동의', consentVersion: '2026-11-06-v2' };
test('동의한 방문을 서버 시간으로 저장하며 재전송은 중복 기록하지 않는다', () => {
  const env = setup();
  assert.deepEqual(env.send(valid), { ok: true, requestId: valid.requestId });
  assert.deepEqual([...env.rows[1]], [valid.requestId, '2026-11-06 12:00:00', '남', '성인', '동의', '2026-11-06-v2']);
  assert.equal(env.send(valid).ok, true);
  assert.equal(env.rows.length, 2);
  assert.equal(env.releases(), 2);
});
test('누락·임의 값·수식 주입·이전 동의문 버전을 거부한다', () => {
  for (const patch of [{ gender: '' }, { ageGroup: '=IMPORTXML("https://example.com")' }, { consent: 'yes' }, { consent: '' }, { consent: '비동의' }, { requestId: 'abc' }, { consentVersion: 'old' }]) {
    const env = setup();
    assert.equal(env.send({ ...valid, ...patch }).ok, false);
    assert.equal(env.rows.length, 1);
  }
});
test('락 또는 시트 오류를 성공 응답으로 바꾸지 않는다', () => {
  const busy = setup({ busy: true });
  assert.equal(busy.send(valid).error, 'busy');
  const broken = setup({ broken: true });
  assert.equal(broken.send(valid).error, 'sheet_unavailable');
  assert.equal(broken.releases(), 1);
});
