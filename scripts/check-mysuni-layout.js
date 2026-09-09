/* Browser regression check. Run in the lecture page with Aside's page.evaluate:
 * await page.evaluate(await (await fetch(new URL('/scripts/check-mysuni-layout.js', page.url()))).text())
 * Set the browser viewport first; this checks actual rendered geometry, not CSS text.
 */
(async function checkMysuniLayout() {
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const slides = Array.from(document.querySelectorAll('.slide'));
  const frame = document.getElementById('frame');
  const prev = document.getElementById('btnPrev');
  const next = document.getElementById('btnNext');
  const notes = document.getElementById('btnNotes');
  const counter = document.getElementById('counter');
  if (!frame || !slides.length || !prev || !next || !notes || !counter) {
    throw new Error('Open /mysuni-marketing/ before running this check.');
  }
  const initial = slides.findIndex(slide => slide.classList.contains('active'));
  const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  await document.fonts.ready;
  await settle();
  // The controls must still work after the desktop hover timeout has elapsed.
  await new Promise(resolve => setTimeout(resolve, 2800));
  const viewport = { width: innerWidth, height: innerHeight };
  const bounds = [];
  try {
    for (let i = initial; i > 0; i--) prev.click();
    for (let i = 0; i < slides.length; i++) {
      await settle();
      const active = slides[i];
      const box = active.getBoundingClientRect();
      const frameBox = frame.getBoundingClientRect();
      check(document.querySelectorAll('.slide.active').length === 1 && active.classList.contains('active'), `Slide ${i + 1}: navigation did not activate exactly one slide`);
      check(box.left >= -1 && box.right <= innerWidth + 1, `Slide ${i + 1}: horizontally clipped (${box.left.toFixed(2)}..${box.right.toFixed(2)} of ${innerWidth})`);
      check(box.top >= -1 && box.bottom <= innerHeight + 1, `Slide ${i + 1}: vertically clipped (${box.top.toFixed(2)}..${box.bottom.toFixed(2)} of ${innerHeight})`);
      check(Math.abs(box.width - frameBox.width) < 1, `Slide ${i + 1}: slide/frame widths differ (${box.width.toFixed(2)} / ${frameBox.width.toFixed(2)})`);
      check(Math.abs(box.width / box.height - 16 / 9) < 0.01, `Slide ${i + 1}: aspect ratio changed`);
      check(counter.textContent === `${i + 1} / ${slides.length}`, `Slide ${i + 1}: wrong counter`);
      check(location.hash === `#${i + 1}`, `Slide ${i + 1}: wrong deep link`);
      bounds.push({ slide: i + 1, x: box.x, y: box.y, width: box.width, height: box.height });
      next.click();
    }
    check(document.documentElement.scrollWidth <= innerWidth + 1, 'Page has horizontal overflow');
    for (const img of document.querySelectorAll('.figure img')) {
      check(img.complete && img.naturalWidth > 0, `Image did not load: ${img.getAttribute('src')}`);
    }
    const touchLayout = matchMedia('(hover: none), (pointer: coarse), (max-width: 600px)').matches;
    if (touchLayout) {
      const hud = document.getElementById('hud');
      check(Number(getComputedStyle(hud).opacity) >= 0.99, 'Mobile navigation disappeared after its timeout');
      check(slides[slides.length - 1].getBoundingClientRect().bottom <= hud.getBoundingClientRect().top, 'Mobile navigation overlaps the slide');
      for (const button of [prev, next, notes]) {
        const rect = button.getBoundingClientRect();
        check(rect.width >= 44 && rect.height >= 44, `${button.id}: touch target is smaller than 44px`);
        check(rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight, `${button.id}: control is outside viewport`);
      }
    }
    const notesWasOpen = document.getElementById('notes').classList.contains('open');
    notes.click();
    check(document.getElementById('notes').classList.contains('open') !== notesWasOpen, 'Presenter notes did not toggle');
    notes.click();
  } finally {
    for (let i = slides.length - 1; i > initial; i--) prev.click();
    await settle();
  }
  return { pass: failures.length === 0, viewport, slidesChecked: slides.length, failures, bounds };
})();
