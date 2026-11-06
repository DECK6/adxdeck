(() => {
  'use strict';
  const config = window.GUESTBOOK_CONFIG;
  const form = document.querySelector('#guestbook');
  const submit = document.querySelector('#submit');
  const status = document.querySelector('#form-status');
  const success = document.querySelector('#success');
  const dialog = document.querySelector('#consent-dialog');
  const fields = ['gender', 'ageGroup', 'consent'];
  let pending = false;
  let requestId = null;
  let requestFingerprint = null;
  let idleTimer;
  let resetTimer;
  let countdownTimer;

  function updateDate() {
    const now = new Date();
    const today = document.querySelector('#today');
    today.dateTime = now.toISOString();
    today.textContent = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now).replaceAll('-', '. ');
  }
  function message(text, error = false) {
    status.textContent = text;
    status.classList.toggle('error', error);
  }
  function reset() {
    if (pending) return;
    clearTimeout(resetTimer);
    clearInterval(countdownTimer);
    form.reset();
    success.hidden = true;
    requestId = requestFingerprint = null;
    dialog.close();
    message('세 가지 항목을 선택하면 기록할 수 있어요.');
    updateDate();
    scheduleIdle();
  }
  function scheduleIdle() {
    clearTimeout(idleTimer);
    if (!pending) idleTimer = setTimeout(reset, config.idleSeconds * 1000);
  }
  function showSuccess() {
    clearTimeout(idleTimer);
    success.hidden = false;
    document.querySelector('#success-title').focus({ preventScroll: true });
    let seconds = config.resetSeconds;
    document.querySelector('#countdown').textContent = seconds;
    countdownTimer = setInterval(() => {
      document.querySelector('#countdown').textContent = Math.max(0, --seconds);
    }, 1000);
    resetTimer = setTimeout(reset, seconds * 1000);
  }

  // A plain form POST avoids a CORS preflight. Only a readable, matching
  // acknowledgement from Apps Script counts as success (never no-cors).
  async function save(payload) {
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(config.endpoint)) {
      throw new Error('저장 연결을 준비 중입니다. 현장 담당자에게 알려주세요.');
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        body: new URLSearchParams(payload),
        signal: controller.signal,
        credentials: 'omit',
        redirect: 'follow',
      });
      if (!response.ok) throw new Error('save failed');
      const result = await response.json();
      if (result.ok !== true || result.requestId !== payload.requestId) throw new Error('invalid acknowledgement');
    } finally {
      clearTimeout(timer);
    }
  }

  form.addEventListener('change', () => {
    const values = new FormData(form);
    const count = fields.filter(field => values.has(field)).length;
    message(count === fields.length ? '선택이 끝났어요. 아래 버튼을 눌러주세요.' : `${count} / 3 선택했어요. 나머지 항목도 선택해주세요.`);
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    const values = new FormData(form);
    const missing = fields.find(field => !values.has(field));
    if (missing) {
      const labels = { gender: '성별', ageGroup: '연령대', consent: '동의 여부' };
      message(`${labels[missing]}를 선택해주세요.`, true);
      form.elements[missing][0].focus({ preventScroll: true });
      return;
    }
    const fingerprint = fields.map(field => values.get(field)).join('|');
    if (fingerprint !== requestFingerprint) {
      requestId = crypto.randomUUID();
      requestFingerprint = fingerprint;
    }
    const payload = {
      requestId,
      gender: values.get('gender'),
      ageGroup: values.get('ageGroup'),
      consent: values.get('consent'),
      consentVersion: config.consentVersion,
    };
    pending = true;
    clearTimeout(idleTimer);
    form.setAttribute('aria-busy', 'true');
    form.querySelectorAll('input, button').forEach(control => { control.disabled = true; });
    submit.firstElementChild.textContent = '기록을 저장하고 있어요';
    message('잠시만 기다려주세요.');
    try {
      await save(payload);
      showSuccess();
    } catch (error) {
      message(error.message.startsWith('저장 연결') ? error.message : '저장을 확인하지 못했어요. 연결을 확인한 뒤 다시 눌러주세요.', true);
    } finally {
      pending = false;
      form.removeAttribute('aria-busy');
      form.querySelectorAll('input, button').forEach(control => { control.disabled = false; });
      submit.firstElementChild.textContent = '방문 기록 남기기';
      if (success.hidden) scheduleIdle();
    }
  });
  document.querySelector('#open-consent').addEventListener('click', () => dialog.showModal());
  document.querySelector('#close-consent').addEventListener('click', () => dialog.close());
  document.querySelector('#next-guest').addEventListener('click', () => {
    reset();
    form.elements.gender[0].focus({ preventScroll: true });
  });
  ['pointerdown', 'keydown'].forEach(type => document.addEventListener(type, scheduleIdle, { passive: true }));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) reset(); });
  updateDate();
  scheduleIdle();
})();
