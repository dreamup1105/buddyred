import { request } from 'umi';
import type { IVersionItem } from '@/pages/Dictionary/Maintenance/Template/type';
import type { IMaintainItemWithVersion } from './type';

/**
 * 获取指定版本的保养项及对应保养明细的集合
 */
export async function fetchMaintainItemsWithVersion(
  id: number,
): ResponseBodyWithPromise<{
  itemIds: number[];
  items: IMaintainItemWithVersion[];
}> {
  return request(`/v3/ms/spec/ver/specs/${id}`);
}

/**
 * 获取指定版本平台保养项集
 */
export async function fetchTemplateForSpecs(): ResponseBodyWithPromise<{
  itemIds: number[];
  items: IMaintainItemWithVersion[];
}> {
  return request(`/v3/ms/spec/ver/platform/specs`);
}

/**
 * 获取版本记录
 * @param id
 * @returns
 */
export async function fetchSpecVersion(
  id: number,
): ResponseBodyWithPromise<IVersionItem> {
  return request(`/v3/ms/spec/ver/get/${id}`);
}
