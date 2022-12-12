import { request } from 'umi';
import type { SubscriptionSearchFormItem } from './type';

/**
 * 保存/更新设备申购单信息
 * @returns
 */
export function savePurchaseOrUpdate(data: any) {
  return request(`/v3/pe/purchase/saveOrUpdate`, {
    method: 'POST',
    data: data,
  });
}

/**
 * 分页查询设备申购单
 * @returns
 */
export function purchaseList(data: SubscriptionSearchFormItem) {
  return request(`/v3/pe/purchase/listByPage`, { method: 'POST', data: data });
}

/**
 * 根据申购单id查询申购单和明细详情
 * @returns
 */
export function getOrderInfo(orderId: string) {
  return request(`/v3/pe/purchase/getOrderById?orderId=${orderId}`, {
    method: 'GET',
  });
}

/**
 * 启用申购单，将申购单明细生成固定资产对应设备信息
 * @returns
 */
export function enableOrder(orderId: string) {
  return request(`/v3/pe/purchase/enableOrder?orderId=${orderId}`, {
    method: 'GET',
  });
}

/**
 * 根据明细id集合删除设备申购单明细
 * @returns
 */
export function delEquiomentDetail(data: number[]) {
  return request(`/v3/pe/purchase/delDetailByIds`, {
    method: 'POST',
    data: data,
  });
}
