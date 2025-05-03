
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RealTimeDeviceReadingProps {
  label: string;
  value: number;
  maxValue: number;
  unit: string;
  timestamp: number;
  className?: string;
}

export function RealTimeDeviceReading({
  label,
  value,
  maxValue,
  unit,
  timestamp,
  className,
}: RealTimeDeviceReadingProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Calculate status based on value
  const getStatus = () => {
    const percentage = (value / maxValue) * 100;
    if (percentage > 80) return 'critical';
    if (percentage > 60) return 'warning';
    return 'normal';
  };
  
  const status = getStatus();

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
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{label}</span>
            <span 
              className={cn(
                "text-2xl font-bold transition-colors", 
                status === 'critical' && "text-destructive",
                status === 'warning' && "text-amber-500",
                status === 'normal' && "text-green-500"
              )}
            >
              {displayValue.toFixed(1)}{unit}
            </span>
          </div>
          
          <div className="relative h-2">
            <Progress 
              value={(displayValue / maxValue) * 100} 
              max={100} 
              className={cn(
                "h-2 transition-all",
                status === 'critical' && "bg-destructive/20",
                status === 'warning' && "bg-amber-500/20",
                status === 'normal' && "bg-green-500/20",
              )}
            />
            <div 
              className={cn(
                "absolute top-0 h-2 rounded-full transition-all",
                status === 'critical' && "bg-destructive",
                status === 'warning' && "bg-amber-500",
                status === 'normal' && "bg-green-500",
              )}
              style={{ 
                width: '4px', 
                left: `calc(${Math.min(100, Math.max(0, (displayValue / maxValue) * 100))}% - 2px)`,
              }}
            />
          </div>
          
          <div className="text-xs text-muted-foreground text-right">
            Updated: {new Date(timestamp).toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
