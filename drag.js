document.addEventListener("DOMContentLoaded", () => {
    const timerList = document.getElementById("timerList");
    const addTimerBtn = document.getElementById("addTimerBtn");
    const defaultTimeInput = document.getElementById("defaultTime");
    const notifyCheckbox = document.getElementById("notifyCheckbox");
    const voteDataDiv = document.getElementById("voteData");
    const resetVotesBtn = document.getElementById("resetVotesBtn");
  
    let totalVotes = 0;
    addTimerBtn.style.color = "green";
  
    notifyCheckbox.addEventListener("change", function () {
      if (this.checked) {
        requestNotificationPermission();
      }
    });
  
    addTimerBtn.addEventListener("click", addTimer);
    resetVotesBtn.addEventListener("click", resetVotes);
  
    function createTimerComponent(defaultTime) {
      const timerComponent = document.createElement("div");
      timerComponent.className = "timer";
      timerComponent.draggable = true;
      timerComponent.innerHTML = `
      <div style="cursor:pointer"></div>
        <input type="text" placeholder="Timer Title" class="timer-title"/>
        <input type="text" value="${defaultTime}" class="timer-value"/>
        <div class="btn-container flex-row">
          <button class="start-pause-btn">▶️</button>
          <button class="reset-initial-btn">⏏️</button>
          <button class="reset-default-btn">⤵️</button>
          <button class="remove-btn">❌</button>
          <button class="vote-btn">Vote</button>
        </div>
      `;
      timerList.appendChild(timerComponent);
  
      // Drag-and-drop events
      timerComponent.addEventListener("dragstart", handleDragStart);
      timerComponent.addEventListener("dragover", handleDragOver);
      timerComponent.addEventListener("drop", handleDrop);
      
      return timerComponent;
    }
  
    function addTimer() {
      const defaultTime = defaultTimeInput.value;
      const timerComponent = createTimerComponent(defaultTime);
      setupTimerControls(timerComponent, defaultTime);
    }
  
    function setupTimerControls(timerComponent, initialTime) {
      const timerValue = timerComponent.querySelector(".timer-value");
      const startPauseBtn = timerComponent.querySelector(".start-pause-btn");
      const resetInitialBtn = timerComponent.querySelector(".reset-initial-btn");
      const resetDefaultBtn = timerComponent.querySelector(".reset-default-btn");
      const removeBtn = timerComponent.querySelector(".remove-btn");
      const voteBtn = timerComponent.querySelector(".vote-btn");
      let intervalId = null;
      let wasRunning = false;
      let hasVoted = false;
  
      voteBtn.addEventListener("click", () => {
        if (!hasVoted) {
          totalVotes++;
          hasVoted = true;
          voteDataDiv.textContent = `Total Votes: ${totalVotes}`;
          voteBtn.style.backgroundColor = "green";
          voteBtn.disabled = true;
        } else {
          alert("You can only vote once for this timer.");
        }
      });
  
      startPauseBtn.addEventListener("click", () => {
        if (intervalId === null) {
          startTimer();
        } else {
          clearInterval(intervalId);
          intervalId = null;
          startPauseBtn.textContent = "▶️";
        }
      });
  
      function startTimer() {
        let [minutes, seconds] = timerValue.value.split(":" ).map(num => parseInt(num, 10));
        let totalSeconds = minutes * 60 + seconds;
  
        intervalId = setInterval(() => {
          if (totalSeconds <= 0) {
            clearInterval(intervalId);
            intervalId = null;
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
  
      resetInitialBtn.addEventListener("click", () => {
        clearInterval(intervalId);
        intervalId = null;
        timerValue.value = initialTime;
        startPauseBtn.textContent = "▶️";
      });
  
      resetDefaultBtn.addEventListener("click", () => {
        clearInterval(intervalId);
        intervalId = null;
        timerValue.value = defaultTimeInput.value;
        startPauseBtn.textContent = "▶️";
      });
  
      removeBtn.addEventListener("click", () => {
        clearInterval(intervalId);
        timerComponent.remove();
      });
    }
  
    function resetVotes() {
      totalVotes = 0;
      voteDataDiv.textContent = `Total Votes: ${totalVotes}`;
      document.querySelectorAll(".vote-btn").forEach(voteBtn => {
        voteBtn.style.backgroundColor = "";
        voteBtn.disabled = false;
      });
    }
  
    function handleDragStart(event) {
      event.dataTransfer.setData("text/plain", event.target.dataset.index);
      event.target.classList.add("dragging");
    }
  
    function handleDragOver(event) {
      event.preventDefault();
      const draggingElement = document.querySelector(".dragging");
      const afterElement = getDragAfterElement(timerList, event.clientY);
      if (afterElement == null) {
        timerList.appendChild(draggingElement);
      } else {
        timerList.insertBefore(draggingElement, afterElement);
      }
    }
  
    function handleDrop(event) {
      event.preventDefault();
      document.querySelector(".dragging").classList.remove("dragging");
    }
  
    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll(".timer:not(.dragging)")];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  });
  