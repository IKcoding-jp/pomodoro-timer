let timeLeft = 1500;

const display = document.querySelector("h1");

const startButton = document.getElementById("start");

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ":" + String(s).padStart(2, "0");
}

startButton.addEventListener("click", function () {
    setInterval(function () {
        timeLeft = timeLeft -1
        display.textContent = formatTime(timeLeft);
    }, 1000);
})