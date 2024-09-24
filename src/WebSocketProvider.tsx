import React, { createContext, useRef, useEffect, useState } from 'react';
import {
  WebSocketContextType,
  WebSocketMessage,
  WebSocketProviderProps,
  WebSocketStatus,
} from './types';

/**
 * Context for managing WebSocket connections and providing WebSocket-related data and methods.
 */
export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

/**
 * WebSocketProvider component that manages a WebSocket connection and provides the
 * connection state, last received message, and methods to send messages via WebSocket.
 *
 * @param props - The props for the WebSocketProvider component.
 *
 * @example
 * ```tsx
 * <WebSocketProvider url="wss://example.com">
 *   <YourComponent />
 * </WebSocketProvider>
 * ```
 *
 * @remarks
 * The WebSocketProvider automatically connects to the given WebSocket URL and manages
 * connection status, error handling, and message transmission.
 */
export function WebSocketProvider({ url, children }: WebSocketProviderProps) {
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>(WebSocketStatus.CONNECTING);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setStatus(WebSocketStatus.OPEN);
    };

    ws.onmessage = (e) => {
      setLastMessage(JSON.parse(e.data));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError(new Error('WebSocket error'));
      setStatus(WebSocketStatus.CLOSED);
    };

    ws.onclose = () => {
      setStatus(WebSocketStatus.CLOSED);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [url]);

  /**
   * Sends a message through the WebSocket connection.
   *
   * @param message - The message to be sent.
   */
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
