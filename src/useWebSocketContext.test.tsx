import React from 'react';
import { render } from '@testing-library/react';
import { WebSocketProvider } from './WebSocketContext';
import { useWebSocketContext } from './useWebSocketContext';

console.error = jest.fn();

describe('useWebSocketContext', () => {
  test('throw an error when used outside of WebSocketProvider', () => {
    const Component = () => {
      useWebSocketContext();
      return null;
    };

    expect(() => render(<Component />)).toThrow(
      'useWebSocketContext must be used within a WebSocketProvider'
    );
  });

  test('returns the context when used within WebSocketProvider', () => {
    const Component = () => {
      const context = useWebSocketContext();
      expect(context).toBeDefined();
      expect(context.sendMessage).toBeDefined();
      expect(context.status).toBeDefined();
      expect(context.error).toBeDefined();
      expect(context.lastMessage).toBeDefined();

      return null;
    };

    render(
      <WebSocketProvider url="ws://localhost:3000">
        <Component />
      </WebSocketProvider>
    );
  });
});
