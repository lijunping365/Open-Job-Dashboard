import request from '@/lib/request';
import { User } from '@/types/UserTyping';
import { LoginParams, RegisterParams } from '@/types/LoginTyping';

/** 获取当前的用户 GET /user/currentUser */
export async function currentUser() {
  return request<User>('/user/currentUser', {
    method: 'GET',
  });
}

/** 更新当前用户 PUT /user/updateUser */
export async function updateUser(data: any) {
  return request<User>('/user/update', {
    method: 'PUT',
    data,
  });
}

/** 登录接口 POST /login/type */
export async function login(body: LoginParams) {
  return request(`/login/${body.type}`, {
    method: 'POST',
    data: body,
  });
}

/** 登录接口 POST /login/type */
export async function register(body: RegisterParams) {
  return request('/register/form', {
    method: 'POST',
    data: body,
  });
}

/** 生成微信扫码验证码 GET /login/code */
export async function getWxLoginCode() {
  return request('/login/code', {
    method: 'GET',
  });
}

/** 微信扫码登录 GET /login/scan */
export async function scanLoginCode(code: string) {
  return request(`/login/scan?code=${code}`, {
    method: 'GET',
  });
}
