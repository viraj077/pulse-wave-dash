
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DeviceReading } from '@/lib/types';
import { formatTimestamp, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricChartProps {
  data: DeviceReading[];
  metric: string;
  label: string;
  unit: string;
  className?: string;
}

export function MetricChart({
  data,
  metric,
  label,
  unit,
  className,
}: MetricChartProps) {
  // Format data for the chart
  const chartData = data.map((reading) => ({
    time: formatTimestamp(reading.timestamp),
    value: reading.value,
    timestamp: reading.timestamp,
    status: reading.status,
  }));

  // Determine chart color based on most recent status
  let chartColor = '#22c55e'; // Default: success/normal color
  if (data.length > 0) {
    const latestStatus = data[data.length - 1].status;
    if (latestStatus === 'critical') {
      chartColor = '#ef4444';
    } else if (latestStatus === 'warning') {
      chartColor = '#f59e0b';
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }} 
              tickFormatter={(time) => time.split(':')[0] + ':' + time.split(':')[1]}
              minTickGap={50}
              hide
            />
            <YAxis domain={[0, 100]} hide />
            <Tooltip 
              formatter={(value: number) => [`${value}${unit}`, label]}
              labelFormatter={(time) => time}
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: 'none',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              fillOpacity={1}
              fill={`url(#gradient-${metric})`}
              strokeWidth={2}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
