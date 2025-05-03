
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

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  autoConnect = true,
  url = 'ws://localhost:8080'
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceData, setDeviceData] = useState<Record<string, RealTimeDeviceData>>({});
  const { toast } = useToast();

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
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the device server.",
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

    return () => {
      unsubscribe();
      disconnect();
    };
  }, [autoConnect, url]);

  const value = {
    isConnected,
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
