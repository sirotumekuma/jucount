const schoolSchedules = {
  normal: [
    { name: "朝活動・学活", start: "08:15", end: "08:35" },
    { name: "1時間目", start: "08:40", end: "09:30" },
    { name: "休み時間", start: "09:30", end: "09:40", isBreak: true },
    { name: "2時間目", start: "09:40", end: "10:30" },
    { name: "休み時間", start: "10:30", end: "10:40", isBreak: true },
    { name: "3時間目", start: "10:40", end: "11:30" },
    { name: "休み時間", start: "11:30", end: "11:40", isBreak: true },
    { name: "4時間目", start: "11:40", end: "12:30" },
    { name: "給食準備・給食", start: "12:30", end: "13:05" },
    { name: "清掃", start: "13:10", end: "13:25" },
    { name: "昼休み", start: "13:25", end: "13:40", isBreak: true },
    { name: "5時間目", start: "13:45", end: "14:35" },
    { name: "休み時間", start: "14:35", end: "14:45", isBreak: true },
    { name: "6時間目", start: "14:45", end: "15:35" },
    { name: "学活", start: "15:40", end: "15:50" }
  ],
  short: [
    { name: "朝活動・学活", start: "08:15", end: "08:35" },
    { name: "1時間目", start: "08:40", end: "09:25" },
    { name: "休み時間", start: "09:25", end: "09:35", isBreak: true },
    { name: "2時間目", start: "09:35", end: "10:20" },
    { name: "休み時間", start: "10:20", end: "10:30", isBreak: true },
    { name: "3時間目", start: "10:30", end: "11:15" },
    { name: "休み時間", start: "11:15", end: "11:25", isBreak: true },
    { name: "4時間目", start: "11:25", end: "12:10" },
    { name: "給食準備・給食", start: "12:10", end: "12:45" },
    { name: "清掃", start: "12:50", end: "13:05" },
    { name: "昼休み", start: "13:05", end: "13:20", isBreak: true },
    { name: "5時間目", start: "13:25", end: "14:10" },
    { name: "休み時間", start: "14:10", end: "14:20", isBreak: true },
    { name: "6時間目", start: "14:20", end: "15:05" },
    { name: "学活", start: "15:10", end: "15:20" }
  ],
  test: [
    { name: "学活", start: "08:15", end: "08:25" },
    { name: "1時間目（テスト）", start: "08:30", end: "09:20" },
    { name: "休み時間", start: "09:20", end: "09:35", isBreak: true },
    { name: "2時間目（テスト）", start: "09:35", end: "10:25" },
    { name: "休み時間", start: "10:25", end: "10:40", isBreak: true },
    { name: "3時間目（テスト）", start: "10:40", end: "11:30" },
    { name: "休み時間", start: "11:30", end: "11:45", isBreak: true },
    { name: "4時間目（テスト）", start: "11:45", end: "12:35" },
    { name: "給食準備・給食", start: "12:35", end: "13:10" },
    { name: "清掃", start: "13:15", end: "13:30" },
    { name: "昼休み", start: "13:30", end: "13:40", isBreak: true },
    { name: "5時間目", start: "13:45", end: "14:35" },
    { name: "休み時間", start: "14:35", end: "14:50", isBreak: true },
    { name: "6時間目", start: "14:50", end: "15:40" },
    { name: "学活", start: "15:45", end: "15:55" }
  ]
};

const modeLabels = { normal: "通常校時", short: "短縮校時", test: "テスト校時" };
const savedMode = localStorage.getItem("ju-count-mode");
let currentMode = savedMode && schoolSchedules[savedMode] ? savedMode : "normal";
const savedColor = localStorage.getItem("ju-count-color") || "#007bff";
const savedDarkMode = localStorage.getItem("ju-count-dark-mode") === "true";

const elements = {
  date: document.querySelector("#current-date"),
  statusCard: document.querySelector(".status-card"),
  statusLabel: document.querySelector("#status-label"),
  periodTime: document.querySelector("#period-time"),
  periodName: document.querySelector("#period-name"),
  countdown: document.querySelector("#countdown"),
  caption: document.querySelector("#countdown-caption"),
  progressTrack: document.querySelector(".progress-track"),
  progressBar: document.querySelector("#progress-bar"),
  next: document.querySelector("#next-period"),
  list: document.querySelector("#schedule-list"),
  modeLabel: document.querySelector("#schedule-mode-label")
};

const settings = {
  overlay: document.querySelector("#settings-overlay"),
  button: document.querySelector("#settings-button"),
  close: document.querySelector("#settings-close"),
  darkMode: document.querySelector("#dark-mode-toggle"),
  scheduleButton: document.querySelector("#show-schedule-button"),
  schedulePanel: document.querySelector("#schedule-panel"),
  modeOnboarding: document.querySelector("#mode-onboarding")
};

function setThemeColor(color) {
  document.documentElement.style.setProperty("--accent", color);
  const colorMap = { "#007bff": "#005fc7", "#6f42c1": "#59359c", "#e8590c": "#bd4708", "#d63384": "#a61e63", "#00897b": "#00695c" };
  document.documentElement.style.setProperty("--accent-dark", colorMap[color] || color);
  document.querySelectorAll(".color-option").forEach((option) => option.classList.toggle("is-selected", option.dataset.color === color));
  localStorage.setItem("ju-count-color", color);
}

function setDarkMode(enabled) {
  document.body.classList.toggle("dark-mode", enabled);
  settings.darkMode.checked = enabled;
  localStorage.setItem("ju-count-dark-mode", String(enabled));
}

function toggleSettings(open) {
  settings.overlay.hidden = !open;
  settings.button.setAttribute("aria-expanded", String(open));
  if (open) settings.close.focus();
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function dateAtTime(date, time) {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function formatRemaining(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function renderSchedule(schedule, activeIndex) {
  elements.list.innerHTML = schedule.map((period, index) => `
    <li class="schedule-item${period.isBreak ? " is-break" : ""}${index === activeIndex ? " is-current" : ""}">
      <span class="schedule-item__number">${period.isBreak ? "休み時間" : `${index + 1}コマ`}</span>
      <span class="schedule-item__name">${period.name}</span>
      <span class="schedule-item__time">${period.start}〜${period.end}</span>
    </li>
  `).join("");
}

function setMode(mode, updateDisplay = true) {
  if (!schoolSchedules[mode]) return;
  localStorage.setItem("ju-count-mode", mode);
  document.querySelectorAll(".mode-option").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.mode === mode);
  });
  if (updateDisplay) {
    currentMode = mode;
    elements.modeLabel.textContent = modeLabels[mode];
    update();
  }
}

function closeModeOnboarding() {
  settings.modeOnboarding.hidden = true;
}

function update() {
  const now = new Date();
  const schedule = schoolSchedules[currentMode];
  const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const activeIndex = schedule.findIndex((period) => nowMinutes >= timeToMinutes(period.start) && nowMinutes < timeToMinutes(period.end));
  const nextIndex = schedule.findIndex((period) => timeToMinutes(period.start) > nowMinutes);
  const active = activeIndex >= 0 ? schedule[activeIndex] : null;
  const next = nextIndex >= 0 ? schedule[nextIndex] : null;
  let remaining = 0;
  let progress = 0;

  elements.date.textContent = now.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
  elements.date.dateTime = now.toISOString();
  elements.statusCard.classList.remove("is-break", "is-ending");
  renderSchedule(schedule, activeIndex);

  if (active) {
    const end = dateAtTime(now, active.end);
    const start = dateAtTime(now, active.start);
    remaining = (end - now) / 1000;
    progress = ((now - start) / (end - start)) * 100;
    elements.statusLabel.textContent = active.isBreak ? "休み時間中" : "現在の時限";
    elements.periodName.textContent = active.name;
    elements.periodTime.textContent = `${active.start}〜${active.end}`;
    elements.caption.textContent = active.isBreak ? "終了まで" : "授業終了まで";
    if (active.isBreak) elements.statusCard.classList.add("is-break");
    if (!active.isBreak && remaining <= 300) elements.statusCard.classList.add("is-ending");
    document.title = `[${formatRemaining(remaining)}] ${active.name} - じゅかうんと`;
  } else if (next) {
    const start = dateAtTime(now, next.start);
    remaining = (start - now) / 1000;
    elements.statusLabel.textContent = "授業前 / 休憩中";
    elements.periodName.textContent = "次の授業まで";
    elements.periodTime.textContent = `${next.start}〜${next.end}`;
    elements.caption.textContent = "開始まで";
    document.title = `[${formatRemaining(remaining)}] 授業前 - じゅかうんと`;
  } else {
    elements.statusLabel.textContent = "本日の校時";
    elements.periodName.textContent = "すべての校時が終了";
    elements.periodTime.textContent = "";
    elements.caption.textContent = "お疲れ様でした！";
    document.title = "放課後 - じゅかうんと";
  }

  elements.countdown.textContent = formatRemaining(remaining);
  elements.progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  elements.progressTrack.setAttribute("aria-valuenow", String(Math.round(progress)));
  elements.next.textContent = next && active ? `次: ${next.name} (${next.start}〜)` : next ? `次: ${next.name} (${next.start}〜)` : "次の予定はありません";
}

document.querySelectorAll(".mode-option").forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode, false));
});
document.querySelectorAll(".onboarding-option").forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode);
    closeModeOnboarding();
  });
});

settings.button.addEventListener("click", () => toggleSettings(true));
settings.close.addEventListener("click", () => toggleSettings(false));
settings.overlay.addEventListener("click", (event) => {
  if (event.target === settings.overlay) toggleSettings(false);
});
settings.darkMode.addEventListener("change", (event) => setDarkMode(event.target.checked));
document.querySelectorAll(".color-option").forEach((option) => {
  option.addEventListener("click", () => setThemeColor(option.dataset.color));
});
settings.scheduleButton.addEventListener("click", () => {
  const isHidden = settings.schedulePanel.hidden;
  settings.schedulePanel.hidden = !isHidden;
  settings.scheduleButton.textContent = isHidden ? "本日の校時を閉じる" : "本日の校時を表示";
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !settings.overlay.hidden) toggleSettings(false);
});

setThemeColor(savedColor);
setDarkMode(savedDarkMode);
setMode(currentMode);
if (!savedMode) settings.modeOnboarding.hidden = false;
setInterval(update, 1000);