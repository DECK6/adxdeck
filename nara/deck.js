// NaraDeck — renders a deck JSON (Contract B) as a 16:9 web presentation.
(function () {
  "use strict";

  var script = document.currentScript;
  var assetBase = script && script.src ? new URL("assets/", script.src).href : "";
  var LAYOUTS = ["cover", "section", "bullets", "two-column", "cards", "table", "timeline", "metric", "closing"];

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null && text !== "") node.textContent = String(text);
    return node;
  }

  function str(value) {
    return value === undefined || value === null ? "" : String(value).trim();
  }

  function list(value) {
    return Array.isArray(value) ? value : [];
  }

  function bulletList(items) {
    var ul = el("ul", "nd-bullets");
    list(items).forEach(function (item) {
      if (str(item)) ul.appendChild(el("li", "", str(item)));
    });
    return ul.children.length ? ul : null;
  }

  function logo() {
    if (!assetBase) return el("span", "nd-wordmark", "AITY");
    var img = el("img", "nd-logo");
    img.alt = "AITY";
    img.src = assetBase + "aity-logo.png";
    img.addEventListener("error", function () {
      img.replaceWith(el("span", "nd-wordmark", "AITY"));
    });
    return img;
  }

  function watermark() {
    if (!assetBase) return null;
    var img = el("img", "nd-watermark");
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.src = assetBase + "aity-watermark.png";
    img.addEventListener("error", function () { img.remove(); });
    return img;
  }

  function panel(title, warm, index) {
    var box = el("div", "nd-panel" + (warm ? " is-warm" : ""));
    if (index) box.appendChild(el("span", "nd-card-index", index));
    if (str(title)) box.appendChild(el("h3", "nd-panel-title", str(title)));
    return box;
  }

  function buildBody(slide, layout) {
    var body = el("div", "nd-body");
    var bullets = bulletList(slide.bullets);

    if (layout === "two-column") {
      var grid = el("div", "nd-grid");
      list(slide.columns).slice(0, 2).forEach(function (col, i) {
        var box = panel(col && col.title, i === 1);
        var ul = bulletList(col && col.bullets);
        if (ul) box.appendChild(ul);
        grid.appendChild(box);
      });
      body.appendChild(grid);
    } else if (layout === "cards") {
      var cards = list(slide.cards).slice(0, 4);
      var cardGrid = el("div", "nd-grid");
      cardGrid.style.setProperty("--nd-count", String(Math.max(cards.length, 1)));
      cards.forEach(function (card, i) {
        var box = panel(card && card.title, i % 2 === 1, String(i + 1).padStart(2, "0"));
        if (str(card && card.body)) box.appendChild(el("p", "nd-panel-body", str(card.body)));
        cardGrid.appendChild(box);
      });
      body.appendChild(cardGrid);
    } else if (layout === "table" && slide.table) {
      var rows = list(slide.table.rows);
      var table = el("table", "nd-table" + (rows.length > 6 ? " is-dense" : ""));
      var headers = list(slide.table.headers);
      if (headers.length) {
        var thead = el("thead");
        var htr = el("tr");
        headers.forEach(function (h) { htr.appendChild(el("th", "", str(h))); });
        thead.appendChild(htr);
        table.appendChild(thead);
      }
      var tbody = el("tbody");
      rows.forEach(function (row) {
        var tr = el("tr");
        list(row).forEach(function (cell) { tr.appendChild(el("td", "", str(cell))); });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      body.appendChild(table);
    } else if (layout === "timeline") {
      var steps = list(slide.steps).slice(0, 6);
      var ol = el("ol", "nd-timeline");
      ol.style.setProperty("--nd-count", String(Math.max(steps.length, 1)));
      steps.forEach(function (step, i) {
        var li = el("li", "nd-step");
        li.appendChild(el("span", "nd-step-num", String(i + 1)));
        if (str(step && step.title)) li.appendChild(el("h3", "nd-step-title", str(step.title)));
        if (str(step && step.body)) li.appendChild(el("p", "nd-step-body", str(step.body)));
        ol.appendChild(li);
      });
      body.appendChild(ol);
    } else if (layout === "metric" && slide.metric) {
      var metric = el("div", "nd-metric");
      metric.appendChild(el("div", "nd-metric-value", str(slide.metric.value)));
      if (str(slide.metric.label)) metric.appendChild(el("div", "nd-metric-label", str(slide.metric.label)));
      body.appendChild(metric);
      if (bullets) body.appendChild(bullets);
      return body;
    }

    if (layout !== "two-column" && layout !== "cards" && bullets) {
      if (body.children.length) bullets.style.marginTop = "1.6cqw";
      body.appendChild(bullets);
    }
    return body.children.length ? body : null;
  }

  function buildSlide(slide, index, total, deckTitle) {
    var layout = LAYOUTS.indexOf(slide && slide.layout) >= 0 ? slide.layout : "bullets";
    var section = el("section", "nd-slide nd-layout-" + layout);
    section.setAttribute("aria-roledescription", "slide");
    section.setAttribute("aria-label", (index + 1) + " / " + total);

    if (layout === "cover" || layout === "section") {
      var mark = watermark();
      if (mark) section.appendChild(mark);
    }

    var inner = el("div", "nd-inner");
    if (layout === "cover") inner.appendChild(el("span", "nd-eyebrow", "제안서"));
    inner.appendChild(el("h2", "nd-title", str(slide.title)));
    inner.appendChild(el("div", "nd-accent"));
    if (str(slide.lead)) inner.appendChild(el("p", "nd-lead", str(slide.lead)));
    var body = buildBody(slide, layout);
    if (body) inner.appendChild(body);
    if (str(slide.note)) inner.appendChild(el("p", "nd-note", str(slide.note)));
    section.appendChild(inner);

    var footer = el("footer", "nd-footer");
    var footerText = layout === "cover" ? "" : deckTitle;
    footer.appendChild(el("span", "nd-footer-text", (footerText ? footerText + "  ·  " : "") + (index + 1) + " / " + total));
    footer.appendChild(logo());
    section.appendChild(footer);
    return section;
  }

  // Shrink text on a slide until its content fits the canvas.
  function fitSlide(slide) {
    var inner = slide.querySelector(".nd-inner");
    var fit = 1;
    slide.style.setProperty("--nd-fit", "1");
    if (!inner || !slide.clientWidth) return;
    while (fit > 0.62 && overflows(inner)) {
      fit = Math.round((fit - 0.05) * 100) / 100;
      slide.style.setProperty("--nd-fit", String(fit));
    }
  }

  function overflows(inner) {
    if (inner.scrollHeight > inner.clientHeight + 1) return true;
    var body = inner.querySelector(".nd-body");
    if (body && body.scrollHeight > body.clientHeight + 1) return true;
    var panels = inner.querySelectorAll(".nd-panel");
    for (var i = 0; i < panels.length; i++) {
      if (panels[i].scrollHeight > panels[i].clientHeight + 1) return true;
    }
    return false;
  }

  function isEditable(target) {
    if (!target || !target.tagName) return false;
    return /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable;
  }

  function render(container, deck) {
    if (!container) throw new Error("NaraDeck: container가 없습니다.");
    var data = deck && typeof deck === "object" ? deck : {};
    var slidesData = list(data.slides).filter(function (s) { return s && typeof s === "object"; });
    var deckTitle = str(data.title);

    container.replaceChildren();
    var root = el("div", "nara-deck");
    root.tabIndex = 0;
    root.setAttribute("role", "region");
    root.setAttribute("aria-roledescription", "presentation");
    root.setAttribute("aria-label", deckTitle || "프레젠테이션");

    var viewport = el("div", "nd-viewport");
    var stage = el("div", "nd-stage");
    var slides = slidesData.map(function (s, i) {
      var node = buildSlide(s, i, slidesData.length, deckTitle);
      stage.appendChild(node);
      return node;
    });
    var prevZone = el("button", "nd-zone nd-zone-prev");
    prevZone.type = "button";
    prevZone.setAttribute("aria-label", "이전 슬라이드");
    var nextZone = el("button", "nd-zone nd-zone-next");
    nextZone.type = "button";
    nextZone.setAttribute("aria-label", "다음 슬라이드");
    var progress = el("div", "nd-progress");
    stage.appendChild(prevZone);
    stage.appendChild(nextZone);
    stage.appendChild(progress);
    viewport.appendChild(stage);

    var controls = el("div", "nd-controls");
    var prevBtn = el("button", "nd-btn", "←");
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "이전 슬라이드");
    var counter = el("span", "nd-counter");
    counter.setAttribute("aria-live", "polite");
    var nextBtn = el("button", "nd-btn", "→");
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "다음 슬라이드");
    var fsBtn = el("button", "nd-btn", "전체화면");
    fsBtn.type = "button";
    controls.appendChild(prevBtn);
    controls.appendChild(counter);
    controls.appendChild(nextBtn);
    controls.appendChild(fsBtn);

    root.appendChild(viewport);
    root.appendChild(controls);
    container.appendChild(root);

    var current = 0;

    function show(index) {
      if (!slides.length) {
        counter.textContent = "0 / 0";
        return;
      }
      current = Math.max(0, Math.min(slides.length - 1, index));
      slides.forEach(function (node, i) { node.classList.toggle("is-active", i === current); });
      counter.textContent = (current + 1) + " / " + slides.length;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === slides.length - 1;
      progress.style.width = ((current + 1) / slides.length * 100) + "%";
    }

    function layout() {
      var w = viewport.clientWidth;
      var h = viewport.clientHeight;
      var width = h > 40 ? Math.min(w, h * 16 / 9) : w;
      stage.style.width = Math.floor(width) + "px";
      slides.forEach(fitSlide);
    }

    function onKey(event) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (isEditable(event.target)) return;
      if (!root.contains(event.target) && event.target !== document.body && event.target !== document.documentElement) return;
      var key = event.key;
      var target = null;
      if (key === "ArrowRight" || key === "PageDown" || (key === " " && !event.shiftKey)) target = current + 1;
      else if (key === "ArrowLeft" || key === "PageUp" || (key === " " && event.shiftKey)) target = current - 1;
      else if (key === "Home") target = 0;
      else if (key === "End") target = slides.length - 1;
      if (target === null) return;
      if (key === " " && event.target && event.target.tagName === "BUTTON" && !event.target.classList.contains("nd-zone")) return;
      event.preventDefault();
      show(target);
    }

    function toggleFullscreen() {
      if (document.fullscreenElement === root) document.exitFullscreen();
      else if (root.requestFullscreen) root.requestFullscreen().catch(function () {});
    }

    function onFullscreenChange() {
      fsBtn.textContent = document.fullscreenElement === root ? "전체화면 종료" : "전체화면";
      root.focus({ preventScroll: true });
    }

    function onPrevZone() { show(current - 1); root.focus({ preventScroll: true }); }
    function onNextZone() { show(current + 1); root.focus({ preventScroll: true }); }
    function onPrev() { show(current - 1); }
    function onNext() { show(current + 1); }

    prevZone.addEventListener("click", onPrevZone);
    nextZone.addEventListener("click", onNextZone);
    prevBtn.addEventListener("click", onPrev);
    nextBtn.addEventListener("click", onNext);
    fsBtn.addEventListener("click", toggleFullscreen);
    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("beforeprint", layout);

    var observer = typeof ResizeObserver === "function" ? new ResizeObserver(layout) : null;
    if (observer) observer.observe(viewport);
    else window.addEventListener("resize", layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

    show(0);
    layout();

    return {
      destroy: function () {
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("fullscreenchange", onFullscreenChange);
        window.removeEventListener("beforeprint", layout);
        if (observer) observer.disconnect();
        else window.removeEventListener("resize", layout);
        if (document.fullscreenElement === root) document.exitFullscreen().catch(function () {});
        root.remove();
      },
    };
  }

  window.NaraDeck = { render: render };
})();
