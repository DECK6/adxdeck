'use strict';

// Do not load analytics or transmit page events during local development.
if (!['localhost', '127.0.0.1', '[::1]', ''].includes(window.location.hostname)) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-QN6DDG3N8X');
  const analytics = document.createElement('script');
  analytics.async = true;
  analytics.src = 'https://www.googletagmanager.com/gtag/js?id=G-QN6DDG3N8X';
  document.head.appendChild(analytics);
}

const form = document.getElementById('contact-form');
if (form) {
  const button = document.getElementById('submit-btn');
  const success = document.getElementById('success-message');
  const error = document.getElementById('error-message');
  let pending = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    success.textContent = '';
    error.textContent = '';
    if (form.elements.botcheck.checked) return;

    pending = true;
    button.disabled = true;
    button.textContent = 'Sending inquiry…';
    form.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    // Snapshot before disabling fields so the request includes all user input.
    const data = new FormData(form);
    const fields = [...form.querySelectorAll('input:not([type="hidden"]), textarea')];
    fields.forEach((field) => { field.disabled = true; });

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Inquiry not accepted');
      form.reset();
      success.textContent = 'Your inquiry has been sent. Thank you for getting in touch.';
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'form_submit', { event_category: 'Contact', event_label: 'English Contact Form' });
      }
    } catch (reason) {
      error.textContent = reason.name === 'AbortError'
        ? 'The request timed out, so we could not confirm delivery. Your message is still here. Please wait before trying again to avoid sending it twice.'
        : 'We could not confirm whether your inquiry was sent. Your message is still here. Please wait before trying again to avoid sending it twice.';
    } finally {
      window.clearTimeout(timeout);
      fields.forEach((field) => { field.disabled = false; });
      pending = false;
      button.disabled = false;
      button.textContent = 'Send inquiry ↗';
      form.removeAttribute('aria-busy');
    }
  });
}
