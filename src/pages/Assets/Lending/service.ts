import { request } from 'umi';
import type { LendignTableFormItem } from './type';

/**
 * 分页查询转借单
 * @returns
 */
 export function lendingListAPI(data: LendignTableFormItem) {
  return request(`/v3/eq/lent/listByPage`, { method: 'POST', data: data });
}

/**
 * 查询当前登陆人所属医院下所有员工信息
 * @returns
 */
 export function listOrgEmpAPI() {
  return request(`/v3/eq/lent/listOrgEmp`, { method: 'GET' });
}

/**
 * 分页查询源科室下的设备信息
 * @returns
 */
 export function listLentEqByPageAPI(data: {
  current: number;
  deptId: number;
  pageSize: number;
 }) {
  return request(`/v3/eq/lent/listLentEqByPage`, { method: 'POST', data: data });
}

/**
 * 点击编辑/查看按钮查询转借单详情
 * @returns
 */
 export function checkOrderAPI(orderId?: number) {
  return request(`/v3/eq/lent/checkOrder?orderId=${orderId}`, { method: 'GET' });
}

/**
 * 查询当前用户授权科室列表
 * @returns
 */
 export function principalDeptAPI() {
  return request(`/v3/org/principal/dept`, { method: 'POST' });
}

/**
 * 保存或更新转借单
 * @returns
 */
 export function saveOrUpdateAPI(data: any) {
  return request(`/v3/eq/lent/saveOrUpdate`, { method: 'POST', data: data });
}

/**
 * 转借单-撤单
 * @returns
 */
 export function deleteByIdAPI(orderId: number) {
  return request(`/v3/eq/lent/deleteById?orderId=${orderId}`, { method: 'GET' });
}

/**
 * 保存审批结果
 * @returns
 */
 export function saveAuditResultAPI(data: any) {
  return request(`/v3/eq/lent/saveAuditResult`, { method: 'POST', data: data });
}

/**
 * 转借单点击审批按钮查询详情
 * @returns
 */
 export function auditByIdAPI(orderId?: number) {
  return request(`/v3/eq/lent/auditById?orderId=${orderId}`, { method: 'GET' });
}

/**
 * 借调单归还设备
 * @returns
 */
 export function returnEquipmentAPI(orderId?: number) {
  return request(`/v3/eq/lent/returnEquipment?orderId=${orderId}`, { method: 'GET' });
}

/**
 * 统计各种状态下的转科/借调单数量
 * @returns
 */
 export function statOrderNumByStatusAPI(data: LendignTableFormItem) {
  return request(`/v3/eq/lent/statOrderNumByStatus`, { method: 'POST', data: data });
}