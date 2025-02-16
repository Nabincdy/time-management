const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
let votertime = 'votertime';
let votetype = 'votetype';
let voteresult = 'voteresult';
let meetingID = 0;
let numberOfELMs = 0;
let globalTimerIDs=0;//not yet used Feb 13 2025 can delete
let globalTimerIDsWebsocketObject = {}; //not yet used Feb 13 2025 can delete
let globalUserIDs=0;
let globaUserIDsWebsocketObject = {};
let globalELMxArray = {};//this object contains each meetings data and it can be operated on from other meetings (ELM) too
    globalELMxArray = {"0": { //ELMxID..this is an example instantiation
                        "flow roles": {
                            "executorName": "spiritman/ID",
                            "influencerName": "spiritman",
                            "strategistName": "spiritman",
                            "relationshipsName": "spiritman"
                            
                        }, //end flow roles
                       "arrayOfAttendanceIDs": {},
                       "participants": {
                            "NumberOfParticipants": 2,
                            "paretoCategories": {  

                                "participant1":{"aesthetic":6, "social":6, "wealth":4, "body":5, "culturedness": 8, "IQ":9, "UQ":1},
                                "participant2":{"aesthetic":2, "social":9, "wealth":5, "body":3, "culturedness": 7, "IQ":4, "UQ":1}

                            },//end paretoCategories
                       },//end participants
                       
                       "cycles": {
                                "totalCompleteCycles": 2,
                                "currentCycle": {
                                    "currentCycleNumber": 3,
                                    "currentSpeaker": "participantID"
                                },
                                "cycleVotingResults":{
                                    "cycle1": {"form": "Straight", "content": "universal-war", "people": "same"},
                                    "cycle2": {"form": "God Mode: Josh", "content": "particular-cohesion", "people": "same"}
                                },//end cycleVotingResults
                            },//cycles
                        "timers": {
                                "timer1TotalMeetTimer": {"name": "Total Meet Timer", "remainingTime": 59},
                                "FudgeTimer": {"name": "Fudge Timer", "remainingTime": 9},
                                "timerID1": {"name": "Ben", "remainingTime": 10, "personAssignedID": "ID2"}
                                
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
                                    "cycle1": {"form": "", "content": "", "people": ""},
                                    "cycle2": {"form": "", "content": "", "people": ""}

                                }//end participant1CurrentMeetingVotingHistory
                            },//end participant1
                            },//end individualParticipantVotes
                               },//end voting
                            } //end ELMxID 1
                       };//end globalELMxArray



// Create an HTTP server
const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, "../server2.html");
    console.log('disconected by nabin');


    // Serve the HTML file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error loading server2.html");
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




            if (data.cmd === 'createTimerComponentToBrowser') {
                //input form 
            //    cmd: 'createTimerComponentToBrowser',
            //    msg: {
            //    defaultTime: defaultTime,
            //    timerComponent: timerComponent.outerHTML // Pass the HTML of the timer component
            //    }
            //  };
            // Broadcast the new timer to all connected clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }

            // Broadcast message to all connected clients
            clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }//end if forEach Broadcasting
            }); //end forEach Broadcasting

           

            //MAIN SWITCH
            switch (message.cmd) {//FLAG: Nabin bind on client side (created 9:50am mst Feb 11 2025)
                case 'createTimerComponent(wait)':
                    //input Object Form: {"cmd": "createUserTimerID", "msg": {"ELMxID": 1, "timerIDFromBrowser": 2}}
                    //if(gidClients[decoded.acc]!=undefined){delete gidClients[];}
                    let createUserTimerIDELMxID = message.msg.ELMxID;
                    let timerIDFromBrowser = message.msg.timerIDFromBrowser;
                    let newUserID = globalUserIDs+1;
                    globalUserIDs++;
                    globaUserIDsWebsocketObject[newUserID] = ws;

                    globalELMxArray[createUserTimerIDELMxID].arrayOfAttendanceIDs[newUserID]=newUserID;

                    let createUserResponseObject= {"cmd": "returnNewUserID","msg": {"newID": newUserID, "timerBrowserID": timerIDFromBrowser}};
                    let desiredList= ["particularSome", globalELMxArray[createUserTimerIDELMxID].arrayOfAttendanceIDs]; 
                    sendToWho(wss, ws, desiredList, createUserResponseObject)
                    //ws.send(JSON.stringify(createUserResponseObject)); // Send response to the client
                    break;
                
                case 'addVote':
                   
                    let addVoteMessage = message.msg;
                    let addVoteELMxID = addVoteMessage.ELMxID;
                    let addVoteParticipantID = addVoteMessage.participantID;
                    let addVoteForm = addVoteMessage.form;
                    let addVoteFormString = addVoteMessage.formString;
                    let addVoteFormTime = addVoteMessage.formTime;
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
            
                    ws.send(JSON.stringify(message)); // Send response to the client
                    sendToWho(listDesired);
                    break;
            
                case 'changeVote':
                    // Handle changeVote logic
                    break;
            
                case 'removeVote':
                    // Handle removeVote logic
                    break;
            
                case 'voteSubmitted':
                    // Handle voteSubmitted logic
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

function createUserTimerIDFunction(wss, ws, message){
//input Object Form: {"cmd": "createUserTimerID", "msg": {"ELMxID": 1, "timerIDFromBrowser": 2}}
                    //if(gidClients[decoded.acc]!=undefined){delete gidClients[];}
                    let createUserTimerIDELMxID = message;//message.msg.ELMxID;
                    
                    let newUserID = globalUserIDs+1;
                    globalUserIDs++;
                    console.log("ELMXMEETING ID SHOULD BE 0"+" "+newUserID+ JSON.stringify(globalELMxArray[createUserTimerIDELMxID].arrayOfAttendanceIDs));
                    globaUserIDsWebsocketObject[newUserID] = ws;
                    globalELMxArray[createUserTimerIDELMxID].arrayOfAttendanceIDs[newUserID]=newUserID;

                    //userData updating done

                    let allMeetingData = globalELMxArray[createUserTimerIDELMxID];
                    let existingTimerData = allMeetingData.timers;

                    let createUserResponseObject= {"cmd": "returnNewUserIDWithScreenCatchUp","msg": {"newID": newUserID, "existingTimerData": existingTimerData}};
                    let desiredList= ["particularSome", globalELMxArray[createUserTimerIDELMxID].arrayOfAttendanceIDs]; 
                    sendToWho(wss, ws, desiredList, createUserResponseObject)

} //end createUserTimerIDFunction



function sendToWho(wss,ws, listDesired, messageToBrowser) {
    //listDesired let desiredList= ["particular", globalELMxArray[createUserTimerIDELMxID].arrayOfAttendanceIDs]
   // clients.forEach((client) => {
        //if (client.readyState === WebSocket.OPEN) {
        console.log("In sendToWho:"+ JSON.stringify(listDesired));
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
                            
                            userWS = globaUserIDsWebsocketObject[listDesired[1][key]];
                            console.log("Why this not working:"+userWS.readyState)
                            if (userWS.readyState === WebSocket.OPEN) {
                            // Get the WebSocket associated with the key
                            
                            
                            // Find the index of the user in the WebSocket clients
                           // socketID = wss.clients.indexOf(userWS);
                          // wss.clients.forEach((client, index) => {
                          //  if (client === userWS) {
                            //    socketID = index;  // Set the index when a match is found
                            //}
                       // });
                        
                        if (socketID !== -1) {
                            // socketID found, proceed with sending the message
                            userWS.send(JSON.stringify(messageToBrowser));
                        } else {
                            console.log("WebSocket client not found.");
                        }
                            
                            // Send the message to the client
                            console.log("sending particularSOME to:"+"userID" +key +" "+ "websocketID"+socketID);
                           // client.send(JSON.stringify(messageToBrowser));
                        }
                    }//end if WEBSOCKET == OPEN
                    }//end if listDesired[1].hasOwnProperty(key)

                    break;
                case "individualOne":
                    // Define logic for sending to a single client
                    break;
            }
        }
 //   });
//}
