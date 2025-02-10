const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = 8080;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the vote.html as the default route (when users visit http://localhost:8080)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../vote.html'));
    
});

// Create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');

    ws.on('message', (message) => {
        console.log('Received message:', message);
        const data = JSON.parse(message);

        // Broadcast messages to all connected clients
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Connection closed');
    });
});

// Handle WebSocket upgrade requests (WebSocket + HTTP server on same port)
app.server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
