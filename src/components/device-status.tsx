
import { cn, getDeviceStatusColor } from "@/lib/utils";

interface DeviceStatusProps {
  status: 'online' | 'offline' | 'maintenance';
  className?: string;
}

export function DeviceStatus({ status, className }: DeviceStatusProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span 
        className={cn(
          "relative flex h-3 w-3",
          status === 'online' && "animate-ping-slow"
        )}
      >
        <span 
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75",
            status === 'online' && "bg-success",
            status === 'offline' && "bg-destructive",
            status === 'maintenance' && "bg-warning"
          )}
        />
        <span 
          className={cn(
            "relative inline-flex rounded-full h-3 w-3",
            status === 'online' && "bg-success",
            status === 'offline' && "bg-destructive",
            status === 'maintenance' && "bg-warning"
          )}
        />
      </span>
      <span className={cn("text-sm font-medium capitalize", getDeviceStatusColor(status))}>
        {status}
      </span>
    </div>
  );
}
