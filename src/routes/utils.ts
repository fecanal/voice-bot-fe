export const CONST = {
  PROTOCOL_VERSION: 0b0001,
  DEFAULT_HEADER_SIZE: 0b0001,

  // Header size
  PROTOCOL_VERSION_BITS: 4,
  HEADER_BITS: 4,
  MESSAGE_TYPE_BITS: 4,
  MESSAGE_TYPE_SPECIFIC_FLAGS_BITS: 4,
  MESSAGE_SERIALIZATION_BITS: 4,
  MESSAGE_COMPRESSION_BITS: 4,
  RESERVED_BITS: 8,

  // Message Type:
  CLIENT_FULL_REQUEST: 0b0001,
  CLIENT_AUDIO_ONLY_REQUEST: 0b0010,
  SERVER_FULL_RESPONSE: 0b1001,
  SERVER_ACK: 0b1011,
  SERVER_ERROR_RESPONSE: 0b1111,

  // Message Type Specific Flags
  NO_SEQUENCE: 0b0000, // no check sequence
  POS_SEQUENCE: 0b0001,
  NEG_WITHOUT_SEQUENCE: 0b0010,
  NEG_WITH_SEQUENCE: 0b0011,

  // Message Serialization
  NO_SERIALIZATION: 0b0000,
  JSON: 0b0001,
  THRIFT: 0b0011,
  CUSTOM_TYPE: 0b1111,

  // Message Compression
  NO_COMPRESSION: 0b0000,
  GZIP: 0b0001,
  CUSTOM_COMPRESSION: 0b1111,
};

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

export const generateWSHeader = () => {
  const buffer = new ArrayBuffer(12);
  const dataView = new DataView(buffer);
  const WEB_REQUEST = 0b0001; // web request message type
  dataView.setUint8(
    0,
    (CONST.PROTOCOL_VERSION << 4) | CONST.DEFAULT_HEADER_SIZE,
  );
  dataView.setUint8(1, WEB_REQUEST);
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

// export const decodeAudioOnlyResponse = (responseData: Blob){
//   const audio_only_response_header = new DataView(responseData.slice(0, 4));
//   const audio_only_response_body = responseData.slice(4);
//   const audio_only_response_payload_size = audio_only_response_header.getUint32(0);
// }

export const decodeWebSocketMessage = (resp: ArrayBuffer) => {
  const view = new DataView(resp);
  const hsize = view.getUint8(0) & 0x0f;
  // const messageType = view.getUint8(1);

  let body = resp.slice(hsize * 4);
  const payloadSize = new DataView(body).getUint32(0);

  body = body.slice(4);
  const dataSize = new DataView(body).getUint32(0);

  // json part
  const raw = body.slice(4, 4 + payloadSize);
  const result = JSON.parse(new TextDecoder().decode(raw));

  // buffer part
  if (dataSize > 0) {
    result.data = body.slice(4 + payloadSize);
  }

  return result;
};

export const handleMessage = (msg: any) => {
  const { event, payload, data } = msg;
  console.log('handleMessage', event, payload, data);
};
