
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DeviceReading } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function getStatusColor(status: DeviceReading['status']) {
  switch (status) {
    case 'critical':
      return 'text-destructive';
    case 'warning':
      return 'text-warning';
    case 'normal':
      return 'text-success';
    default:
      return 'text-muted-foreground';
  }
}

export function getStatusBgColor(status: DeviceReading['status']) {
  switch (status) {
    case 'critical':
      return 'bg-destructive';
    case 'warning':
      return 'bg-warning';
    case 'normal':
      return 'bg-success';
    default:
      return 'bg-muted';
  }
}

export function getDeviceStatusColor(status: 'online' | 'offline' | 'maintenance') {
  switch (status) {
    case 'online':
      return 'text-success';
    case 'offline':
      return 'text-destructive';
    case 'maintenance':
      return 'text-warning';
    default:
      return 'text-muted-foreground';
  }
}

export function getMetricLabel(metric: string): string {
  const labels: Record<string, string> = {
    temperature: 'Temperature',
    humidity: 'Humidity',
    pressure: 'Pressure',
    battery: 'Battery'
  };
  
  return labels[metric] || metric;
}

export function getMetricUnit(metric: string): string {
  const units: Record<string, string> = {
    temperature: '°C',
    humidity: '%',
    pressure: 'kPa',
    battery: '%'
  };
  
  return units[metric] || '';
}
