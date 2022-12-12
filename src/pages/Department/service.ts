import { request } from 'umi';
import type { FetchDepartmentsParams, SaveDepartmentParams } from './type';

/**
 * 获取部门列表
 * @param params
 */
export async function fetchDepartments(
  params: Partial<FetchDepartmentsParams>,
  rootOnly: boolean = false,
  pageNum?: number,
  pageSize?: number,
) {
  const url = pageNum
    ? `/v3/org/department/list?pageNum=${pageNum}&pageSize=${pageSize}&rootOnly=${rootOnly}`
    : `/v3/org/department/list?&rootOnly=${rootOnly}`;
  return request(url, { method: 'POST', data: params });
}

/**
 * 获取某个部门
 * @param id
 */
export async function fetchDepartment(id: number) {
  return request(`/v3/org/department/get/${id}`);
}

/**
 * 获取多个部门
 * @param ids
 */
export async function fetchDepartmentByIds(ids: number[]) {
  return request(`/v3/org/department/getByIds?ids=${ids}`);
}

/**
 * 删除某个部门
 * @param id
 */
export async function delDepartment(id: number) {
  return request(`/v3/org/department/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 新增或编辑部门
 * @param params
 */
export async function saveDepartment(params: SaveDepartmentParams) {
  return request(`/v3/org/department/save`, {
    method: 'POST',
    data: params,
  });
}
