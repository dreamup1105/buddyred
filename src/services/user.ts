import { request } from 'umi';
import { GatewayNS, Terminal } from '@/utils/constants';
import type { IGroupTreeNode } from '@/pages/User/Role/type';

/**
 * 查询当前登录用户信息
 */
export async function fetchCurrent(): ResponseBodyWithPromise<
  CurrentUserInfo & { crs: Customer[] }
> {
  return request(`${GatewayNS}/user/self_info`);
}

/**
 * 查询医修库web端菜单列表
 */
export async function fetchMenus(): ResponseBodyWithPromise<IGroupTreeNode[]> {
  return request(`/v1/user/get_user_menu/${Terminal}`);
}
