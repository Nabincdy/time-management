document.addEventListener("DOMContentLoaded", () => {
  const timerList = document.getElementById("timerList");
  const addTimerBtn = document.getElementById("addTimerBtn");
  const defaultTimeInput = document.getElementById("defaultTime");
  const notifyCheckbox = document.getElementById("notifyCheckbox");
  const voteDataDiv = document.getElementById("voteData"); // Total vote display

  let totalVotes = 0; // Global vote count to track total votes
  let currentRunningTimer = null; // Track the currently running timer

  addTimerBtn.style.color = "green"; // Optional: Set the color to green

  notifyCheckbox.addEventListener("change", function () {
    if (this.checked) {
      requestNotificationPermission();
    }
  });

  addTimerBtn.addEventListener("click", addTimer);
  resetVotesBtn.addEventListener("click", resetVotes); // Add listener for reset vote button

  function createTimerComponent(defaultTime) {
    const timerComponent = document.createElement("div");
    timerComponent.className = "timer";
    timerComponent.innerHTML = `
      <input type="text" placeholder="Timer Title" class="timer-title"/>
      <input type="text" value="${defaultTime}" class="timer-value"/>
      <div class="flex-row">
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

    // Create dropdown menu inside content-btn
    const contentBtn = timerComponent.querySelector(".content-btn");
    const dropdownMenu = document.createElement("div");
    dropdownMenu.classList.add("dropdown-menu");
    dropdownMenu.innerHTML = `
      <button class="dropdown-item">Individual</button>
      <button class="dropdown-item">Particular</button>
      <button class="dropdown-item">Universal</button>
    `;
    contentBtn.appendChild(dropdownMenu);

    // Toggle dropdown visibility
    contentBtn.addEventListener("click", () => {
      dropdownMenu.classList.toggle("show-dropdown");
    });

    document.addEventListener("click", (event) => {
      if (!contentBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove("show-dropdown");
      }
    });

    // Create dropdown menu inside form-btn
    const formBtn = timerComponent.querySelector(".form-btn");
    const formDropdownMenu = document.createElement("div");
    formDropdownMenu.classList.add("dropdown-menu");

    // Create Main Menu Items
    formDropdownMenu.innerHTML = `
      <div class="dropdown-item">1. Turn
        <div class="submenu">
          <button class="submenu-item">1. Straight Turn</button>
          <button class="submenu-item">2. Directive Turn</button>
          <button class="submenu-item">3. Popcorn Turn</button>
        </div>
      </div>
      <div class="dropdown-item">2. Free Flow
        <div class="submenu">
          <button class="submenu-item">Fast Free Flow</button>
          <button class="submenu-item">Team Free Flow</button>
          <button class="submenu-item">Spread Free Flow</button>
        </div>
      </div>
      <div class="dropdown-item">3. God Mode
        <div class="submenu">
          <button class="submenu-item">Same People</button>
          <button class="submenu-item">Remove People</button>
          <button class="submenu-item">Add People</button>
        </div>
      </div>
    `;
    formBtn.appendChild(formDropdownMenu);

    // Toggle dropdown visibility
    formBtn.addEventListener("click", () => {
      formDropdownMenu.classList.toggle("show-dropdown");
    });

    document.addEventListener("click", (event) => {
      if (!formBtn.contains(event.target) && !formDropdownMenu.contains(event.target)) {
        formDropdownMenu.classList.remove("show-dropdown");
      }
    });

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
    let intervalId = null;
    let wasRunning = false;

    // Vote button functionality
    const voteBtn = timerComponent.querySelector(".vote-btn");
    let hasVoted = false; // Track if this timer has already voted

    voteBtn.addEventListener("click", () => {
      if (!hasVoted) {
        totalVotes++; // Increment total vote count
        hasVoted = true; // Mark this timer as voted
        voteDataDiv.textContent = `Total Votes: ${totalVotes}`; // Update the total votes displayed

        // Change button text and color to unvote for subsequent clicks
        voteBtn.textContent = "Unvote"; // Change text to Unvote
        voteBtn.style.backgroundColor = "green"; // Green color for voted button
      } else {
        totalVotes--; // Decrement total vote count
        hasVoted = false; // Mark this timer as unvoted
        voteDataDiv.textContent = `Total Votes: ${totalVotes}`; // Update the total votes displayed

        // Change button text and color to vote again
        voteBtn.textContent = "Vote"; // Change text to Vote
        voteBtn.style.backgroundColor = ""; // Reset button color to default
      }
    });

    function toggleTimer(shouldStart) {
      if (shouldStart) {
        if (currentRunningTimer && currentRunningTimer !== timerComponent) {
          currentRunningTimer.querySelector(".start-pause-btn").click(); // Stop the other timer
        }
        startTimer();
      } else {
        clearInterval(intervalId);
        intervalId = null;
        startPauseBtn.textContent = "▶️";
        timerComponent.style.backgroundColor = ""; // Reset background color to default
      }
    }

    function startTimer() {
      // Clear background color when timer starts
      timerComponent.style.backgroundColor = "#c5eba9"; // Turn bg color to light green

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

      currentRunningTimer = timerComponent; // Set the current running timer
      startPauseBtn.textContent = "⏸️";
    }

    timerValue.addEventListener("focus", () => {
      if (intervalId !== null) {
        wasRunning = true;
        toggleTimer(false);
      }
    });

    timerValue.addEventListener("blur", () => {
      if (wasRunning) {
        toggleTimer(true);
        wasRunning = false; // Reset the flag
      }
    });

    startPauseBtn.addEventListener("click", () => {
      if (intervalId === null) {
        toggleTimer(true);
      } else {
        toggleTimer(false);
      }
    });

    resetDefaultBtn.addEventListener("click", () => {
      clearInterval(intervalId);
      intervalId = null;
      timerValue.value = defaultTimeInput.value; // Reset to the current default time
      timerComponent.style.backgroundColor = ""; // Remove background color
      startPauseBtn.textContent = "▶️";
    });

    resetInitialBtn.addEventListener("click", () => {
      clearInterval(intervalId);
      intervalId = null;
      timerValue.value = initialTime; // Reset to the initial time
      timerComponent.style.backgroundColor = ""; // Remove background color
      startPauseBtn.textContent = "▶️";
    });

    removeBtn.addEventListener("click", () => {
      clearInterval(intervalId);
      timerComponent.remove();
      if (currentRunningTimer === timerComponent) {
        currentRunningTimer = null; // Reset if this was the running timer
      }
    });

    function playSound() {
      const audio = new Audio("complete.mp3"); // Correct path to the sound file
      audio.play();
    }

    function onComplete() {
      playSound();
      // Check if system notifications are enabled and send a notification
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

  function resetVotes() {
    totalVotes = 0; // Reset the vote count to 0
    voteDataDiv.textContent = `Total Votes: ${totalVotes}`; // Update the display
    // Reset all vote buttons' color to default (no vote)
    const voteBtns = document.querySelectorAll(".vote-btn");
    voteBtns.forEach(voteBtn => {
      voteBtn.style.backgroundColor = ""; // Remove background color
      voteBtn.disabled = false; // Enable voting again
    });
  }
});
