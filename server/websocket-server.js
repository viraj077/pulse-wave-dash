
const WebSocket = require('ws');

// Create a new WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Function to generate random number between min and max (inclusive)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate device data in format DxVxxCyyTzz
function generateDeviceData(deviceId) {
  const voltage = getRandomInt(0, 99).toString().padStart(2, '0');
  const current = getRandomInt(0, 99).toString().padStart(2, '0');
  const temperature = getRandomInt(0, 99).toString().padStart(2, '0');
  
  return `${deviceId}V${voltage}C${current}T${temperature}`;
}

// Connection handler
wss.on('connection', function connection(ws) {
  console.log('Client connected');
  
  // Send welcome message
  ws.send('Connected to WebSocket server');
  
  // Set up interval to send data every 1-2 seconds
  const intervalD1 = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(generateDeviceData('D1'));
    } else {
      clearInterval(intervalD1);
    }
  }, 1000 + Math.random() * 1000); // Random interval between 1-2 seconds
  
  const intervalD2 = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(generateDeviceData('D2'));
    } else {
      clearInterval(intervalD2);
    }
  }, 1000 + Math.random() * 1000); // Random interval between 1-2 seconds
  
  // Handle client disconnection
  ws.on('close', function close() {
    console.log('Client disconnected');
    clearInterval(intervalD1);
    clearInterval(intervalD2);
  });
  
  ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
    clearInterval(intervalD1);
    clearInterval(intervalD2);
  });
});

console.log('WebSocket server started on ws://localhost:8080');
