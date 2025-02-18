const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
let votertime = 'votertime';
let votetype = 'votetype';
let voteresult = 'voteresult';
let meetingID = 0;
let numberOfELMs = 0;
let globalTimerIDs = 0;//not yet used Feb 13 2025 can delete
let globalTimerIDsWebsocketObject = {}; //not yet used Feb 13 2025 can delete
let globalUserIDs = 0;
let globalUserIDsWebsocketObject = {};
let globalELMxArray = {};//this object contains each meetings data and it can be operated on from other meetings (ELM) too
globalELMxArray = {
    "0": { //ELMxID..this is an example instantiation
        "flow roles": {
            "executorName": "spiritman/ID",
            "influencerName": "spiritman",
            "strategistName": "spiritman",
            "relationshipsName": "spiritman"

        }, //end flow roles
        "arrayOfAttendanceIDs": {},
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
            "timer1TotalMeetTimer": { "name": "Total Meet Timer", "remainingTime": 59 },
            "FudgeTimer": { "name": "Fudge Timer", "remainingTime": 9 },
            "timerID1": { "name": "Ben", "remainingTime": 10, "personAssignedID": "ID2" }

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

wss.on("connection", (ws) => {
    console.log("New Client Connected");
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

            


        //    if (data.cmd === 'createTimerComponentToBrowser') {
        //        // input form 
        //        //    cmd: 'createTimerComponentToBrowser',
        //        //    msg: {
        //        //    defaultTime: defaultTime,
        //        //    timerComponent: timerComponent.outerHTML // Pass the HTML of the timer component
        //        //    }
        //        //  };
        //        // Broadcast the new timer to all connected clients
        //        wss.clients.forEach(client => {
        //            if (client.readyState === WebSocket.OPEN) {
        //                client.send(JSON.stringify(data));
        //            }
        //        });
        //    }




            //MAIN SWITCH
            switch (message.cmd) {//FLAG: Nabin bind on client side (created 9:50am mst Feb 11 2025)
                //Mark: Feb 17 2025: thefunction for newUserID is in the wss.on, not here.
                case 'addTimerToServer':
                    console.log("Main Switch: Inside addTimerToServer");
                    //input Object Form: {"cmd": "createUserTimerID", "msg": {"ELMxID": 1, "timerIDFromBrowser": 2}}
                    //if(gidClients[decoded.acc]!=undefined){delete gidClients[];}
                    let createTimerIDELMxID = message.msg.ELMxID;
                    let timerIDFromBrowser = message.msg.timerIDFromBrowser;
                    let defaultTimeOfNewlyAddedTimer = message.msg.defaultTime;
                    let newTimerID = globalTimerIDs + 1;
                    globalTimerIDs++;
                    console.log("Inside createTimerComponentToBrowser:"+createTimerIDELMxID+" "+newTimerID);
                    

                    globalELMxArray[createTimerIDELMxID].timers[newTimerID] = {};//end globalUserIDS

                    globalELMxArray[createTimerIDELMxID].timers[newTimerID] = {
                        "name": "Ben", 
                        "remainingTime": 10, 
                        "personAssignedID": "ID3"
            
                    }//end timers
                    
                    let createUserResponseObject = { "cmd": "returnedFromServerAddTimer", "msg": { "newTimerID": newTimerID, "defaultTime": defaultTimeOfNewlyAddedTimer, "timerBrowserID": timerIDFromBrowser } };
                    let desiredList = ["particularSome", globalELMxArray[createTimerIDELMxID].arrayOfAttendanceIDs];
                    sendToWho(wss, ws, desiredList, createUserResponseObject)
                    //ws.send(JSON.stringify(createUserResponseObject)); // Send response to the client
                    break;
                case 'resetTimerName': 
                
                break;    

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

                    let addVoteMessage = message.msg;
                    let addVoteELMxID = addVoteMessage.ELMxID;
                    let addVoteParticipantID = addVoteMessage.participantID;
                    let addVoteForm = addVoteMessage.form;
                    let addVoteFormString = addVoteMessage.formString;
                    let addVoteFormTime = addVoteMessage.formTime;

                    let addVoteContent = addVoteMessage.form;
                    let addVoteContentString = addVoteMessage.formString;
                    let addVoteContentTime = addVoteMessage.formTime;

                    let addVotePeople = addVoteMessage.form;
                    let addVotePeopleString = addVoteMessage.formString;
                    let addVotePeopleTime = addVoteMessage.formTime;
                    let listDesired = "allInMeeting"
                    //test comment for GIT. Hi Nabin!

                    let participantInfo = globalELMxArray[addVoteELMxID].vote.individualParticipantVotes[addVoteParticipantID];
                    let totalAddVoteForm = globalELMxArray[addVoteELMxID].vote.totalVoteForm[addVoteForm];

                    // Increment this form type (Turn, FreeFlow, GodMode)
                    globalELMxArray[addVoteELMxID].vote.totalVoteForm[addVoteForm] = totalAddVoteForm + 1;

                    participantInfo.currentVoting = {
                        voteForm: addVoteForm,
                        voteFormString: addVoteFormString,
                        voteFormTime: addVoteFormTime
                    };

                    // Update globalELMxArray correctly
                    globalELMxArray[addVoteELMxID] = {
                        ...globalELMxArray[addVoteELMxID], // Preserve existing data
                        vote: {
                            test: "test",
                            isVotingHappening: "not yet",
                            totalVoteForm: "not yet",
                            totalVoteFormString: "not yet",
                            totalVoteFormTime: "not yet",
                            totalVoteContent: "not yet",
                            totalVoteContentNotion: "not yet", // Individual, Particular, Universal
                            totalVoteContentString: "not yet",
                            totalVoteContentTime: "not yet",
                            totalVotePeople: "not yet",
                            totalVotePeopleString: "not yet",
                            totalVotePeopleTime: "not yet",
                            individualParticipantVotes: {
                                participant: {
                                    participantCurrentVoting: {
                                        VoteForm: "not yet",
                                        voteFormString: "not yet",
                                        voteFormTime: "not yet",
                                        voteContent: "not yet",
                                        voteContentNotion: "not yet", // Individual, Particular, Universal
                                        voteContentString: "not yet",
                                        voteContentTime: "not yet",
                                        votePeople: "not yet",
                                        votePeopleString: "not yet",
                                        votePeopleTime: "not yet",
                                    }
                                }
                            }
                        }
                    };

                    // ws.send(JSON.stringify(message)); // Send response to the client
                    sendToWho(listDesired);
                    break;

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
                    let totalVoteSubmitResponseObject ={};
                    totalVoteSubmitResponseObject = {
                        cmd: "totalVoteSubmitToAllToStartNextCycle",
                        msg: {
                            totalVotesNumber: 4,
                            formMajority: {"numberOfVotes": 3, "formType": "turn", "FormString": "popcorn"},
                            contentMajority: {"numberOfVotes": 4, "contentType": "individual", "contentString": "AI"},
                            peopleMajority: {"numberOfVotes": 4, "peopleType": "individual", "peopleString": "same"},
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
const PORT = 8082;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});


// ////////////LIBRARY///////////////

function createUserTimerIDFunction(wss, ws, message) {
    //input Object Form: {"cmd": "createUserTimerID", "msg": {"ELMxID": 1, "timerIDFromBrowser": 2}}
    //if(gidClients[decoded.acc]!=undefined){delete gidClients[];}
    let createUserTimerIDELMxID = message;//message.msg.ELMxID;
    let newUserSocketID = ws.clientID;//wss.clients.indexOf(ws);
    let newUserID = globalUserIDs + 1;
    globalUserIDs++;
    console.log("ELMXMEETING ID SHOULD BE 0" + " " + newUserID + JSON.stringify(globalELMxArray[createUserTimerIDELMxID].arrayOfAttendanceIDs));
    globalUserIDsWebsocketObject[newUserID] = ws;
    globalELMxArray[createUserTimerIDELMxID].arrayOfAttendanceIDs[newUserID] = newUserID;

    //userData updating done

    let allMeetingData = globalELMxArray[createUserTimerIDELMxID];
    let existingTimerData = allMeetingData.timers;

    let createUserResponseObject = { "cmd": "returnNewUserIDWithScreenCatchUp", "msg": { "newID": newUserID, "existingTimerData": existingTimerData } };
    let desiredList = ["IndividualOne", newUserSocketID];
    sendToWho(wss, ws, desiredList, createUserResponseObject)

} //end createUserTimerIDFunction



function sendToWho(wss, ws, listDesired, messageToBrowser, meetingIDIfNeeded) {
    //listDesired let desiredList= ["particular", globalELMxArray[createUserTimerIDELMxID].arrayOfAttendanceIDs]
    // clients.forEach((client) => {
    //if (client.readyState === WebSocket.OPEN) {
    console.log("In sendToWho:" + JSON.stringify(listDesired));
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


                        // Find the index of the user in the WebSocket clients
                         //socketID = wss.clients.indexOf(userWS); //this indexOf no longer a function
                        // wss.clients.forEach((client, index) => {
                        //  if (client === userWS) {
                        //    socketID = index;  // Set the index when a match is found
                        //}
                        // });

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
        case "individualOne":
            // Define logic for sending to a single client
            let individualUserWS = ws; //setting this in what appears to be redundent but makes it clear we are in individual and only sending to an individual user
            let individualUserID = ws.clientID;

          //  if(globalUserIDsWebsocketObject[individualUserID]!=undefined){//this is here for lost connections. If they lose connection then their websocket isn't closed and will still take up space in the wss array. So when they log back in we check to see if their GID is alrady in gidClients because it shouldn't be. If it is, then we find the socket it used to be registered at, use that socketIndex to delete the old ws information, then re-add their gid to gidClients with the new socketIndex. this way our websocket wss array doesn't get full of millions of unused ws objects from being disconnected. There migth already be some kind clean up mechanism but I'm doing it in case
          //      delete globalUserIDsWebsocketObject[individualUserID];
          //    }

            if (socketID !== -1) {
                // socketID found, proceed with sending the message
                console.log("sendToWho: individualOne: socketID:"+individualUserID)
                individualUserWS.send(JSON.stringify(messageToBrowser));
            } else {
                console.log("WebSocket client not found. Removing ID from globalUserIDsWebsocketObject and clients ");
                delete globalUserIDsWebsocketObject[individualUserID];
                delete globalUserIDsWebsocketObject[meetingIDIfNeeded].arrayOfAttendanceIDs[individualUserID];
                delete globalUserIDsWebsocketObject[meetingIDIfNeeded].arrayOfAttendanceIDs[individualUserID];
                globalUserIDsWebsocketObject[meetingIDIfNeeded].participants.NumberOfParticipants=globalUserIDsWebsocketObject[meetingIDIfNeeded].participants.NumberOfParticipants -1;
            }
            break;
    }
}//end sendToWho
//   });
//}