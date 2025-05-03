
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn, getStatusColor } from "@/lib/utils";
import { DeviceReading } from "@/lib/types";

interface MetricGaugeProps {
  value: number;
  status: DeviceReading["status"];
  label: string;
  unit: string;
  className?: string;
}

export function MetricGauge({
  value,
  status,
  label,
  unit,
  className,
}: MetricGaugeProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate the gauge on value change
  useEffect(() => {
    const animationDuration = 800; // ms
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;
    const difference = endValue - startValue;
    
    if (Math.abs(difference) < 0.1) {
      setDisplayValue(value);
      return;
    }

    const animateValue = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed < animationDuration) {
        const progress = elapsed / animationDuration;
        // Easing function for smooth animation
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        setDisplayValue(startValue + difference * eased);
        requestAnimationFrame(animateValue);
      } else {
        setDisplayValue(endValue);
      }
    };
    
    requestAnimationFrame(animateValue);
  }, [value]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span 
          className={cn(
            "text-sm font-bold transition-colors", 
            getStatusColor(status)
          )}
        >
          {displayValue.toFixed(1)}{unit}
        </span>
      </div>
      <div className="relative h-2">
        <Progress 
          value={displayValue} 
          max={100} 
          className={cn(
            "h-2 transition-all",
            status === 'critical' && "bg-destructive/20",
            status === 'warning' && "bg-warning/20",
            status === 'normal' && "bg-success/20",
          )}
        />
        <div 
          className={cn(
            "absolute top-0 h-2 rounded-full transition-all",
            status === 'critical' && "bg-destructive",
            status === 'warning' && "bg-warning",
            status === 'normal' && "bg-success",
          )}
          style={{ 
            width: '4px', 
            left: `calc(${Math.min(100, Math.max(0, displayValue))}% - 2px)`,
          }}
        />
      </div>
    </div>
  );
}
