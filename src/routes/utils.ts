import { CONST } from '@/utils/constant';
import type { IWebSocketResponse, JSONResponse } from '@/utils/type';

export const encodeAudioOnlyRequest = (requestData: Blob) => {
  const audio_only_request_header = generateHeader(
    CONST.CLIENT_AUDIO_ONLY_REQUEST,
  );
  audio_only_request_header.setUint32(4, requestData.size, false);
  return new Blob([audio_only_request_header, requestData]);
};

const generateHeader = (message_type = CONST.CLIENT_FULL_REQUEST) => {
  const buffer = new ArrayBuffer(8);
  const dataView = new DataView(buffer);
  dataView.setUint8(
    0,
    (CONST.PROTOCOL_VERSION << 4) | CONST.DEFAULT_HEADER_SIZE,
  );
  dataView.setUint8(1, (message_type << 4) | CONST.NO_SEQUENCE);
  dataView.setUint8(2, (CONST.JSON << 4) | CONST.NO_COMPRESSION);
  dataView.setUint8(3, 0x00);
  return dataView;
};

export const generateWSHeader = (msgType = CONST.CLIENT_AUDIO_ONLY_REQUEST) => {
  const buffer = new ArrayBuffer(8);
  const dataView = new DataView(buffer);
  dataView.setUint8(
    0,
    (CONST.PROTOCOL_VERSION << 4) | CONST.DEFAULT_HEADER_SIZE,
  );
  dataView.setUint8(1, msgType << 4 || CONST.NO_SEQUENCE);
  dataView.setUint8(2, (CONST.JSON << 4) | CONST.NO_COMPRESSION);
  dataView.setUint8(3, 0x00);

  return dataView;
};

export type BotWebRequest = {
  event: string;
  payload?: Record<string, any>;
  data?: Blob;
};
export const genBotWSData = (req: BotWebRequest) => {
  const header = generateWSHeader();
  const data = req.data || new Blob([]);
  const json = JSON.stringify({
    event: req.event,
    payload: req.payload || {},
  });
  const byteLength = new TextEncoder().encode(json).length;
  header.setUint32(4, byteLength, false);
  header.setUint32(8, data.size || 0, false);
  return new Blob([header, json, data]);
};

export const decodeWebSocketResponse = (
  resp: ArrayBuffer,
): IWebSocketResponse => {
  const view = new DataView(resp);
  const header_size = view.getUint8(0) & 0x0f; // 0~3 bits
  const messageType = getHighNibble(view.getUint8(1));
  // const messageType = view.getUint8(1) & 0x0f; // 4~7 bits
  const payload = resp.slice(header_size * CONST.HEADER_BITS);
  const payloadSize = new DataView(payload).getUint32(0);
  const payloadBody = payload.slice(CONST.PAYLOAD_LENGTH_BYTES);
  if (messageType === CONST.SERVER_AUDIO_ONLY_RESPONSE) {
    return {
      messageType: CONST.SERVER_AUDIO_ONLY_RESPONSE,
      payload: payload.slice(
        CONST.PAYLOAD_LENGTH_BYTES,
        CONST.PAYLOAD_LENGTH_BYTES + payloadSize,
      ),
    };
  }
  return {
    messageType: CONST.SERVER_FULL_RESPONSE,
    payload: JSON.parse(new TextDecoder().decode(payloadBody)),
  };
};

export const handleJSONMessage = (msg: JSONResponse) => {
  const { event, payload } = msg;
  console.log('handleMessage', event, payload);
  if (!event) {
    return;
  }
  switch (event) {
    case 'BotReady':
      console.log('BotReady', payload);
      break;
    case 'BotUpdateConfig':
      console.log('BotUpdateConfig', payload);
      break;
    case 'SentenceRecognized':
      console.log('SentenceRecognized', payload);
      break;
    case 'TTSSentenceStart':
      console.log('TTSSentenceStart', payload);
      break;
    case 'TTSDone':
      console.log('TTSDone', payload);
      break;
    case 'BotError':
      console.log('BotError', payload);
      break;
    default:
      console.log('Unknown event', event, payload);
      break;
  }
};
const getHighNibble = (byte: number) => {
  return (byte >> 4) & 0x0f;
};
