
type DeviceDataCallback = (deviceId: string, voltage: number, current: number, temperature: number) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Set<DeviceDataCallback> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000; // ms
  
  connect(url: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) return;
    
    try {
      this.socket = new WebSocket(url);
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = event.data as string;
          // Parse data in format D1VxxCyyTzz or D2VxxCyyTzz
          const match = data.match(/^(D[12])V(\d{2})C(\d{2})T(\d{2})$/);
          
          if (match) {
            const [_, deviceId, voltageStr, currentStr, temperatureStr] = match;
            const voltage = parseInt(voltageStr, 10);
            const current = parseInt(currentStr, 10);
            const temperature = parseInt(temperatureStr, 10);
            
            // Notify all listeners with the parsed data
            this.notifyListeners(deviceId, voltage, current, temperature);
          } else {
            console.error('Invalid data format:', data);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed', event);
        this.attemptReconnect(url);
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (this.socket) {
          this.socket.close();
        }
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      this.attemptReconnect(url);
      throw new Error('WebSocket connection failed');
    }
  }
  
  private attemptReconnect(url: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect(url);
    }, this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1)); // Exponential backoff
  }
  
  subscribe(callback: DeviceDataCallback): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }
  
  private notifyListeners(deviceId: string, voltage: number, current: number, temperature: number): void {
    this.listeners.forEach(listener => {
      try {
        listener(deviceId, voltage, current, temperature);
      } catch (error) {
        console.error('Error in device data listener:', error);
      }
    });
  }
  
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.listeners.clear();
  }
}

// Export a singleton instance
export const websocketService = new WebSocketService();

