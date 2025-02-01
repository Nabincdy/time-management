document.addEventListener("DOMContentLoaded", () => {
  const timerList = document.getElementById("timerList");
  const addTimerBtn = document.getElementById("addTimerBtn");
  const defaultTimeInput = document.getElementById("defaultTime");
  const notifyCheckbox = document.getElementById("notifyCheckbox");
  addTimerBtn.style.color = "green"; // Optional: Set the color to green

  notifyCheckbox.addEventListener("change", function () {
    if (this.checked) {
      requestNotificationPermission();
    }
  });

  addTimerBtn.addEventListener("click", addTimer);

  function createTimerComponent(defaultTime) {
    const timerComponent = document.createElement("div");
    timerComponent.className = "timer";
    timerComponent.innerHTML = `
      <input type="text" placeholder="Timer Title" class="timer-title"/>
      <input type="text" value="${defaultTime}" class="timer-value"/>
      <div class="btn-container flex-row">
        <button class="start-pause-btn">▶️</button>
        <button class="reset-initial-btn">⏏️</button>
        <button class="reset-default-btn">⤵️</button>
        <button class="remove-btn">❌</button>
        <button class="form-btn">Form</button>
        <button class="content-btn">Content</button>
        <button class="people-btn">People</button>
        <button class="vote-btn">Vote</button>
      </div>

    `;
    timerList.appendChild(timerComponent);
    return timerComponent;
  }

  function addTimer() {
    const defaultTime = defaultTimeInput.value;
    const timerComponent = createTimerComponent(defaultTime);
    setupTimerControls(timerComponent, defaultTime);
  }

  function setupTimerControls(timerComponent, initialTime) {
    const timerTitle = timerComponent.querySelector(".timer-title");
    const timerValue = timerComponent.querySelector(".timer-value");
    const startPauseBtn = timerComponent.querySelector(".start-pause-btn");
    const resetInitialBtn = timerComponent.querySelector(".reset-initial-btn");
    const resetDefaultBtn = timerComponent.querySelector(".reset-default-btn");
    const removeBtn = timerComponent.querySelector(".remove-btn");
    const formBtn = timerComponent.querySelector(".form-btn");
    const dropdown = timerComponent.querySelector(".form-dropdown");
    let intervalId = null;
    let wasRunning = false;

    function toggleTimer(shouldStart) {
      if (shouldStart) {
        startTimer();
      } else {
        clearInterval(intervalId);
        intervalId = null;
        startPauseBtn.textContent = "▶️";
        timerComponent.style.backgroundColor = "";
      }
    }

    function startTimer() {
      timerComponent.style.backgroundColor = "#c5eba9";
      let [minutes, seconds] = timerValue.value.split(":").map(num => parseInt(num, 10));
      let totalSeconds = minutes * 60 + seconds;

      intervalId = setInterval(() => {
        if (totalSeconds <= 0) {
          clearInterval(intervalId);
          intervalId = null;
          timerComponent.style.backgroundColor = "orange";
          onComplete();
          startPauseBtn.textContent = "▶️";
          return;
        }
        totalSeconds--;
        const mins = Math.floor(totalSeconds / 60).toString();
        const secs = (totalSeconds % 60).toString().padStart(2, "0");
        timerValue.value = `${mins}:${secs}`;
      }, 1000);
      startPauseBtn.textContent = "⏸️";
    }

    formBtn.addEventListener("click", () => {
      dropdown.classList.toggle("hidden");
    });

    dropdown.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        timerValue.value = item.getAttribute("data-time");
        dropdown.classList.add("hidden");
      });
    });

    resetDefaultBtn.addEventListener("click", () => {
      clearInterval(intervalId);
      intervalId = null;
      timerValue.value = defaultTimeInput.value;
      timerComponent.style.backgroundColor = "";
      startPauseBtn.textContent = "▶️";
    });

    resetInitialBtn.addEventListener("click", () => {
      clearInterval(intervalId);
      intervalId = null;
      timerValue.value = initialTime;
      timerComponent.style.backgroundColor = "";
      startPauseBtn.textContent = "▶️";
    });

    removeBtn.addEventListener("click", () => {
      clearInterval(intervalId);
      timerComponent.remove();
    });

    function playSound() {
      const audio = new Audio("complete.mp3");
      audio.play();
    }

    function onComplete() {
      playSound();
      if (notifyCheckbox.checked) {
        sendSystemNotification(`${timerTitle.value || "Timer"} Completed`, {
          body: `Your ${timerTitle.value ? timerTitle.value + " " : "" }timer has finished.`,
        });
      }
    }
  }

  function requestNotificationPermission() {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }

  function sendSystemNotification(title, options) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, options);
    } else if (Notification.permission === "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    }
  }
});
