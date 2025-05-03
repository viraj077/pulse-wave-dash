
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DeviceData } from '@/lib/types';
import { deviceService } from '@/lib/mock-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeviceStatus } from '@/components/device-status';
import { MetricChart } from '@/components/metric-chart';
import { MetricGauge } from '@/components/metric-gauge';
import { formatDate, formatTimestamp, getMetricLabel, getMetricUnit } from '@/lib/utils';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const DeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [device, setDevice] = useState<DeviceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    // Initial load
    const initialDevice = deviceService.getDeviceById(id);
    if (initialDevice) {
      setDevice(initialDevice);
    }
    
    // Subscribe to updates
    const unsubscribe = deviceService.subscribe((devices) => {
      const updatedDevice = devices.find(d => d.id === id);
      if (updatedDevice) {
        setDevice(updatedDevice);
        setIsLoading(false);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [id]);
  
  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Device Not Found</h1>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const metrics = ['temperature', 'humidity', 'pressure', 'battery'] as const;
  
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
                {device.name}
                {isLoading && (
                  <RefreshCw className="h-4 w-4 ml-2 animate-spin text-muted-foreground" />
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                {device.type} • {device.location} • ID: {device.id}
              </p>
            </div>
            <DeviceStatus status={device.status} className="mt-2 md:mt-0" />
          </div>
        </header>
        
        {/* Main content */}
        <main className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Current Readings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.map(metric => (
                <Card key={metric} className="animate-slide-in">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{getMetricLabel(metric)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MetricGauge
                      value={device.readings[metric].value}
                      status={device.readings[metric].status}
                      label={getMetricLabel(metric)}
                      unit={getMetricUnit(metric)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Historical Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.map(metric => (
                <MetricChart
                  key={metric}
                  data={device.history[metric]}
                  metric={metric}
                  label={getMetricLabel(metric)}
                  unit={getMetricUnit(metric)}
                  className="animate-slide-in"
                />
              ))}
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Device Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                <div>
                  <dt className="text-sm text-muted-foreground">Device Type</dt>
                  <dd className="font-medium">{device.type}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Location</dt>
                  <dd className="font-medium">{device.location}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Device ID</dt>
                  <dd className="font-medium">{device.id}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Last Updated</dt>
                  <dd className="font-medium">
                    {formatDate(device.lastUpdated)} {formatTimestamp(device.lastUpdated)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DeviceDetail;
