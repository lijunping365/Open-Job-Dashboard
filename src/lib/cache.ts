import Cookies from 'js-cookie';

/**
 * 从 Cookie 中获取 accessToken
 */
export function getAccessToken() {
  return Cookies.get('accessToken');
}

/**
 * 把 accessToken 存储到 Cookie, 15 天后失效
 * @param accessToken
 */
export function setAccessToken(accessToken: string) {
  Cookies.set('accessToken', accessToken, {
    domain: 'openbytecode.com',
    expires: 15,
  });
}

/**
 * 将 Cookie 中的 accessToken 移除
 */
export function removeAccessToken() {
  return Cookies.remove('accessToken');
}
