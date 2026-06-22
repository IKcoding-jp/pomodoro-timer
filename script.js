let timeLeft = 1500;
let totalTime = 1500;
let timer;
let isRunning = false;
let timerStatus = "work";
let sessionCount = 0;
let startTimestamp = null;
let startTimeLeft = 0;

const display = document.querySelector(".ring-time");
const startButton = document.getElementById("start");
const workInput = document.getElementById("workTime");
const breakInput = document.getElementById("breakTime");
const ring = document.querySelector(".ring-progress");
const circumference = 2 * Math.PI * 90;
const chimeSound = new Audio("sounds/chime.mp3");
const savedWork = localStorage.getItem("workTime");
const savedBreak = localStorage.getItem("breakTime");
const savedSession = localStorage.getItem("sessionCount");
const showStatsBtn = document.getElementById("showStats");
const statsModal = document.getElementById("statsModal");
const closeStatsBtn = document.getElementById("closeStats");
ring.style.strokeDasharray = circumference;

function updateRing(timeLeft, totalTime) {
  const offset = circumference * (1 - timeLeft / totalTime);
  ring.style.strokeDashoffset = offset;
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  const current = sessionCount % 4;
  dots.forEach(function (dot, index) {
    if (index < current) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m + ":" + String(s).padStart(2, "0");
}

function handleTimerEnd() {
  playChime();
  clearInterval(timer);
  isRunning = false;

  if (timerStatus === "work") {
    timerStatus = "break";
    sessionCount = sessionCount + 1;
    saveTodaySession(Number(workInput.value));
    updateTodayStats();
    localStorage.setItem("sessionCount", sessionCount);
    updateDots();
    timeLeft = sessionCount % 4 === 0 ? 900 : breakInput.value * 60;
    display.textContent = "休憩";
    startButton.textContent = "休憩スタート";
  } else {
    timerStatus = "work";
    timeLeft = workInput.value * 60;
    display.textContent = formatTime(timeLeft);
    startButton.textContent = "スタート";
  }

  const autoStart = document.getElementById("autoStart");
  if (autoStart.checked) {
    startButton.click();
  }
}

function playChime() {
  chimeSound.currentTime = 0;
  chimeSound.play().catch(function (e) {
    console.log("音が鳴りませんでした", e);
  });
}

startButton.addEventListener("click", function () {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
    startButton.textContent = "スタート";
  } else {
    totalTime = timeLeft;
    startTimestamp = Date.now();
    startTimeLeft = timeLeft;
    timer = setInterval(function () {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      timeLeft = startTimeLeft - elapsed;
      display.textContent = formatTime(timeLeft);
      updateRing(timeLeft, totalTime);
      if (timeLeft <= 0) {
        handleTimerEnd();
      }
    }, 500);
    isRunning = true;
    startButton.textContent = "ストップ";
  }
});

const resetButton = document.getElementById("reset");

resetButton.addEventListener("click", function () {
  timerStatus = "work";
  clearInterval(timer);
  timeLeft = workInput.value * 60;
  isRunning = false;
  startButton.textContent = "スタート";
  display.textContent = formatTime(timeLeft);
  updateRing(timeLeft, totalTime);
  sessionCount = 0;
  updateDots();
});

workInput.addEventListener("input", function () {
  if (workInput.value < 1) workInput.value = 1;
  localStorage.setItem("workTime", workInput.value);
  if (!isRunning) {
    timeLeft = workInput.value * 60;
    display.textContent = formatTime(timeLeft);
  }
});

breakInput.addEventListener("input", function () {
  if (breakInput.value < 1) breakInput.value = 1;
  localStorage.setItem("breakTime", breakInput.value);
  if (!isRunning) {
    if (timerStatus === "break") {
      timeLeft = breakInput.value * 60;
      display.textContent = formatTime(timeLeft);
    }
  }
});

document.getElementById("debug").addEventListener("click", function () {
  handleTimerEnd();
});

if (
  location.hostname !== "localhost" &&
  location.hostname !== "127.0.0.1" &&
  location.protocol !== "file:"
) {
  document.getElementById("debug").style.display = "none";
}

if (savedWork) {
  workInput.value = savedWork;
  timeLeft = savedWork * 60;
  totalTime = timeLeft;
  display.textContent = formatTime(timeLeft);
}
if (savedBreak) breakInput.value = savedBreak;
if (savedSession) {
  sessionCount = Number(savedSession);
  updateDots();
}

function updateTodayStats() {
  const today = new Date().toISOString().slice(0, 10);
  const log = JSON.parse(localStorage.getItem("studyLog") || "{}");
  const todayData = log[today] || { sessions: 0, workMinutes: 0 };
  const h = Math.floor(todayData.workMinutes / 60);
  const m = todayData.workMinutes % 60;
  const timeStr = h > 0 ? h + "時間" + m + "分" : m + "分";
  document.getElementById("todayStats").textContent =
    "今日: " + todayData.sessions + "セッション / " + timeStr;
}

function saveTodaySession(workMinutes) {
  const today = new Date().toISOString().slice(0, 10);
  const log = JSON.parse(localStorage.getItem("studyLog") || "{}");
  if (!log[today]) {
    log[today] = { sessions: 0, workMinutes: 0 };
  }
  log[today].sessions += 1;
  log[today].workMinutes += workMinutes;
  localStorage.setItem("studyLog", JSON.stringify(log));
}

updateTodayStats();

showStatsBtn.addEventListener("click", () => {
  renderBarChart();
  renderHeatmap();
  statsModal.classList.remove("hidden");
});

closeStatsBtn.addEventListener("click", () => {
  statsModal.classList.add("hidden");
});

function renderBarChart() {
  const log = JSON.parse(localStorage.getItem("studyLog") || "{}");
  const chart = document.getElementById("barChart");
  chart.innerHTML = "";

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const data = log[key] || { sessions: 0, workMinutes: 0 };

    const bar = document.createElement("div");
    bar.className = "bar-item";
    bar.innerHTML =
      '<div class="bar-fill" style="height: ' +
      data.workMinutes * 2 +
      'px"></div>' +
      '<div class="bar-label">' +
      (date.getMonth() + 1) +
      "/" +
      date.getDate() +
      "</div>";
    chart.appendChild(bar);
  }
}

function renderHeatmap() {
  const log = JSON.parse(localStorage.getItem("studyLog") || "{}");
  const heatmap = document.getElementById("heatmap");
  heatmap.innerHTML = "";

  for (let i = 89; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const minutes = (log[key] || { workMinutes: 0 }).workMinutes;

    const cell = document.createElement("div");
    cell.className = "heatmap-cell";
    if (minutes >= 31) {
      cell.classList.add("level-2");
    } else if (minutes >= 1) {
      cell.classList.add("level-1");
    }
    cell.title = key + ": " + minutes + "分";
    heatmap.appendChild(cell);
  }
}
