import { request } from 'umi';
import type { IFetchTableFormItem } from './type';

/**
 * 分时间查询全院设备维修完成率（医院端）
 * @param data
 * @returns
 */
export async function queryCompleteMaintenanceAPI(data: IFetchTableFormItem) {
  return request(`/v3/census/equipment/queryCompleteMaintenance`, {
    method: 'POST',
    data,
  });
}

/**
 * 分时间查询全院设备维修完成率（医院端）
 * @param data
 * @returns
 */
export async function queryDepartmentMaintenanceAPI(data: IFetchTableFormItem) {
  return request(` /v3/census/equipment/queryDepartmentMaintenance`, {
    method: 'POST',
    data,
  });
}

/**
 * 分时间查询维修公司完成维修率
 * @param data
 * @returns
 */
export async function queryCompanyRatioAPI(data: IFetchTableFormItem) {
  return request(`/v3/census/equipment/queryCompanyRatio`, {
    method: 'POST',
    data,
  });
}

/**
 * 查询客户机构列表（工程师端返回医院客户列表，医院端返回维修公司列表）
 * @param data
 * @returns
 */
export async function getQueryCustomerRelationAPI() {
  return request(`/v3/census/equipment/queryCustomerRelation`, {
    method: 'GET',
  });
}
