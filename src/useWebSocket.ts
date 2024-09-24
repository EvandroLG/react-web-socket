import { useContext } from 'react';
import { WebSocketContext } from './WebSocketProvider';

/**
 * Custom hook to access the WebSocket context.
 *
 * This hook provides access to the WebSocket connection state, the last received message,
 * the sendMessage function, and any errors related to the WebSocket connection.
 *
 * @returns The WebSocket context, which includes:
 * - `lastMessage`: The last message received via WebSocket.
 * - `sendMessage`: A function to send messages through the WebSocket.
 * - `status`: The current status of the WebSocket connection (connecting, open, or closed).
 * - `error`: Any error encountered during the WebSocket connection lifecycle.
 *
 * @throws Will throw an error if used outside of a `WebSocketProvider`.
 *
 * @example
 * ```tsx
 * const { lastMessage, sendMessage, status, error } = useWebSocket();
 * ```
 */
export function useWebSocket() {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  return context;
}
