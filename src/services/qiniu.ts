import { request } from 'umi';

/**
 * 获取上传七牛云的token，只返回token
 */
export async function fetchUploadToken() {
  return request('/v1/image/token');
}

/**
 * 获取上传七牛云的token，返回token和过期日期
 */
export async function fetchUploadTokenWithExpire() {
  return request('/v1/image/token_with_expire');
}

/**
 * 批量获取图片下载地址接口
 * @param keys
 * @returns
 */
export async function batchFetchRawImageUrl(
  keys: string[],
): ResponseBodyWithPromise<string[]> {
  return request(`/v1/image/get_images_urls`, {
    method: 'POST',
    data: keys,
  });
}

export const UploadHost = '//upload-z2.qiniup.com';
