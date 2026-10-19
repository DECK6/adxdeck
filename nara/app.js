// DEXA NARA vault — decrypt data.enc.json with the shared password, render daily AITY
// recommendations, saved bids, drafts and slide decks; send draft requests to the inbox worker.

const $ = (id) => document.getElementById(id);
const state = { payload: null, viewerItem: null, viewerIndex: 0, view: "recommend", statuses: new Map(), requestBid: null, deck: null };
const NAME_KEY = "dexa-nara-requester";
const STATUS_LABELS = {
  requested: ["요청됨", "orange"], queued: ["생성 대기", "orange"], drafting: ["초안 작성 중", "orange"],
  slides: ["슬라이드 제작 중", "orange"], done: ["완료", "good"], rejected: ["반려", "red"], error: ["오류", "red"],
};
const PW_KEY = "dexa-nara-pw";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function b64ToBytes(b64) {
  return Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
}

async function decrypt(encrypted, password) {
  const baseKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: encrypted.kdf.hash, salt: b64ToBytes(encrypted.kdf.salt), iterations: encrypted.kdf.iterations },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64ToBytes(encrypted.cipher.iv) }, key, b64ToBytes(encrypted.ct));
  return JSON.parse(new TextDecoder().decode(plain));
}

let encryptedCache = null;
async function fetchEncrypted() {
  if (encryptedCache) return encryptedCache;
  const response = await fetch("data.enc.json", { cache: "no-store" });
  if (!response.ok) throw new Error("data missing");
  encryptedCache = await response.json();
  return encryptedCache;
}

async function unlock(password) {
  const button = $("unlockButton");
  button.disabled = true;
  $("lockError").hidden = true;
  try {
    state.payload = await decrypt(await fetchEncrypted(), password);
    sessionStorage.setItem(PW_KEY, password);
    $("lockLed").classList.add("on");
    $("lockScreen").hidden = true;
    $("app").hidden = false;
    render();
    refreshStatuses();
    setInterval(refreshStatuses, 60000);
    return true;
  } catch {
    $("lockError").hidden = false;
    return false;
  } finally {
    button.disabled = false;
  }
}

function dday(bidCloseAt) {
  if (!bidCloseAt) return null;
  const close = new Date(bidCloseAt.replace(" ", "T"));
  if (Number.isNaN(close.getTime())) return null;
  const days = Math.ceil((close - Date.now()) / 86400000);
  if (days < 0) return { label: "마감", cls: "" };
  if (days === 0) return { label: "D-DAY", cls: "red" };
  return { label: `D-${days}`, cls: days <= 3 ? "red" : "orange" };
}

function render() {
  const items = state.payload?.items || [];
  const batches = state.payload?.recommendations || [];
  $("metaCount").textContent = `오늘 추천 ${batches[0]?.items.length || 0}건 · 보관 ${items.length}건 · 초안 ${items.reduce((sum, item) => sum + (item.drafts?.length || 0), 0)}건`;
  $("metaUpdated").textContent = state.payload?.generatedAt ? `업데이트 ${state.payload.generatedAt.slice(0, 10)}` : "";
  $("viewTabs").querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.view === state.view));
  $("recommendView").hidden = state.view !== "recommend";
  $("cards").hidden = state.view !== "vault";
  $("cards").innerHTML = items.length ? items.map((item) => renderCard(item)).join("") : `<div class="empty">공유된 공고가 없습니다</div>`;
  $("recommendView").innerHTML = batches.length
    ? batches.map((batch, index) => `
        <section class="batch">
          <h2 class="batch-title mono">${escapeHtml(batch.date)} ${index === 0 ? "· 오늘의 AITY 추천" : ""}<span>${batch.items.length}건</span></h2>
          <div class="cards">${batch.items.map((item) => renderCard(item)).join("")}</div>
        </section>`).join("")
    : `<div class="empty">아직 추천이 없습니다 — 매일 오전 9시에 적합도 70점 이상 공고가 올라옵니다</div>`;
}

const bidKey = (item) => String(item.bidNtceNo || item.id || "");

// Drafts live on vault items; recommendations reference them by bid number.
function draftsFor(item) {
  if (item.drafts?.length) return item.drafts;
  return (state.payload?.items || []).find((entry) => bidKey(entry) === bidKey(item))?.drafts || [];
}

function renderCard(item) {
  const key = bidKey(item);
  const deadline = dday(item.bidCloseAt);
  const drafts = draftsFor(item);
  const status = state.statuses.get(key);
  const [statusLabel, statusCls] = STATUS_LABELS[status?.status] || [];
  const tags = [
    deadline ? `<span class="tag ${deadline.cls}">${deadline.label}</span>` : "",
    item.match?.score ? `<span class="tag orange">적합 ${item.match.score}${item.match.grade ? ` · ${escapeHtml(item.match.grade)}` : ""}</span>` : "",
    item.contractMethod ? `<span class="tag">${escapeHtml(item.contractMethod)}</span>` : "",
    item.noticeKind ? `<span class="tag">${escapeHtml(item.noticeKind)}</span>` : "",
    drafts.length ? `<span class="tag good">초안 ${drafts.length}</span>` : "",
    statusLabel ? `<span class="tag ${statusCls}" title="${escapeHtml(status.message || "")}">${statusLabel}</span>` : "",
  ].filter(Boolean).join("");
  const terms = (item.match?.matchedTerms || []).slice(0, 6).map((term) => `<span>${escapeHtml(term)}</span>`).join("");
  const canRequest = state.payload?.requestApi && (!status || ["done", "rejected", "error"].includes(status.status));
  return `
    <article class="card" data-key="${escapeHtml(key)}">
      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <div class="card-agency">${escapeHtml(item.agency || "")}</div>
      <div class="tag-row">${tags}</div>
      ${terms ? `<div class="terms">${terms}</div>` : ""}
      <div class="card-foot">
        <span class="budget">${escapeHtml(item.budgetLabel || "")}</span>
        <span class="card-links">
          ${item.detailUrl ? `<a href="${escapeHtml(item.detailUrl)}" target="_blank" rel="noopener">나라장터 ↗</a>` : ""}
          ${drafts.length ? `<button type="button" data-action="draft">초안 보기</button>` : ""}
          ${drafts[0]?.slides ? `<button type="button" data-action="slides">슬라이드</button>` : ""}
          ${canRequest ? `<button type="button" class="request" data-action="request">${drafts.length ? "재요청" : "초안 요청"}</button>` : ""}
        </span>
      </div>
    </article>`;
}

function findItem(key) {
  const all = [...(state.payload?.recommendations || []).flatMap((batch) => batch.items), ...(state.payload?.items || [])];
  return all.find((item) => bidKey(item) === key);
}

async function refreshStatuses() {
  const api = state.payload?.requestApi;
  if (!api) return;
  try {
    const response = await fetch(`${api.url.replace(/\/$/, "")}/status`, { headers: { "X-Nara-Token": api.token }, cache: "no-store" });
    const data = await response.json();
    if (!data.ok) return;
    state.statuses = new Map(data.items.map((item) => [item.bidNo, item]));
    render();
  } catch {
    // inbox unreachable — keep the last known statuses
  }
}

function openRequest(item) {
  state.requestBid = item;
  $("requestTitle").textContent = item.title;
  $("requestName").value = localStorage.getItem(NAME_KEY) || "";
  $("requestNote").value = "";
  $("requestError").hidden = true;
  $("requestOverlay").hidden = false;
  ($("requestName").value ? $("requestNote") : $("requestName")).focus();
}

async function submitRequest() {
  const api = state.payload?.requestApi;
  const item = state.requestBid;
  if (!api || !item) return;
  const { drafts, match, ...bid } = item;
  $("requestSubmit").disabled = true;
  try {
    const response = await fetch(`${api.url.replace(/\/$/, "")}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Nara-Token": api.token },
      body: JSON.stringify({ bidNo: bidKey(item), bid, requester: $("requestName").value.trim(), note: $("requestNote").value.trim() }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.message || "요청을 보내지 못했습니다");
    localStorage.setItem(NAME_KEY, $("requestName").value.trim());
    state.statuses.set(bidKey(item), data.request);
    $("requestOverlay").hidden = true;
    render();
  } catch (error) {
    $("requestError").textContent = error.message;
    $("requestError").hidden = false;
  } finally {
    $("requestSubmit").disabled = false;
  }
}

function openDeck(deck) {
  state.deck?.destroy?.();
  $("deckOverlay").hidden = false;
  state.deck = window.NaraDeck.render($("deckHost"), deck);
}

function closeDeck() {
  state.deck?.destroy?.();
  state.deck = null;
  $("deckHost").innerHTML = "";
  $("deckOverlay").hidden = true;
}

function openViewer(item, index = 0) {
  state.viewerItem = item;
  state.viewerIndex = index;
  const draft = item.drafts[index];
  $("viewerTitle").textContent = item.title;
  $("viewerMeta").innerHTML = [
    draft.generatedAt ? `생성 ${escapeHtml(draft.generatedAt.slice(0, 16).replace("T", " "))}` : "",
    draft.engine ? escapeHtml(draft.engine) : "",
    draft.rfpFile ? escapeHtml(draft.rfpFile) : "",
  ].filter(Boolean).map((text) => `<span>${text}</span>`).join("");
  $("versionTabs").innerHTML = item.drafts.length > 1
    ? item.drafts.map((entry, i) =>
        `<button type="button" data-version="${i}" class="${i === index ? "active" : ""}">v${item.drafts.length - i} · ${escapeHtml((entry.generatedAt || "").slice(0, 10))}</button>`).join("")
    : "";
  $("slidesButton").hidden = !draft.slides;
  $("draftBody").innerHTML = marked.parse(draft.markdown);
  $("draftBody").scrollTop = 0;
  $("viewerOverlay").hidden = false;
}

function closeViewer() {
  $("viewerOverlay").hidden = true;
  state.viewerItem = null;
}

$("lockForm").addEventListener("submit", (event) => {
  event.preventDefault();
  unlock($("password").value);
});

$("lockButton").addEventListener("click", () => {
  sessionStorage.removeItem(PW_KEY);
  location.reload();
});

function onCardClick(event) {
  const button = event.target.closest("[data-action]");
  const card = event.target.closest(".card");
  if (!button || !card) return;
  const item = findItem(card.dataset.key);
  if (!item) return;
  const drafts = draftsFor(item);
  if (button.dataset.action === "request") openRequest(item);
  if (button.dataset.action === "draft") openViewer({ ...item, drafts });
  if (button.dataset.action === "slides") openDeck(drafts[0].slides);
}
$("cards").addEventListener("click", onCardClick);
$("recommendView").addEventListener("click", onCardClick);

$("viewTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  state.view = button.dataset.view;
  render();
});

$("requestForm").addEventListener("submit", (event) => {
  event.preventDefault();
  submitRequest();
});
$("requestCancel").addEventListener("click", () => { $("requestOverlay").hidden = true; });
$("slidesButton").addEventListener("click", () => {
  const draft = state.viewerItem?.drafts[state.viewerIndex];
  if (draft?.slides) openDeck(draft.slides);
});
$("deckClose").addEventListener("click", closeDeck);

$("versionTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-version]");
  if (button && state.viewerItem) openViewer(state.viewerItem, Number(button.dataset.version));
});

$("closeViewer").addEventListener("click", closeViewer);
$("viewerOverlay").addEventListener("click", (event) => {
  if (event.target === $("viewerOverlay")) closeViewer();
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!$("deckOverlay").hidden) closeDeck();
  else if (!$("requestOverlay").hidden) $("requestOverlay").hidden = true;
  else if (!$("viewerOverlay").hidden) closeViewer();
});

$("copyButton").addEventListener("click", async () => {
  const draft = state.viewerItem?.drafts[state.viewerIndex];
  if (!draft) return;
  await navigator.clipboard.writeText(draft.markdown);
  $("copyButton").textContent = "복사됨";
  setTimeout(() => { $("copyButton").textContent = "MD 복사"; }, 1500);
});

const savedPassword = sessionStorage.getItem(PW_KEY);
if (savedPassword) unlock(savedPassword);
