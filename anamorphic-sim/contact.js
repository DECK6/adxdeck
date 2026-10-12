(() => {
  const form = document.querySelector('#inquiry-form');
  const topic = document.querySelector('#inquiry-topic');
  const button = document.querySelector('#inquiry-submit');
  const status = document.querySelector('#inquiry-status');
  const idleLabel = button.innerHTML;
  let pending = false;

  document.querySelectorAll('[data-inquiry]').forEach(link => {
    link.addEventListener('click', () => { topic.value = link.dataset.inquiry; });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity() || form.elements.botcheck.checked) return;
    pending = true;
    button.disabled = true;
    button.textContent = '보내는 중…';
    status.textContent = '';
    status.dataset.state = 'pending';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const data = new FormData(form);
      data.set('subject', `Anamorphic Sim · ${topic.value}`);
      const response = await fetch(form.action, { method: 'POST', body: data, signal: controller.signal });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Submission failed');
      form.reset();
      status.dataset.state = 'success';
      status.textContent = '문의가 접수되었습니다. 남겨주신 이메일로 답변드리겠습니다.';
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.name === 'AbortError'
        ? '응답을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요. 작성 내용은 남아 있습니다.'
        : '문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요. 작성 내용은 남아 있습니다.';
    } finally {
      clearTimeout(timeout);
      pending = false;
      button.disabled = false;
      button.innerHTML = idleLabel;
    }
  });
})();
