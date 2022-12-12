import { request } from 'umi';
import { GatewayNS } from '@/utils/constants';
import type {
  EmployeeItem,
  FetchEmployeesParams,
  SaveEmployeeParams,
  ISaveAccountData,
  SaveEmployeeAndAccountParams,
  EmployeeAdminParams,
} from './type';

/**
 * 查询人员信息列表
 * @param params
 * @param pageNum
 * @param pageSize
 * @param rootOnly
 */
export async function fetchEmployees(
  data: Partial<FetchEmployeesParams>,
  rootOnly: boolean = false,
  pageNum?: number,
  pageSize?: number,
): ResponseBodyWithPromise<EmployeeItem[]> {
  const url = pageNum
    ? `${GatewayNS}/org/employee/list?pageNum=${pageNum}&pageSize=${pageSize}&rootOnly=${rootOnly}`
    : `${GatewayNS}/org/employee/list?rootOnly=${rootOnly}`;
  return request(url, { method: 'POST', data });
}

/**
 * 查询人员信息列表(当前登录人的)
 * @param data
 * @param rootOnly
 * @param pageNum
 * @param pageSize
 * @returns
 */
export async function fetchOrgEmployees(
  data: Omit<FetchEmployeesParams, 'orgId'>,
  rootOnly: boolean = false,
  pageNum?: number,
  pageSize?: number,
): ResponseBodyWithPromise<EmployeeItem[]> {
  const url = pageNum
    ? `/v3/org/employee/list/x?pageNum=${pageNum}&pageSize=${pageSize}&rootOnly=${rootOnly}`
    : `/v3/org/employee/list/x?rootOnly=${rootOnly}`;

  return request(url, { method: 'POST', data });
}

/**
 * 查询某个人员
 * @param id
 */
export async function fetchEmployee(id: number) {
  return request(`/v3/org/employee/get/${id}`);
}

/**
 * 查询某个人员（含关联部门, 登录账号）
 * @param id
 */
export async function fetchEmployeeAndAccountInfo(id: number) {
  return request(`/v3/org/employee/getInfo/${id}`);
}

/**
 * 保存人员
 * @param params
 */
export async function saveEmployee(
  params: SaveEmployeeParams,
): ResponseBodyWithPromise<EmployeeItem> {
  return request(`/v3/org/employee/save`, {
    method: 'POST',
    data: params,
  });
}

export async function saveEmployeeAndAccount(
  params: SaveEmployeeAndAccountParams,
) {
  return request(`/v3/org/employee/saveInfo`, {
    method: 'POST',
    data: params,
  });
}

/**
 *
 * @param params 更新管理员信息
 * @returns
 */
export async function uploadAdmin(params: EmployeeAdminParams) {
  return request(`/v3/org/organization/update`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 删除人员 - 维修工程师
 * @param id
 * @param crId
 */
export async function delEmployee(id: number) {
  return request(`/v3/org/employee/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 账号更新
 * @param id
 * @param data
 */
export async function saveAccount(id: number, data: ISaveAccountData) {
  return request(`${GatewayNS}/account/save/${id}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 账号删除
 * @param id
 */
export async function delAccount(id: number) {
  return request(`${GatewayNS}/account/delete/${id}`, {
    method: 'DELETE',
  });
}
