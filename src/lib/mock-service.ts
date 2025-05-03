
import { DeviceData, DeviceReading } from './types';

// Helper function to determine status based on value
const getStatus = (value: number, metric: string): 'normal' | 'warning' | 'critical' => {
  switch (metric) {
    case 'temperature':
      if (value > 80) return 'critical';
      if (value > 60) return 'warning';
      return 'normal';
    case 'humidity':
      if (value > 85) return 'critical';
      if (value > 70) return 'warning';
      return 'normal';
    case 'pressure':
      if (value > 85) return 'critical';
      if (value < 20) return 'warning';
      return 'normal';
    case 'battery':
      if (value < 20) return 'critical';
      if (value < 40) return 'warning';
      return 'normal';
    default:
      return 'normal';
  }
};

// Create a realistic value that changes gradually over time
const createRealisticValue = (
  prevValue: number,
  metric: string,
  min: number = 0,
  max: number = 99
): number => {
  // Define how much the value can change each time (smaller = more stable)
  const volatility = 0.05;
  
  // Calculate a random change with the right volatility
  const change = (Math.random() - 0.5) * 2 * volatility * (max - min);
  
  // Apply the change to the previous value
  let newValue = prevValue + change;
  
  // Sometimes introduce a "meaningful event" (5% chance)
  if (Math.random() < 0.05) {
    const eventMagnitude = (Math.random() * 0.2 + 0.1) * (max - min); // 10-30% event
    newValue = Math.random() < 0.5 ? newValue + eventMagnitude : newValue - eventMagnitude;
  }
  
  // Ensure the value stays within bounds
  newValue = Math.max(min, Math.min(max, newValue));
  
  // Round to one decimal place for cleaner display
  return Math.round(newValue * 10) / 10;
};

// Initialize device data
const initialDeviceData: DeviceData[] = [
  {
    id: 'D1V01C02T03',
    name: 'Production Sensor',
    type: 'Environmental Monitor',
    location: 'Factory Floor',
    status: 'online',
    lastUpdated: Date.now(),
    readings: {
      temperature: { timestamp: Date.now(), value: 58, status: 'normal' },
      humidity: { timestamp: Date.now(), value: 45, status: 'normal' },
      pressure: { timestamp: Date.now(), value: 67, status: 'normal' },
      battery: { timestamp: Date.now(), value: 82, status: 'normal' },
    },
    history: {
      temperature: [],
      humidity: [],
      pressure: [],
      battery: [],
    }
  },
  {
    id: 'D1V02C05T01',
    name: 'Storage Sensor',
    type: 'Environmental Monitor',
    location: 'Warehouse',
    status: 'online',
    lastUpdated: Date.now(),
    readings: {
      temperature: { timestamp: Date.now(), value: 42, status: 'normal' },
      humidity: { timestamp: Date.now(), value: 55, status: 'normal' },
      pressure: { timestamp: Date.now(), value: 72, status: 'normal' },
      battery: { timestamp: Date.now(), value: 75, status: 'normal' },
    },
    history: {
      temperature: [],
      humidity: [],
      pressure: [],
      battery: [],
    }
  }
];

// Populate initial history
initialDeviceData.forEach(device => {
  const now = Date.now();
  const metrics = ['temperature', 'humidity', 'pressure', 'battery'] as const;
  
  metrics.forEach(metric => {
    const currentValue = device.readings[metric].value;
    const history: DeviceReading[] = [];
    
    // Generate 20 historical data points at 5-second intervals
    for (let i = 0; i < 20; i++) {
      const timeOffset = (20 - i) * 5000; // 5 seconds apart, going back in time
      const timestamp = now - timeOffset;
      
      // Slightly different values for history to show realistic trends
      const variance = (Math.random() - 0.5) * 15;
      const historicalValue = Math.max(0, Math.min(99, currentValue + variance));
      const status = getStatus(historicalValue, metric);
      
      history.push({
        timestamp,
        value: historicalValue,
        status
      });
    }
    
    device.history[metric] = history;
  });
});

class MockDeviceService {
  private devices: DeviceData[];
  private listeners: ((devices: DeviceData[]) => void)[] = [];
  private updateInterval: number | null = null;
  private historySize = 20;

  constructor() {
    this.devices = JSON.parse(JSON.stringify(initialDeviceData));
  }

  // Get current device data
  getDevices(): DeviceData[] {
    return this.devices;
  }

  // Get a specific device by ID
  getDeviceById(id: string): DeviceData | undefined {
    return this.devices.find(device => device.id === id);
  }

  // Subscribe to data updates
  subscribe(listener: (devices: DeviceData[]) => void): () => void {
    this.listeners.push(listener);
    
    // Start interval if this is the first listener
    if (this.listeners.length === 1 && !this.updateInterval) {
      this.startUpdates();
    }
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
      
      // Stop interval if no more listeners
      if (this.listeners.length === 0 && this.updateInterval) {
        this.stopUpdates();
      }
    };
  }

  // Start sending updates
  private startUpdates(intervalMs: number = 2000): void {
    this.updateInterval = window.setInterval(() => {
      const now = Date.now();
      
      // Update each device
      this.devices.forEach(device => {
        // Update last updated timestamp
        device.lastUpdated = now;
        
        // Update each metric's current reading and history
        Object.keys(device.readings).forEach(metricKey => {
          const metric = metricKey as keyof typeof device.readings;
          const currentReading = device.readings[metric];
          
          // Generate new value based on previous one
          const newValue = createRealisticValue(currentReading.value, metric);
          const newStatus = getStatus(newValue, metric);
          
          // Update current reading
          device.readings[metric] = {
            timestamp: now,
            value: newValue,
            status: newStatus
          };
          
          // Add to history and maintain history size
          device.history[metric].push({
            timestamp: now,
            value: newValue,
            status: newStatus
          });
          
          if (device.history[metric].length > this.historySize) {
            device.history[metric].shift();
          }
        });
        
        // Occasionally change device status (1% chance)
        if (Math.random() < 0.01) {
          const statuses: DeviceData['status'][] = ['online', 'offline', 'maintenance'];
          const currentIndex = statuses.indexOf(device.status);
          const newStatus = statuses[(currentIndex + 1) % statuses.length];
          device.status = newStatus;
        }
      });
      
      // Notify all listeners with updated data
      this.notifyListeners();
    }, intervalMs);
  }

  // Stop sending updates
  private stopUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Notify all listeners with the current device data
  private notifyListeners(): void {
    const devicesCopy = JSON.parse(JSON.stringify(this.devices));
    this.listeners.forEach(listener => {
      try {
        listener(devicesCopy);
      } catch (error) {
        console.error("Error in device data listener:", error);
      }
    });
  }
}

// Create and export a singleton instance
export const deviceService = new MockDeviceService();
