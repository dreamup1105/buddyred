import { request } from 'umi';
import type { IFetchMaintenanceRecordForm } from './type';

/**
 * 维保记录明细查询
 * @param data
 * @returns
 */
export async function getMaintenanceRecordAPI(
  data: IFetchMaintenanceRecordForm,
) {
  return request(`/v3/ms/statistical/getMaintenanceRecord`, {
    method: 'POST',
    data,
  });
}

/**
 * 维保记录导出Excel
 * @param data
 * @returns
 */
export async function maintenanceRecordExportAPI(
  data: IFetchMaintenanceRecordForm,
) {
  return request(`/v3/ms/statistical/maintenanceRecord/export`, {
    method: 'POST',
    data,
    getResponse: true,
    responseType: 'blob',
  });
}

/**
 * 获取客户医院列表
 * @returns
 */
export async function getHospitalClientListAPI(data: any) {
  return request(`/v3/ms/statistical/getHospitalClientList`, {
    method: 'POST',
    data: data,
  });
}

/**
 * 获取医院下的科室
 * @param orgId 医院id
 * @returns
 */
export async function getDepartmentListAPI(orgId: number) {
  return request(`/v3/ms/statistical/getDepartmentList/${orgId}`, {
    method: 'GET',
  });
}

/**
 * 查询总金额
 * @param data
 * @returns
 */
export async function getSummationCostAPI(data: IFetchMaintenanceRecordForm) {
  return request(`/v3/ms/statistical/getSummationCost `, {
    method: 'POST',
    data,
  });
}
