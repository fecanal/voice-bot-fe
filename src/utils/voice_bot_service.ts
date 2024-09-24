import { decodeWebSocketResponse, handleJSONMessage } from '@/routes/utils';
import { pack } from '.';
import type { JSONResponse, WebRequest } from './type';
import { CONST } from '@/utils/constant';

interface IVoiceBotService {
  ws_url: string;
}
export default class VoiceBotService {
  private ws_url: string;
  private ws?: WebSocket;
  private audioCtx: AudioContext;
  constructor(props: IVoiceBotService) {
    this.ws_url = props.ws_url;
    this.audioCtx = new AudioContext();
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
        const resp = decodeWebSocketResponse(buffer);
        console.log('##resp', resp);
        if (resp.messageType === CONST.SERVER_FULL_RESPONSE) {
          handleJSONMessage(resp.payload as JSONResponse);
        }
        if (resp.messageType === CONST.SERVER_AUDIO_ONLY_RESPONSE) {
          this.handleAudioOnlyResponse(resp.payload as ArrayBuffer);
        }
        // handleMessage?.(json);
      });
    } catch (e) {
      this.onError(e);
    }
  }
  private async handleAudioOnlyResponse(data: ArrayBuffer) {
    const audioBuffer = await this.audioCtx.decodeAudioData(
      new Uint8Array(data).buffer,
    );
    const buffer = this.audioCtx.createBufferSource();
    buffer.buffer = audioBuffer;
    buffer.connect(this.audioCtx.destination);
    buffer.start(0);
  }
  private onError(e: any) {
    console.error(e);
    this.dispose();
  }
  private dispose() {
    this.ws?.close();
  }
}
