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
  payload?: any;
  data?: Blob;
};
