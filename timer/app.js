const SESSION_CONFIG = {
  break: {
    label: "휴식",
    recommendedSeconds: 10 * 60,
    palette: {
      bg0: "#08131b",
      bg1: "#14344a",
      bg2: "#1d5d77",
      accent: "#78ebff",
      accentStrong: "#b8fbff",
      accentSoft: "rgba(120, 235, 255, 0.2)",
      secondary: "#97ffe8",
    },
  },
  lunch: {
    label: "점심",
    recommendedSeconds: 60 * 60,
    palette: {
      bg0: "#140f0a",
      bg1: "#48311d",
      bg2: "#835635",
      accent: "#ffcf72",
      accentStrong: "#fff0b4",
      accentSoft: "rgba(255, 207, 114, 0.2)",
      secondary: "#ffd8a0",
    },
  },
  practice: {
    label: "실습",
    recommendedSeconds: 45 * 60,
    palette: {
      bg0: "#0a0c11",
      bg1: "#1b2330",
      bg2: "#273549",
      accent: "#8ae3ff",
      accentStrong: "#d9f5ff",
      accentSoft: "rgba(138, 227, 255, 0.17)",
      secondary: "#79ffcc",
    },
  },
};

const state = {
  session: "break",
  timingMode: "duration",
  isRunning: false,
  isPaused: false,
  isComplete: false,
  totalMs: 0,
  targetTimestamp: null,
  remainingMs: 0,
  pausedRemainingMs: 0,
  tickId: null,
  notice: "",
};

const dom = {
  body: document.body,
  hudLayer: document.querySelector("#hudLayer"),
  revealables: Array.from(document.querySelectorAll(".revealable")),
  nowClock: document.querySelector("#nowClock"),
  sessionGrid: document.querySelector("#sessionGrid"),
  sessionCards: Array.from(document.querySelectorAll(".session-card")),
  durationModeButton: document.querySelector("#durationModeButton"),
  endTimeModeButton: document.querySelector("#endTimeModeButton"),
  durationFields: document.querySelector("#durationFields"),
  endTimeField: document.querySelector("#endTimeField"),
  hoursInput: document.querySelector("#hoursInput"),
  minutesInput: document.querySelector("#minutesInput"),
  secondsInput: document.querySelector("#secondsInput"),
  endTimeInput: document.querySelector("#endTimeInput"),
  startButton: document.querySelector("#startButton"),
  pauseButton: document.querySelector("#pauseButton"),
  stopButton: document.querySelector("#stopButton"),
  targetTimeValue: document.querySelector("#targetTimeValue"),
  durationValue: document.querySelector("#durationValue"),
  sessionBadge: document.querySelector("#sessionBadge"),
  modeBadge: document.querySelector("#modeBadge"),
  countdownValue: document.querySelector("#countdownValue"),
  statusLine: document.querySelector("#statusLine"),
  progressRing: document.querySelector("#progressRing"),
  progressValue: document.querySelector("#progressValue"),
  stageFrame: document.querySelector("#stageFrame"),
  artCanvas: document.querySelector("#artCanvas"),
};

const hudState = {
  hideTimerId: null,
};

const TAU = Math.PI * 2;

function pad(value) {
  return String(value).padStart(2, "0");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function formatDurationLabel(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];

  if (hours) {
    parts.push(`${hours}시간`);
  }
  if (minutes) {
    parts.push(`${minutes}분`);
  }
  if (!hours && !minutes) {
    parts.push(`${seconds}초`);
  } else if (seconds && !hours) {
    parts.push(`${seconds}초`);
  }

  return parts.join(" ") || "0초";
}

function formatTargetLabel(timestamp) {
  if (!timestamp) {
    return "-";
  }

  const target = new Date(timestamp);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  let prefix = `${target.getMonth() + 1}월 ${target.getDate()}일`;
  if (target.toDateString() === now.toDateString()) {
    prefix = "오늘";
  } else if (target.toDateString() === tomorrow.toDateString()) {
    prefix = "내일";
  }

  return `${prefix} ${pad(target.getHours())}:${pad(target.getMinutes())}`;
}

function formatClock(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function secondsToParts(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

function readDurationMs() {
  const hours = clamp(Number(dom.hoursInput.value) || 0, 0, 23);
  const minutes = clamp(Number(dom.minutesInput.value) || 0, 0, 59);
  const seconds = clamp(Number(dom.secondsInput.value) || 0, 0, 59);
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

function writeDurationInputs(totalSeconds) {
  const { hours, minutes, seconds } = secondsToParts(totalSeconds);
  dom.hoursInput.value = String(hours);
  dom.minutesInput.value = String(minutes);
  dom.secondsInput.value = String(seconds);
}

function syncEndTimeInputFromMs(ms) {
  const target = new Date(Date.now() + ms);
  dom.endTimeInput.value = `${pad(target.getHours())}:${pad(target.getMinutes())}`;
}

function getEndTimeTargetTimestamp() {
  const value = dom.endTimeInput.value;
  if (!value) {
    return null;
  }

  const [hoursString, minutesString] = value.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);
  const now = new Date();
  const target = new Date(now);

  target.setHours(hours, minutes, 0, 0);

  if (target.getTime() <= now.getTime() + 999) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime();
}

function getIdlePreviewMs() {
  if (state.timingMode === "duration") {
    return readDurationMs();
  }

  const targetTimestamp = getEndTimeTargetTimestamp();
  if (!targetTimestamp) {
    return 0;
  }
  return Math.max(0, targetTimestamp - Date.now());
}

function getDisplayMs() {
  if (state.isRunning || state.isPaused || state.isComplete) {
    return state.remainingMs;
  }
  return getIdlePreviewMs();
}

function getActiveTargetTimestamp() {
  if (state.isRunning || state.isPaused) {
    return state.targetTimestamp;
  }

  if (state.timingMode === "duration") {
    return Date.now() + readDurationMs();
  }

  return getEndTimeTargetTimestamp();
}

function setNotice(message) {
  state.notice = message;
  updateUI();
}

function clearNotice() {
  if (state.notice) {
    state.notice = "";
  }
}

function applySessionTheme(sessionKey) {
  const palette = SESSION_CONFIG[sessionKey].palette;
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty("--bg-0", palette.bg0);
  rootStyle.setProperty("--bg-1", palette.bg1);
  rootStyle.setProperty("--bg-2", palette.bg2);
  rootStyle.setProperty("--accent", palette.accent);
  rootStyle.setProperty("--accent-strong", palette.accentStrong);
  rootStyle.setProperty("--accent-soft", palette.accentSoft);
  rootStyle.setProperty("--secondary", palette.secondary);
}

function setSession(sessionKey) {
  state.session = sessionKey;
  clearNotice();
  writeDurationInputs(SESSION_CONFIG[sessionKey].recommendedSeconds);
  syncEndTimeInputFromMs(SESSION_CONFIG[sessionKey].recommendedSeconds * 1000);
  applySessionTheme(sessionKey);
  updateUI();
}

function setTimingMode(mode) {
  state.timingMode = mode;
  clearNotice();
  dom.durationFields.classList.toggle("hidden", mode !== "duration");
  dom.endTimeField.classList.toggle("hidden", mode !== "endTime");
  dom.durationModeButton.classList.toggle("active", mode === "duration");
  dom.endTimeModeButton.classList.toggle("active", mode === "endTime");
  dom.durationModeButton.setAttribute("aria-selected", String(mode === "duration"));
  dom.endTimeModeButton.setAttribute("aria-selected", String(mode === "endTime"));
  updateUI();
}

function getProgress() {
  if (state.isComplete) {
    return 1;
  }

  if (!state.totalMs) {
    return 0;
  }

  const remaining = state.isPaused ? state.pausedRemainingMs : state.remainingMs;
  return clamp(1 - remaining / state.totalMs, 0, 1);
}

class MediaArtStage {
  constructor(canvas, getSnapshot) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.getSnapshot = getSnapshot;
    this.width = 0;
    this.height = 0;
    this.pixelRatio = 1;
    this.loop = this.loop.bind(this);

    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.requestAnimationFrame(this.loop);
  }

  resize() {
    const bounds = this.canvas.getBoundingClientRect();
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.width = bounds.width;
    this.height = bounds.height;
    this.canvas.width = Math.max(1, Math.floor(bounds.width * this.pixelRatio));
    this.canvas.height = Math.max(1, Math.floor(bounds.height * this.pixelRatio));
    this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
  }

  loop(timestamp) {
    this.render(timestamp / 1000);
    window.requestAnimationFrame(this.loop);
  }

  render(time) {
    const snapshot = this.getSnapshot();
    const config = SESSION_CONFIG[snapshot.session];
    const { palette } = config;
    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;
    const intensity = snapshot.isRunning ? 1 : snapshot.isPaused ? 0.6 : 0.45;
    const progress = snapshot.progress;

    ctx.clearRect(0, 0, width, height);

    const background = ctx.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, palette.bg0);
    background.addColorStop(0.5, palette.bg1);
    background.addColorStop(1, palette.bg2);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    this.drawVignette(ctx, width, height);

    if (snapshot.session === "break") {
      this.drawBreakScene(ctx, width, height, time, palette, progress, intensity);
    } else if (snapshot.session === "lunch") {
      this.drawLunchScene(ctx, width, height, time, palette, progress, intensity);
    } else {
      this.drawPracticeScene(ctx, width, height, time, palette, progress, intensity, snapshot.isComplete);
    }

    if (snapshot.isComplete) {
      this.drawCompletionFlash(ctx, width, height, time, palette.accentStrong);
    }
  }

  drawVignette(ctx, width, height) {
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.48, width * 0.14, width * 0.5, height * 0.48, width * 0.68);
    gradient.addColorStop(0, "rgba(255,255,255,0.02)");
    gradient.addColorStop(1, "rgba(0,0,0,0.28)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  drawGlow(ctx, x, y, radius, colorHex, alpha = 1) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, this.rgba(colorHex, 0.22 * alpha));
    gradient.addColorStop(0.4, this.rgba(colorHex, 0.11 * alpha));
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  rgba(hex, alpha) {
    const clean = hex.replace("#", "");
    const full = clean.length === 3 ? clean.split("").map((value) => value + value).join("") : clean;
    const red = parseInt(full.slice(0, 2), 16);
    const green = parseInt(full.slice(2, 4), 16);
    const blue = parseInt(full.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  drawParticle(ctx, x, y, radius, colorHex, alpha = 0.3, glowScale = 0) {
    if (radius <= 0 || alpha <= 0) {
      return;
    }

    ctx.fillStyle = this.rgba(colorHex, alpha);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();

    if (glowScale > 0) {
      this.drawGlow(ctx, x, y, radius * glowScale, colorHex, alpha);
    }
  }

  drawStreak(ctx, x, y, vx, vy, width, colorHex, alpha = 0.18) {
    ctx.beginPath();
    ctx.moveTo(x - vx, y - vy);
    ctx.lineTo(x + vx * 0.16, y + vy * 0.16);
    ctx.strokeStyle = this.rgba(colorHex, alpha);
    ctx.lineWidth = width;
    ctx.stroke();
  }

  drawParticleSwarm(ctx, count, generator) {
    const points = [];

    for (let index = 0; index < count; index += 1) {
      const point = generator(index, index / Math.max(1, count - 1));
      if (!point) {
        continue;
      }

      if (point.streak) {
        this.drawStreak(
          ctx,
          point.x,
          point.y,
          point.streak.vx,
          point.streak.vy,
          point.streak.width,
          point.color,
          point.streak.alpha,
        );
      }

      this.drawParticle(ctx, point.x, point.y, point.radius, point.color, point.alpha, point.glowScale || 0);
      points.push(point);
    }

    return points;
  }

  drawConstellation(ctx, points, colorHex, maxDistance, alpha = 0.08) {
    const maxDistanceSquared = maxDistance * maxDistance;

    for (let index = 0; index < points.length; index += 1) {
      const pointA = points[index];
      for (let compareIndex = index + 1; compareIndex < points.length; compareIndex += 1) {
        const pointB = points[compareIndex];
        const dx = pointA.x - pointB.x;
        const dy = pointA.y - pointB.y;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared > maxDistanceSquared) {
          continue;
        }

        const distanceRatio = 1 - distanceSquared / maxDistanceSquared;
        ctx.beginPath();
        ctx.moveTo(pointA.x, pointA.y);
        ctx.lineTo(pointB.x, pointB.y);
        ctx.strokeStyle = this.rgba(colorHex, alpha * distanceRatio);
        ctx.lineWidth = 0.8 + distanceRatio * 0.8;
        ctx.stroke();
      }
    }
  }

  drawBreakScene(ctx, width, height, time, palette, progress, intensity) {
    const flow = 20 + intensity * 38;
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (let halo = 0; halo < 3; halo += 1) {
      const x = width * (0.24 + halo * 0.28) + Math.sin(time * 0.24 + halo) * 42;
      const y = height * (0.32 + halo * 0.12) + Math.cos(time * 0.28 + halo) * 28;
      const radius = 110 + halo * 24 + Math.sin(time * 0.9 + halo) * 18 + progress * 30;
      this.drawGlow(ctx, x, y, radius, halo % 2 === 0 ? palette.accent : palette.secondary, 0.56 + intensity * 0.34);
    }

    for (let ribbon = 0; ribbon < 4; ribbon += 1) {
      const ribbonPoints = this.drawParticleSwarm(ctx, 32, (index, offset) => {
        const x = ((offset * (width + 180) + time * (flow + ribbon * 9) + ribbon * 70) % (width + 180)) - 90;
        const wave =
          Math.sin(offset * TAU * 3 + time * 1.05 + ribbon * 0.7) * (26 + ribbon * 3) +
          Math.cos(offset * TAU * 5 + time * 0.55 + ribbon) * 10;
        const y = height * (0.26 + ribbon * 0.15) + wave + Math.sin(time * 0.9 + index * 0.35) * 8;
        const pulse = 0.5 + 0.5 * Math.sin(time * 1.3 + index * 0.7 + ribbon);
        const radius = 1.4 + pulse * (2.4 + ribbon * 0.25);
        const alpha = 0.12 + intensity * 0.16 + pulse * 0.18;
        const color = index % 3 === 0 ? palette.secondary : palette.accent;
        return {
          x,
          y,
          radius,
          alpha,
          color,
          glowScale: radius > 2.8 ? 4.4 : 0,
          streak: {
            vx: 8 + ribbon * 3,
            vy: wave * 0.03,
            width: 0.7 + radius * 0.12,
            alpha: alpha * 0.52,
          },
        };
      });

      this.drawConstellation(
        ctx,
        ribbonPoints.filter((_, index) => index % 5 === 0),
        ribbon % 2 === 0 ? palette.accentStrong : palette.secondary,
        120,
        0.04 + intensity * 0.03,
      );
    }

    this.drawParticleSwarm(ctx, 56, (index, offset) => {
      const drift = ((time * (12 + index * 0.18) + offset * width * 1.4) % (width + 120)) - 60;
      const y = height * (0.18 + (index % 10) * 0.067) + Math.sin(time * 0.8 + index * 0.6) * 18;
      const alpha = 0.08 + ((index % 6) / 6) * 0.14;
      return {
        x: drift,
        y,
        radius: 0.9 + (index % 4) * 0.55,
        alpha,
        color: index % 2 === 0 ? palette.accentStrong : palette.secondary,
        glowScale: index % 7 === 0 ? 5 : 0,
        streak: {
          vx: 4 + (index % 5),
          vy: -1.2,
          width: 0.45 + (index % 3) * 0.18,
          alpha: alpha * 0.34,
        },
      };
    });

    ctx.restore();
  }

  drawLunchScene(ctx, width, height, time, palette, progress, intensity) {
    const centerX = width * 0.54;
    const centerY = height * 0.55;
    const baseRadius = Math.min(width, height) * 0.16;

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    this.drawGlow(ctx, centerX, centerY, baseRadius * 2.8, palette.accent, 0.9);
    this.drawGlow(ctx, centerX, centerY, baseRadius * 1.5, palette.secondary, 0.4);

    const orbitPoints = this.drawParticleSwarm(ctx, 96, (index, offset) => {
      const band = index % 6;
      const direction = band % 2 === 0 ? 1 : -1;
      const angle = time * (0.18 + band * 0.035) * direction + offset * TAU * 4;
      const radius = baseRadius * (0.84 + band * 0.24) + Math.sin(time + index) * 10 + progress * 16;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle * 1.14) * radius * 0.56;
      const pulse = 0.5 + 0.5 * Math.sin(time * 1.5 + index * 0.33);
      const color = band % 3 === 0 ? palette.secondary : index % 2 === 0 ? palette.accent : palette.accentStrong;
      return {
        x,
        y,
        radius: 1.5 + pulse * (2 + band * 0.15),
        alpha: 0.12 + pulse * 0.18,
        color,
        glowScale: pulse > 0.72 ? 4.6 : 0,
        streak: {
          vx: -Math.sin(angle) * (8 + band * 1.6),
          vy: Math.cos(angle * 1.14) * (4 + band),
          width: 0.8 + pulse * 0.6,
          alpha: 0.08 + pulse * 0.09,
        },
      };
    });

    this.drawConstellation(
      ctx,
      orbitPoints.filter((_, index) => index % 8 === 0),
      palette.accentStrong,
      baseRadius * 1.48,
      0.08,
    );

    this.drawParticleSwarm(ctx, 110, (index, offset) => {
      const lane = index % 8;
      const rise = (time * (0.08 + lane * 0.01) + offset * 1.8 + lane * 0.12) % 1;
      const y = height * 0.96 - rise * height * 0.72;
      const x =
        width * (0.32 + lane * 0.053) +
        Math.sin(time * 1.1 + lane + rise * TAU * 2) * (10 + lane * 1.6) +
        Math.cos(rise * TAU * 3 + index) * 6;
      const alpha = 0.06 + (1 - rise) * 0.15;
      const radius = 0.8 + (1 - rise) * 2 + (lane % 3) * 0.22;
      return {
        x,
        y,
        radius,
        alpha,
        color: lane % 2 === 0 ? palette.accentStrong : palette.secondary,
        glowScale: rise < 0.28 ? 4.8 : 0,
        streak: {
          vx: Math.sin(time + lane) * 1.4,
          vy: 7 + lane * 0.6,
          width: 0.4 + radius * 0.16,
          alpha: alpha * 0.32,
        },
      };
    });

    this.drawParticleSwarm(ctx, 28, (index, offset) => {
      const angle = offset * TAU + time * 0.2;
      const x = centerX + Math.cos(angle) * baseRadius * 0.6;
      const y = centerY + Math.sin(angle) * baseRadius * 0.24;
      return {
        x,
        y,
        radius: 2.4 + (index % 4) * 0.45,
        alpha: 0.08 + (index % 3) * 0.03,
        color: palette.accent,
        glowScale: 5.4,
      };
    });

    ctx.restore();
  }

  drawPracticeScene(ctx, width, height, time, palette, progress, intensity, isComplete) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const centerX = width * 0.5;
    const centerY = height * 0.54;
    const fieldWidth = width * 0.62;
    const fieldHeight = height * 0.46;
    const startX = centerX - fieldWidth * 0.5;
    const startY = centerY - fieldHeight * 0.5;
    const columns = 12;
    const rows = 7;
    const grid = [];

    this.drawGlow(ctx, centerX, centerY, Math.min(width, height) * 0.32, palette.accent, 0.22 + intensity * 0.12);

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const offsetX = fieldWidth / (columns - 1);
        const offsetY = fieldHeight / (rows - 1);
        const pulse = 0.5 + 0.5 * Math.sin(time * 1.8 + column * 0.55 + row * 0.72);
        const x = startX + column * offsetX + Math.sin(time + column * 0.7 + row) * 7;
        const y = startY + row * offsetY + Math.cos(time * 1.15 + row * 0.8 + column * 0.3) * 7;
        const point = {
          x,
          y,
          pulse,
          color: (row + column) % 3 === 0 ? palette.secondary : palette.accent,
        };
        grid.push(point);

        this.drawParticle(
          ctx,
          x,
          y,
          1.3 + pulse * 2.4,
          point.color,
          0.12 + pulse * 0.16,
          pulse > 0.8 ? 4.8 : 0,
        );
      }
    }

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        const point = grid[index];
        const right = column < columns - 1 ? grid[index + 1] : null;
        const down = row < rows - 1 ? grid[index + columns] : null;

        [right, down].forEach((nextPoint) => {
          if (!nextPoint) {
            return;
          }

          const strength = ((point.pulse + nextPoint.pulse) * 0.5) * (0.08 + progress * 0.08);
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(nextPoint.x, nextPoint.y);
          ctx.strokeStyle = this.rgba(point.color, strength);
          ctx.lineWidth = 0.7 + strength * 6;
          ctx.stroke();
        });
      }
    }

    this.drawParticleSwarm(ctx, 84, (index, offset) => {
      const drift = (time * (58 + index * 0.4) + offset * (width + height) * 0.7) % (width + 180);
      const x = drift - 90;
      const y =
        height - ((offset * (height + 160) + time * (34 + index * 0.24) + index * 9) % (height + 160)) + 80;
      const angle = -0.7;
      const speed = 6 + (index % 6);
      const alpha = 0.06 + ((index % 5) / 5) * 0.12;
      return {
        x,
        y,
        radius: 0.9 + (index % 4) * 0.5,
        alpha,
        color: index % 4 === 0 ? palette.secondary : palette.accentStrong,
        glowScale: index % 9 === 0 ? 4.8 : 0,
        streak: {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          width: 0.45 + (index % 3) * 0.18,
          alpha: alpha * 0.42,
        },
      };
    });

    const corePoints = grid.filter((_, index) => index % 4 === 0);
    this.drawConstellation(ctx, corePoints, palette.accentStrong, 140, isComplete ? 0.16 : 0.09 + intensity * 0.02);

    ctx.restore();
  }

  drawCompletionFlash(ctx, width, height, time, color) {
    const pulse = (Math.sin(time * 8) + 1) * 0.5;
    ctx.fillStyle = this.rgba(color, 0.06 + pulse * 0.08);
    ctx.fillRect(0, 0, width, height);
  }
}

const stage = new MediaArtStage(dom.artCanvas, () => ({
  session: state.session,
  progress: getProgress(),
  isRunning: state.isRunning,
  isPaused: state.isPaused,
  isComplete: state.isComplete,
}));

function clearTick() {
  if (state.tickId) {
    window.clearInterval(state.tickId);
    state.tickId = null;
  }
}

function clearHudHideTimer() {
  if (hudState.hideTimerId) {
    window.clearTimeout(hudState.hideTimerId);
    hudState.hideTimerId = null;
  }
}

function setHudVisible(visible) {
  dom.body.classList.toggle("hud-visible", visible);
}

function isHudInteracting() {
  const activeElement = document.activeElement;
  return (
    dom.revealables.some((element) => element.matches(":hover")) ||
    (activeElement && dom.hudLayer.contains(activeElement))
  );
}

function scheduleHudHide(delay = 1800) {
  clearHudHideTimer();
  hudState.hideTimerId = window.setTimeout(() => {
    if (!isHudInteracting()) {
      setHudVisible(false);
    }
  }, delay);
}

function revealHud(delay = 2600) {
  clearHudHideTimer();
  setHudVisible(true);
  scheduleHudHide(delay);
}

function isNearViewportEdge(clientX, clientY) {
  const threshold = window.innerWidth <= 820 ? 56 : 84;
  return (
    clientX <= threshold ||
    clientY <= threshold ||
    clientX >= window.innerWidth - threshold ||
    clientY >= window.innerHeight - threshold
  );
}

function validateDuration(ms) {
  return ms >= 1000;
}

function updateClock() {
  dom.nowClock.textContent = formatClock(new Date());
}

function updateUI() {
  const config = SESSION_CONFIG[state.session];
  const settingsLocked = state.isRunning || state.isPaused;
  const previewMs = getDisplayMs();
  const targetTimestamp = getActiveTargetTimestamp();
  const progress = getProgress();
  const timingLabel = state.timingMode === "duration" ? "지속" : "종료";

  dom.sessionCards.forEach((card) => {
    const active = card.dataset.session === state.session;
    card.classList.toggle("active", active);
    card.disabled = settingsLocked;
  });

  dom.sessionGrid.classList.toggle("is-locked", settingsLocked);

  [dom.hoursInput, dom.minutesInput, dom.secondsInput, dom.endTimeInput].forEach((input) => {
    input.disabled = settingsLocked;
  });
  dom.durationModeButton.disabled = settingsLocked;
  dom.endTimeModeButton.disabled = settingsLocked;

  dom.sessionBadge.textContent = config.label;
  dom.modeBadge.textContent = timingLabel;

  dom.countdownValue.textContent = formatCountdown(previewMs);
  dom.durationValue.textContent = formatDurationLabel(state.isRunning || state.isPaused ? state.totalMs : previewMs);
  dom.targetTimeValue.textContent = formatTargetLabel(targetTimestamp);

  let statusLine = config.label;
  if (state.notice) {
    statusLine = state.notice;
  } else if (state.isRunning) {
    statusLine = formatTargetLabel(state.targetTimestamp);
  } else if (state.isPaused) {
    statusLine = "일시정지";
  } else if (state.isComplete) {
    statusLine = "완료";
  } else if (state.timingMode === "endTime") {
    statusLine = formatTargetLabel(targetTimestamp);
  } else {
    statusLine = formatDurationLabel(previewMs);
  }
  dom.statusLine.textContent = statusLine;

  dom.progressRing.style.setProperty("--progress", `${Math.round(progress * 100)}%`);
  dom.progressValue.textContent = `${Math.round(progress * 100)}%`;

  dom.startButton.textContent = state.isPaused ? "재개" : "시작";
  dom.startButton.disabled = state.isRunning;
  dom.pauseButton.disabled = !state.isRunning;
  dom.stopButton.disabled = !state.isRunning && !state.isPaused && !state.isComplete;
}

function tick() {
  if (!state.targetTimestamp) {
    return;
  }

  const remainingMs = Math.max(0, state.targetTimestamp - Date.now());
  state.remainingMs = remainingMs;

  if (remainingMs <= 0) {
    completeTimer();
    return;
  }

  updateUI();
}

async function startTimer() {
  clearNotice();

  let totalMs;
  let targetTimestamp;

  if (state.timingMode === "duration") {
    totalMs = readDurationMs();
    if (!validateDuration(totalMs)) {
      setNotice("최소 1초 이상 설정해야 합니다.");
      return;
    }
    targetTimestamp = Date.now() + totalMs;
  } else {
    targetTimestamp = getEndTimeTargetTimestamp();
    if (!targetTimestamp) {
      setNotice("종료 시각을 먼저 지정해야 합니다.");
      return;
    }
    totalMs = targetTimestamp - Date.now();
    if (!validateDuration(totalMs)) {
      setNotice("현재 시각보다 충분히 뒤의 종료 시각을 골라야 합니다.");
      return;
    }
  }

  state.isRunning = true;
  state.isPaused = false;
  state.isComplete = false;
  state.totalMs = totalMs;
  state.targetTimestamp = targetTimestamp;
  state.remainingMs = totalMs;
  state.pausedRemainingMs = 0;

  clearTick();
  state.tickId = window.setInterval(tick, 250);
  tick();
  updateUI();
}

async function resumeTimer() {
  if (!state.isPaused || !state.pausedRemainingMs) {
    return;
  }

  state.isPaused = false;
  state.isRunning = true;
  state.isComplete = false;
  state.targetTimestamp = Date.now() + state.pausedRemainingMs;
  state.remainingMs = state.pausedRemainingMs;
  state.pausedRemainingMs = 0;

  clearTick();
  state.tickId = window.setInterval(tick, 250);
  tick();
  updateUI();
}

function pauseTimer() {
  if (!state.isRunning) {
    return;
  }

  clearTick();
  state.isRunning = false;
  state.isPaused = true;
  state.remainingMs = Math.max(0, state.targetTimestamp - Date.now());
  state.pausedRemainingMs = state.remainingMs;
  updateUI();
}

function stopTimer() {
  clearTick();
  state.isRunning = false;
  state.isPaused = false;
  state.isComplete = false;
  state.totalMs = 0;
  state.targetTimestamp = null;
  state.remainingMs = 0;
  state.pausedRemainingMs = 0;
  clearNotice();
  updateUI();
}

async function completeTimer() {
  clearTick();
  state.isRunning = false;
  state.isPaused = false;
  state.isComplete = true;
  state.remainingMs = 0;
  state.pausedRemainingMs = 0;
  updateUI();
}

function onInputChange() {
  clearNotice();
  updateUI();
}

dom.sessionCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (state.isRunning || state.isPaused) {
      return;
    }
    setSession(card.dataset.session);
  });
});

dom.durationModeButton.addEventListener("click", () => {
  if (!state.isRunning && !state.isPaused) {
    setTimingMode("duration");
  }
});

dom.endTimeModeButton.addEventListener("click", () => {
  if (!state.isRunning && !state.isPaused) {
    setTimingMode("endTime");
  }
});

[dom.hoursInput, dom.minutesInput, dom.secondsInput, dom.endTimeInput].forEach((input) => {
  input.addEventListener("input", onInputChange);
});

dom.startButton.addEventListener("click", async () => {
  if (state.isPaused) {
    await resumeTimer();
    return;
  }
  await startTimer();
});

dom.pauseButton.addEventListener("click", pauseTimer);
dom.stopButton.addEventListener("click", stopTimer);

window.addEventListener("pointermove", (event) => {
  if (isNearViewportEdge(event.clientX, event.clientY)) {
    revealHud(2600);
    return;
  }

  if (!isHudInteracting()) {
    scheduleHudHide(1400);
  }
});

window.addEventListener("pointerdown", (event) => {
  if (isNearViewportEdge(event.clientX, event.clientY)) {
    revealHud(2600);
  }
});

window.addEventListener(
  "touchstart",
  () => {
    revealHud(2600);
  },
  { passive: true },
);

window.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    revealHud(3200);
  }
});

dom.revealables.forEach((element) => {
  element.addEventListener("pointerenter", () => {
    clearHudHideTimer();
    setHudVisible(true);
  });

  element.addEventListener("pointerleave", () => {
    scheduleHudHide(1200);
  });
});

dom.hudLayer.addEventListener("focusin", () => {
  clearHudHideTimer();
  setHudVisible(true);
});

dom.hudLayer.addEventListener("focusout", () => {
  scheduleHudHide(1200);
});

window.setInterval(() => {
  updateClock();
  if (!state.isRunning) {
    updateUI();
  }
}, 1000);

updateClock();
setSession("break");
setTimingMode("duration");
updateUI();
revealHud(3200);
