import type { WebRequest, WebResponse } from '@/utils/type';
import { generateWSHeader } from '@/routes/utils';

export function unpack(resp: ArrayBuffer): WebResponse {
  const view = new DataView(resp);
  const hsize = view.getUint8(0) & 0x0f;
  let body = resp.slice(hsize * 4);
  const payloadSize = new DataView(body).getUint32(0);
  body = body.slice(4);
  const dataSize = new DataView(body).getUint32(0);
  // json part
  const raw = body.slice(4, 4 + payloadSize);
  const result = JSON.parse(new TextDecoder().decode(raw));
  // audio part
  if (dataSize > 0) {
    result.data = body.slice(4 + payloadSize);
  }
  return result;
}

/**
 * web send for 同传
 */
export function pack(req: WebRequest): Blob {
  const header = generateWSHeader();
  const data = req.data || new Blob();
  req.data = undefined;

  const json = JSON.stringify(req);
  const encoded = new TextEncoder().encode(json);
  const byteLength = encoded.length;

  header.setUint32(4, byteLength, false);
  header.setUint32(8, data.size, false);

  return new Blob([header, json, data]);
}
