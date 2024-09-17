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

export const encodeAudioOnlyRequest = (requestData) => {
    const audio_only_request_header = generateHeader(CONST.CLIENT_AUDIO_ONLY_REQUEST);
    audio_only_request_header.setUint32(4, requestData.size, false);
    return new Blob([audio_only_request_header, requestData]);
};

const generateHeader = (
    message_type = CONST.CLIENT_FULL_REQUEST,
    version = CONST.PROTOCOL_VERSION,
    message_type_specific_flags = CONST.NO_SEQUENCE,
    serial_method = CONST.JSON,
    compression_type = CONST.NO_COMPRESSION,
    reserved_data = 0x00,
    extension_header = new ArrayBuffer(0),
) => {
    const buffer = new ArrayBuffer(8);
    const dataView = new DataView(buffer);

    const header_size = Math.trunc(extension_header.byteLength / 4) + 1;
    dataView.setUint8(0, (version << 4) | header_size);
    dataView.setUint8(1, (message_type << 4) | message_type_specific_flags);
    dataView.setUint8(2, (serial_method << 4) | compression_type);
    dataView.setUint8(3, reserved_data);
    return dataView;
};

const VERSION = 0b0001;
const HEADER_SIZE = 0b0001;
const WEB_REQUEST = 0b0001;
const SERIALIZATION_JSON = 0b0001;
const NO_COMPRESSION = 0b0000;

export const generateWSHeader = () => {
    const buffer = new ArrayBuffer(12);
    const dataView = new DataView(buffer);

    dataView.setUint8(0, (VERSION << 4) | HEADER_SIZE);
    dataView.setUint8(1, WEB_REQUEST);
    dataView.setUint8(2, (SERIALIZATION_JSON << 4) | NO_COMPRESSION);
    dataView.setUint8(3, 0x00);

    return dataView;
};
export const genBotWSData = (req) => {
    const header = generateWSHeader();
    const data = req.data || new Blob([]);
    const json = JSON.stringify({
        event: req.event,
        payload: req.payload || {},
    });
    const encoder = new TextEncoder();
    const encoded = encoder.encode(json);
    const byteLength = encoded.length;
    header.setUint32(4, byteLength, false);
    header.setUint32(8, data.size || 0, false);
    return new Blob([header, json, data]);
};

