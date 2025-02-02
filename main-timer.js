let mainTimerInterval;
let mainTimerSeconds = 600;
let isTimerRunning = false;

function updateMainTimerDisplay() {
  let minutes = Math.floor(mainTimerSeconds / 60);
  let seconds = mainTimerSeconds % 60;
  document.getElementById("mainTimer").value = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateMainTimerFromInput() {
  const input = document.getElementById("mainTimer").value;
  const parts = input.split(":");
  if (parts.length === 2) {
    let mins = parseInt(parts[0], 10);
    let secs = parseInt(parts[1], 10);
    if (!isNaN(mins) && !isNaN(secs) && secs >= 0 && secs < 60) {
      mainTimerSeconds = mins * 60 + secs;
    }
  }
}

function updateTimerTitle() {
  const title = document.getElementById("timerTitle").value;
  // Update the title dynamically if needed (e.g., store it in local storage or use it elsewhere).
  // For now, just display it.
  console.log("Timer title updated to: " + title);
}

function toggleStartPause() {
  if (isTimerRunning) {
    clearInterval(mainTimerInterval);
    mainTimerInterval = null;
    isTimerRunning = false;
    document.getElementById("toggleStartPauseBtn").textContent = "▶️"; // Change button to start icon
  } else {
    startMainTimer();
    document.getElementById("toggleStartPauseBtn").textContent = "⏸️"; // Change button to pause icon
  }
}

function startMainTimer() {
  if (!mainTimerInterval) {
    mainTimerInterval = setInterval(() => {
      if (mainTimerSeconds > 0) {
        mainTimerSeconds--;
        updateMainTimerDisplay();
      } else {
        clearInterval(mainTimerInterval);
        mainTimerInterval = null;
        isTimerRunning = false;
        document.getElementById("toggleStartPauseBtn").textContent = "▶"; // Reset button to start
      }
    }, 1000);
    isTimerRunning = true;
  }
}

function resetMainTimer() {
  clearInterval(mainTimerInterval);
  mainTimerInterval = null;
  isTimerRunning = false;
  mainTimerSeconds = 600;
  updateMainTimerDisplay();
  document.getElementById("toggleStartPauseBtn").textContent = "▶"; // Reset button to start
}

updateMainTimerDisplay();