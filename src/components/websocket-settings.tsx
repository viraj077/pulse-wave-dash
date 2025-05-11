
import { useState } from 'react';
import { useWebSocket } from './websocket-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface WebSocketSettingsProps {
  className?: string;
}

export function WebSocketSettings({ className }: WebSocketSettingsProps) {
  const { webSocketUrl, setWebSocketUrl, isConnected } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState(webSocketUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWebSocketUrl(url);
  };

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          WebSocket Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="websocket-url" className="text-sm text-muted-foreground block mb-2">
              WebSocket Server URL
            </label>
            <Input
              id="websocket-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ws://localhost:8080"
              className="w-full"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <span className="text-sm">Status:</span>
              <div className={`ml-2 w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="ml-2 text-sm">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? 'Live data streaming' : 'Using mock data'}
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Close
        </Button>
        <Button onClick={handleSubmit}>
          Apply Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
