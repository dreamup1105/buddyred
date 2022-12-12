import { request } from 'umi';

/**
 * 解绑微信
 */
export async function unbindWechat(uId: number, openId: string) {
  return request(`/v3/account/unbindWx`, {
    method: 'POST',
    data: {
      uid: uId,
      wxId: openId,
    },
  });
}

/**
 * 根据uid获取绑定的微信用户列表
 * @param uId
 * @returns
 */
export async function fetchWechatAccounts(): ResponseBodyWithPromise<
  WechatUserInfo[]
> {
  return request(`/v3/account/getBindWxList`);
}
