import { request } from 'umi';
import type { Department, AuthorizedDpt } from './type';

/* 获取部门列表 */
export async function fetchDepartments(
  pageSize: number,
  pageNum: number,
  condition: { orgId: string | number; name?: string },
): Promise<Required<ResponseBody<Department[]>>> {
  const url = `/v3/org/department/list?rootOnly=false&pageSize=${pageSize}&pageNum=${pageNum}`;
  return request(url, { method: 'POST', data: condition });
}

/* 获取已授权部门id */
export async function fetchAuthorizing(employeeId: string) {
  const url = `/v3/equipment/acl/principalView/get/${employeeId}/R_DEPARTMENT`;
  return request(url, { method: 'GET' });
}

/* 获取已授权部门信息 */
export async function fetchAuthorizedDepartments(
  employeeId?: string | number,
): ResponseBodyWithPromise<AuthorizedDpt[]> {
  const url = `/v3/equipment/acl/principalView/getkv/${employeeId}/R_DEPARTMENT`;
  return request(url, { method: 'GET' });
}

/* 保存授权 */
export async function postAuthorizing(
  employeeId: string | number,
  resourceIds: string[] | number[],
): ResponseBodyWithPromise<any> {
  const url = `/v3/equipment/acl/principalView/save/${employeeId}/P_EMPLOYEE/R_DEPARTMENT`;
  return request(url, { method: 'POST', data: resourceIds });
}
