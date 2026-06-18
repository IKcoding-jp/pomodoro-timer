let timeLeft = 1500;
let timer;
let isRunning = false;
let timerStatus = "work";

const display = document.querySelector("h1");

const startButton = document.getElementById("start");

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ":" + String(s).padStart(2, "0");
}

startButton.addEventListener("click", function() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startButton.textContent = "スタート";
    } else {
        timer = setInterval(function () {
            timeLeft = timeLeft - 1;
            display.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;

                if (timerStatus === "work"){
                    timerStatus = "break";
                    timeLeft = 300;
                    display.textContent = "休憩！";
                    startButton.textContent = "休憩スタート";
                } else {
                    timerStatus = "work";
                    timeLeft = 1500;
                    display.textContent = "25:00"
                    startButton.textContent = "スタート"
                }
            }
        }, 1000);
        isRunning = true;
        startButton.textContent = "ストップ";
    }
})

const resetButton = document.getElementById("reset");

resetButton.addEventListener("click", function () {
    clearInterval(timer);
    timeLeft = 1500;
    isRunning = false;
    startButton.textContent = "スタート";
    display.textContent = formatTime(timeLeft);
});