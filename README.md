# react-web-socket &middot; [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

**react-web-socket** is a lightweight React provider that integrates WebSocket functionality into your React application, allowing you to easily manage WebSocket connections, send and receive messages, and track connection status using React hooks and context.

## Features

- Simple WebSocket integration for React applications.
- Easily send and receive messages.
- Track WebSocket connection status (connecting, open, closed).
- Handle WebSocket errors.
- Written in TypeScript for type safety.

## Installation

To install the package, run:

```bash
npm install @evandrolg/react-web-socket
```

## Usage

### WebSocketProvider

Wrap your application (or a part of it) with the `WebSocketProvider` to provide WebSocket context to your components.

```tsx
import React from 'react';
import { WebSocketProvider } from 'react-web-socket';

const App = () => {
  return (
    <WebSocketProvider url="wss://your-websocket-url">
      <YourComponent />
    </WebSocketProvider>
  );
};

export default App;
```

### useWebSocket Hook

The `useWebSocket` hook allows you to access WebSocket state and send messages from within your components.

```tsx
import React, { useEffect } from 'react';
import { useWebSocket } from 'react-web-socket';

const YourComponent = () => {
  const { lastMessage, sendMessage, status, error } = useWebSocket();

  useEffect(() => {
    if (lastMessage) {
      console.log('Received:', lastMessage);
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    sendMessage({ type: 'HELLO', content: 'Hello, WebSocket!' });
  };

  return (
    <div>
      <h1>WebSocket Status: {status}</h1>
      {error && <p>Error: {error.message}</p>}
      <button onClick={handleSendMessage}>Send Message</button>
      {lastMessage && <p>Last Message: {JSON.stringify(lastMessage)}</p>}
    </div>
  );
};

export default YourComponent;
```

## API

### WebSocketProvider

The `WebSocketProvider` component provides the WebSocket context to your application.

#### Props:

- `url` (string, required): The WebSocket server URL.
- `children` (ReactNode, required): The child components that will have access to the WebSocket context.

### useWebSocket

The `useWebSocket` hook gives access to WebSocket functionality.

#### Returns:

- `lastMessage`: The most recent WebSocket message received (parsed as JSON).
- `sendMessage(message: object)`: Sends a JSON message through the WebSocket connection.
- `status`: The current status of the WebSocket connection (`CONNECTING`, `OPEN`, or `CLOSED`).
- `error`: Any WebSocket error that may have occurred.

## WebSocket Status Enum

The `WebSocketStatus` enum can have the following values:

- `CONNECTING`: The WebSocket connection is in the process of being established.
- `OPEN`: The WebSocket connection is open and ready to communicate.
- `CLOSED`: The WebSocket connection is closed.

## Example

Here's a full example of how to use **react-web-socket** in your project:

```tsx
import React, { useEffect } from 'react';
import { WebSocketProvider, useWebSocket } from 'react-web-socket';

const WebSocketComponent = () => {
  const { lastMessage, sendMessage, status, error } = useWebSocket();

  useEffect(() => {
    if (lastMessage) {
      console.log('Received:', lastMessage);
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    sendMessage({ message: 'Hello from the client!' });
  };

  return (
    <div>
      <h1>WebSocket Status: {status}</h1>
      {error && <p>Error: {error.message}</p>}
      <button onClick={handleSendMessage}>Send Message</button>
      {lastMessage && <p>Last Message: {JSON.stringify(lastMessage)}</p>}
    </div>
  );
};

const App = () => {
  return (
    <WebSocketProvider url="wss://your-websocket-url">
      <WebSocketComponent />
    </WebSocketProvider>
  );
};

export default App;
```

## License

[MIT](./LICENSE)
