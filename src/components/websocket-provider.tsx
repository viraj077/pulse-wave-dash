
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { websocketService } from '@/lib/websocket-service';
import { RealTimeDeviceData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface WebSocketContextValue {
  isConnected: boolean;
  deviceData: Record<string, RealTimeDeviceData>;
  connect: (url: string) => void;
  disconnect: () => void;
  setWebSocketUrl: (url: string) => void;
  webSocketUrl: string;
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

// Check if there's a saved WebSocket URL in localStorage
const getSavedWebSocketUrl = (): string => {
  const savedUrl = localStorage.getItem('websocket_url');
  return savedUrl || 'ws://localhost:8080';
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  autoConnect = true,
  url = getSavedWebSocketUrl()
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceData, setDeviceData] = useState<Record<string, RealTimeDeviceData>>({});
  const { toast } = useToast();
  const [useMockData, setUseMockData] = useState(false);
  const [webSocketUrl, setWebSocketUrl] = useState<string>(url);
  
  // Save WebSocket URL to localStorage
  const updateWebSocketUrl = (newUrl: string) => {
    localStorage.setItem('websocket_url', newUrl);
    setWebSocketUrl(newUrl);
    
    // Disconnect from current connection
    disconnect();
    
    // Try to connect to the new URL
    connect(newUrl);
    
    toast({
      title: "WebSocket URL Updated",
      description: `Attempting to connect to: ${newUrl}`,
    });
  };

  const connect = (serverUrl: string) => {
    try {
      websocketService.connect(serverUrl);
      setIsConnected(true);
      setUseMockData(false);
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
    if (autoConnect && webSocketUrl) {
      connect(webSocketUrl);
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

    // Start mock data immediately if mockData flag is enabled
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

    // Set a timeout to switch to mock data if there's no real data after a short period
    const mockDataTimeout = setTimeout(() => {
      if (Object.keys(deviceData).length === 0) {
        setUseMockData(true);
        setIsConnected(false);
        toast({
          title: "Using Mock Data",
          description: "No WebSocket data received. Using mock data instead.",
          variant: "default",
        });
      }
    }, 2000);

    return () => {
      unsubscribe();
      disconnect();
      if (mockInterval) {
        clearInterval(mockInterval);
      }
      clearTimeout(mockDataTimeout);
    };
  }, [autoConnect, webSocketUrl, useMockData]);

  // Ensure we always have mock data if the connection fails
  useEffect(() => {
    if (useMockData) {
      const d1Data = generateMockData('D1');
      const d2Data = generateMockData('D2');
      
      setDeviceData({
        'D1': d1Data,
        'D2': d2Data
      });
    }
  }, [useMockData]);

  const value = {
    isConnected: isConnected || useMockData,
    deviceData,
    connect,
    disconnect,
    webSocketUrl,
    setWebSocketUrl: updateWebSocketUrl
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

