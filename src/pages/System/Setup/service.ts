import { request } from 'umi';
import type {
  ITableListItem as SaveSetupParams,
  FetchOwnerSetupListParams,
} from './type';

/**
 * 获取全局设置
 */
export async function fetchGlobalSetup() {
  return request(`/v3/prefs/get`);
}

/**
 * 重置全局设置
 */
export async function resetGlobalSetup() {
  return request(`/v3/prefs/reset`, {
    method: 'PUT',
  });
}

/**
 * 保存全局设置
 */
export async function saveGlobalSetup(params: SaveSetupParams) {
  return request(`/v3/prefs/save`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取机构设置
 * @param ownerId 机构ID
 */
export async function fetchSetupByOwner(ownerId: number) {
  return request(`/v3/prefs/get/${ownerId}`);
}

/**
 * 保存机构设置
 * @param ownerId
 * @param params
 */
export async function saveSetupByOwner(
  ownerId: number,
  params: SaveSetupParams,
) {
  return request(`/v3/prefs/save/${ownerId}`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 重置机构设置
 * @param ownerId
 */
export async function resetSetupByOwner(ownerId: number) {
  return request(`/v3/prefs/reset/${ownerId}`, {
    method: 'PUT',
  });
}

/**
 * 获取机构设置列表
 * @param pageNum
 * @param pageSize
 * @param params
 */
export async function fetchOwnerSetupList(
  pageNum: number,
  pageSize: number,
  params: Partial<FetchOwnerSetupListParams>,
) {
  return request(`/v3/prefs/org/list?pageNum=${pageNum}&pageSize=${pageSize}`, {
    method: 'POST',
    data: params,
  });
}
