
// this is server code dont edit over here their is another file name index.js


// const WebSocket = require("ws");

// const wss = new WebSocket.Server({ port: 8082 });

// wss.on("connection", ws => {
//     console.log("New Client Connected");

//     ws.on("message", data => {
//         const message = data instanceof Buffer ? data.toString() : data; // Convert buffer to string if needed
//         console.log(`Client sent: ${message}`);

//         // Broadcast message to all connected clients (including sender)
//         wss.clients.forEach(client => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(message);
//             }
//         });
//     });

//     ws.on("close", () => {
//         console.log("Client Disconnected");
//     });
// });

// console.log("WebSocket Server running on ws://localhost:8082");

// const http = require("http");
// const fs = require("fs");
// const path = require("path");
// const WebSocket = require("ws");

// // Create an HTTP server
// const server = http.createServer((req, res) => {
//     if (req.url === "/") {
//         fs.readFile(path.join(__dirname, "../server2.html"), (err, data) => {
//             if (err) {
//                 res.writeHead(500);
//                 res.end("Error loading server2.html");
//             } else {
//                 res.writeHead(200, { "Content-Type": "text/html" });
//                 res.end(data);
//             }
//         });
//     } else {
//         res.writeHead(404);
//         res.end("Not Found");
//     }
// });

// // Attach WebSocket to the HTTP server
// const wss = new WebSocket.Server({ server });

// wss.on("connection", ws => {
//     console.log("New Client Connected");

//     ws.on("message", data => {
//         const message = data instanceof Buffer ? data.toString() : data; // Convert buffer to string if needed
//         console.log(`Client sent: ${message}`);

//         // Broadcast message to all connected clients
//         wss.clients.forEach(client => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(message);
//             }
//         });
//     });

//     ws.on("close", () => {
//         console.log("Client Disconnected");
//     });
// });

// server.listen(8082, () => {
//     console.log("Server running at http://localhost:8082/");
// });




const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
let votertime = 'votertime';
let votetype = 'votetype';
let voteresult = 'voteresult';
let meetingID = 0;
let numberOfELMs = 0;
let globalELMxArray = {};//this object contains each meetings data and it can be operated on from other meetings (ELM) too
    globalELMxArray = {"1": {, //ELMxID..this is an example instantiation
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
// let voteResult = { 'cmd', 
//     { "voteType", "Form",
//          "voteString", "StraightTime",
//           "voteCycleTime", "5 min"}}

// let voteResult = {'cmd',
//      "returnVoteResult",
//       "msg",
//     {"voteType", "Form",
//          "voteString", "StraightTime",
//           "voteCycleTime", "5 min"
//         }}

// let voteResult = {
//     "returnVoteResult",
//     "cmd" : {
//         "voteType": "Form",
//         "voteString": "StraightTime",
//         "voteCycleType": "5 min"
//     },

//     "returnVoteResult" : {
//         "voteType": "Form",
//         "voteString": "StraightTime",
//         "voteCycleType": "5 min"
//     }
// }



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

            switch(message.cmd){
                case 'addVote':
                    let addVoteMessage = message.msg;
                    let addVoteELMxID = addVoteMessage.ELMxID;
                    let addVoteParticipantID = addVoteMessage.participantID;
                    let addVoteForm = addVoteMessage.form;
                    let addVoteFormString = addVoteMessage.formString;
                    let addVoteFormTime = addVoteMessage.formTime;
                    //test comment for GIT. Hi Nabin!

                    let participantInfo = globalELMxArray[addVoteELMxID].vote.individualParticipantVotes[addVoteParticipantID]
                    let totalAddVoteForm =globalELMxArray[addVoteELMxID].vote.totalVoteForm[addvoteForm]
                    totalAddVoteForm = totalVoteForm[addvoteForm]+1; //incredment this form type (Turn, FreeFlow, GodMode)
                    participantInfo.currentVoting.voteForm=addVoteForm; 
                    : {
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

                    //update globalELMxArray
                    globalELMxArray[addVoteELMxID] = {"voting": {"test":"test"}} //add all fields
                    client.send(JSON.stringify(message));
                break;
                case 'changeVote':
      
                break;
                case 'removeVote':
      
                break;
                case 'voteSubmitted':
      
                break;

            }//end switch




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
