import { decodeWebSocketMessage, handleMessage } from '@/routes/utils';
import { pack } from '.';
import type { WebRequest } from './type';

interface IVoiceBotService {
  ws_url: string;
}
export default class VoiceBotService {
  private ws_url: string;
  private ws?: WebSocket;
  constructor(props: IVoiceBotService) {
    this.ws_url = props.ws_url;
  }
  public async connect(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.ws_url);
      ws.onopen = () => {
        this.ws = ws;
        resolve(ws);
      };
      ws.onerror = e => {
        reject(e);
        this.onError(e);
      };
      ws.onmessage = e => this.onMessage(e);
    });
  }

  // 发送消息
  public sendMessage(message: WebRequest) {
    this.ws?.send(pack(message));
  }

  // 接收消息
  public onMessage(e: MessageEvent<any>) {
    try {
      e.data.arrayBuffer().then((buffer: ArrayBuffer) => {
        const json = decodeWebSocketMessage(buffer);
        handleMessage?.(json);
      });
    } catch (e) {
      this.onError(e);
    }
  }
  private onError(e: any) {
    console.error(e);
    this.dispose();
  }
  private dispose() {
    this.ws?.close();
  }
}
