let timeLeft = 1500;
let timer;
let isRunning = false;
let timerStatus = "work";
let sessionCount = 0;

const display = document.querySelector("h1");
const startButton = document.getElementById("start");
const workInput = document.getElementById("workTime");
const breakInput = document.getElementById("breakTime");

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
        timeLeft = breakInput.value * 60;
        display.textContent = "休憩！";
        startButton.textContent = "休憩スタート";
        sessionCount = sessionCount + 1;
        document.getElementById("sessionCount").textContent = "セッション:" + sessionCount;
    } else {
        timerStatus = "work";
        timeLeft = workInput.value * 60;
        display.textContent = "25:00"
        startButton.textContent = "スタート"
    }
}

function playChime() {
    const sound = new Audio("sounds/chime.mp3");
    sound.play();
}

startButton.addEventListener("click", function () {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startButton.textContent = "スタート";
    } else {
        timeLeft = workInput.value * 60;
        timer = setInterval(function () {
            timeLeft = timeLeft - 1;
            display.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                handleTimerEnd();
            }
        }, 1000);
        isRunning = true;
        startButton.textContent = "ストップ";
    }
})

const resetButton = document.getElementById("reset");

resetButton.addEventListener("click", function () {
    clearInterval(timer);
    timeLeft = workInput.value * 60;
    isRunning = false;
    startButton.textContent = "スタート";
    display.textContent = formatTime(timeLeft);
});

workInput.addEventListener("input", function () {
    if (!isRunning) {
        timeLeft = workInput.value * 60;
        display.textContent = formatTime(timeLeft);
    }
});

breakInput.addEventListener("input", function () {
    if (!isRunning) {
        if (timerStatus === "break") {
            timeLeft = breakInput.value * 60;
            display.textContent = formatTime(timeLeft);
        }
    }
});