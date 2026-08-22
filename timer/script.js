const sessionConfig = {
  break: { name: "휴식시간", emoji: "☕", defaultMinutes: 15, playMusic: true },
  lunch: { name: "점심시간", emoji: "🍱", defaultMinutes: 60, playMusic: true },
  practice: { name: "실습 세션", emoji: "💻", defaultMinutes: 40, playMusic: false },
};

const sessionCards = [...document.querySelectorAll(".session-card")];
const modeRadios = [...document.querySelectorAll('input[name="mode"]')];
const durationWrap = document.getElementById("durationWrap");
const endtimeWrap = document.getElementById("endtimeWrap");
const durationInput = document.getElementById("durationMinutes");
const endTimeInput = document.getElementById("endTime");
const statusText = document.getElementById("statusText");
const timeLeftEl = document.getElementById("timeLeft");
const sessionVisual = document.getElementById("sessionVisual");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

let selectedSession = "break";
let totalSeconds = sessionConfig[selectedSession].defaultMinutes * 60;
let remainingSeconds = totalSeconds;
let timerId = null;
let isPaused = false;
let musicNode = null;
let audioCtx = null;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function setSession(sessionKey) {
  selectedSession = sessionKey;
  sessionCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.session === sessionKey);
  });

  const conf = sessionConfig[sessionKey];
  durationInput.value = conf.defaultMinutes;
  totalSeconds = conf.defaultMinutes * 60;
  remainingSeconds = totalSeconds;

  sessionVisual.textContent = conf.emoji;
  statusText.textContent = `${conf.name} 준비됨`;
  renderTime();
  stopMusic();
}

function renderTime() {
  timeLeftEl.textContent = formatTime(remainingSeconds);
}

function getDurationByMode() {
  const mode = modeRadios.find((radio) => radio.checked)?.value;

  if (mode === "endtime") {
    if (!endTimeInput.value) return null;
    const [hour, min] = endTimeInput.value.split(":").map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(hour, min, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);

    return Math.floor((target - now) / 1000);
  }

  const minutes = Number(durationInput.value);
  if (!Number.isFinite(minutes) || minutes < 1) return null;
  return Math.floor(minutes * 60);
}

function updateModeUI() {
  const mode = modeRadios.find((radio) => radio.checked)?.value;
  durationWrap.classList.toggle("hidden", mode !== "duration");
  endtimeWrap.classList.toggle("hidden", mode !== "endtime");
}

function playBackgroundMusic() {
  const conf = sessionConfig[selectedSession];
  if (!conf.playMusic) return;

  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();

  oscillator.type = selectedSession === "lunch" ? "triangle" : "sine";
  oscillator.frequency.value = selectedSession === "lunch" ? 196 : 261.63;
  gainNode.gain.value = 0.02;

  lfo.type = "sine";
  lfo.frequency.value = 0.2;
  lfoGain.gain.value = selectedSession === "lunch" ? 30 : 16;

  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.frequency);
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  lfo.start();

  musicNode = { oscillator, lfo };
}

function stopMusic() {
  if (!musicNode) return;

  try {
    musicNode.oscillator.stop();
    musicNode.lfo.stop();
  } catch {
    // already stopped
  }
  musicNode = null;
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  isPaused = false;
}

function finishTimer() {
  stopTimer();
  stopMusic();
  statusText.textContent = `${sessionConfig[selectedSession].name} 종료!`;
  sessionVisual.textContent = "✅";
  alert(`${sessionConfig[selectedSession].name} 시간이 종료되었습니다.`);
}

function tick() {
  if (remainingSeconds <= 0) {
    finishTimer();
    return;
  }

  remainingSeconds -= 1;
  renderTime();
}

function startTimer() {
  const duration = getDurationByMode();
  if (!duration || duration <= 0) {
    alert("유효한 시간을 입력해 주세요.");
    return;
  }

  stopTimer();
  stopMusic();

  totalSeconds = duration;
  remainingSeconds = duration;
  renderTime();

  statusText.textContent = `${sessionConfig[selectedSession].name} 진행 중`;
  sessionVisual.textContent = sessionConfig[selectedSession].emoji;

  playBackgroundMusic();
  timerId = setInterval(tick, 1000);
}

function pauseTimer() {
  if (!timerId && !isPaused) return;

  if (!isPaused) {
    clearInterval(timerId);
    timerId = null;
    isPaused = true;
    statusText.textContent = `${sessionConfig[selectedSession].name} 일시정지`;
    stopMusic();
    return;
  }

  isPaused = false;
  statusText.textContent = `${sessionConfig[selectedSession].name} 재개`;
  playBackgroundMusic();
  timerId = setInterval(tick, 1000);
}

function resetTimer() {
  stopTimer();
  stopMusic();
  const conf = sessionConfig[selectedSession];
  remainingSeconds = Number(durationInput.value || conf.defaultMinutes) * 60;
  sessionVisual.textContent = conf.emoji;
  statusText.textContent = `${conf.name} 준비됨`;
  renderTime();
}

sessionCards.forEach((card) => {
  card.addEventListener("click", () => setSession(card.dataset.session));
});

modeRadios.forEach((radio) => radio.addEventListener("change", updateModeUI));
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

durationInput.addEventListener("input", () => {
  if (timerId || isPaused) return;
  remainingSeconds = Math.max(1, Number(durationInput.value) || 1) * 60;
  renderTime();
});

setSession(selectedSession);
updateModeUI();
