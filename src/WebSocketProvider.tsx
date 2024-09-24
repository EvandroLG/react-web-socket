import React, { createContext, useRef, useEffect, useState } from 'react';
import {
  WebSocketContextType,
  WebSocketMessage,
  WebSocketProviderProps,
  WebSocketStatus,
} from './types';

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ url, children }: WebSocketProviderProps) {
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>(WebSocketStatus.CONNECTING);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log('useEffect: Setting up WebSocket connection');
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setStatus(WebSocketStatus.OPEN);
    };

    ws.onmessage = (e) => {
      console.log('WebSocket message:', e.data);
      setLastMessage(JSON.parse(e.data));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError(new Error('WebSocket error'));
      setStatus(WebSocketStatus.CLOSED);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setStatus(WebSocketStatus.CLOSED);
    };

    wsRef.current = ws;

    return () => {
      console.log('Cleaning up WebSocket connection');
      ws.close();
    };
  }, [url]);

  const sendMessage = (message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ lastMessage, sendMessage, status, error }}>
      {children}
    </WebSocketContext.Provider>
  );
}
