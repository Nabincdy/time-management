let clickCountsMap = {}; // Stores total votes for each name
let formButtonSelections = {}; // Maps formButtonID to its selected timerServerDropdownID
let voterMap = {}; // Stores list of voters for each name
let manageValuesMap = {}; // Stores "manage" input values for each vote
let newtimerinputfiledMap = {}; // Stores "newtimerinputfiled" for each voter
let alreadyClicked = {}; // Now an object instead of a Set

let voterData = {}; // Store for displaying on veto update

function updateClickCountDisplay(timerServerDropdownID, clickCount, timerFromNewName, formButtonID, newtimerinputfiled) {
  const clickCountsList = document.getElementById("click-counts-list");
  const name = timerServerDropdownID.split('-').slice(1).join('-');

  console.log("timerFromNewName: " + timerFromNewName);
  const manageInput = document.getElementById("manage");
  const manageValue = manageInput ? manageInput.value.trim() : "1:00"; // Default to "N/A" if input is not found

  // Ensure we track votes per user
  if (!alreadyClicked[timerFromNewName]) {
    alreadyClicked[timerFromNewName] = new Set();
  }

  // Check if this user has already voted for this option
  if (alreadyClicked[timerFromNewName].has(timerServerDropdownID)) {
    // Allow updating newtimerinputfiled even if already voted
    if (!newtimerinputfiledMap[name]) {
      newtimerinputfiledMap[name] = {};
    }
    newtimerinputfiledMap[name][timerFromNewName] = newtimerinputfiled;

    // Just refresh the display to show updated value
    updateClickCountDisplayList();
    return;
  }

  // If this formButtonID previously selected a different timerServerDropdownID, decrease its count
  if (formButtonSelections[formButtonID] && formButtonSelections[formButtonID] !== timerServerDropdownID) {
    const previousTimerServerDropdownID = formButtonSelections[formButtonID];
    const previousName = previousTimerServerDropdownID.split('-').slice(1).join('-');

    if (clickCountsMap[previousName]) {
      clickCountsMap[previousName] -= 1;

      // Remove the previous voter from the list
      if (voterMap[previousName]) {
        voterMap[previousName] = voterMap[previousName].filter(voter => voter !== timerFromNewName);
        if (voterMap[previousName].length === 0) {
          delete voterMap[previousName];
        }
      }

      if (clickCountsMap[previousName] <= 0) {
        delete clickCountsMap[previousName];
      }

      // Remove previous selection from alreadyClicked
      alreadyClicked[timerFromNewName].delete(previousTimerServerDropdownID);
    }
  }

  // Mark this selection for the formButtonID
  formButtonSelections[formButtonID] = timerServerDropdownID;

  // Increment vote count correctly
  clickCountsMap[name] = (clickCountsMap[name] || 0) + 1;

  // Store the voter's name
  if (!voterMap[name]) {
    voterMap[name] = [];
  }
  if (!voterMap[name].includes(timerFromNewName)) {
    voterMap[name].push(timerFromNewName);
  }

  // Store "manage" value for each vote
  manageValuesMap[name] = manageValue;

  // Store "newtimerinputfiled" for each vote (per voter)
  if (!newtimerinputfiledMap[name]) {
    newtimerinputfiledMap[name] = {};
  }
  newtimerinputfiledMap[name][timerFromNewName] = newtimerinputfiled;

  // Mark this vote in alreadyClicked
  alreadyClicked[timerFromNewName].add(timerServerDropdownID);

  // Store the voter data with the total votes for later use in veto update
  voterData[name] = {
    totalVotes: clickCountsMap[name],  // Total votes for this key
    voters: voterMap[name].join(", "), // Voter names
    newTimerInputs: Object.values(newtimerinputfiledMap[name] || {}).join(", ") || "No input provided" // New timer inputs
  };

  // Refresh the display
  clickCountsList.innerHTML = '';
  for (let [key, count] of Object.entries(clickCountsMap)) {
    if (count > 0) {
      const voters = voterMap[key] ? voterMap[key].join(", ") : "Unknown";
      const manageValueForKey = manageValuesMap[key] || "N/A";
      const newTimerInputs = Object.values(newtimerinputfiledMap[key] || {}).join(", ") || "No input provided";

      const listItem = document.createElement("li");
      const textSpan = document.createElement("span");
      textSpan.textContent = `(${voters}) voted for (${key}) For : (${newTimerInputs}) min`;

      listItem.appendChild(textSpan);
      listItem.appendChild(document.createTextNode(` ${count} Vote${count > 1 ? 's' : ''}`));
      clickCountsList.appendChild(listItem);
    }
  }
}

function updateClickCountDisplayList() {
  const clickCountsList = document.getElementById("click-counts-list");
  clickCountsList.innerHTML = '';
  for (let [key, count] of Object.entries(clickCountsMap)) {
    if (count > 0) {
      const voters = voterMap[key] ? voterMap[key].join(", ") : "Unknown";
      const manageValueForKey = manageValuesMap[key] || "N/A";
      const newTimerInputs = Object.values(newtimerinputfiledMap[key] || {}).join(", ") || "No input provided";

      const listItem = document.createElement("li");
      const textSpan = document.createElement("span");
      textSpan.textContent = `(${voters}) voted for (${key}) For : (${newTimerInputs}) min`;
      listItem.appendChild(textSpan);
      listItem.appendChild(document.createTextNode(` ${count} Vote${count > 1 ? 's' : ''}`));
      clickCountsList.appendChild(listItem);
    }
  }
}

let vetoClickCountMap = {}; // Store click count for each timerID

document.getElementById('updateVeto').addEventListener('click', sendTimerUpdateFromButton);

function sendTimerUpdateFromButton() {
  console.log("Sending veto name updates...");

  // Capture current veto values
  const vetoInputs = document.querySelectorAll('[data-id$="-4"]');
  const oldVetoMap = {}; // { newTimerID: oldVetoValue }

  vetoInputs.forEach(input => {
    const dataId = input.getAttribute('data-id'); // e.g., "3-4"
    const newTimerID = dataId.split('-')[0];
    const oldVetoValue = input.value;
    oldVetoMap[newTimerID] = oldVetoValue;
    console.log(`Existing -> newTimerID: ${newTimerID}, Old Veto Value: ${oldVetoValue}`);
  });

  // Get selected veto value
  const selectedVeto = document.querySelector('input[name="vetoSelection"]:checked');
  if (!selectedVeto) {
    alert("Please select a veto option.");
    return;
  }

  const vetoValue = selectedVeto.value;
  console.log("Selected veto value:", vetoValue);

  // Update input fields and check for repeats
  vetoInputs.forEach(input => {
    const vetoElementID = input.getAttribute('data-id');
    const newTimerID = vetoElementID.split('-')[0];
    const oldValue = oldVetoMap[newTimerID];

    // Initialize click count for this newTimerID if not already present
    if (!vetoClickCountMap[newTimerID]) {
      vetoClickCountMap[newTimerID] = 0; // Start count at 0 for each newTimerID
    }

    let vetoMessage;
    if (oldValue === vetoValue) {
      // If the veto value is repeated, use the previous veto value or default to f-0 if null
      vetoMessage = `f-${vetoClickCountMap[newTimerID]}`; // Use the last click count value
      console.log(`Repeated sentence for newTimerID: ${newTimerID}. Passing previous value: ${vetoMessage}`);
    } else {
      // Otherwise, generate a new veto value
      vetoClickCountMap[newTimerID] += 1; // Increment the count
      vetoMessage = `f-${vetoClickCountMap[newTimerID]}`; // Assign the new veto value
    }

    input.value = vetoMessage;

    const responseObject = {
      cmd: "updateMultipleVetoValue",
      msg: {
        ELMxID: 0,
        vetoElementID: vetoElementID,
        vetoNewName: vetoMessage
      }
    };

    console.log("Sending responseObject to server:", responseObject);
    socket.send(JSON.stringify(responseObject));
  });

  console.log("✅ Veto value update process complete.");

  // Log the total vote count, voters, and their inputs
  console.log("Voter data captured:", voterData);
}
