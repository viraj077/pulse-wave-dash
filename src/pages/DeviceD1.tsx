
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { RealTimeDeviceReading } from '@/components/real-time-device-reading';
import { useWebSocket } from '@/components/websocket-provider';
import { formatTimestamp } from '@/lib/utils';

const DeviceD1 = () => {
  const { deviceData, isConnected } = useWebSocket();
  const deviceId = 'D1';
  const device = deviceData[deviceId];
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="mb-6">
          <Button asChild variant="ghost" className="mb-4 -ml-3">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                Device {deviceId} - Real-time Data
                <div className={`ml-3 w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </h1>
              <p className="text-muted-foreground mt-1">
                Power management device • Device ID: {deviceId}
              </p>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="space-y-6">
          {device ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RealTimeDeviceReading
                label="Voltage"
                value={device.voltage}
                maxValue={99}
                unit="V"
                timestamp={device.timestamp}
                className="animate-fade-in"
              />
              <RealTimeDeviceReading
                label="Current"
                value={device.current}
                maxValue={99}
                unit="A"
                timestamp={device.timestamp}
                className="animate-fade-in"
              />
              <RealTimeDeviceReading
                label="Temperature"
                value={device.temperature}
                maxValue={99}
                unit="°C"
                timestamp={device.timestamp}
                className="animate-fade-in"
              />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Device Data</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-10">
                <p className="text-muted-foreground">Waiting for data...</p>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Device Information</h2>
            <Card>
              <CardContent className="pt-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                  <div>
                    <dt className="text-sm text-muted-foreground">Device Type</dt>
                    <dd className="font-medium">Power Monitor</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Location</dt>
                    <dd className="font-medium">Main Control Room</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Device ID</dt>
                    <dd className="font-medium">{deviceId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Last Updated</dt>
                    <dd className="font-medium">
                      {device ? formatTimestamp(device.timestamp) : 'No data yet'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
          
        </main>
      </div>
    </div>
  );
};

export default DeviceD1;
