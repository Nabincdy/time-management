
// this is server code dont edit over here their is another file name index.js


const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8082 });

wss.on("connection", ws => {
    console.log("New Client Connected");

    ws.on("message", data => {
        const message = data instanceof Buffer ? data.toString() : data; // Convert buffer to string if needed
        console.log(`Client sent: ${message}`);

        // Broadcast message to all connected clients (including sender)
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => {
        console.log("Client Disconnected");
    });
});

console.log("WebSocket Server running on ws://localhost:8082");

