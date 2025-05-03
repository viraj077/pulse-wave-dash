
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeviceData } from "@/lib/types";
import { MetricGauge } from "./metric-gauge";
import { DeviceStatus } from "./device-status";
import { formatTimestamp, getMetricLabel, getMetricUnit } from "@/lib/utils";
import { ArrowRight, Gauge } from "lucide-react";
import { Link } from "react-router-dom";

interface DeviceCardProps {
  device: DeviceData;
  className?: string;
}

export function DeviceCard({ device, className }: DeviceCardProps) {
  const metrics = ['temperature', 'humidity', 'pressure', 'battery'] as const;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{device.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              {device.type} • {device.location}
            </CardDescription>
          </div>
          <DeviceStatus status={device.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <MetricGauge
            key={metric}
            value={device.readings[metric].value}
            status={device.readings[metric].status}
            label={getMetricLabel(metric)}
            unit={getMetricUnit(metric)}
          />
        ))}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 text-sm text-muted-foreground">
        <span>ID: {device.id}</span>
        <Button asChild variant="ghost" className="p-0 h-auto" size="sm">
          <Link to={`/device/${device.id}`}>
            <span className="flex items-center gap-1">
              Details <ArrowRight className="h-3 w-3 ml-1" />
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
