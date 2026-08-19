// DEXA NARA vault — decrypt data.enc.json with the shared password, render bids + drafts.

const $ = (id) => document.getElementById(id);
const state = { payload: null, viewerItem: null, viewerIndex: 0 };
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
  $("metaCount").textContent = `공고 ${items.length}건 · 초안 ${items.reduce((sum, item) => sum + (item.drafts?.length || 0), 0)}건`;
  $("metaUpdated").textContent = state.payload?.generatedAt ? `업데이트 ${state.payload.generatedAt.slice(0, 10)}` : "";
  $("cards").innerHTML = items.length ? items.map(renderCard).join("") : `<div class="empty">공유된 공고가 없습니다</div>`;
}

function renderCard(item, index) {
  const deadline = dday(item.bidCloseAt);
  const draftCount = item.drafts?.length || 0;
  const tags = [
    deadline ? `<span class="tag ${deadline.cls}">${deadline.label}</span>` : "",
    item.match?.score ? `<span class="tag orange">적합 ${item.match.score}</span>` : "",
    item.contractMethod ? `<span class="tag">${escapeHtml(item.contractMethod)}</span>` : "",
    item.noticeKind ? `<span class="tag">${escapeHtml(item.noticeKind)}</span>` : "",
    draftCount ? `<span class="tag good">초안 ${draftCount}</span>` : "",
  ].filter(Boolean).join("");
  return `
    <article class="card${draftCount ? " has-drafts" : ""}" data-index="${index}">
      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <div class="card-agency">${escapeHtml(item.agency || "")}</div>
      <div class="tag-row">${tags}</div>
      <div class="card-foot">
        <span class="budget">${escapeHtml(item.budgetLabel || "")}</span>
        <span class="card-links">
          ${item.detailUrl ? `<a href="${escapeHtml(item.detailUrl)}" target="_blank" rel="noopener">나라장터 ↗</a>` : ""}
        </span>
      </div>
    </article>`;
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

$("cards").addEventListener("click", (event) => {
  const card = event.target.closest(".card.has-drafts");
  if (!card || event.target.closest("a")) return;
  openViewer(state.payload.items[Number(card.dataset.index)]);
});

$("versionTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-version]");
  if (button && state.viewerItem) openViewer(state.viewerItem, Number(button.dataset.version));
});

$("closeViewer").addEventListener("click", closeViewer);
$("viewerOverlay").addEventListener("click", (event) => {
  if (event.target === $("viewerOverlay")) closeViewer();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("viewerOverlay").hidden) closeViewer();
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
