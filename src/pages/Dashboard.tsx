
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DeviceData } from '@/lib/types';
import { deviceService } from '@/lib/mock-service';
import { DeviceCard } from '@/components/device-card';
import { ThemeToggle } from '@/components/theme-toggle';
import { formatTimestamp } from '@/lib/utils';
import { RefreshCw, Gauge } from 'lucide-react';
import { useWebSocket } from '@/components/websocket-provider';
import { RealTimeDeviceReading } from '@/components/real-time-device-reading';
import { WebSocketSettings } from '@/components/websocket-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const { deviceData, isConnected } = useWebSocket();
  
  useEffect(() => {
    // Subscribe to device updates
    setIsLoading(true);
    const unsubscribe = deviceService.subscribe((updatedDevices) => {
      setDevices(updatedDevices);
      setLastUpdate(Date.now());
      setIsLoading(false);
    });
    
    // Clean up subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Gauge className="h-7 w-7 mr-2 text-primary" />
            <h1 className="text-2xl font-bold">PulseWaveDash</h1>
          </div>
          <div className="flex items-center gap-4">
            <WebSocketSettings />
            <div className="text-sm text-muted-foreground hidden md:block">
              Last updated: {formatTimestamp(lastUpdate)}
            </div>
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
            <ThemeToggle />
          </div>
        </header>
        
        {/* WebSocket Real-time data section */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              WebSocket Real-time Data
              {isConnected && <span className="ml-2 text-xs text-green-500">Connected</span>}
              {!isConnected && <span className="ml-2 text-xs text-red-500">Disconnected</span>}
            </h2>
            <p className="text-muted-foreground">
              Live data from device sensors via WebSocket connection
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* D1 Data Card */}
            {deviceData['D1'] ? (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">Device D1</CardTitle>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/device-d1">View Details</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <RealTimeDeviceReading 
                      label="Voltage"
                      value={deviceData['D1'].voltage}
                      maxValue={99}
                      unit="V"
                      timestamp={deviceData['D1'].timestamp}
                    />
                    <RealTimeDeviceReading 
                      label="Current"
                      value={deviceData['D1'].current}
                      maxValue={99}
                      unit="A"
                      timestamp={deviceData['D1'].timestamp}
                    />
                    <RealTimeDeviceReading 
                      label="Temperature"
                      value={deviceData['D1'].temperature}
                      maxValue={99}
                      unit="°C"
                      timestamp={deviceData['D1'].timestamp}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Device D1</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-10">
                  <p className="text-muted-foreground">Waiting for data...</p>
                </CardContent>
              </Card>
            )}
            
            {/* D2 Data Card */}
            {deviceData['D2'] ? (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">Device D2</CardTitle>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/device-d2">View Details</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <RealTimeDeviceReading 
                      label="Voltage"
                      value={deviceData['D2'].voltage}
                      maxValue={99}
                      unit="V"
                      timestamp={deviceData['D2'].timestamp}
                    />
                    <RealTimeDeviceReading 
                      label="Current"
                      value={deviceData['D2'].current}
                      maxValue={99}
                      unit="A"
                      timestamp={deviceData['D2'].timestamp}
                    />
                    <RealTimeDeviceReading 
                      label="Temperature"
                      value={deviceData['D2'].temperature}
                      maxValue={99}
                      unit="°C"
                      timestamp={deviceData['D2'].timestamp}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Device D2</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-10">
                  <p className="text-muted-foreground">Waiting for data...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
        
        {/* Legacy Device section */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              Device Overview
              {isLoading && (
                <RefreshCw className="h-4 w-4 ml-2 animate-spin text-muted-foreground" />
              )}
            </h2>
            <p className="text-muted-foreground">
              Real-time monitoring of environmental sensors
            </p>
          </div>
          
          {/* Device Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} className="animate-fade-in" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
