// Install ws: npm install ws
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('A new client connected.');

  // Broadcast message to all connected clients
  ws.on('message', (message) => {
    console.log('Received: %s', message);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('A client disconnected.');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
