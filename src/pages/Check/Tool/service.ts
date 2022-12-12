import { request } from 'umi';
import type { IFetchTableFormItem, ITableListItem } from './type';

/**
 * 保存或者更新检测仪器信息
 * @param data
 * @returns
 */
export async function addOrUpdateAPI(data: ITableListItem) {
  return request(`/v3/pe/tool/addOrUpdate`, {
    method: 'POST',
    data,
  });
}

/**
 * 分页查询检测仪器列表
 * @param data
 * @returns
 */
export async function listByPageAPI(data: IFetchTableFormItem) {
  return request(`/v3/pe/tool/listByPage`, {
    method: 'POST',
    data,
  });
}

/**
 * 根据id删除检测仪器信息
 * @param data
 * @returns
 */
export async function toolDeleteAPI(id?: number) {
  return request(`/v3/pe/tool/delete/${id}`, {
    method: 'DELETE',
  });
}
