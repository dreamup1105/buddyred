import { request } from 'umi';
import type { TableFormItem } from './type';

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
export function equipmentListAPI(data: {
  current: number;
  departmentId: number[];
  orgId?: number;
  pageSize: number;
}) {
  return request(`/v3/equipment/list`, { method: 'POST', data: data });
}

/**
 * 分页查询定制巡检规则信息
 * @returns
 */
export function customListByPageAPI(data: TableFormItem) {
  return request(`/v3/inspection/custom/listByPage`, {
    method: 'POST',
    data: data,
  });
}

/**
 * 保存或更新定制巡检规则
 * @returns
 */
export function customSaveOrUpdateAPI(data: TableFormItem) {
  return request(`/v3/inspection/custom/saveOrUpdate`, {
    method: 'POST',
    data: data,
  });
}

/**
 * 点击编辑/查看按钮查询定制巡检规则详情
 * @returns
 */
export function customGetObjByIdAPI(id?: string) {
  return request(`/v3/inspection/custom/getObjById?id=${id}`, {
    method: 'GET',
  });
}

/**
 * 删除定制巡检规则
 * @returns
 */
export function customDeleteByIdAPI(id?: string) {
  return request(`/v3/inspection/custom/deleteById?id=${id}`, {
    method: 'GET',
  });
}
