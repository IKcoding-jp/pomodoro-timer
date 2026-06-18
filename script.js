let timeLeft = 1500;
let timer;
let isRunning = false;

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
                display.textContent = "終了！";
                isRunning = false;
                startButton.textContent = "スタート";
            }
        }, 1000);
        isRunning = true;
        startButton.textContent = "ストップ";
    }
})