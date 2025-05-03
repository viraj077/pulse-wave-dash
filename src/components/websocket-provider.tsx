
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { websocketService } from '@/lib/websocket-service';
import { RealTimeDeviceData } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

interface WebSocketContextValue {
  isConnected: boolean;
  deviceData: Record<string, RealTimeDeviceData>;
  connect: (url: string) => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
  url?: string;
}

// Mock data to use when WebSocket connection fails
const generateMockData = (deviceId: string): RealTimeDeviceData => {
  return {
    deviceId,
    voltage: Math.floor(Math.random() * 99),
    current: Math.floor(Math.random() * 99),
    temperature: Math.floor(Math.random() * 99),
    timestamp: Date.now()
  };
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  autoConnect = true,
  url = 'ws://localhost:8080'
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceData, setDeviceData] = useState<Record<string, RealTimeDeviceData>>({});
  const { toast } = useToast();
  const [useMockData, setUseMockData] = useState(false);

  const connect = (serverUrl: string) => {
    try {
      websocketService.connect(serverUrl);
      setIsConnected(true);
      toast({
        title: "WebSocket Connected",
        description: "Successfully connected to the device server.",
      });
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
      setUseMockData(true);
      toast({
        title: "Connection Failed",
        description: "Using mock data since WebSocket server is not available.",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    websocketService.disconnect();
    setIsConnected(false);
  };

  useEffect(() => {
    if (autoConnect && url) {
      connect(url);
    }

    const unsubscribe = websocketService.subscribe((deviceId, voltage, current, temperature) => {
      const timestamp = Date.now();
      
      setDeviceData(prevData => ({
        ...prevData,
        [deviceId]: {
          deviceId,
          voltage,
          current,
          temperature,
          timestamp
        }
      }));
    });

    // Use mock data if WebSocket connection fails
    let mockInterval: NodeJS.Timeout | null = null;
    if (useMockData) {
      mockInterval = setInterval(() => {
        const d1Data = generateMockData('D1');
        const d2Data = generateMockData('D2');
        
        setDeviceData(prevData => ({
          ...prevData,
          'D1': d1Data,
          'D2': d2Data
        }));
      }, 1500);
    }

    return () => {
      unsubscribe();
      disconnect();
      if (mockInterval) {
        clearInterval(mockInterval);
      }
    };
  }, [autoConnect, url, useMockData]);

  // Start using mock data if max reconnection attempts are reached
  useEffect(() => {
    const maxReconnectTimeout = setTimeout(() => {
      // If no data after 5 seconds, switch to mock data
      if (Object.keys(deviceData).length === 0) {
        setUseMockData(true);
        setIsConnected(false);
        toast({
          title: "Using Mock Data",
          description: "WebSocket connection not established. Using mock data instead.",
          variant: "default",
        });
      }
    }, 5000);
    
    return () => clearTimeout(maxReconnectTimeout);
  }, []);

  const value = {
    isConnected: isConnected || useMockData,
    deviceData,
    connect,
    disconnect
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
