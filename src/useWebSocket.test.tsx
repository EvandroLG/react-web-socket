import React from 'react';
import { render } from '@testing-library/react';
import { WebSocketProvider } from './WebSocketProvider';
import { useWebSocket } from './useWebSocket';

console.error = jest.fn();

describe('useWebSocket', () => {
  test('throw an error when used outside of WebSocketProvider', () => {
    const Component = () => {
      useWebSocket();
      return null;
    };

    expect(() => render(<Component />)).toThrow(
      'useWebSocket must be used within a WebSocketProvider'
    );
  });

  test('returns the context when used within WebSocketProvider', () => {
    const Component = () => {
      const context = useWebSocket();
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
