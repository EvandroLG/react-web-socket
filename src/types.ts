export type WebSocketMessage = {
  type: string;
  data: unknown;
};

export enum WebSocketStatus {
  CONNECTING = 'connecting',
  OPEN = 'open',
  CLOSED = 'closed',
}

export type WebSocketContextType = {
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: object) => void;
  status: WebSocketStatus;
  error: Error | null;
};

export type WebSocketProviderProps = {
  url: string;
  maxRetries?: number;
  children: React.ReactNode;
};
