export type WebResponse = {
  event: string;
  payload?: Record<string, any>;
  data?: ArrayBuffer;
  reqid?: string;
  status_code: number;
  status_text: string;
};

export type WebRequest = {
  event: string;
  payload?: Record<string, any>;
  data?: Blob;
};

export enum EventType {
  BotReady = 'BotReady',
  BotUpdateConfig = 'BotUpdateConfig',
  SentenceRecognized = 'SentenceRecognized',
  TTSSentenceStart = 'TTSSentenceStart',
  TTSDone = 'TTSDone',
  BotError = 'BotError',
}

export interface IWebSocketResponse {
  messageType: number;
  payload: JSONResponse | ArrayBuffer;
}
export type JSONResponse = {
  event: EventType;
  payload?: Record<string, any>;
};
