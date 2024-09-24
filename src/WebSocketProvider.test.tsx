import React from 'react';
import { render, act } from '@testing-library/react';
import { WebSocketContext, WebSocketProvider } from './WebSocketProvider';
import { WebSocketStatus } from './types';

console.error = jest.fn();

class MockWebSocket {
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((error: Event) => void) | null = null;
  onclose: (() => void) | null = null;
  readyState: number = WebSocket.CONNECTING;
  send: jest.Mock = jest.fn();
  close: jest.Mock = jest.fn();

  constructor(public url: string) {}

  triggerOpen() {
    this.readyState = WebSocket.OPEN;
    this.onopen?.();
  }
}

let mockWebSocketInstance: MockWebSocket;

const mockWebSocketConstructor = jest.fn((url: string) => {
  mockWebSocketInstance = new MockWebSocket(url);
  return mockWebSocketInstance;
});

global.WebSocket = mockWebSocketConstructor as unknown as jest.MockedClass<typeof WebSocket>;

describe('WebSocketProvider', () => {
  const url = 'ws://localhost:3000';

  test('sets up a WebSocket connection', () => {
    render(<WebSocketProvider url={url}>Test</WebSocketProvider>);

    expect(global.WebSocket).toHaveBeenCalledWith(url);
  });

  test('updates status when WebSocket is connected', () => {
    let contextValue: undefined | { status: WebSocketStatus };

    render(
      <WebSocketProvider url={url}>
        <WebSocketContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </WebSocketContext.Consumer>
      </WebSocketProvider>
    );

    expect(contextValue?.status).toBe(WebSocketStatus.CONNECTING);

    act(() => {
      mockWebSocketInstance.triggerOpen();
    });

    expect(contextValue?.status).toBe(WebSocketStatus.OPEN);
  });

  test('cleans up WebSocket connection', () => {
    const { unmount } = render(<WebSocketProvider url={url}>Test</WebSocketProvider>);
    expect(mockWebSocketInstance.close).not.toHaveBeenCalled();
    unmount();

    expect(mockWebSocketInstance.close).toHaveBeenCalled();
  });

  test('updates lastMessage when WebSocket receives a message', () => {
    let contextValue: undefined | { lastMessage: { type: string; data: unknown } | null };

    render(
      <WebSocketProvider url={url}>
        <WebSocketContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </WebSocketContext.Consumer>
      </WebSocketProvider>
    );

    const message = { type: 'test', data: 'test data' };

    act(() => {
      mockWebSocketInstance.onmessage?.({ data: JSON.stringify(message) });
    });

    expect(contextValue?.lastMessage).toEqual(message);
  });

  test('sets error and update status on WebSocket error', () => {
    let contextValue: undefined | { error: Error | null; status: WebSocketStatus };

    render(
      <WebSocketProvider url={url}>
        <WebSocketContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </WebSocketContext.Consumer>
      </WebSocketProvider>
    );

    const error = new Error();

    act(() => {
      mockWebSocketInstance.onerror?.(error as unknown as Event);
    });

    expect(contextValue?.error).toBeInstanceOf(Error);
    expect(contextValue?.error?.message).toBe('WebSocket error');
    expect(contextValue?.status).toBe(WebSocketStatus.CLOSED);
  });

  test('updates status when WebSocket is closed', () => {
    let contextValue: undefined | { status: WebSocketStatus };

    render(
      <WebSocketProvider url={url}>
        <WebSocketContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </WebSocketContext.Consumer>
      </WebSocketProvider>
    );

    act(() => {
      mockWebSocketInstance.onclose?.();
    });

    expect(contextValue?.status).toBe(WebSocketStatus.CLOSED);
  });

  test('sendMessage sends a message when WebSocket is open', () => {
    let contextValue: undefined | { sendMessage: (message: object) => void };

    render(
      <WebSocketProvider url={url}>
        <WebSocketContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </WebSocketContext.Consumer>
      </WebSocketProvider>
    );

    act(() => {
      mockWebSocketInstance.triggerOpen();
    });

    act(() => {
      contextValue?.sendMessage({ test: 'test' });
    });

    expect(mockWebSocketInstance.send).toHaveBeenCalledWith('{"test":"test"}');
  });
});
