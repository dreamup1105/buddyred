import { request } from 'umi';
import type { IFetchTableFormItem } from './type';

/**
 * 查询全院设备开机率【医院端】
 * @param data
 * @returns
 */
export async function getSelectStartingUpAPI(data: IFetchTableFormItem) {
  return request(`/v3/census/equipment/selectStartingUp`, {
    method: 'POST',
    data,
  });
}

/**
 * 分时间查询科室设备开机率【医院端】
 * @param data
 * @returns
 */
export async function getSelectDepartmentStartingAPI(
  data: IFetchTableFormItem,
) {
  return request(`/v3/census/equipment/selectDepartmentStarting`, {
    method: 'POST',
    data,
  });
}

/**
 * 分时间查询单台设备开机率【医院端】
 * @param data
 * @returns
 */
export async function getQueryEquipmentStartingAPI(data: IFetchTableFormItem) {
  return request(`/v3/census/equipment/queryEquipmentStarting`, {
    method: 'POST',
    data,
  });
}

/**
 * 分时间查询单台设备开机率【医院端】
 * @param data
 * @returns
 */
export async function getQueryCompanyStartingAPI(data: IFetchTableFormItem) {
  return request(`/v3/census/equipment/queryCompanyStarting`, {
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
