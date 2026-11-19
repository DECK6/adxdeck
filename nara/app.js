// DEXA NARA vault — decrypt data.enc.json with the shared password, render daily AITY
// recommendations, saved bids, drafts and slide decks; send draft requests to the inbox worker.

const $ = (id) => document.getElementById(id);
const state = { payload: null, viewerItem: null, viewerIndex: 0, view: "recommend", statuses: new Map(), bookmarks: new Map(), requestBid: null, requestModel:null, deck: null };
const EMBEDDED=window.parent!==window&&new URLSearchParams(location.search).get("embedded")==="dashboard";
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
    setInterval(() => document.visibilityState === "visible" && refreshStatuses(), 60000);
    document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && refreshStatuses());
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

function workflowViews(payload, statuses, bookmarks, owner) {
  const saved = new Map((payload.items || []).map(item => [bidKey(item), item]));
  const vault = new Map(owner ? bookmarks : []);
  for (const [key, item] of saved) vault.set(key, item);
  const batches = payload.recommendations || [];
  const recommended = new Map(batches.slice().reverse().flatMap(batch => batch.items.map(item => [bidKey(item), item])));
  const inbox = [];
  const assigned = new Set(vault.keys());
  if (owner) {
    const entries = [...statuses.values()].sort((a,b) =>
      Number(b.status === "requested" && !b.auto) - Number(a.status === "requested" && !a.auto)
      || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
    for (const entry of entries) {
      const key = entry.bidNo;
      const draft = saved.get(key)?.drafts?.[0];
      if (entry.status === "done" && draft && (!entry.createdAt || !draft.generatedAt || Date.parse(draft.generatedAt) >= Date.parse(entry.createdAt))) continue;
      const item = vault.get(key) || recommended.get(key) || { ...entry.bid, bidNtceNo:key, title:entry.bid?.title || key };
      inbox.push(item);
      assigned.add(key);
      vault.delete(key);
    }
  }
  const remaining = batches.map(batch => ({ ...batch, items: batch.items.filter(item => {
    const key = bidKey(item);
    if (assigned.has(key)) return false;
    assigned.add(key);
    return true;
  }) })).filter(batch => batch.items.length);
  return { batches:remaining, vault:[...vault.values()].sort((a,b) =>
    String(b.savedAt || b.drafts?.[0]?.generatedAt || "").localeCompare(String(a.savedAt || a.drafts?.[0]?.generatedAt || ""))), inbox };
}

function render() {
  const { batches, vault, inbox } = workflowViews(state.payload, state.statuses, state.bookmarks, EMBEDDED);
  const counts = { recommend:batches.reduce((n,batch) => n + batch.items.length, 0), vault:vault.length, requests:inbox.length };
  const labels = { recommend:"AITY 추천", vault:"보관함", requests:"요청함" };
  $("metaCount").textContent = "";
  $("metaUpdated").textContent = state.payload?.generatedAt ? `업데이트 ${state.payload.generatedAt.slice(0, 10)}` : "";
  $("viewTabs").querySelectorAll("button").forEach(button => {
    const view = button.dataset.view;
    button.textContent = `${labels[view]} ${counts[view]}`;
    button.classList.toggle("active", view === state.view);
    button.setAttribute("aria-current", view === state.view ? "page" : "false");
  });
  $("recommendView").hidden = state.view !== "recommend";
  $("cards").hidden = state.view !== "vault";
  $("requestsTab").hidden = !EMBEDDED;
  $("requestView").hidden = state.view !== "requests";
  $("requestView").innerHTML = inbox.length ? inbox.map(renderCard).join("") : '<div class="empty">진행 중인 초안 요청이 없습니다.</div>';
  $("cards").innerHTML = vault.length ? vault.map(renderCard).join("") : '<div class="empty">보관한 공고와 완성된 초안이 여기에 표시됩니다.</div>';
  $("recommendView").innerHTML = batches.length ? batches.map(batch => `
    <section class="batch"><h2 class="batch-title mono">${escapeHtml(batch.date)} 추천<span>${batch.items.length}건</span></h2>
    <div class="cards">${batch.items.map(renderCard).join("")}</div></section>`).join("")
    : '<div class="empty">새로 검토할 추천 공고가 없습니다.</div>';
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
  const detailUrl = /^https?:\/\//i.test(item.detailUrl || "") ? item.detailUrl : "";
  const drafts = draftsFor(item);
  const status = state.statuses.get(key);
  const [statusLabel, statusCls] = STATUS_LABELS[status?.status] || [];
  const tags = [
    deadline ? `<span class="tag ${deadline.cls}">${deadline.label}</span>` : "",
    item.match?.score ? `<span class="tag orange">적합 ${item.match.score}${item.match.grade ? ` · ${escapeHtml(item.match.grade)}` : ""}</span>` : "",
    item.contractMethod ? `<span class="tag">${escapeHtml(item.contractMethod)}</span>` : "",
    item.noticeKind ? `<span class="tag">${escapeHtml(item.noticeKind)}</span>` : "",
    drafts.length ? `<span class="tag good">초안 ${drafts.length}</span>` : "",
    statusLabel ? `<span class="tag ${statusCls}" title="${escapeHtml(status.message || "")}">${statusLabel}${status?.draftModel ? " · " + ({opus:"오푸스 5.5",sol:"Sol 6.2","astra-xhigh":"아스트라 6.2",fable:"페이블 5.2"}[status.draftModel] || "") : ""}</span>` : "",
  ].filter(Boolean).join("");
  const terms = (item.match?.matchedTerms || []).slice(0, 6).map((term) => `<span>${escapeHtml(term)}</span>`).join("");
  const canRequest = state.payload?.requestApi && (!status || ["done", "rejected", "error"].includes(status.status));
  // Generation controls exist only inside the master's dashboard; the shared page just files a request.
  const canGenerate = EMBEDDED && state.payload?.requestApi && (canRequest || (status.status === "requested" && !status.auto));
  return `
    <article class="card" data-key="${escapeHtml(key)}">
      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <div class="card-agency">${escapeHtml(item.agency || "")}</div>
      <div class="tag-row">${tags}</div>
      ${state.view === "requests" && status?.status === "done" ? '<p class="request-note">새 초안이 게시되면 보관함에서 열 수 있습니다. <button type="button" data-action="reload">게시 결과 새로고침</button></p>' : ""}
      ${terms ? `<div class="terms">${terms}</div>` : ""}
      ${EMBEDDED && status && !status.auto && (status.requester || status.note) ? `<p class="request-note">요청 · ${escapeHtml(status.requester || "이름 없음")} · ${escapeHtml((status.createdAt || "").slice(0, 10))}${status.note ? ` — ${escapeHtml(status.note)}` : ""}</p>` : ""}
      <div class="card-foot">
        <span class="budget">${escapeHtml(item.budgetLabel || "")}</span>
        <div class="card-links">
          ${EMBEDDED && state.view === "recommend" && state.payload?.requestApi ? '<button type="button" data-action="save">보관함에 담기</button>' : ""}
          ${detailUrl ? `<a href="${escapeHtml(detailUrl)}" target="_blank" rel="noopener">나라장터 ↗</a>` : ""}
          ${drafts.length ? `<button type="button" data-action="draft">초안 보기</button>` : ""}
          ${drafts[0]?.slides ? `<button type="button" data-action="slides">슬라이드</button>` : ""}
          ${canGenerate ? `<button type="button" class="request" data-action="request">${drafts.length ? "자동 재요청" : "초안 자동 생성"}</button><details class="model-choices"><summary>모델 선택</summary><div><button type="button" data-action="opus">오푸스 5.5로 생성</button><button type="button" data-action="sol">Sol 6.2로 생성</button><button type="button" data-action="astra">아스트라 6.2로 생성</button><button type="button" data-action="fable">페이블 5.2로 생성</button></div></details>` : !EMBEDDED && canRequest ? `<button type="button" class="request" data-action="request">${drafts.length ? "초안 재요청" : "초안 요청"}</button>` : ""}
        </div>
      </div>
    </article>`;
}

function findItem(key) {
  const all = [...(state.payload?.recommendations || []).flatMap((batch) => batch.items), ...(state.payload?.items || [])];
  const found = all.find((item) => bidKey(item) === key);
  if (found) return found;
  if (state.bookmarks.has(key)) return state.bookmarks.get(key);
  const bid = state.statuses.get(key)?.bid;
  return bid ? { ...bid, bidNtceNo: key } : undefined;
}

async function loadBookmarks() {
  const api = state.payload?.requestApi;
  if (!api || !EMBEDDED) return;
  try {
    const url = new URL(api.url.replace(/\/$/, "") + "/bookmarks");
    let cursor;
    do {
      if (cursor) url.searchParams.set("cursor", cursor);
      const response = await fetch(url, { headers: { "X-Nara-Token":api.token }, cache:"no-store" });
      const data = await response.json();
      if (!data.ok) throw new Error();
      for (const item of data.items) state.bookmarks.set(bidKey(item), item);
      cursor = data.cursor;
    } while (cursor);
    render();
  } catch {
    $("workflowMessage").textContent = "보관 목록을 불러오지 못했습니다. 보관함을 다시 열어 주세요.";
  }
}

async function saveBookmark(item, button) {
  const api = state.payload.requestApi;
  button.disabled = true;
  try {
    const response = await fetch(api.url.replace(/\/$/, "") + "/bookmarks", {
      method:"POST", headers:{ "Content-Type":"application/json", "X-Nara-Token":api.token },
      body:JSON.stringify({ bidNo:bidKey(item), bid:item })
    });
    const data = await response.json();
    if (!data.ok) throw new Error();
    state.bookmarks.set(bidKey(item), data.item);
    state.view = "vault";
    $("workflowMessage").textContent = "";
    render();
  } catch {
    $("workflowMessage").textContent = "공고를 보관하지 못했습니다. 다시 시도해 주세요.";
  } finally {
    button.disabled = false;
  }
}

async function refreshStatuses() {
  const api = state.payload?.requestApi;
  if (!api) return;
  const previous = state.statuses;
  try {
    const response = await fetch(`${api.url.replace(/\/$/, "")}/status`, { headers: { "X-Nara-Token": api.token }, cache: "no-store" });
    const data = await response.json();
    if (!data.ok) return;
    if (previous !== state.statuses) return;
    const next = new Map(data.items.map(item => [item.bidNo, item]));
    for (const [key, local] of previous) {
      if (next.has(key) && String(local.updatedAt) > String(next.get(key).updatedAt)) next.set(key, local);
    }
    state.statuses = next;
    render();
  } catch {
    // inbox unreachable — keep the last known statuses
  }
}

function openRequest(item) {
  state.requestBid = item;state.requestModel=null;
  $("requestTitle").textContent = item.title;
  $("requestName").value = EMBEDDED?"":localStorage.getItem(NAME_KEY) || "";
  $("requestHint").textContent = EMBEDDED ? "오푸스 구독 → 오푸스 API → Sol 구독 → Sol API 순서로 시도합니다 · 초안과 슬라이드 자동 생성" : "요청이 접수되면 담당자가 확인한 뒤 초안을 생성합니다";
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
      body: JSON.stringify({ bidNo: bidKey(item), bid, draftModel: state.requestModel, requester: $("requestName").value.trim(), note: $("requestNote").value.trim() }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.message || "요청을 보내지 못했습니다");
    if(!EMBEDDED)localStorage.setItem(NAME_KEY, $("requestName").value.trim());
    state.statuses = new Map(state.statuses).set(bidKey(item), data.request);
    if (EMBEDDED) state.view = "requests";
    $("requestOverlay").hidden = true;
    render();
  } catch (error) {
    $("requestOverlay").hidden=false;$("requestTitle").textContent=item.title;
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
  const rendered=new DOMParser().parseFromString(marked.parse(escapeHtml(draft.markdown)),"text/html");
  for(const link of rendered.querySelectorAll("a")){
    try{if(!["https:","http:"].includes(new URL(link.getAttribute("href"),location.href).protocol))link.removeAttribute("href");}catch{link.removeAttribute("href");}
    link.target="_blank";link.rel="noopener noreferrer";
  }
  $("draftBody").replaceChildren(...rendered.body.childNodes);
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
  if(EMBEDDED){window.parent.postMessage({type:"nara:lock"},location.origin);return;}
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
  if (button.dataset.action === "reload") { window.parent.location.reload(); return; }
  if (button.dataset.action === "save") {
    saveBookmark(item, button);
    return;
  }
  if (button.dataset.action === "request") openRequest(item);
  if(["opus","sol","astra","fable"].includes(button.dataset.action)){
    state.requestBid=item;state.requestModel={opus:"opus",sol:"sol",astra:"astra-xhigh",fable:"fable"}[button.dataset.action];
    $("requestName").value="마스터";$("requestNote").value="";
    button.disabled=true;
    submitRequest().finally(()=>{button.disabled=false;});
  }
  if (button.dataset.action === "draft") openViewer({ ...item, drafts });
  if (button.dataset.action === "slides") openDeck(drafts[0].slides);
}
$("cards").addEventListener("click", onCardClick);
$("recommendView").addEventListener("click", onCardClick);
$("requestView").addEventListener("click", onCardClick);

$("viewTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  state.view = button.dataset.view;
  $("workflowMessage").textContent = "";
  if (state.view === "vault") loadBookmarks();
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

const THEME_PARAM=new URLSearchParams(location.search).get("theme");
if(["light","dark"].includes(THEME_PARAM))document.documentElement.dataset.theme=THEME_PARAM;
if(EMBEDDED){
 document.body.classList.add("embedded");
 window.addEventListener("message",event=>{if(event.source===window.parent&&event.origin===location.origin&&event.data?.type==="dexa:theme"&&["light","dark"].includes(event.data.theme))document.documentElement.dataset.theme=event.data.theme;});
 $("lockForm").hidden=true;
 document.querySelector(".lock-sub").textContent="대시보드 연결 중…";
 window.addEventListener("message",event=>{
  if(event.source!==window.parent||event.origin!==location.origin||event.data?.type!=="dexa:nara-payload"||event.data.payload?.v!==2)return;
  state.payload=event.data.payload;$("lockScreen").hidden=true;$("app").hidden=false;render();refreshStatuses();loadBookmarks();
 });
 window.parent.postMessage({type:"nara:ready"},location.origin);
 setInterval(()=>document.visibilityState==="visible"&&state.payload&&refreshStatuses(),60000);
}else{
 const savedPassword=sessionStorage.getItem(PW_KEY);if(savedPassword)unlock(savedPassword);
}
