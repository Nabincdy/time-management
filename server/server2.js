
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
let votertime =  'votertime';
let votetype = 'votetype';
let voteresult = 'voteresult';



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
                }
            });
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
