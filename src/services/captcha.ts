import request from '@/lib/request';
import { CaptchaParams } from '@/types/LoginTyping';
export async function getFakeImageCaptcha(params: Partial<CaptchaParams>) {
  return request('/captcha/create/image', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getFakeSmsCaptcha(params: Partial<CaptchaParams>) {
  return request('/captcha/create/sms', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
