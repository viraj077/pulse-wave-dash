
# PulseWaveDash - Real-time Device Monitoring Dashboard

A real-time dashboard for monitoring device data from multiple sources, including WebSocket connections for live sensor data.

## Features

- Real-time data visualization from WebSocket connection
- Display of device data in the format D1VxxCyyTzz and D2VxxCyyTzz
- Clean, responsive UI with dark/light theme support
- Separate detailed views for each device
- Animated gauges for metric visualization

## Technology Stack

- Frontend: React, TypeScript, Tailwind CSS, shadcn/ui
- WebSocket client for real-time data
- Node.js WebSocket server for data simulation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pulsewavdash
```

2. Install dependencies
```bash
npm install
# or
yarn
```

### Running the Frontend

```bash
npm run dev
# or
yarn dev
```

The frontend will start on http://localhost:5173

### Running the WebSocket Server

```bash
# Install ws package if not already installed
npm install ws

# Run the server
node server/websocket-server.js
```

The WebSocket server will start on ws://localhost:8080

## Data Format

The WebSocket server sends data in the following format:

- `D1VxxCyyTzz` or `D2VxxCyyTzz`

Where:
- `D1` / `D2`: Device ID
- `Vxx`: Voltage (value between 0–99)
- `Cyy`: Current (value between 0–99)
- `Tzz`: Temperature (value between 0–99)

Example: `D1V75C30T22` represents Device 1 with Voltage 75, Current 30, and Temperature 22.

## Project Structure

- `src/` - Frontend source code
  - `components/` - Reusable React components
  - `pages/` - Application pages/routes
  - `lib/` - Utilities, services, and types
- `server/` - WebSocket server implementation

## Navigation

- Dashboard (`/`): Overview of all devices with real-time data
- Device Detail (`/device/:id`): Detailed view of a specific device
- Device D2 (`/device-d2`): Dedicated page for Device D2 as required

## License

This project is licensed under the MIT License - see the LICENSE file for details.
