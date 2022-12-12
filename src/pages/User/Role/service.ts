import { request } from 'umi';
import { GatewayNS } from '@/utils/constants';
import type {
  ISetUserRoleData,
  IUpdateGroupRoleData,
  IGroupRoleItem,
  IGroupTree,
  IPermission,
  ISetRolePermissionsData,
} from './type';

/**
 * 获取组织下所有端和子树(包含实体)
 */
export async function fetchGroupTrees(): ResponseBodyWithPromise<IGroupTree[]> {
  return request(`/v1/user/get_group_all_tree`);
}

/**
 * 获取组织下所有角色
 */
export async function fetchGroupRoles(): ResponseBodyWithPromise<
  IGroupRoleItem[]
> {
  return request(`/v1/user/get_group_roles`);
}

/**
 * 新增组织角色
 * @param name
 */
export async function createRole(name: string) {
  return request(`/v1/user/add_group_role`, {
    method: 'POST',
    data: {
      name,
    },
  });
}

/**
 * 删除组织角色
 * @param id
 */
export async function deleteRole(id: number) {
  return request(`/v1/user/del_group_role/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 组织（管理员）获取组织内角色所有端树（索引），角色id
 * @param roleId
 */
export async function fetchRolePermissions(
  roleId: number,
): ResponseBodyWithPromise<IPermission[]> {
  return request(`/v1/user/get_role_permissions/${roleId}`);
}

/**
 * 给角色设置权限
 */
export async function setRolePermissions(data: ISetRolePermissionsData) {
  return request(`${GatewayNS}/user/set_role_permissions`, {
    method: 'POST',
    data,
  });
}

/**
 * 设置用户角色
 * @param data
 */
export async function setRole(data: ISetUserRoleData) {
  return request(`/v1/user/set_user_role`, {
    method: 'POST',
    data,
  });
}

/**
 * 修改组织到角色名称，角色名称可以重名
 * @param data
 */
export async function updateGroupRole(data: IUpdateGroupRoleData) {
  return request(`/v1/user/update_group_role`, {
    method: 'POST',
    data,
  });
}
