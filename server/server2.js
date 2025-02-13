const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
let votertime = 'votertime';
let votetype = 'votetype';
let voteresult = 'voteresult';
let meetingID = 0;
let numberOfELMs = 0;
let globalUserIDs=0;
let globalELMxArray = {};//this object contains each meetings data and it can be operated on from other meetings (ELM) too
    globalELMxArray = {"1": { //ELMxID..this is an example instantiation
                        "flow roles": {
                            "executorName": "spiritman",
                            "influencerName": "spiritman",
                            "strategistName": "spiritman",
                            "relationshipsName": "spiritman"
                        }, //end flow roles
                       "participants": {
                            "NumberOfParticipants": 2, 
                            "paretoCategories": {
                                "participant1":{"aesthetic":6, "social":6, "wealth":4, "body":5, "culturedness": 8, "IQ":9, "UQ":1},
                                "participant2":{"aesthetic":2, "social":9, "wealth":5, "body":3, "culturedness": 7, "IQ":4, "UQ":1}

                            },//end paretoCategories
                       },//end participants
                       
                       "cycles": {
                                "totalCompleteCycles": 2,
                                "currentCycle": 3,
                                "cycleVotingResults":{
                                    "cycle1": {"form": "Straight", "content": "universal-war", "people": "same"},
                                    "cycle2": {"form": "God Mode: Josh", "content": "particular-cohesion", "people": "same"}
                                },//end cycleVotingResults
                            },//cycles
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

    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data); // Expect JSON messages
            console.log("Received:", message);

            // Broadcast message to all connected clients
            clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }//end if forEach Broadcasting
            }); //end forEach Broadcasting

           


            switch (message.cmd) {//FLAG: Nabin bind on client side (created 9:50am mst Feb 11 2025)
                case 'createUserTimerID':
                    //input Object Form: {"cmd": "createUserTimerID", "msg": {"timerIDFromBrowser": 2}}
                    let timerIDFromBrowser = message.msg.timerIDFromBrowser;
                    let newUserID = globalUserIDs+1;
                    globalUserIDs++;

                    let createUserResponseObject= {"cmd": "returnNewUserID","msg": timerIDFromBrowser}
                    ws.send(JSON.stringify(createUserResponseObject)); // Send response to the client
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

function sendToWho(listDesired, message) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            switch (listDesired) {
                case "universalAll":
                    client.send(JSON.stringify(message)); // Broadcast to all clients
                    break;
                case "particularSome":
                    // Define logic for sending to specific clients
                    break;
                case "individualOne":
                    // Define logic for sending to a single client
                    break;
            }
        }
    });
}
