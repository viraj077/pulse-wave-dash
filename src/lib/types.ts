
export interface DeviceReading {
  timestamp: number;
  value: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface DeviceData {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  lastUpdated: number;
  readings: {
    temperature: DeviceReading;
    humidity: DeviceReading;
    pressure: DeviceReading;
    battery: DeviceReading;
  };
  history: {
    temperature: DeviceReading[];
    humidity: DeviceReading[];
    pressure: DeviceReading[];
    battery: DeviceReading[];
  };
}
