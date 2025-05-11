
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RealTimeDeviceReading } from '@/components/real-time-device-reading';
import { useWebSocket } from '@/components/websocket-provider';
import { ThemeToggle } from '@/components/theme-toggle';

const DeviceD1 = () => {
  const { deviceData, isConnected } = useWebSocket();
  const d1Data = deviceData['D1'];
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button asChild variant="ghost" className="-ml-3">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <ThemeToggle />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Device D1 - Real-time Data</h1>
              <p className="text-muted-foreground mt-1">
                Live monitoring of device D1 {isConnected ? "(Connected)" : "(Using Mock Data)"}
              </p>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="space-y-6">
          {d1Data ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Device Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-2">
                    Device ID: <span className="font-bold">{d1Data.deviceId}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last update: {new Date(d1Data.timestamp).toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RealTimeDeviceReading 
                  label="Voltage"
                  value={d1Data.voltage}
                  maxValue={99}
                  unit="V"
                  timestamp={d1Data.timestamp}
                />
                
                <RealTimeDeviceReading 
                  label="Current"
                  value={d1Data.current}
                  maxValue={99}
                  unit="A"
                  timestamp={d1Data.timestamp}
                />
                
                <RealTimeDeviceReading 
                  label="Temperature"
                  value={d1Data.temperature}
                  maxValue={99}
                  unit="°C"
                  timestamp={d1Data.timestamp}
                />
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="h-4 w-4 rounded-full bg-primary/20 animate-ping mb-4" />
                <p className="text-muted-foreground mb-2">Initializing data for device D1...</p>
                <p className="text-xs text-muted-foreground">Data will appear automatically when available</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default DeviceD1;
