import { SSE } from 'sse.js';
import { ChatRequest } from '@/types/typings';

const TIME_OUT_MS = 60000;

let baseURL: string;
if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://openbytecode.com/open-job-api';
} else {
  baseURL = 'http://localhost:8090/open-job-api';
}

export const openAi = (
  req: ChatRequest,
  options?: {
    onMessage: (message: string, done: boolean) => void;
    onError: (error: Error, statusCode?: number) => void;
  }
) => {
  const apiUrl = baseURL + '/chat/completionStream';

  const evtSource = new SSE(apiUrl, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    withCredentials: true,
    payload: JSON.stringify(req),
  });

  let responseText = '';

  const finish = () => {
    options?.onMessage(responseText, true);
  };

  const requestTimeoutId = setTimeout(() => finish(), TIME_OUT_MS);

  evtSource.onopen = function () {
    clearTimeout(requestTimeoutId);
  };

  evtSource.onmessage = async function (e) {
    const msg = e?.data;
    // 结束
    if (msg.indexOf('[DONE]') !== -1) {
      evtSource.close();
      finish();
      return;
    }

    const resultData = JSON.parse(e?.data || '{}');
    responseText += resultData?.choices?.[0]?.delta?.content || '';
    options?.onMessage(responseText, false);
  };

  evtSource.onerror = async function () {
    options?.onError(new Error('Stream Error'), 1000);
  };

  const close = () => {
    clearTimeout(requestTimeoutId);
    evtSource.close();
  };
  return {
    close,
  };
};
