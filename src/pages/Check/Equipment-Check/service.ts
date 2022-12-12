import { request } from 'umi';
import type { IFetchTableFormItem } from './type';

/**
 * 分页查询设备检测表信息
 * @param data
 * @returns
 */
export async function getDectionListAPI(data: IFetchTableFormItem) {
  return request(`/v3/pe/detection/listByPage`, {
    method: 'POST',
    data,
  });
}

/**
 * 获取设备检测项目字典
 * @param data
 * @returns
 */
export async function getDectionItemTypeAPI() {
  return request(`/v3/pe/detection/enum/itemType`, {
    method: 'GET',
  });
}

/**
 * 获取设备检测表字典
 * @param data
 * @returns
 */
export async function getDectionOrderTypeAPI() {
  return request(`/v3/pe/detection/enum/orderType`, {
    method: 'GET',
  });
}

/**
 * 根据设备检测表主表id获取全表信息
 * @param data
 * @returns
 */
export async function getDectionDetailAPI(id?: string) {
  return request(`/v3/pe/detection/getById?id=${id}`, {
    method: 'GET',
  });
}

/**
 * 根据设备检测表主表id删除检测数据
 * @param data
 * @returns
 */
export async function deleteOrderAPI(id?: string) {
  return request(`/v3/pe/detection/deleteOrder?id=${id}`, {
    method: 'GET',
  });
}
