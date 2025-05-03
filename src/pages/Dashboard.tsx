
import { useState, useEffect } from 'react';
import { DeviceData } from '@/lib/types';
import { deviceService } from '@/lib/mock-service';
import { DeviceCard } from '@/components/device-card';
import { ThemeToggle } from '@/components/theme-toggle';
import { formatTimestamp } from '@/lib/utils';
import { RefreshCw, Gauge } from 'lucide-react';

const Dashboard = () => {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  
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
            <div className="text-sm text-muted-foreground hidden md:block">
              Last updated: {formatTimestamp(lastUpdate)}
            </div>
            <ThemeToggle />
          </div>
        </header>
        
        {/* Main content */}
        <main>
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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
