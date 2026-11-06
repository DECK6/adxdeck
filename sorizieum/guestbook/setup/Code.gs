// Deploy as: Web app / Execute as: Me / Access: Anyone.
// Public endpoint only appends validated rows. It never exposes existing rows.
const SPREADSHEET_ID = '1IVHY-T-V3bAufjfqIraudFr3TKCHAnbVc9NjDWihd98';
const SHEET_NAME = '방문기록';
const CONSENT_VERSION = '2026-11-06-v1';

function doGet() {
  return json_({ ok: true, service: 'sorizieum-guestbook' });
}

function doPost(event) {
  const data = (event && event.parameter) || {};
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.requestId || '') ||
      !['남', '여'].includes(data.gender) ||
      !['유아', '초등', '중등', '고등', '대학', '성인'].includes(data.ageGroup) ||
      !['동의', '비동의'].includes(data.consent) ||
      data.consentVersion !== CONSENT_VERSION) {
    return json_({ ok: false, error: 'invalid_fields' });
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return json_({ ok: false, error: 'busy' });
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) return json_({ ok: false, error: 'sheet_unavailable' });
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const found = sheet.getRange(2, 1, lastRow - 1, 1).createTextFinder(data.requestId).matchEntireCell(true).findNext();
      if (found) return json_({ ok: true, requestId: data.requestId });
    }
    // Time is assigned by the server in Korea time, never trusted from a kiosk.
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow([data.requestId, timestamp, data.gender, data.ageGroup, data.consent, CONSENT_VERSION]);
    SpreadsheetApp.flush();
    return json_({ ok: true, requestId: data.requestId });
  } catch (error) {
    return json_({ ok: false, error: 'save_failed' });
  } finally {
    lock.releaseLock();
  }
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
