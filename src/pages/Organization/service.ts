import { request } from 'umi';
import type {
  ITableListItem,
  ICreateAdminAccountData,
  IUpdateAdminAccountData,
  FetchOrganizationsParams,
  SaveOrganizationParams,
  SaveOrganizationAndAccountParams,
} from './type';

/**
 * 查询机构列表
 * @param params
 * @param pageNum
 * @param pageSize
 * @param rootOnly 仅查根级(parentOrgId=null)
 */
export async function fetchOrganizations(
  pageNum: number,
  pageSize: number,
  params: FetchOrganizationsParams,
  rootOnly: boolean = false,
) {
  return request(
    `/ent/org/organization/list?pageNum=${pageNum}&pageSize=${pageSize}&rootOnly=${rootOnly}`,
    {
      method: 'POST',
      data: params,
    },
  );
}

/**
 * 查询单个机构
 * @param id
 */
export async function fetchOrganization(id: number) {
  return request(`/v3/org/organization/get/${id}`);
}

/**
 * 查询机构信息（含账号信息）
 * @param id
 */
export async function fetchOrganizationAndAccount(id: number) {
  return request(`/v3/org/organization/getInfo/${id}`);
}

/**
 * 删除Organization(同时删除管理员账号)
 * @param id
 */
export async function delOrganization(id: number) {
  return request(`/v3/org/organization/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 保存机构
 * @param params
 */
export async function saveOrganization(
  params: SaveOrganizationParams,
): ResponseBodyWithPromise<ITableListItem> {
  return request(`/v3/org/organization/save`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 保存机构及操作管理员账号
 * @param params
 */
export async function saveOrganizationAndAccount(
  params: SaveOrganizationAndAccountParams,
) {
  return request(`/v3/org/organization/saveInfo`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 创建机构管理员账号
 * @param orgId
 * @param data
 */
export async function createAdminAccount(
  orgId: number,
  data: ICreateAdminAccountData,
) {
  return request(`/v3/account/admin/${orgId}`, {
    method: 'POST',
    data,
  });
}

/**
 * 更新机构管理员账号
 * @param accountId
 * @param data
 */
export async function updateAdminAccount(
  accountId: number,
  data: IUpdateAdminAccountData,
) {
  return request(`/v3/account/change/${accountId}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 删除机构管理员账号
 * @param accountId
 */
export async function deleteAdminAccount(accountId: number) {
  return request(`/v3/account/delete/${accountId}`, {
    method: 'DELETE',
  });
}

/**
 * 平台管理员重新设置机构管理员密码
 */
export async function setPasswordByAdminAPI(
  pwd: string,
  uid: number | undefined,
) {
  return request(`/v3/account/setPasswordByAdmin?pwd=${pwd}&uid=${uid}`, {
    method: 'get',
  });
}
