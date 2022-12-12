import { request } from 'umi';
import { GatewayNS } from '@/utils/constants';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export async function login(
  params: LoginParams,
): ResponseBodyWithPromise<CurrentUserInfo> {
  return request(`${GatewayNS}/login`, {
    method: 'POST',
    data: params,
  });
}

export async function logout() {
  return request(`${GatewayNS}/logout`, {
    method: 'POST',
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
