const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

let theGlobalFlowTimer = null;
/*
let activeMeetings = [];  // List of active meetings
let globalFlowTimerStart = performance.now();  // Global start time
let globalFlowTimers = [];  // List to hold global timers (or shards)
const meetingsPerShard = 1000000;  // Max meetings per shard
const syncThreshold = 1000;  // Number of milliseconds to sync the shard timers

// Each shard has its own "shardStartTime" and processes meetings in its range
class GlobalFlowTimerShard {
  constructor(startIndex) {
    this.startIndex = startIndex;
    this.shardStartTime = performance.now();
    this.intervalId = null;
  }

  // Method to start the shard timer
  start() {
    this.intervalId = setInterval(() => this.processMeetings(), syncThreshold);
  }

  // Method to process the meetings in this shard
  processMeetings() {
    let elapsedTime = Math.floor((performance.now() - globalFlowTimerStart) / 1000);  // Elapsed time in seconds

    // Loop through the active meetings in this shard's range
    for (let i = this.startIndex; i < this.startIndex + meetingsPerShard && i < activeMeetings.length; i++) {
      let meeting = activeMeetings[i];
      meeting.timeRemaining -= 1;  // Decrease the remaining time for this meeting

      // If the meeting's time is up, deactivate it
      if (meeting.timeRemaining <= 0) {
        meeting.isActive = false;
        // Optionally: Remove the meeting from active meetings or mark as finished
      }
    }

    // Sync the shard with the global timer and send updates to clients
    this.syncWithGlobalTimer();
    this.syncMeetingsState();
  }

  // Synchronize the shard with the global timer
  syncWithGlobalTimer() {
    let elapsedTime = Math.floor((performance.now() - globalFlowTimerStart) / 1000);  // Elapsed time from global start
    // Optionally adjust the shard's timers based on global elapsed time if needed
  }

  // Sync the state with clients (e.g., using WebSockets or HTTP)
  syncMeetingsState() {
    // Send updates to clients connected to the meetings in this shard
    // For example, using WebSockets or similar real-time update mechanisms
    // Example: broadcastMeetingUpdate(meeting);
  }

  // Stop the shard timer
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}

// Function to create new global timers (shards) as needed
function manageGlobalFlowTimers() {
  let numShards = Math.ceil(activeMeetings.length / meetingsPerShard);

  // Ensure that the number of active global timers is correct
  if (globalFlowTimers.length < numShards) {
    // Create a new shard
    for (let i = globalFlowTimers.length; i < numShards; i++) {
      let shardStartIndex = i * meetingsPerShard;
      let newShard = new GlobalFlowTimerShard(shardStartIndex);
      globalFlowTimers.push(newShard);
      newShard.start();
    }
  } else if (globalFlowTimers.length > numShards) {
    // Stop extra shards if meetings decrease
    for (let i = numShards; i < globalFlowTimers.length; i++) {
      globalFlowTimers[i].stop();
    }
    globalFlowTimers = globalFlowTimers.slice(0, numShards);
  }
}

// Function to initialize a meeting (for demonstration)
function initializeMeeting(meetingId, timeAllocated) {
  activeMeetings.push({
    meetingId,
    timeAllocated,  // Time allocated in seconds
    timeRemaining: timeAllocated,
    isActive: true
  });
}

// Example of managing meetings and global timers
initializeMeeting('meeting1', 60);  // Meeting with 60 seconds
initializeMeeting('meeting2', 120); // Meeting with 120 seconds
// Add more meetings...

// Start managing global timers as the number of active meetings grows
setInterval(manageGlobalFlowTimers, 1000);  // Check every second if new timers are needed

*/ //end sharded global timer. Not used. Saving here in case needed once code scaled.


function updateTimers() {

    let currentTime = null;
    let elapsedTime = null;

    // Update participant timers
    for (const meetingID in globalELMxArray) {
        if (globalELMxArray.hasOwnProperty(meetingID)) {
            // console.log("UpdateTimers globalELMxArray.hasOwnProperty:" + meetingID);  // Will log: Alice, Bob (but not extraProperty)

            currentTime = performance.now(); // Get the current high-resolution time
            elapsedTime = (currentTime - globalELMxArray[meetingID].lastUpdateTime) / 1000; // Time in seconds

            for (const timerID in globalELMxArray[meetingID].timers) {
                //console.log("timerID:"+meetingID+" "+timerID);
                if (globalELMxArray[meetingID].timers.hasOwnProperty(timerID)) {

                    let timer = globalELMxArray[meetingID].timers[timerID];
                    //console.log("timer.isRunning:"+meetingID+" "+timerID+" "+JSON.stringify(timer));
                    if (timer.isRunning) {
                        // Update the time left for the participant based on the elapsed time
                        timer.remainingTime -= elapsedTime;
                        timer.ascendingTime += elapsedTime;

                        // console.log("time decreased UpdateTimers globalELMxArray.timer:" + timerID + "elaspedTime:" + elapsedTime + "remainingTime:" + timer.remainingTime + " " + globalELMxArray[meetingID].timers[timerID].remainingTime);
                        if (timer.remainingTime <= 0) {
                            timer.remainingTime = 0; // Ensure time doesn't go negative
                            timer.isRunning = false; // Stop the timer once time is up
                            console.log(`${timer.name}'s time is up.`);

                        }
                    }
                }//end hasOwnProperty
            };//end globalELMxArray.participants


            // Update the last update time to current time
            globalELMxArray[meetingID].lastUpdateTime = currentTime;


        }//end if hasOwnProperty
    }//end for globalELMxArray that loops over all meetings

    // If the meeting time hasn't ended, schedule the next update
    if (globalELMxArray[meetingID].totalMeetingTime > 0) { //we don't need this since this engine will be for all meetings such that when one meeting ends it doesn't stop the loop but only moves the meeting to globalELMxArrayArchive
        //put archive code here which deletes from active globalELMxArray and moves to archived
        // removeFromGlobalELMxArray();
        // addToGlobalELMxArrayArchive();

    }//end globalELMxArrayArchive
    // Schedule the next update based on the time remaining
    const nextUpdateDelay = Math.max(0, 1000 - (performance.now() - currentTime)); // Delay of 1 second or adjust based on drift
    setTimeout(updateTimers, nextUpdateDelay);

}//end updateTimers


function startMeetingEngine() {
    // Start the timer for the meeting
    console.log("Meeting 0 started!");
    //timerStatus.lastUpdateTime = performance.now(); // Initialize the start time
    updateTimers(); // Begin the timer updates
}






/////////////////////////////////////////////////////////

let votertime = 'votertime';
let votetype = 'votetype';
let voteresult = 'voteresult';
let meetingID = 0;
let numberOfELMs = 0;
let globalTimerIDs = 0;//not yet used Feb 13 2025 can delete
let globalTimerIDsWebsocketObject = {}; //not yet used Feb 13 2025 can delete
let globalUserIDs = 0;
let globalUserIDsWebsocketObject = {};
let globalELMxArray = {};//this object contains each ACTIVE meetings data and it can be operated on from other meetings (ELM) too
let thirdingCheckboxStatesBySession = {};
let globalELMxArrayArchived = {};//for old or finished meetings that are no longer active.
globalELMxArray = {
    "0": { //ELMxID..this is an example instantiation
        "lastUpdatTime": null,
        "pendingNotificationsToAll": null,//to tell when to broadcast out to participants sendToWho() for ELMxEngine
        "flow roles": {
            "executorName": "spiritman/ID",
            "influencerName": "spiritman",
            "strategistName": "spiritman",
            "relationshipsName": "spiritman"

        }, //end flow roles
        "arrayOfAttendanceIDs": {},
        "userData": {
            "participant1": { "assignTimerId": "timerId", "paretoCategory": { "aesthetic": 6, "social": 6, "wealth": 4, "body": 5, "culturedness": 8, "IQ": 9, "UQ": 1 } },
            "participant2": { "aesthetic": 2, "social": 9, "wealth": 5, "body": 3, "culturedness": 7, "IQ": 4, "UQ": 1 },

            "vetoes": {
                "formVeto": 8,
                "formTimeVeto": 1,
                "contentVeto": 0,
                "contentTimeVeto": 2,
                "peopleVeto": 1,
                "peopleTimeVeto": 1
            },
        },
        "participants": {
            "NumberOfParticipants": 0,
            "paretoCategories": {

                "participant1": { "aesthetic": 6, "social": 6, "wealth": 4, "body": 5, "culturedness": 8, "IQ": 9, "UQ": 1 },
                "participant2": { "aesthetic": 2, "social": 9, "wealth": 5, "body": 3, "culturedness": 7, "IQ": 4, "UQ": 1 }

            },//end paretoCategories
        },//end participants

        "cycles": {
            "totalCompleteCycles": 2,
            "currentCycle": {
                "currentCycleNumber": 3,
                "currentSpeaker": "participantID"
            },
            "cycleVotingResults": {
                "cycle1": { "form": "Straight", "content": "universal-war", "people": "same" },
                "cycle2": { "form": "God Mode: Josh", "content": "particular-cohesion", "people": "same" }
            },//end cycleVotingResults
        },//cycles
        "timers": {
            // "timer1TotalMeetTimer": { "name": "Total Meet Timer", "remainingTime": 59, isRunning: true,}, 
            // "FudgeTimer": { "name": "Fudge Timer", "remainingTime": 9 },
            // "timerID1": { "name": "Ben", "remainingTime": 10, "personAssignedID": "ID2", "timerIntervalID": null isRunning: true, ascendingTime: 3222, veteos:  "vetoes": { "formTimeVeto": 1,"contentVeto": 0,"contentTimeVeto": 2, "peopleVeto": 1, "peopleTimeVeto": 1formTimeVeto },
            //      }//NOTE: March 16 2025 timerIntervalID is added to store the LIVE running timers on server when the timer is running. It is set to null. NOTE March 19 2025: we no longer store the timers here but have one big meeting engine the elmxEngine //March 20 2025: ascendingTime includes donated time and will be the total speaking time to be added to users total time speaking to inner gov.

        },//end timers


        "vote": {
            "isVotingHappening": "not yet",
            "totalVoteForm": "not yet",
            "totalVoteFormString": "not yet",
            "totalVoteFormTime": "not yet",

            "totalVoteContent": "not yet",
            "totalVoteContentNotion": "not yet",//Individual, Particular, Univerasl
            "totalVoteContentString": "not yet",
            "totalVoteContentTime": "not yet",

            "totalVotePeople": "not yet",
            "totalVotePeopleString": "not yet",
            "totalVotePeopleTime": "not yet",
            "individualParticipantVotes": {
                "participant1": {

                    "vetoes": {
                        "formVeto": 0,
                        "formTimeVeto": 1,
                        "contentVeto": 0,
                        "contentTimeVeto": 2,
                        "peopleVeto": 1,
                        "peopleTimeVeto": 1
                    },

                    "participant1CurrentVoting": {
                        "VoteForm": "not yet",
                        "voteFormString": "not yet",
                        "voteFormTime": "not yet",

                        "voteContent": "not yet",
                        "voteContentNotion": "not yet",//Individual, Particular, Univerasl
                        "voteContentString": "not yet",
                        "voteContentTime": "not yet",

                        "votePeople": "not yet",
                        "votePeopleString": "not yet",
                        "votePeopleTime": "not yet",

                    },//end participant1CurrentVoting
                    "participant1CurrentMeetingVotingHistory": {
                        "cycle1": { "form": "", "content": "", "people": "" },
                        "cycle2": { "form": "", "content": "", "people": "" }

                    }//end participant1CurrentMeetingVotingHistory
                },//end participant1
            },//end individualParticipantVotes
        },//end voting
        "donateHistory": "History No Data Found",
        "approvedDonations": "Approval His No Data Found",
        "realUserCheckbox": "Real User Not Found",
        "thirdingDonationData": { "realapprovaluser": "" },

    } //end ELMxID 1
};//end globalELMxArray



// Create an HTTP server
const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, "../server.html");
    console.log('disconected by nabin');


    // Serve the HTML file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error loading server.html");
            console.log('disconected by nabin');
        } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        }
    });
});

// Attach WebSocket to the HTTP server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();
startMeetingEngine();//this starts a single timer per meeting to simplify things. Right now march 19 2025 it is hardcoded since there is only meeting 0 we are coding but this might have to be duplicated with more meetings.

wss.on("connection", (ws) => {


    function safeStringify(obj) {
        const seen = new Set();
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return; // Prevent circular reference
                }
                seen.add(value);
            }
            return value;
        });
    }



    // helper to broadcast to everyone
    function broadcastToAllClients(messageObj) {
        const message = JSON.stringify(messageObj);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }



    function saveDonationHistoryToFile() {
        const dataToSave = {};

        for (const ELMxID in globalELMxArray) {
            const meeting = globalELMxArray[ELMxID];
            if (meeting.donateHistory) {
                dataToSave[ELMxID] = meeting.donateHistory;
            }
        }

        fs.writeFile(DONATION_HISTORY_FILE, JSON.stringify(dataToSave, null, 2), err => {
            if (err) {
                console.error("Failed to save donation history:", err);
            } else {
                console.log("✅ Donation history saved successfully.");
            }
        });
    }

    console.log("New Client Connected: " + safeStringify(ws));

    clients.add(ws);
    let hardcodedMeetingIDTest = "0"
    createUserTimerIDFunction(wss, ws, hardcodedMeetingIDTest);

    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data); // Expect JSON messages
            console.log("Received:", message);



            if (data.cmd === "voteTimer") {
                let timerId = data.timerId;

                if (!voteCounts[timerId]) {
                    voteCounts[timerId] = 0;
                }

                voteCounts[timerId] += 1; // Increase vote count

                let voteUpdate = {
                    cmd: "updateVoteCount",
                    timerId: timerId,
                    voteCount: voteCounts[timerId]
                };

                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        //client.send(JSON.stringify(voteUpdate)); // Send vote update to all clients
                    }
                });
            }







            //MAIN SWITCH

            switch (message.cmd) {//FLAG: Nabin bind on client side (created 9:50am mst Feb 11 2025)
                //Mark: Feb 17 2025: thefunction for newUserID is in the wss.on, not here.
                case 'addTimerToServer':
                    console.log("Main Switch: Inside addTimerToServer");
                    //input Object Form: {"cmd": "createUserTimerID", "msg": {"ELMxID": 1, "timerIDFromBrowser": 2}}
                    //if(gidClients[decoded.acc]!=undefined){delete gidClients[];}
                    let createTimerIDELMxID = message.msg.ELMxID;
                    let timerIDFromBrowser = message.msg.timerIDFromBrowser;
                    let defaultTimeOfNewlyAddedTimer = message.msg.defaultTime; //is in 5:00 form but server stores as seconds
                    let defaultName = "";
                    let vetoValue = "";
                    let oldVetoValue = "";
                    let newTimerID = globalTimerIDs + 1;
                    let userID = newTimerID; // ✅ Get userID from client
                    globalTimerIDs++;
                    // globalUserIDs

                    console.log("tinn " + message.msg);
                    console.log("Inside createTimerComponentToBrowser:" + createTimerIDELMxID + " " + newTimerID);

                    let [minutes, seconds] = defaultTimeOfNewlyAddedTimer.split(":"); // Split the string at ":"

                    let totalSeconds = (parseInt(minutes) * 60) + parseInt(seconds);

                    globalELMxArray[createTimerIDELMxID].timers[newTimerID] = {};//end globalUserIDS

                    globalELMxArray[createTimerIDELMxID].timers[newTimerID] = {
                        "timerServerID": newTimerID,
                        "defaultTime": defaultTimeOfNewlyAddedTimer,
                        "personAssignedID": "???",
                        "ownerID": userID,
                        "name": defaultName,
                        "remainingTime": totalSeconds,
                        "ascendingTime": 0,
                        "isRunning": false,
                        "veto": vetoValue,
                        "oldVeto": oldVetoValue,
                    }//end timers

                    let createUserResponseObject = { "cmd": "returnedFromServerAddTimer", "msg": { "timerServerID": newTimerID, "defaultTime": defaultTimeOfNewlyAddedTimer, "timerBrowserID": timerIDFromBrowser, "allMeetingData": globalELMxArray[createTimerIDELMxID].timers[newTimerID] } };
                    let desiredList = ["particularSome", globalELMxArray[createTimerIDELMxID].arrayOfAttendanceIDs];
                    sendToWho(wss, ws, desiredList, createUserResponseObject)
                    //ws.send(JSON.stringify(createUserResponseObject)); // Send response to the client
                    break;



                case 'startTimer':
                    console.log("Received startTimer request:", message);

                    let startTimer_ELMxID = message.msg.ELMxID;
                    let startTimer_timerServerID = message.msg.timerServerID;



                    globalELMxArray[startTimer_ELMxID].timers[startTimer_timerServerID].isRunning = true;
                    let startTimer_remainingTime = globalELMxArray[startTimer_ELMxID].timers[startTimer_timerServerID].remainingTime;
                    let startTimer_ascendingTime = globalELMxArray[startTimer_ELMxID].timers[startTimer_timerServerID].ascendingTime;

                    let startTimer_updateResponse = {
                        cmd: "returnedStartTimer",
                        msg: { timerServerID: startTimer_timerServerID, shouldStart: "starting", ELMxID: startTimer_ELMxID, serverTime: Math.floor(startTimer_remainingTime), ascendingTime: Math.floor(startTimer_ascendingTime) }
                    };
                    sendToWho(wss, ws, ["particularSome", globalELMxArray[startTimer_ELMxID].arrayOfAttendanceIDs], startTimer_updateResponse);
                    console.log("startTimer sendToWho() done:" + startTimer_timerServerID);



                    if (!globalELMxArray[startTimer_ELMxID]) {
                        console.error(`ELMxID ${startTimer_ELMxID} not found in globalELMxArray`);
                        break;
                    }

                    if (!globalELMxArray[startTimer_ELMxID].timers) {
                        console.log(`Timers object for ELMxID ${toggle_ELMxID} does not exist`);
                        globalELMxArray[startTimer_ELMxID].timers = {};
                    }

                    break;//startTimer (added March 14 2025 by Mark to start simplifying)

                case 'stopTimer':
                    console.log("Received stopTimer request:", message);

                    let stopTimer_ELMxID = message.msg.ELMxID;
                    let stopTimer_timerServerID = message.msg.timerServerID;

                    globalELMxArray[stopTimer_ELMxID].timers[stopTimer_timerServerID].isRunning = false;
                    let stopTimer_remainingTime = globalELMxArray[stopTimer_ELMxID].timers[stopTimer_timerServerID].remainingTime;
                    let stopTimer_ascendingTime = globalELMxArray[stopTimer_ELMxID].timers[stopTimer_timerServerID].ascendingTime;

                    let stopTimer_updateResponse = {
                        cmd: "returnedStopTimer",
                        msg: { timerServerID: stopTimer_timerServerID, shouldStart: "stopping", ELMxID: stopTimer_ELMxID, serverTime: Math.floor(stopTimer_remainingTime), ascendingTime: Math.floor(stopTimer_ascendingTime) }
                    };
                    sendToWho(wss, ws, ["particularSome", globalELMxArray[stopTimer_ELMxID].arrayOfAttendanceIDs], stopTimer_updateResponse);
                    console.log("stopTimer sendToWho() done:" + stopTimer_timerServerID);




                    break;//stopTimer (added March 14 2025 by Mark to start simplifying)



                case 'toggleTimer':
                    console.log("Received toggleTimer request:", message);

                    let toggle_ELMxID = message.msg.ELMxID;
                    let toggle_timerServerID = message.msg.timerServerID;
                    let shouldStart = message.msg.shouldStart;

                    if (!globalELMxArray[toggle_ELMxID]) {
                        console.error(`ELMxID ${toggle_ELMxID} not found in globalELMxArray`);
                        break;
                    }

                    if (!globalELMxArray[toggle_ELMxID].timers) {
                        console.log(`Timers object for ELMxID ${toggle_ELMxID} does not exist`);
                        globalELMxArray[toggle_ELMxID].timers = {};
                    }

                    let timerID = parseInt(toggle_timerServerID.split('-')[0], 10);
                    let timer = globalELMxArray[toggle_ELMxID].timers[timerID];

                    if (!timer) {
                        console.error(`Timer with ID ${toggle_timerServerID} not found for ELMxID ${toggle_ELMxID}`);
                        break;
                    }

                    if (timer.interval) clearInterval(timer.interval);
                    if (timer.ascInterval) clearInterval(timer.ascInterval);

                    timer.isRunning = shouldStart;

                    if (shouldStart) {
                        if (!('remainingTime' in timer)) {
                            timer.remainingTime = convertToSeconds(timer.defaultTime);
                        }

                        console.log(`Starting timer with remaining time: ${timer.remainingTime} seconds`);

                        timer.interval = setInterval(() => {
                            if (timer.remainingTime > 0) {
                                timer.remainingTime--;
                            } else {
                                clearInterval(timer.interval);
                                timer.interval = null;
                            }

                            let formattedTime = formatTime(timer.remainingTime);
                            console.log(`[Default Timer] ID: ${toggle_timerServerID}, Time Left: ${formattedTime}`);

                            let defaultTimeUpdate = {
                                cmd: "returnedFromServerResetDefaultTime",
                                msg: { timerServerID: toggle_timerServerID, newDefaultTime: formattedTime }
                            };
                            sendToWho(wss, ws, ["particularSome", globalELMxArray[toggle_ELMxID].arrayOfAttendanceIDs], defaultTimeUpdate);
                        }, 1000);

                        // Start the ascending timer, and preserve the last ascValue
                        if (!timer.ascValue) {
                            timer.ascValue = 0;  // Make sure ascValue starts at 0 if it's not already set
                        }

                        timer.ascInterval = setInterval(() => {
                            timer.ascValue++;
                            let formattedAscTime = formatTime(timer.ascValue);
                            console.log(`[Asc Timer] ID: ${toggle_timerServerID}, Asc Time: ${formattedAscTime}`);  // Display ascending time

                            let ascUpdate = {
                                cmd: "returnedFromServerResetTimerAsc",
                                msg: { timerServerID: toggle_timerServerID, timerAscValue: formattedAscTime }
                            };
                            sendToWho(wss, ws, ["particularSome", globalELMxArray[toggle_ELMxID].arrayOfAttendanceIDs], ascUpdate);
                        }, 1000);
                    } else {
                        console.log(`Pausing timer ${toggle_timerServerID}, saving remaining time: ${formatTime(timer.remainingTime)}`);
                        // Do not reset ascValue, just pause it
                    }

                    let updateResponse = {
                        cmd: "updateTimerState",
                        msg: { timerServerID: toggle_timerServerID, shouldStart: shouldStart, ELMxID: toggle_ELMxID, serverTime: timer.remainingTime }
                    };
                    sendToWho(wss, ws, ["particularSome", globalELMxArray[toggle_ELMxID].arrayOfAttendanceIDs], updateResponse);
                    break;

                    function convertToSeconds(time) {
                        if (typeof time === 'number') {
                            return time * 60; // Convert minutes to seconds
                        }

                        if (typeof time === 'string') {
                            let parts = time.split(":").map(Number);

                            if (parts.length === 2) {
                                return parts[0] * 60 + parts[1]; // MM:SS
                            } else if (parts.length === 3) {
                                return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
                            }
                        }

                        return 0; // Default return if format is unrecognized
                    }

                    function formatTime(seconds) {
                        let h = Math.floor(seconds / 3600);
                        let m = Math.floor((seconds % 3600) / 60);
                        let s = seconds % 60;
                        return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
                    }





                // case 'resetTimerName':
                //     //input {"cmd": "resetTimerName", "msg": {"ELMxID": 0, "timerNewName": name}}
                //     let resetTimerName_meetingID = message.msg.ELMxID
                //     let resetTimerName_timerServerID = message.msg.timerServerID;
                //     //        const parts = resetTimerName_timerServerID.split('-');
                //     //        const firstPart = parts[0]; 
                //     //        resetTimerName_timerServerID =firstPart;//this firstPart is the timerServerID        
                //     //        console.log(firstPart);
                //     //let resetTimerName_timerNewTitleID = message.msg.timerNewTitleID;
                //     let timerNewName = message.msg.timerNewName
                //     //globalELMxArray[resetTimerName_meetingID].timers[resetTimerName_timerServerID]={};
                //     //globalELMxArray[resetTimerName_meetingID].timers[resetTimerName_timerServerID].name=""; 
                //     globalELMxArray[resetTimerName_meetingID].timers[resetTimerName_timerServerID].name = timerNewName;
                //     let createUserResponseObjectName = { "cmd": "returnedFromServerResetTimerName", "msg": { "ELMxID": resetTimerName_meetingID, "timerServerID": resetTimerName_timerServerID, "timerNewName": timerNewName } };
                //     let desiredListName = ["particularSome", globalELMxArray[resetTimerName_meetingID].arrayOfAttendanceIDs];
                //     sendToWho(wss, ws, desiredListName, createUserResponseObjectName);

                //     break;

                case "resetTimerName":
                    // Input: { "cmd": "resetTimerName", "msg": { "ELMxID": 0, "timerServerID": "timerID1", "timerNewName": "Ben" } }

                    let resetTimerName_meetingID = message.msg.ELMxID;
                    let resetTimerName_timerServerID = message.msg.timerServerID;
                    let timerNewName = message.msg.timerNewName;

                    // Ensure timer object exists before updating
                    if (!globalELMxArray[resetTimerName_meetingID].timers[resetTimerName_timerServerID]) {
                        globalELMxArray[resetTimerName_meetingID].timers[resetTimerName_timerServerID] = {};
                    }

                    // ✅ Set the new timer name
                    globalELMxArray[resetTimerName_meetingID].timers[resetTimerName_timerServerID].name = timerNewName;

                    // ✅ OPTIONAL: Attach veto data if you want to pre-fill or sync it
                    let defaultVetoObject = {
                        formVeto: 0,
                        formTimeVeto: 0,
                        contentVeto: 0,
                        contentTimeVeto: 0,
                        peopleVeto: 0,
                        peopleTimeVeto: 0
                    };

                    let vetoDataFromMeeting = globalELMxArray[resetTimerName_meetingID]?.userData?.vetoes;

                    globalELMxArray[resetTimerName_meetingID].timers[resetTimerName_timerServerID].vetoes =
                        vetoDataFromMeeting ? { ...defaultVetoObject, ...vetoDataFromMeeting } : defaultVetoObject;

                    // ✅ Broadcast the updated name (and optionally veto info)
                    let createUserResponseObjectName = {
                        cmd: "returnedFromServerResetTimerName",
                        msg: {
                            ELMxID: resetTimerName_meetingID,
                            timerServerID: resetTimerName_timerServerID,
                            timerNewName: timerNewName,
                            vetoes: globalELMxArray[resetTimerName_meetingID].timers[resetTimerName_timerServerID].vetoes // optional to send veto back
                        }
                    };

                    let desiredListName = ["particularSome", globalELMxArray[resetTimerName_meetingID].arrayOfAttendanceIDs];
                    sendToWho(wss, ws, desiredListName, createUserResponseObjectName);

                    break;



                //working 3
                case 'resetDefaultTime':
                    // Input: {"cmd": "resetDefaultTime", "msg": {"timerServerID": "1-2", "newDefaultTime": "5:05"}}
                    console.log("Received resetDefaultTime message: ", message);  // Log the incoming message for debugging
                    let resetDefaultTime_ELMxID = message.msg.ELMxID;
                    let resetDefaultTime_timerServerID = message.msg.timerServerID;
                    let newDefaultTime = message.msg.defaultTime;

                    // Ensure the timerServerID exists in the global timers object
                    // if (globalELMxArray[resetDefaultTime_timerServerID]) {
                    globalELMxArray[resetDefaultTime_ELMxID].timers[resetDefaultTime_timerServerID].remainingTime = newDefaultTime;

                    console.log(`Updated default time for timerServerID ${resetDefaultTime_timerServerID} to ${newDefaultTime}`);

                    // Create a response object to notify the client with the updated default time
                    let createDefaultTimeResponse = {
                        cmd: "returnedFromServerResetDefaultTime",
                        msg: {
                            timerServerID: resetDefaultTime_timerServerID,
                            newDefaultTime: newDefaultTime
                        }
                    };


                    // Determine the list of clients to notify (e.g., clients connected to the same meeting)
                    let desiredListTime = ["particularSome", globalELMxArray[resetDefaultTime_ELMxID].arrayOfAttendanceIDs];
                    sendToWho(wss, ws, desiredListTime, createDefaultTimeResponse);  // Send the response to the clients

                    // } else {
                    //     console.error(`Timer with ID ${resetDefaultTime_timerServerID} not found in globalELMxArray.`);
                    // }

                    break;



                case 'resetTimerAsc':
                    // Input: {"cmd": "resetTimerAsc", "msg": {"ELMxID": 0, "timerServerID": "1-3", "timerAscValue": "00:01"}}
                    console.log("Received resetTimerAsc message: ", message);  // Log the incoming message for debugging

                    let resetTimerAsc_ELMxID = message.msg.ELMxID;  // Get the meeting ID
                    let resetTimerAsc_timerServerID = message.msg.timerServerID;  // Get the timerServerID
                    let timerAscValue = message.msg.timerAscValue;  // Get the new ascending timer value

                    // Ensure the timerServerID exists in the global timers object
                    console.log('global elmx' + globalELMxArray[resetTimerAsc_ELMxID]);
                    if (globalELMxArray[resetTimerAsc_ELMxID] && globalELMxArray[resetTimerAsc_ELMxID].timers[resetTimerAsc_timerServerID]) {
                        // Update the timer's ascending value in the global array
                        globalELMxArray[resetTimerAsc_ELMxID].timers[resetTimerAsc_timerServerID].ascValue = timerAscValue;

                        console.log(`Updated ascending time for timerServerID ${resetTimerAsc_timerServerID} to ${timerAscValue}`);

                        // Create a response object to notify the client with the updated ascending timer value
                        let createAscTimerResponse = {
                            cmd: "returnedFromServerResetTimerAsc",
                            msg: {
                                timerServerID: resetTimerAsc_timerServerID,
                                timerAscValue: timerAscValue
                            }
                        };

                        // Determine the list of clients to notify (e.g., clients connected to the same meeting)
                        let desiredListAsc = ["particularSome", globalELMxArray[resetTimerAsc_ELMxID].arrayOfAttendanceIDs];
                        sendToWho(wss, ws, desiredListAsc, createAscTimerResponse);  // Send the response to the clients
                    } else {
                        console.error(`Timer with ID ${resetTimerAsc_timerServerID} not found in globalELMxArray.`);
                    }

                    break;





                case 'resetVetoName':
                    // Input: {"cmd": "resetVetoName", "msg": {"ELMxID": 0, "vetoNewName": name}}
                    let resetVetoName_meetingID = message.msg.ELMxID;
                    let resetVetoName_vetoNewTitleID = message.msg.vetoNewTitleID;
                    let vetoNewName = message.msg.vetoNewName;
                    let newTimeVetoID = message.msg.newTimeVetoID;


                    // let timerId = globalUserIDs;



                    // let checking = globalELMxArray[resetVetoName_meetingID].userData[resetVetoName_vetoNewTitleID].vetoes = vetoNewName;
                    // globalELMxArray[resetTimerAsc_ELMxID].timers[resetTimerAsc_timerServerID].ascValue = timerAscValue;
                    // let checking = JSON.stringify(globalELMxArray[resetVetoName_meetingID].userData.vetoes.formVeto);
                    //    $testing = globalELMxArray[resetVetoName_meetingID].timers[resetVetoName_vetoNewTitleID].veto;


                    // let testing = JSON.stringify(globalELMxArray[resetVetoName_meetingID].timers[newTimeVetoID]);
                    globalELMxArray[resetVetoName_meetingID].timers[newTimeVetoID].veto = vetoNewName;

                    // console.log("ramro" + newUserID);

                    // globalELMxArray[ resetVetoName_meetingID].timers[]
                    let createUserResponseObjectVetoName = {
                        "cmd": "returnedFromServerResetVetoName",
                        "msg": {
                            "ELMxID": resetVetoName_meetingID,
                            "vetoElementID": resetVetoName_vetoNewTitleID,
                            "vetoNewName": vetoNewName
                        }
                    };

                    let desiredListVetoName = ["particularSome", globalELMxArray[resetVetoName_meetingID].arrayOfAttendanceIDs];
                    sendToWho(wss, ws, desiredListVetoName, createUserResponseObjectVetoName);

                    break;








                //bestwork
                // Case: Set Veto User ID (Assuming different functionality, update logic accordingly)
                case 'setVetoUserId':
                    // Input: {"cmd": "setVetoUserId", "msg": {"ELMxID": 0, "vetoNewTitleID": 1, "vetoNewName": "teamFreeFlow", "newTimerID": "1"}}
                    console.log("Mero data", message);
                    let setVetoUser_meetingID = message.msg.ELMxID;
                    let setVetoUser_titleID = message.msg.vetoElementID;  // Make sure to use the correct field
                    let vetoUserName = message.msg.vetoNewName;
                    let newTimerUserID = message.msg.newTimerID;  // Ensure we're getting newTimerID
                    globalELMxArray[setVetoUser_meetingID].timers[newTimerUserID].veto = vetoUserName;

                    // Create response object with all the required fields
                    let createUserResponseObjectSetVetoUser = {
                        "cmd": "returnedFromServerSetVetoUserId",
                        "msg": {
                            "ELMxID": setVetoUser_meetingID,
                            "newTimerUserID": newTimerUserID, // Add newTimerID here
                            "vetoElementID": setVetoUser_titleID, // Add vetoElementID here
                            "vetoNewName": vetoUserName
                        }
                    };

                    console.log("createUserResponseObjectSetVetoUser: " + JSON.stringify(createUserResponseObjectSetVetoUser));

                    // List of users to send the response to
                    let desiredListSetVetoUser = ["particularSome", globalELMxArray[setVetoUser_meetingID].arrayOfAttendanceIDs];

                    // Send response to the relevant users
                    sendToWho(wss, ws, desiredListSetVetoUser, createUserResponseObjectSetVetoUser);

                    break;



                // case 'updateMultipleVetoValue':
                //     console.log("Mero data", message);
                //     // Extract values from the message
                //     let updateVeto_meetingID = message.msg.ELMxID;
                //     let updateVeto_titleID = message.msg.vetoElementID;  // Ensure correct field
                //     let updateVetoNewName = message.msg.vetoNewName;

                //     // Create response object with the necessary fields
                //     let createUserResponseObjectUpdateVetoValue = {
                //         "cmd": "returnedFromServerUpdateMultipleVetoValue",
                //         "msg": {
                //             "ELMxID": updateVeto_meetingID,
                //             "vetoElementID": updateVeto_titleID,
                //             "vetoNewName": updateVetoNewName
                //         }
                //     };
                //     console.log("createUserResponseObjectUpdateVetoValue: " + JSON.stringify(createUserResponseObjectUpdateVetoValue));

                //     // List of users to send the response to
                //     let desiredListUpdateVetoValue = ["particularSome", globalELMxArray[updateVeto_meetingID].arrayOfAttendanceIDs];

                //     // Send response to the relevant users
                //     sendToWho(wss, ws, desiredListUpdateVetoValue, createUserResponseObjectUpdateVetoValue);

                //     break;


                case 'updateMultipleVetoValue':
                    console.log("Mero data", message);

                    let updateVeto_meetingID = message.msg.ELMxID;
                    let updateVeto_titleID = message.msg.vetoElementID;
                    let updateVetoNewName = message.msg.vetoNewName;
                    let vetoMultipleNewTimerId = message.msg.vetoMultipleNewTimerId;
                    let oldVetoName = message.msg.oldVetoName;
                    //working 2
                    globalELMxArray[updateVeto_meetingID].timers[vetoMultipleNewTimerId].veto = updateVetoNewName;
                    globalELMxArray[updateVeto_meetingID].timers[vetoMultipleNewTimerId].oldVeto = oldVetoName;



                    // Create response object with the necessary fields
                    let createUserResponseObjectUpdateVetoValue = {
                        "cmd": "returnedFromServerUpdateMultipleVetoValue",
                        "msg": {
                            "ELMxID": updateVeto_meetingID,
                            "vetoElementID": updateVeto_titleID,
                            "vetoNewName": updateVetoNewName,
                            "oldVetoName": oldVetoName
                        }
                    };
                    console.log("hello everyone : " + JSON.stringify(createUserResponseObjectUpdateVetoValue));

                    // List of users to send the response to
                    let desiredListUpdateVetoValue = ["particularSome", globalELMxArray[updateVeto_meetingID].arrayOfAttendanceIDs];

                    // Send response to the relevant users (broadcasting to all tabs)
                    sendToWho(wss, ws, desiredListUpdateVetoValue, createUserResponseObjectUpdateVetoValue);

                    break;



                case 'removeTimer':
                    console.log("Received removeTimer request:", message);

                    // Extract the timerServerID and ELMxID from the message
                    const { timerServerID, ELMxID } = message.msg; // Destructure for cleaner code

                    // Ensure the ELMxID exists in the global array
                    if (!globalELMxArray.hasOwnProperty(ELMxID)) {
                        console.error(`ELMxID ${ELMxID} not found in globalELMxArray.`);
                        break; // Exit if the ELMxID is not valid
                    }

                    // Log the timers for this ELMxID to verify the structure
                    console.log(`Timers for ELMxID ${ELMxID}:`, globalELMxArray[ELMxID].timers);

                    // Extract the numeric timer ID from timerServerID
                    const timerRemovalID = timerServerID.split('-')[0]; // Assuming '1-8' format

                    // Get the timers object for the ELMxID
                    let timers = globalELMxArray[ELMxID].timers;

                    // Log the current state of timers for debugging
                    console.log('Timers before removal:', JSON.stringify(timers));

                    // Check if the timer exists and proceed to remove it
                    if (timers && timers[timerRemovalID]) {
                        const timer = timers[timerRemovalID];

                        // Clear any running intervals associated with the timer
                        if (timer.interval) {
                            clearInterval(timer.interval);
                            console.log(`Cleared interval for Timer ${timerRemovalID}`);
                        }
                        if (timer.ascInterval) {
                            clearInterval(timer.ascInterval);
                            console.log(`Cleared ascending interval for Timer ${timerRemovalID}`);
                        }

                        // Remove the timer from the timers list
                        delete timers[timerRemovalID];
                        console.log(`Timer ${timerRemovalID} removed successfully.`);

                        // Prepare the response for the frontend
                        const response = {
                            cmd: 'timerRemoved',
                            msg: {
                                timerRemovalServerID: timerRemovalID, // Matching frontend expectation
                                ELMxID_Remove: ELMxID // Matching frontend expectation
                            }
                        };

                        // Create the recipient list (combining global array and particular attendees)
                        const desiredList = ["particularSome", globalELMxArray[ELMxID].arrayOfAttendanceIDs];

                        // Send the update to the specific clients
                        sendToWho(wss, ws, desiredList, response);

                    } else {
                        console.error(`Timer with ID ${timerRemovalID} not found for ELMxID ${ELMxID}`);
                    }

                    break;




                // case "submenuClick":
                //     console.log("Received submenuClick message:", message);

                //     // Extract the necessary data from the message
                //     let { formButtonID, timerdropdownID, timerSubmenuServerID, buttonText } = message.msg;

                //     console.log('show data' + JSON.stringify(message.msg));
                //     console.log(`Button "${buttonText}" clicked for TimerServerID: ${timerSubmenuServerID}`);

                //     // Create response object to send back to frontend
                //     let submenuResponse = {
                //         cmd: "returnedFromServerSubmenuClick",
                //         msg: {
                //             ELMxID_Form: 0,  // Optional: Can be used to identify the form if needed
                //             clickedButton: buttonText,
                //             formButtonID: formButtonID,  // Pass back the formButtonID for frontend use
                //             timerDropdownID: timerdropdownID,  // Pass the timerDropdownID for frontend use
                //             timerServerDropdownID: timerSubmenuServerID,

                //         }
                //     };

                //     // Broadcast the update to the relevant clients
                //     let recipientList = ["particularSome", globalELMxArray[message.msg.ELMxID].arrayOfAttendanceIDs];
                //     sendToWho(wss, ws, recipientList, submenuResponse);
                //     break;

                case "submenuClick":
                    console.log("Received submenuClick message:", message);

                    // Extract necessary data
                    // let { formButtonID, timerdropdownID, timerSubmenuServerID, buttonText } = message.msg;
                    let { formButtonID, timerdropdownID, timerSubmenuServerID, buttonText, timerFromNewName, newtimerinputfiled } = message.msg;

                    console.log('Show received data:', JSON.stringify(message.msg));
                    console.log(`Button "${buttonText}" clicked for TimerServerID: ${timerSubmenuServerID}`);

                    // Ensure globalButtonClickData is defined
                    if (typeof globalButtonClickData === "undefined") {
                        globalButtonClickData = {}; // Initialize if missing
                    }

                    // Create a unique key for tracking button clicks
                    const buttonKey = `${buttonText}_ID_${timerSubmenuServerID}`;

                    // Prevent counting the same message multiple times
                    if (!globalButtonClickData[buttonKey]) {
                        globalButtonClickData[buttonKey] = 1;
                    } else {
                        globalButtonClickData[buttonKey] += 1;
                    }

                    console.log(`${buttonKey} clicked ${globalButtonClickData[buttonKey]} times`);

                    // Create response object to send back to frontend
                    let submenuResponse = {
                        cmd: "returnedFromServerSubmenuClick",
                        msg: {
                            ELMxID_Form: 0,  // Optional: Can be used to identify the form if needed
                            clickedButton: buttonText,
                            formButtonID: formButtonID,  // Pass back the formButtonID for frontend use
                            timerDropdownID: timerdropdownID,  // Pass the timerDropdownID for frontend use
                            timerServerDropdownID: timerSubmenuServerID,
                            newtimerinputfiled: newtimerinputfiled,
                            timerFromNewName: timerFromNewName, // Change here to match frontend key
                            clickCount: globalButtonClickData[buttonKey]  // Include updated click count
                        }
                    };

                    // console.log("submenuResponse" + submenuResponse);

                    // Send response to relevant clients
                    let recipientList = ["particularSome", globalELMxArray[message.msg.ELMxID].arrayOfAttendanceIDs];

                    sendToWho(wss, ws, recipientList, submenuResponse);

                    break;



                // case 'selectedTimersUpdate':
                //     console.log("📩 Received selectedTimersUpdate message: ", JSON.stringify(message));

                //     // Broadcast the message to all connected clients
                //     const responseMessage = {
                //       cmd: "returnselectedTimersUpdate",
                //       msg: {
                //         selectedTimers: message.msg.selectedTimers
                //       }
                //     };

                //     clients.forEach(client => {
                //       if (client.readyState === WebSocket.OPEN) {
                //         client.send(JSON.stringify(responseMessage));
                //       }
                //     });
                //     break;

                case 'selectedTimersUpdate':
                    console.log("📩 Received selectedTimersUpdate message: ", JSON.stringify(message));

                    // Extract meeting ID and selectedTimers
                    const meetingID_selectedTimers = message.msg.ELMxID;  // Make sure your frontend sends this
                    const selectedTimersData = message.msg.selectedTimers;

                    // Ensure the meeting exists
                    if (!globalELMxArray[meetingID_selectedTimers]) {
                        console.error(`Meeting ID ${meetingID_selectedTimers} not found in globalELMxArray.`);
                        break;
                    }

                    // Store selectedTimers in globalELMxArray under a new or existing field
                    globalELMxArray[meetingID_selectedTimers].selectedTimersState = selectedTimersData;

                    // Prepare response message
                    const responseMessage = {
                        cmd: "returnselectedTimersUpdate",
                        msg: {
                            selectedTimers: selectedTimersData,
                            ELMxID: meetingID_selectedTimers
                        }
                    };

                    // Broadcast the update to all connected clients
                    clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(responseMessage));
                        }
                    });

                    break;




                case "contentDropdownClick":
                    console.log("Received contentDropdownClick message:", message);

                    // Use unique variable names to avoid redeclaration errors
                    const {
                        selectedContent: selectedContentFromMsg,
                        timerName: timerNameFromMsg,
                        timerID: timerIDFromMsg,
                        topicName: topicNameFromMsg,
                        topicTime: topicTimeFromMsg
                    } = message.msg;

                    console.log("Selected Content:", selectedContentFromMsg);
                    console.log("From Timer Name:", timerNameFromMsg);
                    console.log("Timer ID:", timerIDFromMsg);
                    console.log("Topic Name:", topicNameFromMsg);
                    console.log("Topic Time:", topicTimeFromMsg);

                    // Optional: Use a unique tracking object
                    if (typeof globalContentClickData === "undefined") {
                        globalContentClickData = {};
                    }

                    const contentKey = `${selectedContentFromMsg}_TIMER_${timerIDFromMsg}`;
                    globalContentClickData[contentKey] = (globalContentClickData[contentKey] || 0) + 1;

                    const contentResponse = {
                        cmd: "returnedContentDropdownClick",
                        msg: {
                            selectedContent: selectedContentFromMsg,
                            timerName: timerNameFromMsg,
                            timerID: timerIDFromMsg,
                            topicName: topicNameFromMsg,
                            topicTime: topicTimeFromMsg,
                            count: globalContentClickData[contentKey]
                        }
                    };

                    console.log("Broadcasting contentResponse:", JSON.stringify(contentResponse));

                    let recipientContentList = ["particularSome"];
                    if (globalELMxArray[message.msg.ELMxID]) {
                        recipientContentList.push(globalELMxArray[message.msg.ELMxID].arrayOfAttendanceIDs);
                    }

                    sendToWho(wss, ws, recipientContentList, contentResponse);
                    break;




                case "peopleDropdownClick":
                    console.log("Received peopleDropdownClick message:", message);

                    // Extract necessary data
                    let { action, buttonID, buttonPeopleText, timerPeopleNewName } = message.msg;


                    console.log('Show received data:', JSON.stringify(message.msg));
                    console.log(`Action "${action}" selected for button ID: ${buttonID}`);

                    // Ensure globalActionClickData is defined
                    if (typeof globalActionClickData === "undefined") {
                        globalActionClickData = {}; // Initialize if missing
                    }

                    // Create a unique key for tracking button actions
                    const actionKey = `${action}_ID_${buttonID}`;

                    // Prevent counting the same message multiple times
                    if (!globalActionClickData[actionKey]) {
                        globalActionClickData[actionKey] = 1;
                    } else {
                        globalActionClickData[actionKey] += 1;
                    }

                    console.log(`${actionKey} selected ${globalActionClickData[actionKey]} times`);

                    // Create response object to send back to frontend (without clickCount)
                    let peopleResponse = {
                        cmd: "returnedPeopleDropdownClick",
                        msg: {
                            ELMxID: 0,  // Optional: Can be used to identify the id if needed
                            selectedAction: action,
                            buttonID: buttonID,  // Pass back the buttonID for frontend use
                            timerPeopleNewName: timerPeopleNewName, // Change here to match frontend key
                            buttonPeopleText: buttonPeopleText  // Include button text for clarity
                        }
                    };
                    console.log("Sending peopleResponse to clients:", JSON.stringify(peopleResponse));

                    // Send response to relevant clients
                    let recipientPeopleList = ["particularSome", globalELMxArray[message.msg.ELMxID].arrayOfAttendanceIDs];

                    sendToWho(wss, ws, recipientPeopleList, peopleResponse);

                    break;



                case 'updateVoteButton':
                    console.log("Received updateVoteButton request:", message);

                    let vote_ELMxID = message.msg.ELMxID;
                    let voteButtonID = message.msg.voteButtonID;
                    let isEnabled = message.msg.isEnabled;

                    if (!globalELMxArray[vote_ELMxID]) {
                        console.error(`ELMxID ${vote_ELMxID} not found in globalELMxArray`);
                        break;
                    }

                    if (!globalELMxArray[vote_ELMxID].voteButtons) {
                        console.log(`Vote buttons object for ELMxID ${vote_ELMxID} does not exist, creating it.`);
                        globalELMxArray[vote_ELMxID].voteButtons = {};
                    }

                    globalELMxArray[vote_ELMxID].voteButtons[voteButtonID] = {
                        "voteButtonID": voteButtonID,
                        "isEnabled": isEnabled
                    };

                    console.log(`Vote button ${voteButtonID} for ELMxID ${vote_ELMxID} is now ${isEnabled ? "enabled" : "disabled"}`);

                    let updateVoteResponse = {
                        cmd: "returnedFromServerUpdateVoteButton",
                        msg: {
                            voteButtonID: voteButtonID,
                            isEnabled: isEnabled,
                            ELMxID: vote_ELMxID
                        }
                    };

                    let targetAudience = ["particularSome", globalELMxArray[vote_ELMxID].arrayOfAttendanceIDs];
                    sendToWho(wss, ws, targetAudience, updateVoteResponse);
                    break;




                case 'showApproval':
                    console.log("📩 Received showApproval message: ", message);

                    const approvalMsg = message.msg;

                    // Destructure with fallbacks
                    const {
                        ELMxID_Approval = 0,
                        fromUserID_Approval = approvalMsg.fromUserID,
                        toUserID_Approval = approvalMsg.toUserID,
                        timerName_Approval = approvalMsg.timerName,
                        minutes_Approval = approvalMsg.minutes,
                        seconds_Approval = approvalMsg.seconds,
                        totalSeconds_Approval = approvalMsg.totalSeconds
                    } = approvalMsg;

                    const approvalKey = `${fromUserID_Approval}_${toUserID_Approval}_${totalSeconds_Approval}`;

                    // ✅ Ensure ELMxID exists
                    if (!globalELMxArray[ELMxID_Approval]) {
                        globalELMxArray[ELMxID_Approval] = {};
                    }

                    // ✅ Ensure approvedDonations is an object
                    if (typeof globalELMxArray[ELMxID_Approval].approvedDonations !== 'object' || globalELMxArray[ELMxID_Approval].approvedDonations === null) {
                        globalELMxArray[ELMxID_Approval].approvedDonations = {};
                    }


                    // ✅ Store full approval message safely
                    globalELMxArray[ELMxID_Approval].approvedDonations[approvalKey] = {
                        shown: true,
                        fromUserID: fromUserID_Approval,
                        toUserID: toUserID_Approval,
                        timerName: timerName_Approval,
                        minutes: minutes_Approval,
                        seconds: seconds_Approval,
                        totalSeconds: totalSeconds_Approval
                    };

                    // ✅ Debug: show current approvedDonations
                    console.log("✅ Current approvedDonations:", globalELMxArray[ELMxID_Approval].approvedDonations);

                    // ✅ Prepare response to send back to clients
                    const showApprovalResponse = {
                        cmd: "returnShowApproval",
                        msg: {
                            ELMxID_Approval,
                            fromUserID_Approval,
                            toUserID_Approval,
                            timerName_Approval,
                            minutes_Approval,
                            seconds_Approval,
                            totalSeconds_Approval
                        }
                    };

                    console.log("📤 Sending showApprovalResponse to clients", showApprovalResponse);

                    // ✅ Send to all attendees
                    const recipients = ["particularSome", globalELMxArray[ELMxID_Approval]?.arrayOfAttendanceIDs];
                    sendToWho(wss, ws, recipients, showApprovalResponse);

                    break;






                // case 'updateThirdingCheckbox':
                //     console.log("📩 Received updateThirdingCheckbox message:", message);

                //     const checkboxMsg = message.msg;
                //     const {
                //         thirdingcheckingELMxID,
                //         thirdingcheckingFromUserID,
                //         checkboxId,
                //         checked,
                //         checkboxIndex
                //     } = checkboxMsg;

                //     // if (!thirdingcheckingELMxID || typeof thirdingcheckingFromUserID === "undefined" || typeof checkboxIndex === "undefined") {
                //     //   console.error("❌ Missing required fields in updateThirdingCheckbox:", checkboxMsg);
                //     //   return;
                //     // }

                //     // Create thirdingKey from existing approvals
                //     const currentApprovals = globalELMxArray[thirdingcheckingELMxID]?.approvedDonations || {};
                //     const matchingKey = Object.keys(currentApprovals).find(key => key.startsWith(`${thirdingcheckingFromUserID}_`));

                //     // if (!matchingKey) {
                //     //   console.error("❌ No matching thirding approval found for fromUserID:", thirdingcheckingFromUserID);
                //     //   return;
                //     // }

                //     // Initialize checkboxStates object if not exists
                //     if (!currentApprovals[matchingKey].checkboxStates) {
                //         currentApprovals[matchingKey].checkboxStates = {};
                //     }

                //     // ✅ Update the checkbox state
                //     currentApprovals[matchingKey].checkboxStates[checkboxIndex] = {
                //         checkboxId,
                //         checked: Boolean(checked),
                //     };

                //     console.log(`✅ Updated checkbox index ${checkboxIndex} to`, checked);
                //     console.log("📦 Updated checkboxStates:", currentApprovals[matchingKey].checkboxStates);

                //     // Optionally broadcast the change to others
                //     const checkboxUpdateResponse = {
                //         cmd: "returnUpdatedThirdingCheckbox",
                //         msg: {
                //             thirdingcheckingELMxID,
                //             thirdingcheckingFromUserID,
                //             checkboxId,
                //             checkboxIndex,
                //             checked: Boolean(checked)
                //         }
                //     };

                //     const ThirdingCheckingRecipients = ["particularSome", globalELMxArray[thirdingcheckingELMxID]?.arrayOfAttendanceIDs];
                //     sendToWho(wss, ws, ThirdingCheckingRecipients, checkboxUpdateResponse);

                //     break;

                //             case 'updateThirdingCheckbox':
                // console.log("📩 Received updateThirdingCheckbox message:", message);

                // const checkboxMsg = message.msg;

                // // ✅ Correct destructuring from actual incoming keys
                // const {
                //     ELMxID: thirdingcheckingELMxID,
                //     fromUserID: thirdingcheckingFromUserID,
                //     checkboxId,
                //     checked,
                //     checkboxIndex
                // } = checkboxMsg;

                // // ✅ Check if globalELMxArray and required data exist
                // if (!globalELMxArray[thirdingcheckingELMxID]) {
                //     console.error("❌ ELMxID not found in globalELMxArray:", thirdingcheckingELMxID);
                //     return;
                // }

                // const currentApprovals = globalELMxArray[thirdingcheckingELMxID].approvedDonations || {};

                // // ✅ Find the matching approval key for this user
                // const matchingKey = Object.keys(currentApprovals).find(key => key.startsWith(`${thirdingcheckingFromUserID}_`));

                // if (!matchingKey) {
                //     console.error("❌ No matching approval key found for user:", thirdingcheckingFromUserID);
                //     return;
                // }

                // // ✅ Safely initialize checkboxStates if needed
                // if (!currentApprovals[matchingKey].checkboxStates) {
                //     currentApprovals[matchingKey].checkboxStates = {};
                // }

                // // ✅ Update the checkbox state
                // currentApprovals[matchingKey].checkboxStates[checkboxIndex] = {
                //     checkboxId,
                //     checked: Boolean(checked),
                // };

                // console.log(`✅ Updated checkbox index ${checkboxIndex} to`, checked);
                // console.log("📦 Updated checkboxStates:", currentApprovals[matchingKey].checkboxStates);

                // // ✅ Broadcast the change to other clients
                // const checkboxUpdateResponse = {
                //     cmd: "returnUpdatedThirdingCheckbox",
                //     msg: {
                //         thirdingcheckingELMxID,
                //         thirdingcheckingFromUserID,
                //         checkboxId,
                //         checkboxIndex,
                //         checked: Boolean(checked)
                //     }
                // };

                // const ThirdingCheckingRecipients = [
                //     "particularSome",
                //     globalELMxArray[thirdingcheckingELMxID].arrayOfAttendanceIDs
                // ];

                // sendToWho(wss, ws, ThirdingCheckingRecipients, checkboxUpdateResponse);

                // break;

                case 'updateThirdingCheckbox':
                    console.log("📩 Received updateThirdingCheckbox message:", message);

                    const checkboxMsg = message.msg;

                    // ✅ Correct destructuring
                    const {
                        ELMxID: thirdingcheckingELMxID,
                        fromUserID: thirdingcheckingFromUserID,
                        checkboxId,
                        checked,
                        checkboxIndex
                    } = checkboxMsg;

                    // ✅ Validate ELMxID
                    if (!globalELMxArray[thirdingcheckingELMxID]) {
                        console.error("❌ ELMxID not found in globalELMxArray:", thirdingcheckingELMxID);
                        return;
                    }

                    // ✅ Initialize approvedDonations object if not present
                    if (!globalELMxArray[thirdingcheckingELMxID].approvedDonations || typeof globalELMxArray[thirdingcheckingELMxID].approvedDonations !== 'object') {
                        globalELMxArray[thirdingcheckingELMxID].approvedDonations = {};
                    }

                    const currentApprovals = globalELMxArray[thirdingcheckingELMxID].approvedDonations;

                    // ✅ Get the key for this user's approval
                    const matchingKey = Object.keys(currentApprovals).find(key => key.startsWith(`${thirdingcheckingFromUserID}_`));

                    if (!matchingKey) {
                        console.error("❌ No matching approval key found for user:", thirdingcheckingFromUserID);
                        return;
                    }

                    // ✅ Ensure checkboxStates exists
                    if (!currentApprovals[matchingKey].checkboxStates) {
                        currentApprovals[matchingKey].checkboxStates = {};
                    }

                    // ✅ Save checkbox state
                    currentApprovals[matchingKey].checkboxStates[checkboxIndex] = {
                        checkboxId,
                        checked: Boolean(checked),
                    };

                    console.log(`✅ Updated checkbox index ${checkboxIndex} to`, checked);
                    console.log("📦 Updated checkboxStates:", currentApprovals[matchingKey].checkboxStates);

                    // ✅ Now store in realapprovaluser
                    if (
                        !globalELMxArray[thirdingcheckingELMxID].thirdingDonationData ||
                        typeof globalELMxArray[thirdingcheckingELMxID].thirdingDonationData !== 'object'
                    ) {
                        globalELMxArray[thirdingcheckingELMxID].thirdingDonationData = {};
                    }

                    if (!globalELMxArray[thirdingcheckingELMxID].thirdingDonationData.realapprovaluser) {
                        globalELMxArray[thirdingcheckingELMxID].thirdingDonationData.realapprovaluser = {};
                    }

                    // ✅ Create entry for fromUserID if not exists
                    if (!globalELMxArray[thirdingcheckingELMxID].thirdingDonationData.realapprovaluser[thirdingcheckingFromUserID]) {
                        globalELMxArray[thirdingcheckingELMxID].thirdingDonationData.realapprovaluser[thirdingcheckingFromUserID] = {};
                    }

                    // ✅ Store checkbox state under realapprovaluser
                    globalELMxArray[thirdingcheckingELMxID].thirdingDonationData.realapprovaluser[thirdingcheckingFromUserID][checkboxIndex] = {
                        checkboxId,
                        checked: Boolean(checked),
                    };

                    console.log("📥 Stored in realapprovaluser:", globalELMxArray[thirdingcheckingELMxID].thirdingDonationData.realapprovaluser);

                    // ✅ Notify all clients
                    const checkboxUpdateResponse = {
                        cmd: "returnUpdatedThirdingCheckbox",
                        msg: {
                            thirdingcheckingELMxID,
                            thirdingcheckingFromUserID,
                            checkboxId,
                            checkboxIndex,
                            checked: Boolean(checked)
                        }
                    };

                    const ThirdingCheckingRecipients = [
                        "particularSome",
                        globalELMxArray[thirdingcheckingELMxID].arrayOfAttendanceIDs
                    ];

                    sendToWho(wss, ws, ThirdingCheckingRecipients, checkboxUpdateResponse);

                    break;


                // case 'getThirdingCheckboxState':
                //     {
                //         console.log("📩 Received getThirdingCheckboxState message:", message);

                //         const { ELMxID, fromUserID } = message.msg;

                //         // ✅ Validate ELMxID
                //         if (!globalELMxArray[ELMxID]) {
                //             console.error("❌ ELMxID not found in globalELMxArray:", ELMxID);
                //             return;
                //         }

                //         const currentApprovals = globalELMxArray[ELMxID].approvedDonations;

                //         // ✅ Get the key for this user's approval
                //         const matchingKey = Object.keys(currentApprovals).find(key => key.startsWith(`${fromUserID}_`));

                //         if (!matchingKey) {
                //             console.error("❌ No matching approval key found for user:", fromUserID);
                //             return;
                //         }

                //         const checkboxStates = currentApprovals[matchingKey].checkboxStates || {};

                //         // ✅ Send the checkbox states back to the client
                //         const checkboxStateResponse = {
                //             cmd: "returnThirdingCheckboxState",
                //             msg: {
                //                 ELMxID,
                //                 fromUserID,
                //                 checkboxStates
                //             }
                //         };

                //         // Send the checkbox states to the requesting client
                //         sendToWho(wss, ws, [message.from], checkboxStateResponse);

                //         break;
                //     }

                case 'getThirdingCheckboxState': {
                    console.log("📩 Received getThirdingCheckboxState message:", message);

                    const { ELMxID, fromUserID } = message.msg;

                    // ✅ Validate ELMxID
                    if (!globalELMxArray[ELMxID]) {
                        console.error("❌ ELMxID not found in globalELMxArray:", ELMxID);
                        return;
                    }

                    const currentApprovals = globalELMxArray[ELMxID].approvedDonations;

                    // ✅ Get the key for this user's approval
                    const matchingKey = Object.keys(currentApprovals).find(key => key.startsWith(`${fromUserID}_`));

                    if (!matchingKey) {
                        console.error("❌ No matching approval key found for user:", fromUserID);
                        return;
                    }

                    const checkboxStates = currentApprovals[matchingKey].checkboxStates || {};

                    // ✅ Send the checkbox states back to the client
                    const checkboxStateResponse = {
                        cmd: "returnThirdingCheckboxState",
                        msg: {
                            ELMxID,
                            fromUserID,
                            checkboxStates
                        }
                    };

                    // Send the checkbox states to the requesting client
                    sendToWho(wss, ws, [message.from], checkboxStateResponse);
                    break;
                }









                // case "getCurrentThirdingCheckboxStates":
                //   const currentCheckboxStates = Object.entries(thirdingCheckboxStates).map(([checkboxId, checked]) => ({
                //     checkboxId,
                //     checked
                //   }));

                //   ws.send(JSON.stringify({
                //     cmd: "returnAllThirdingCheckboxStates",
                //     msg: currentCheckboxStates
                //   }));
                //   break;


                // case "getCurrentThirdingCheckboxStates":
                //     const currentCheckboxStates = Object.entries(thirdingCheckboxStates).map(([checkboxId, checked]) => ({
                //         checkboxId,
                //         checked
                //     }));

                //     ws.send(JSON.stringify({
                //         cmd: "returnAllThirdingCheckboxStates",
                //         msg: currentCheckboxStates
                //     }));
                //     break;


                // case "getCurrentThirdingCheckboxStates": {
                //     const sessionID = message.msg?.ELMxID ?? 0;

                //     const checkboxStates = thirdingCheckboxStatesBySession[sessionID] || {};

                //     const currentCheckboxStates = Object.entries(checkboxStates).map(([checkboxId, state]) => ({
                //         checkboxId,
                //         checked: state
                //     }));

                //     ws.send(JSON.stringify({
                //         cmd: "returnAllThirdingCheckboxStates",
                //         msg: currentCheckboxStates
                //     }));
                //     break;
                // }


                case 'showThirdingApproval':
                    console.log("📩 Received showThirdingApproval message: ", message);

                    const thirdingMsg = message.msg;

                    // Destructure with clearly named variables to avoid conflicts
                    const {
                        ELMxID: thirdingELMxID = 0,
                        fromUserID: thirdingFromUserID,
                        toUserID: thirdingToUserID,
                        timerName: thirdingTimerName,
                        minutes: thirdingMinutes,
                        seconds: thirdingSeconds,
                        totalSeconds: thirdingTotalSeconds,
                        selectedTimers: thirdingSelectedTimers = [],
                        selectedTimerIDs: thirdingSelectedTimerIDs = [], // ✅ NEW
                        note: thirdingNote = "Third+ donation – full approval"
                    } = thirdingMsg;

                    const thirdingKey = `${thirdingFromUserID}_${thirdingToUserID}_${thirdingTotalSeconds}`;

                    // ✅ Ensure the ELMx entry exists
                    if (!globalELMxArray[thirdingELMxID]) {
                        globalELMxArray[thirdingELMxID] = {};
                    }

                    // ✅ Ensure approvedDonations exists
                    if (
                        typeof globalELMxArray[thirdingELMxID].approvedDonations !== 'object' ||
                        globalELMxArray[thirdingELMxID].approvedDonations === null
                    ) {
                        globalELMxArray[thirdingELMxID].approvedDonations = {};
                    }

                    // ✅ Store the third+ approval data
                    globalELMxArray[thirdingELMxID].approvedDonations[thirdingKey] = {
                        shown: true,
                        fromUserID: thirdingFromUserID,
                        toUserID: thirdingToUserID,
                        timerName: thirdingTimerName,
                        minutes: thirdingMinutes,
                        seconds: thirdingSeconds,
                        totalSeconds: thirdingTotalSeconds,
                        selectedTimers: thirdingSelectedTimers,
                        selectedTimerIDs: thirdingSelectedTimerIDs, // ✅ NEW
                        note: thirdingNote
                    };

                    // ✅ Debug output
                    console.log("✅ Updated thirding approvedDonations:", globalELMxArray[thirdingELMxID].approvedDonations);

                    // ✅ Prepare response message for all attendees
                    const showThirdingResponse = {
                        cmd: "returnShowThirdingApproval",
                        msg: {
                            ELMxID: thirdingELMxID,
                            fromUserID: thirdingFromUserID,
                            toUserID: thirdingToUserID,
                            timerName: thirdingTimerName,
                            minutes: thirdingMinutes,
                            seconds: thirdingSeconds,
                            totalSeconds: thirdingTotalSeconds,
                            selectedTimers: thirdingSelectedTimers,
                            selectedTimerIDs: thirdingSelectedTimerIDs, // ✅ NEW
                            note: thirdingNote
                        }
                    };

                    console.log("📤 Sending returnShowThirdingApproval to attendees:", showThirdingResponse);

                    // ✅ Send to all relevant recipients
                    const thirdingRecipients = ["particularSome", globalELMxArray[thirdingELMxID]?.arrayOfAttendanceIDs];
                    sendToWho(wss, ws, thirdingRecipients, showThirdingResponse);

                    break;


                case "sendingremoveApprovalUI": {
                    console.log("📩 Received removeshowApproval message:", message);

                    // 1. Safely extract your fields
                    const {
                        ELMxID: sessionID = 0,
                        fromUserID,
                        toUserID,
                        totalSeconds
                    } = message.msg || {};

                    // 2. Compute the key you used when approving
                    const donationKey = `${fromUserID}_${toUserID}_${totalSeconds}`;
                    console.log("🔍 Removal request for key:", donationKey, "in session", sessionID);

                    // 3. Look up the session data
                    const sessionData = globalELMxArray[sessionID];
                    if (!sessionData) {
                        console.warn("⚠️ No session data found for ELMxID:", sessionID);
                        break;
                    }

                    // 4. Delete from approvedDonations if it exists
                    const approved = sessionData.approvedDonations;
                    if (approved && donationKey in approved) {
                        delete approved[donationKey];
                        console.log(`✅ Deleted approvedDonations[${donationKey}]`);
                    } else {
                        console.warn(`⚠️ No approvedDonations["${donationKey}"] to delete.`);
                    }

                    // 5. Build your recipients list.  
                    //    In your existing code you use ["particularSome", arrayOfAttendanceIDs]
                    //    so we’ll do the same—this will send to that group plus everyone in the meeting:
                    const recipients = [
                        "particularSome",
                        sessionData.arrayOfAttendanceIDs   // should be an array of socket IDs
                    ];

                    // 6. Tell all clients to remove the single approval box:
                    const removalUI = {
                        cmd: "returnRemoveApproval",
                        msg: {
                            ELMxID: sessionID,
                            fromUserID,
                            toUserID,
                            totalSeconds
                        }
                    };
                    sendToWho(wss, ws, recipients, removalUI);

                    // 7. Then broadcast the updated approvedDonations map:
                    const updateMsg = {
                        cmd: "updateApprovedDonations",
                        msg: approved
                    };
                    sendToWho(wss, ws, recipients, updateMsg);

                    break;
                }










                case 'donateTime':
                    console.log("📩 Received donateTime message: ", message);
                    let ELMxID_DonateTimer = message.msg.ELMxID;

                    const {
                        fromUserID,
                        toUserID,
                        timerName,
                        minutes: donateMinutes,
                        seconds: donateSeconds,
                        totalSeconds: donateTotalSeconds,
                        approvedByID = null,
                        approvedByName = null
                    } = message.msg;

                    if (donateTotalSeconds == null) {
                        console.error("❌ Invalid donateTime message: missing totalSeconds.");
                        break;
                    }

                    if (approvedByID && approvedByName) {
                        console.log(`✅ Donation approved by User ${approvedByID} (${approvedByName})`);
                    }

                    console.log(`⏳ User ${fromUserID} is donating ${donateMinutes}m ${donateSeconds}s (${donateTotalSeconds}s) to user ${toUserID} for timer "${timerName}".`);

                    if (!globalELMxArray) {
                        console.error("❌ No active meetings data available.");
                        break;
                    }

                    let donorTimer = null;
                    let recipientTimer = null;

                    for (let ELMxID in globalELMxArray) {
                        const meeting = globalELMxArray[ELMxID];
                        for (let timerID in meeting.timers) {
                            const timer = meeting.timers[timerID];
                            if (!donorTimer && String(timer.ownerID) === String(fromUserID)) {
                                donorTimer = timer;
                            }
                            if (!recipientTimer && String(timer.ownerID) === String(toUserID)) {
                                recipientTimer = timer;
                            }
                        }
                    }

                    if (!donorTimer || !recipientTimer) {
                        console.error("❌ Donor or recipient timer not found.");
                        break;
                    }

                    if (donorTimer.remainingTime < donateTotalSeconds) {
                        console.error("❌ Donor does not have enough time to donate.");
                        break;
                    }

                    donorTimer.remainingTime -= donateTotalSeconds;
                    recipientTimer.remainingTime += donateTotalSeconds;

                    const recipientName = recipientTimer.name || "";
                    const donationMessageText = `${timerName} Donated ${donateMinutes}m ${donateSeconds}s to ${recipientName || toUserID}`;

                    if (!globalELMxArray.donationCounts) {
                        globalELMxArray.donationCounts = {};
                    }

                    const donationKey = `${fromUserID}_${toUserID}`;
                    if (!globalELMxArray.donationCounts[donationKey]) {
                        globalELMxArray.donationCounts[donationKey] = 0;
                    }

                    globalELMxArray.donationCounts[donationKey]++;

                    // globalELMxArray[ELMxID_DonateTimer].donateHistory = {
                    //     fromUserID,
                    //     toUserID,
                    //     timerName,
                    //     donatedMinutes: donateMinutes,
                    //     donatedSeconds: donateSeconds,
                    //     totalSeconds: donateTotalSeconds,
                    //     donorNewTime: donorTimer.remainingTime,
                    //     recipientName: recipientName,
                    //     approvedByID,
                    //     approvedByName,
                    //     donationCount: globalELMxArray.donationCounts[donationKey]
                    // };


                    if (!Array.isArray(globalELMxArray[ELMxID_DonateTimer].donateHistory)) {
                        globalELMxArray[ELMxID_DonateTimer].donateHistory = [];
                    }

                    globalELMxArray[ELMxID_DonateTimer].donateHistory.push({
                        fromUserID,
                        toUserID,
                        timerName,
                        donatedMinutes: donateMinutes,
                        donatedSeconds: donateSeconds,
                        totalSeconds: donateTotalSeconds,
                        donorNewTime: donorTimer.remainingTime,
                        recipientName: recipientName,
                        approvedByID,
                        approvedByName,
                        donationCount: globalELMxArray.donationCounts[donationKey],
                    });


                    const donationResult = {
                        cmd: "donateTimeResult",
                        msg: {
                            ELMxID_DonateTimer: 0,
                            fromUserID,
                            toUserID,
                            timerName,
                            donatedMinutes: donateMinutes,
                            donatedSeconds: donateSeconds,
                            totalSeconds: donateTotalSeconds,
                            donorNewTime: donorTimer.remainingTime,
                            recipientNewTime: recipientTimer.remainingTime,
                            recipientName: recipientTimer.name,
                            approvedByID,
                            approvedByName,
                            donationCount: globalELMxArray.donationCounts[donationKey]
                        }
                    };

                    let targetDonateAudience = ["particularSome", globalELMxArray[ELMxID_DonateTimer].arrayOfAttendanceIDs];
                    sendToWho(wss, ws, targetDonateAudience, donationResult);

                    // ✅ STORE donation message for later display
                    if (!globalELMxArray[ELMxID_DonateTimer].donationMessages) {
                        globalELMxArray[ELMxID_DonateTimer].donationMessages = [];
                    }

                    globalELMxArray[ELMxID_DonateTimer].donationMessages.push({
                        message: donationMessageText,
                    });

                    const donationDisplayMsg = {
                        cmd: "displayDonationMessage",
                        msg: {
                            message: donationMessageText
                        }
                    };

                    sendToWho(wss, ws, targetDonateAudience, donationDisplayMsg);
                    break;





                case 'checkDonationCount':
                    const { fromUserID: fromID, toUserID: toID } = message.msg;
                    let countKey = `${fromID}_${toID}`;
                    let existingCount = 0;

                    if (globalELMxArray.donationCounts && globalELMxArray.donationCounts[countKey]) {
                        existingCount = globalELMxArray.donationCounts[countKey];
                    }

                    const resultMsg = {
                        cmd: "checkDonationCountResult",
                        msg: {
                            fromUserID: fromID,
                            toUserID: toID,
                            donationCount: existingCount
                        }
                    };

                    ws.send(JSON.stringify(resultMsg));
                    break;


                case 'sendDonation': {
                    const donation = message.msg;
                    const donationKey = `${donation.fromUserID}_${donation.toUserID}`;

                    if (!globalELMxArray.donationCounts[donationKey]) {
                        globalELMxArray.donationCounts[donationKey] = 0;
                    }

                    globalELMxArray.donationCounts[donationKey] += 1;

                    console.log(`🎉 Donation recorded: ${donationKey} = ${globalELMxArray.donationCounts[donationKey]}`);

                    // Optionally notify the sender or others
                    const confirmMsg = {
                        cmd: "donationConfirmed",
                        msg: {
                            ...donation,
                            newCount: globalELMxArray.donationCounts[donationKey]
                        }
                    };

                    ws.send(JSON.stringify(confirmMsg));
                    break;
                }



                // case 'removeApprovedDonation':
                //     if (!message.msg) {
                //       console.error("Invalid message format: 'msg' field is missing.");
                //       return;
                //     }

                //     const { fromUserIDRemoval, toUserIDRemoval, totalSecondsRemoval } = message.msg;
                //     const key = `${fromUserIDRemoval}-${toUserIDRemoval}-${totalSecondsRemoval}`;

                //     console.log("removal data", message.msg);
                //     if (approvedDonations[key]) {
                //       delete approvedDonations[key];
                //       console.log(`Donation removed: ${key}`);

                //       clients.forEach(client => {
                //         client.send(JSON.stringify({
                //           cmd: "updateApprovedDonations",
                //           msg: approvedDonations
                //         }));
                //       });
                //     } else {
                //       console.log("Donation not found:", key);
                //     }
                //     break;

                // case 'removeApprovedDonation': 
                //     if (!message.msg) {
                //         console.error("Invalid message format: 'msg' field is missing.");
                //         return;
                //     }

                //     // broadcastToAllClients(removalMsg);

                //     const { fromUserID, toUserID, totalSeconds, ELMxID } = message.msg; // <-- IMPORTANT: Add ELMxID here!

                //     const key = `${fromUserID}_${toUserID}_${totalSeconds}`;

                //     console.log("removal data", message.msg);

                //     if (globalELMxArray[ELMxID] && globalELMxArray[ELMxID].approvedDonations && globalELMxArray[ELMxID].approvedDonations[key]) {
                //         delete globalELMxArray[ELMxID].approvedDonations[key];
                //         console.log(`Donation removed: ${key}`);

                //         clients.forEach(client => {
                //             client.send(JSON.stringify({
                //                 cmd: "updateApprovedDonations",
                //                 msg: globalELMxArray[ELMxID].approvedDonations
                //             }));
                //         });
                //     } else {
                //         console.log("Donation not found:", key);
                //     }
                //     break;



                //             case 'removeApprovedDonation': 
                // if (!message.msg) {
                //     console.error("Invalid message format: 'msg' field is missing.");
                //     return;
                // }

                // // broadcastToAllClients(removalMsg);

                // const { 
                //     fromUserID: donorID, 
                //     toUserID: recipientID, 
                //     totalSeconds: donatedDuration, 
                //     ELMxID: sessionID 
                // } = message.msg;

                // const SecondingapprovalKey = `${donorID}_${recipientID}_${donatedDuration}`;

                // console.log("🔍 Removal request received with data:", message.msg);

                // if (
                //     globalELMxArray[sessionID] &&
                //     globalELMxArray[sessionID].approvedDonations &&
                //     globalELMxArray[sessionID].approvedDonations[SecondingapprovalKey]
                // ) {
                //     delete globalELMxArray[sessionID].approvedDonations[SecondingapprovalKey];
                //     console.log(`✅ Donation removed: ${SecondingapprovalKey}`);

                //     clients.forEach(client => {
                //         client.send(JSON.stringify({
                //             cmd: "updateApprovedDonations",
                //             msg: globalELMxArray[sessionID].approvedDonations
                //         }));
                //     });
                // } else {
                //     console.warn(`⚠️ Donation not found for key: ${SecondingapprovalKey}`);
                // }
                // break;



                // case 'removeApprovedDonation':
                //     // Rename totalSeconds to donationSeconds to avoid conflict
                //     const { fromUserID: donorID, toUserID: recipientID, totalSeconds: donationSeconds } = data.msg;
                //     const key = `${donorID}-${recipientID}-${donationSeconds}`;

                //     // Check if donation exists, then remove it
                //     if (approvedDonations[key]) {
                //       delete approvedDonations[key];  // Remove donation from approvedDonations
                //       console.log(`Donation removed: ${key}`);

                //       // Optionally, notify other clients that the donation was removed
                //       clients.forEach(client => {
                //         client.send(JSON.stringify({
                //           cmd: "updateApprovedDonations",
                //           msg: approvedDonations
                //         }));
                //       });
                //     } else {
                //       console.log("Donation not found:", key);
                //     }
                //     break;

                // case 'getDonationMessages': {
                //     const ELMxID = message.msg.ELMxID;

                //     const messages = globalELMxArray[ELMxID]?.donateHistory || [];

                //     const unapproveusermessage = globalELMxArray[ELMxID]?.approvedDonations || [];


                //     console.log("📜 Retrieved unapproveusermessage for ELMxID", ELMxID, ":", unapproveusermessage);

                //     console.log("📜 Retrieved donateHistory for ELMxID", ELMxID, ":", messages);

                //     const response = {
                //         cmd: "donationMessagesList",
                //         msg: { messages },
                //         unapprovalmessage : {unapproveusermessage}
                //     };

                //     ws.send(JSON.stringify(response));
                //     break;
                // }


                // case "removeApprovedDonation": {
                //     console.log("📩 removeApprovedDonation request:", message.msg);
                //     const {
                //         ELMxID: sessionID = 0,
                //         fromUserID,
                //         toUserID,
                //         totalSeconds
                //     } = message.msg || {};

                //     // Build the same key you used when approving
                //     const key = `${fromUserID}_${toUserID}_${totalSeconds}`;
                //     const session = globalELMxArray[sessionID];
                //     if (session && session.approvedDonations && key in session.approvedDonations) {
                //         delete session.approvedDonations[key];
                //         console.log(`✅ Deleted approvedDonations[${key}] in session ${sessionID}`);
                //     } else {
                //         console.warn(`⚠️ No approvedDonations[${key}] to delete.`);
                //     }

                //     // Tell *all* relevant clients to drop that one box
                //     const removalUI = {
                //         cmd: "returnRemoveApproval",
                //         msg: { ELMxID: sessionID, fromUserID, toUserID, totalSeconds }
                //     };
                //     const recipients = ["particularSome", session.arrayOfAttendanceIDs];
                //     sendToWho(wss, ws, recipients, removalUI);

                //     break;
                // }

                case "removeApprovedDonation": {
                    console.log("📩 removeApprovedDonation request:", message.msg);
                    const {
                        ELMxID: sessionID = 0,
                        fromUserID,
                        toUserID,
                        totalSeconds
                    } = message.msg || {};

                    const key = `${fromUserID}_${toUserID}_${totalSeconds}`;
                    const session = globalELMxArray[sessionID];

                    if (!session) {
                        console.warn(`⚠️ No session found for sessionID ${sessionID}`);
                        break;
                    }

                    // Ensure approvedDonations is an object
                    if (typeof session.approvedDonations !== "object" || session.approvedDonations === null) {
                        console.warn(`⚠️ Invalid approvedDonations structure in session ${sessionID}. Found:`, session.approvedDonations);
                        session.approvedDonations = {}; // Initialize if necessary
                    }

                    if (key in session.approvedDonations) {
                        delete session.approvedDonations[key];
                        console.log(`✅ Deleted approvedDonations[${key}] in session ${sessionID}`);
                    } else {
                        console.warn(`⚠️ No approvedDonations[${key}] to delete.`);
                    }

                    // Notify all relevant clients to remove the approved donation UI
                    const removalUI = {
                        cmd: "returnRemoveApproval",
                        msg: { ELMxID: sessionID, fromUserID, toUserID, totalSeconds }
                    };

                    const recipients = ["particularSome", session.arrayOfAttendanceIDs];
                    sendToWho(wss, ws, recipients, removalUI);

                    break;
                }




                // case 'getDonationMessages': {
                //     const ELMxID = message.msg.ELMxID;
                //     const messages = globalELMxArray[ELMxID]?.donateHistory || [];
                //     const unapproveusermessage = globalELMxArray[ELMxID]?.approvedDonations || [];
                //     console.log("📜 Retrieved unapproveusermessage for ELMxID", ELMxID, ":", unapproveusermessage);
                //     console.log("📜 Retrieved donateHistory for ELMxID", ELMxID, ":", messages);
                //     const response = {
                //         cmd: "donationMessagesList",
                //         msg: {
                //             messages,
                //             unapproveusermessage
                //         }
                //     };
                //     ws.send(JSON.stringify(response));
                //     break;
                // }



                case 'getDonationMessages': {
                    const ELMxID = message.msg.ELMxID;
                    const messages = globalELMxArray[ELMxID]?.donateHistory || [];
                    const unapproveusermessage = globalELMxArray[ELMxID]?.approvedDonations || [];

                    // Ensure unapproveusermessage is an array
                    const unapproveMessagesArray = Array.isArray(unapproveusermessage) ? unapproveusermessage : Object.values(unapproveusermessage);

                    console.log("📜 Retrieved unapproveusermessage for ELMxID", ELMxID, ":", unapproveMessagesArray);
                    console.log("📜 Retrieved donateHistory for ELMxID", ELMxID, ":", messages);

                    const response = {
                        cmd: "donationMessagesList",
                        msg: {
                            messages,
                            unapproveusermessage: unapproveMessagesArray
                        }
                    };
                    ws.send(JSON.stringify(response));
                    break;
                }


                case 'getSelectedTimersState':
                    const selectedELMxID = message.msg.ELMxID; // Renamed ELMxID to selectedELMxID
                    const selectedTimerServerID = message.msg.timerServerID; // Renamed timerServerID to selectedTimerServerID

                    // Retrieve the selected timers from your data structure (globalELMxArray or equivalent)
                    const selectedTimersState = globalELMxArray[selectedELMxID]?.selectedTimersState || [];

                    // Log the data being sent back to the client for debugging purposes
                    console.log(`Retrieving selected timers for selectedELMxID ${selectedELMxID}:`, JSON.stringify(selectedTimersState));

                    // Send the selected timers data to the client
                    const returnMessage = {
                        cmd: "returnselectedTimersUpdate",
                        msg: {
                            selectedELMxID: selectedELMxID, // Send back as selectedELMxID
                            selectedTimers: selectedTimersState
                        }
                    };

                    ws.send(JSON.stringify(returnMessage));
                    break;


                // case 'removeThirdingApprovedDonation': {
                //     const {
                //         ELMxID,
                //         fromUserID,
                //         toUserID,
                //         totalSeconds
                //     } = message.msg;

                //     const meetingData = globalELMxArray[ELMxID];

                //     if (!meetingData) {
                //         console.error(`❌ ELMxID ${ELMxID} not found.`);
                //         return;
                //     }

                //     // ✅ 1. Remove from approvedDonations
                //     if (typeof meetingData.approvedDonations === 'object') {
                //         const keys = Object.keys(meetingData.approvedDonations);
                //         const keyToRemove = keys.find(key =>
                //             key.startsWith(`${fromUserID}_`) &&
                //             key.includes(`${toUserID}_${totalSeconds}`)
                //         );

                //         if (keyToRemove) {
                //             delete meetingData.approvedDonations[keyToRemove];
                //             console.log(`🗑️ Removed approved donation: ${keyToRemove}`);
                //         } else {
                //             console.warn("⚠️ No matching key found in approvedDonations.");
                //         }
                //     }

                //     // ✅ 2. Remove from thirdingDonationData.realapprovaluser
                //     if (
                //         meetingData.thirdingDonationData &&
                //         typeof meetingData.thirdingDonationData.realapprovaluser === 'object' &&
                //         meetingData.thirdingDonationData.realapprovaluser[fromUserID]
                //     ) {
                //         delete meetingData.thirdingDonationData.realapprovaluser[fromUserID];
                //         console.log(`🗑️ Removed realapprovaluser[${fromUserID}]`);
                //     }

                //     break;
                // }


                case 'removeThirdingApprovedDonation': {
                    const {
                        ELMxID,
                        fromUserID,
                        toUserID,
                        totalSeconds
                    } = message.msg;

                    const meetingData = globalELMxArray[ELMxID];

                    if (!meetingData) {
                        console.error(`❌ ELMxID ${ELMxID} not found.`);
                        return;
                    }

                    // ✅ 1. Remove from approvedDonations
                    if (typeof meetingData.approvedDonations === 'object') {
                        const keys = Object.keys(meetingData.approvedDonations);
                        const keyToRemove = keys.find(key =>
                            key.startsWith(`${fromUserID}_`) &&
                            key.includes(`${toUserID}_${totalSeconds}`)
                        );

                        if (keyToRemove) {
                            delete meetingData.approvedDonations[keyToRemove];
                            console.log(`🗑️ Removed approved donation: ${keyToRemove}`);
                        } else {
                            console.warn("⚠️ No matching key found in approvedDonations.");
                        }
                    }

                    // ✅ 2. Remove from thirdingDonationData.realapprovaluser
                    if (
                        meetingData.thirdingDonationData &&
                        typeof meetingData.thirdingDonationData.realapprovaluser === 'object' &&
                        meetingData.thirdingDonationData.realapprovaluser[fromUserID]
                    ) {
                        delete meetingData.thirdingDonationData.realapprovaluser[fromUserID];
                        console.log(`🗑️ Removed realapprovaluser[${fromUserID}]`);
                    }

                    // ✅ 3. Broadcast to all clients to remove the UI
                    const returnRemoveApproval = {
                        cmd: "returnRemoveApproval",
                        msg: {
                            ELMxID,
                            fromUserID,
                            toUserID,
                            totalSeconds
                        }
                    };

                    const recipients = ["particularSome", meetingData.arrayOfAttendanceIDs];
                    sendToWho(wss, ws, recipients, returnRemoveApproval);

                    break;
                }






                // case 'sendingThirdingremoveApprovalUI': {
                //     const { ELMxID, fromUserID, toUserID, totalSeconds } = message.msg;

                //     const broadcastMessage = {
                //         cmd: "sendingThirdingremoveApprovalUI",
                //         msg: { fromUserID, toUserID, totalSeconds }
                //     };

                //     broadcastToELMxClients(ELMxID, broadcastMessage, ws);
                //     break;
                // }
                // case 'sendingThirdingremoveApprovalUI':
                //     {
                //         console.log("📩 Received sendingThirdingremoveApprovalUI message: ", message);

                //         // Destructure the necessary properties from the message
                //         const {
                //             ELMxID,
                //             fromUserID,
                //             toUserID,
                //             totalSeconds
                //         } = message.msg;

                //         // Validate required fields
                //         if (ELMxID == null || fromUserID == null || toUserID == null || totalSeconds == null) {
                //             console.error("❌ Invalid sendingThirdingremoveApprovalUI message: missing one or more required fields.");
                //             break;
                //         }

                //         console.log(`🧹 Broadcasting thirding approval UI removal for ELMxID ${ELMxID}, fromUserID ${fromUserID}, toUserID ${toUserID}, totalSeconds ${totalSeconds}`);

                //         // Check if the specific ELMxID exists in the global array
                //         if (!globalELMxArray[ELMxID]) {
                //             console.error(`⚠️ ELMxID ${ELMxID} does not exist.`);
                //             break;
                //         }

                //         // You can add logic here to handle UI removal if necessary (this can be specific to your application’s structure)
                //         // Example: if there is a 'pendingApprovalUI' object or similar structure to clear, you can clear it.

                //         // Log the removal action
                //         console.log(`🧹 UI removal request from User ${fromUserID} to User ${toUserID} for ${totalSeconds}s`);

                //         break;
                //     }






                case 'hardcodeNewTimeIntoTimer':
                    break;

                case 'pressStart':
                    break;

                case 'pressStop':
                    break;

                case 'pressResetTimerTime1':
                    break;

                case 'pressResetTimerTime2':
                    break;
                case 'addVote':
                    console.log("Received vote message:", message);

                    let Vote_ELMxID = message.id;  // Get the meeting ID
                    console.log("Extracted ID for addVote:", Vote_ELMxID);

                    if (!Vote_ELMxID) {
                        console.error("❌ Missing ID in addVote message:", message);
                        break;
                    }

                    // Broadcast the vote update to all clients (including sender)
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                cmd: "returntoservervote",
                                msg: "Vote successfully added",
                                id: Vote_ELMxID,
                            }));
                        }
                    });

                    break;

                case 'removeVote':
                    console.log("Remove vote message:", message);

                    let Voterm_ELMxID = message.id;  // Get the meeting ID
                    console.log("Extracted ID for removeVote:", Voterm_ELMxID);

                    if (!Voterm_ELMxID) {
                        console.error("❌ Missing ID in removeVote message:", message);
                        break;
                    }

                    // Broadcast vote removal to all clients (including sender)
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                cmd: "returntoservervote",
                                msg: "Vote successfully removed",
                                id: Voterm_ELMxID,
                            }));
                        }
                    });

                    break;


                // case 'addVote':

                //     let addVoteMessage = message.msg;
                //     let addVoteELMxID = addVoteMessage.ELMxID;
                //     let addVoteParticipantID = addVoteMessage.participantID;
                //     let addVoteForm = addVoteMessage.form;
                //     let addVoteFormString = addVoteMessage.formString;
                //     let addVoteFormTime = addVoteMessage.formTime;

                //     let addVoteContent = addVoteMessage.form;
                //     let addVoteContentString = addVoteMessage.formString;
                //     let addVoteContentTime = addVoteMessage.formTime;

                //     let addVotePeople = addVoteMessage.form;
                //     let addVotePeopleString = addVoteMessage.formString;
                //     let addVotePeopleTime = addVoteMessage.formTime;
                //     let listDesired = "allInMeeting"
                //     //test comment for GIT. Hi Nabin!

                //     let participantInfo = globalELMxArray[addVoteELMxID].vote.individualParticipantVotes[addVoteParticipantID];
                //     let totalAddVoteForm = globalELMxArray[addVoteELMxID].vote.totalVoteForm[addVoteForm];

                //     // Increment this form type (Turn, FreeFlow, GodMode)
                //     globalELMxArray[addVoteELMxID].vote.totalVoteForm[addVoteForm] = totalAddVoteForm + 1;

                //     participantInfo.currentVoting = {
                //         voteForm: addVoteForm,
                //         voteFormString: addVoteFormString,
                //         voteFormTime: addVoteFormTime
                //     };

                //     // Update globalELMxArray correctly
                //     globalELMxArray[addVoteELMxID] = {
                //         ...globalELMxArray[addVoteELMxID], // Preserve existing data
                //         vote: {
                //             test: "test",
                //             isVotingHappening: "not yet",
                //             totalVoteForm: "not yet",
                //             totalVoteFormString: "not yet",
                //             totalVoteFormTime: "not yet",
                //             totalVoteContent: "not yet",
                //             totalVoteContentNotion: "not yet", // Individual, Particular, Universal
                //             totalVoteContentString: "not yet",
                //             totalVoteContentTime: "not yet",
                //             totalVotePeople: "not yet",
                //             totalVotePeopleString: "not yet",
                //             totalVotePeopleTime: "not yet",
                //             individualParticipantVotes: {
                //                 participant: {
                //                     participantCurrentVoting: {
                //                         VoteForm: "not yet",
                //                         voteFormString: "not yet",
                //                         voteFormTime: "not yet",
                //                         voteContent: "not yet",
                //                         voteContentNotion: "not yet", // Individual, Particular, Universal
                //                         voteContentString: "not yet",
                //                         voteContentTime: "not yet",
                //                         votePeople: "not yet",
                //                         votePeopleString: "not yet",
                //                         votePeopleTime: "not yet",
                //                     }
                //                 }
                //             }
                //         }
                //     };

                //     // ws.send(JSON.stringify(message)); // Send response to the client
                //     sendToWho(listDesired);
                //     break;

                case 'changeVote':
                    // Handle changeVote logic
                    break;

                case 'removeVote':
                    // Handle removeVote logic
                    break;

                case 'totalVoteSubmitToAllToStartNextCycle':
                    // Handle totalVoteSubmitToAllToStartNextCycle logic
                    let totalVoteMessage = message.msg;
                    let totalVoteELMxID = addVoteMessage.ELMxID;
                    let totalVoteParticipantID = addVoteMessage.participantID;
                    let totalVoteForm = addVoteMessage.form;
                    let totalVoteFormString = addVoteMessage.formString;
                    let totalVoteFormTime = addVoteMessage.formTime;
                    let listDesiredTotal = "allInMeeting";
                    let totalVoteSubmitResponseObject = {};
                    totalVoteSubmitResponseObject = {
                        cmd: "totalVoteSubmitToAllToStartNextCycle",
                        msg: {
                            totalVotesNumber: 4,
                            formMajority: { "numberOfVotes": 3, "formType": "turn", "FormString": "popcorn" },
                            contentMajority: { "numberOfVotes": 4, "contentType": "individual", "contentString": "AI" },
                            peopleMajority: { "numberOfVotes": 4, "peopleType": "individual", "peopleString": "same" },
                            totalFormVote: {
                                turnBased: {
                                    straightTurn: 0,
                                    directiveTurn: 1,
                                    popcorn: 3,
                                },//end turn
                                freeFlow: {
                                    fast: 0,
                                    team: 1,
                                    spread: 3,
                                },//end freeFlow
                                godMode: {
                                    god: 0,
                                    diety: 1,
                                    spirit: 3,
                                },//end God Mode

                            },//end TotalFormVote
                            totalContentVote: {
                                individual: {
                                    self: 0,
                                    group: 1,
                                    world: 3,
                                },//end individual
                                particular: {
                                    topic: 0,
                                    why: 1,
                                    how: 3,
                                },//end particular
                                universal: {
                                    care: 0,
                                    coordinate: 1,
                                    commence: 3,
                                },//end universal

                            },//end TotalContentVote
                            totalPeopleVote: {
                                add: {
                                    short: 0,
                                    medium: 1,
                                    long: 3,
                                },//end turn
                                remove: {
                                    short: 0,
                                    medium: 1,
                                    long: 3,
                                },//end freeFlow
                                change: {
                                    same: 3,
                                    replace: 0,
                                    pareto: {
                                        paretoBasic: 0,
                                        paretoDignity: 1,
                                        paretoTranscendental: 3,
                                    },//end pareto
                                },//end God Mode

                            },//end TotalPeopleVote
                            vetoes: {
                                peopleWhoGetToVetoNowInThisCycle:
                                {
                                    userID1: 3,
                                },//end  peopleWhoGetToVetoNowInThisCycle
                                whoGotANewVeto: {
                                    userID1: 1,
                                    userID2: 0,
                                    userID3: 1,
                                    userID4: 0,
                                },//end whoGotANewVeto
                            },//end vetoes
                        },//end msg
                    }//end totalVoteSubmitResponseObject 
                    sendToWho(wss, ws, listDesired, messageToBrowser);
                    break;

                // case 'donateTime':
                //     handleTimeDonation(wss, ws, message);
                //     break;
            } // End switch



        } catch (error) {
            console.error("Invalid message format", error);
        }
    });

    ws.on("close", () => {
        console.log("Client Disconnected");
        clients.delete(ws); // Remove client from the set
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});

// Start the server
// const PORT = 8082;
const PORT = 8084;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});


// ////////////LIBRARY///////////////

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => String(-v).padStart(2, "0")).join(":");
}


function createUserTimerIDFunction(wss, ws, message) {
    //input Object Form: {"cmd": "createUserTimerID", "msg": {"ELMxID": 1, "timerIDFromBrowser": 2}}
    //if(gidClients[decoded.acc]!=undefined){delete gidClients[];}
    let createUserTimerIDELMxID = message;//message.msg.ELMxID;
    let newUserSocketID = ws;//wss.clients.indexOf(ws);
    let newUserID = globalUserIDs + 1;
    ws.clientID = newUserID;
    globalUserIDs++;
    console.log("Login ELMXMEETING ID SHOULD BE for meeting 0: newUserID:" + " " + newUserID + " " + JSON.stringify(globalELMxArray[createUserTimerIDELMxID].arrayOfAttendanceIDs));
    globalUserIDsWebsocketObject[newUserID] = ws;
    globalELMxArray[createUserTimerIDELMxID].arrayOfAttendanceIDs[newUserID] = newUserID;
    globalELMxArray[createUserTimerIDELMxID].userData[newUserID] = { UserID: newUserID };
    // console.log("Hero" + JSON.stringify(Heroo));
    //userData updating done

    //break reference here so that the high precision on server not lost. We draw lower precision on browser
    let deepCopy = JSON.parse(JSON.stringify(globalELMxArray[createUserTimerIDELMxID]));

    let allMeetingData = globalELMxArray[createUserTimerIDELMxID];

    console.log("allMeetingData:" + allMeetingData);


    for (const timerID in deepCopy.timers) {

        if (deepCopy.timers.hasOwnProperty(timerID)) {
            deepCopy.timers[timerID].remainingTime = Math.floor(deepCopy.timers[timerID].remainingTime)
            deepCopy.timers[timerID].ascendingTime = Math.floor(deepCopy.timers[timerID].ascendingTime)

        }//end has property
    }//end for
    let existingTimerData = deepCopy.timers;
    let createUserResponseObject = { "cmd": "returnNewUserIDWithScreenCatchUp", "msg": { "newID": newUserID, "existingTimerData": existingTimerData, "allMeetingData": deepCopy } };
    let desiredList = ["individualOne", newUserSocketID];
    sendToWho(wss, ws, desiredList, createUserResponseObject)

} //end createUserTimerIDFunction




// Function to remove circular references
// function removeCircularReferences(obj) {
//     const seen = new Set();
//     return JSON.parse(JSON.stringify(obj, (key, value) => {
//         if (typeof value === "object" && value !== null) {
//             if (seen.has(value)) {
//                 return; // Skip circular reference
//             }
//             seen.add(value);
//         }
//         return value;
//     }));
// }

function sendToWho(wss, ws, listDesired, messageToBrowser, meetingIDIfNeeded) {
    //listDesired let desiredList= ["particular", globalELMxArray[createUserTimerIDELMxID].arrayOfAttendanceIDs]
    // clients.forEach((client) => {
    //if (client.readyState === WebSocket.OPEN) {
    // messageToBrowser = removeCircularReferences(messageToBrowser);

    console.log("In sendToWho:" + JSON.stringify(listDesired[0]));
    switch (listDesired[0]) {
        case "universalAll":
            client.send(JSON.stringify(message)); // Broadcast to all clients
            break;
        case "particularSome":
            // Define logic for sending to specific clients in a specific meeting (the "send to some")
            let userWS = {};
            let socketID = 0; //initialize

            for (const key in listDesired[1]) {
                if (listDesired[1].hasOwnProperty(key)) {

                    userWS = globalUserIDsWebsocketObject[listDesired[1][key]];
                    console.log("Why this not working:" + userWS.readyState)

                    //this section on websocket.open has only been through through ~60% and could result in errors in more complex situations. Its ok to edit it
                    if (userWS.readyState === WebSocket.OPEN) {
                        // Get the WebSocket associated with the key


                        if (socketID !== -1) {
                            // socketID found, proceed with sending the message
                            userWS.send(JSON.stringify(messageToBrowser));
                        } else {
                            console.log("WebSocket client not found. Removing from");
                        }

                        // Send the message to the client
                        console.log("sending particularSOME to:" + "userID" + key + " " + "websocketID" + socketID);
                        // client.send(JSON.stringify(messageToBrowser));
                    }
                }//end if WEBSOCKET == OPEN
            }//end if listDesired[1].hasOwnProperty(key)

            break;


        // case "particularSome":
        //     // Define logic for sending to specific clients in a specific meeting ("send to some")
        //     let userWS = {};  // Initialize an empty object for WebSocket
        //     let socketID = 0; // Initialize socketID as 0

        //     // Iterate over the desired list of users (listDesired[1])
        //     for (const key in listDesired[1]) {
        //         if (listDesired[1].hasOwnProperty(key)) {

        //             // Get the WebSocket for the current user from globalUserIDsWebsocketObject
        //             userWS = globalUserIDsWebsocketObject[listDesired[1][key]];

        //             // Check if userWS exists and if the WebSocket connection is open
        //             if (userWS && userWS.readyState === WebSocket.OPEN) {
        //                 // Proceed to send the message to the WebSocket client

        //                 if (socketID !== -1) {
        //                     // socketID is valid, proceed with sending the message
        //                     userWS.send(JSON.stringify(messageToBrowser));
        //                     console.log("sending particularSOME to: userID " + key + " websocketID " + socketID);
        //                 } else {
        //                     // socketID is not valid
        //                     console.log("WebSocket client not found for userID " + key + ". Removing from list.");
        //                 }

        //             } else {
        //                 // If userWS is undefined or WebSocket is not open, log a message
        //                 console.warn("WebSocket for user " + key + " is not open or not found.");
        //             }
        //         }
        //     }
        //     break;


        case "individualOne":
            // Define logic for sending to a single client
            let individualUserWS = ws; //setting this in what appears to be redundent but makes it clear we are in individual and only sending to an individual user
            let individualUserID = ws.clientID;

            //  if(globalUserIDsWebsocketObject[individualUserID]!=undefined){//this is here for lost connections. If they lose connection then their websocket isn't closed and will still take up space in the wss array. So when they log back in we check to see if their GID is alrady in gidClients because it shouldn't be. If it is, then we find the socket it used to be registered at, use that socketIndex to delete the old ws information, then re-add their gid to gidClients with the new socketIndex. this way our websocket wss array doesn't get full of millions of unused ws objects from being disconnected. There migth already be some kind clean up mechanism but I'm doing it in case
            //      delete globalUserIDsWebsocketObject[individualUserID];
            //    }
            console.log("In individualOne sendToWho:")
            if (individualUserWS.readyState === WebSocket.OPEN) {
                // if (socketID !== -1) {
                // socketID found, proceed with sending the message
                console.log("sendToWho: individualOne now sending in .readyState: socketID:" + individualUserID + " " + JSON.stringify(messageToBrowser))
                individualUserWS.send(JSON.stringify(messageToBrowser));
            } else {
                console.log("WebSocket client not found. Removing ID from globalUserIDsWebsocketObject and clients ");
                delete globalUserIDsWebsocketObject[individualUserID];
                delete globalUserIDsWebsocketObject[meetingIDIfNeeded].arrayOfAttendanceIDs[individualUserID];
                delete globalUserIDsWebsocketObject[meetingIDIfNeeded].arrayOfAttendanceIDs[individualUserID];
                globalUserIDsWebsocketObject[meetingIDIfNeeded].participants.NumberOfParticipants = globalUserIDsWebsocketObject[meetingIDIfNeeded].participants.NumberOfParticipants - 1;
            }
            break;
    }
}//end sendToWho
//   });
//}

function handleTimeDonation(wss, ws, message) {
    console.log("Received donation request:", message);
    const { fromUserID, toUserID, minutes, seconds } = message.msg;
    const meetingID = message.msg.meetingID || "0"; // Default to meeting 0 if not specified

    console.log(`Processing donation: fromUserID=${fromUserID}, toUserID=${toUserID}, minutes=${minutes}, seconds=${seconds}`);

    // Convert donation time to seconds
    const donationTime = (parseInt(minutes) * 60) + parseInt(seconds);
    console.log(`Total donation time in seconds: ${donationTime}`);

    // Check if both users exist in the meeting
    if (globalELMxArray[meetingID] &&
        globalELMxArray[meetingID].timers[fromUserID] &&
        globalELMxArray[meetingID].timers[toUserID]) {

        console.log(`Donor's current time: ${globalELMxArray[meetingID].timers[fromUserID].remainingTime}`);
        console.log(`Recipient's current time: ${globalELMxArray[meetingID].timers[toUserID].remainingTime}`);

        // Check if donor has enough time
        if (globalELMxArray[meetingID].timers[fromUserID].remainingTime >= donationTime) {
            // Subtract time from donor
            globalELMxArray[meetingID].timers[fromUserID].remainingTime -= donationTime;

            // Add time to recipient
            globalELMxArray[meetingID].timers[toUserID].remainingTime += donationTime;

            console.log(`After donation - Donor's new time: ${globalELMxArray[meetingID].timers[fromUserID].remainingTime}`);
            console.log(`After donation - Recipient's new time: ${globalELMxArray[meetingID].timers[toUserID].remainingTime}`);

            // Create response object
            const response = {
                cmd: "timeDonationUpdate",
                msg: {
                    fromUserID,
                    toUserID,
                    donationTime,
                    remainingTime: {
                        [fromUserID]: globalELMxArray[meetingID].timers[fromUserID].remainingTime,
                        [toUserID]: globalELMxArray[meetingID].timers[toUserID].remainingTime
                    }
                }
            };

            console.log("Sending donation update to clients:", response);

            // Broadcast update to all clients
            sendToWho(wss, ws, "all", response, meetingID);
        } else {
            console.log("Donation failed: Insufficient time available");
            // Send error message if donor doesn't have enough time
            const errorResponse = {
                cmd: "timeDonationError",
                msg: {
                    error: "Insufficient time available for donation"
                }
            };
            ws.send(JSON.stringify(errorResponse));
        }
    } else {
        console.log("Donation failed: One or both users not found in meeting");
        console.log("Meeting exists:", !!globalELMxArray[meetingID]);
        console.log("Donor exists:", !!globalELMxArray[meetingID]?.timers[fromUserID]);
        console.log("Recipient exists:", !!globalELMxArray[meetingID]?.timers[toUserID]);
    }
}
