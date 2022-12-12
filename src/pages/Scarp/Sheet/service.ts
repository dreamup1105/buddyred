import { request } from 'umi';
import type { ScarpDetailItem, ScarpSearchFormItem } from './type';

/**
 * 通过设备id获取报废单所需设备信息
 * @returns
 */
export function getEquipmentInfo(eqId: number) {
  return request(`/v3/pe/scrap/getEquipmentInfoById?eqId=${eqId}`, {
    method: 'GET',
  });
}

/**
 * 保存或更新报废单，只用于保存草稿或者是确认提交
 * @returns
 */
export function saveOrUpdate(data: ScarpDetailItem | any) {
  return request(`/v3/pe/scrap/saveOrUpdate`, { method: 'POST', data: data });
}

/**
 * 分页查询报废单
 * @returns
 */
export function scarpListPage(data: ScarpSearchFormItem) {
  return request(`/v3/pe/scrap/listByPage`, { method: 'POST', data: data });
}

/**
 * 分页查询报废单
 * @returns
 */
export function getOrderInfo(orderId: string) {
  return request(`/v3/pe/scrap/getOrderInfoById?orderId=${orderId}`, {
    method: 'GET',
  });
}
