
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useWebSocket } from '@/components/websocket-provider';
import { RealTimeDeviceReading } from '@/components/real-time-device-reading';
import { ThemeToggle } from '@/components/theme-toggle';

const DeviceD2 = () => {
  const { deviceData } = useWebSocket();
  const d2Data = deviceData['D2'];
  
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
              <h1 className="text-2xl font-bold">Device D2 - Real-time Data</h1>
              <p className="text-muted-foreground mt-1">
                Live monitoring of device D2
              </p>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="space-y-6">
          {d2Data ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Device Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-2">
                    Device ID: <span className="font-bold">{d2Data.deviceId}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last update: {new Date(d2Data.timestamp).toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RealTimeDeviceReading 
                  label="Voltage"
                  value={d2Data.voltage}
                  maxValue={99}
                  unit="V"
                  timestamp={d2Data.timestamp}
                />
                
                <RealTimeDeviceReading 
                  label="Current"
                  value={d2Data.current}
                  maxValue={99}
                  unit="A"
                  timestamp={d2Data.timestamp}
                />
                
                <RealTimeDeviceReading 
                  label="Temperature"
                  value={d2Data.temperature}
                  maxValue={99}
                  unit="°C"
                  timestamp={d2Data.timestamp}
                />
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">Waiting for data from device D2...</p>
                <div className="h-4 w-4 rounded-full bg-primary/20 animate-ping" />
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default DeviceD2;
