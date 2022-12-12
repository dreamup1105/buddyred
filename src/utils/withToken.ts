import { fetchUploadTokenWithExpire } from '@/services/qiniu';

let token = '';

/**
 * 更新token，获取token
 */
export async function loadToken() {
  const res = await fetchUploadTokenWithExpire();
  if (res.data && res.data.token) {
    token = res.data.token;
    return res.data.token;
  }
  throw new Error('获取Token失败');
}

/**
 * 在每次执行异步逻辑之前校验更新token
 * @param fn async function
 */
export async function withToken<T = any>(
  fn: (token: string) => Promise<T>,
): Promise<T> {
  // todo token有效时间校验，过期重新获取
  await loadToken();
  return fn(token);
}

/**
 * 不主动更新token，需要更新时手动调用loadToken
 * @param fn async function
 */
export async function withTokenLazy<T = any>(
  fn: (token: string) => Promise<T>,
): Promise<T> {
  return fn(token);
}
