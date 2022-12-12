import { UploadHost } from '@/services/qiniu';
import { request } from 'umi';
import type { TeamDetail } from '../Team/type';
import type { WarranthyStatus, Equipment, SigApplyData } from './type';

/* 发起（维修方）授权申请 */
export async function putAuthApply(
  crId: number | string,
  applyMessage: string,
): ResponseBodyWithPromise<any> {
  const url = `/v3/mt/auth/apply/${crId}`;
  const data = { authApply: applyMessage };
  return request(url, { method: 'PUT', data });
}

/* 拒绝（设备方）授权申请 */
export async function putRejectAuth(
  crId: number | string,
): ResponseBodyWithPromise<any> {
  const url = `/v3/mt/auth/deny/${crId}`;
  return request(url, { method: 'PUT' });
}

/* 获取设备列表 */
export async function fetchEquipments(
  page: number,
  pageSize: number,
  orgId: number | string,
  condition?: {
    departmentId?: (string | number)[];
    warranthyStatus?: WarranthyStatus[];
  },
): ResponseBodyWithPromise<Equipment[]> {
  const url = `/v3/equipment/list?pageNum=${page}&pageSize=${pageSize}`;
  const data = {
    orgId,
    ...condition,
  };
  return request(url, { method: 'POST', data });
}

/* 根据team获取已授权设备 */
export async function fetchAuthEquipments(
  page: number,
  pageSize: number,
  crId: number | string,
  orgId: number | string,
): ResponseBodyWithPromise<Equipment[]> {
  const url = `/v3/equipment/view/acl/list/explicit/${crId}?pageNum=${page}&pageSize=${pageSize}`;
  const data = { orgId };
  return request(url, { method: 'POST', data });
}

/* 根据team获取申请签约所选的设备 */
export async function fetchSigEquipments(
  page: number,
  pageSize: number,
  crId: number | string,
): ResponseBodyWithPromise<Equipment[]> {
  const url = `/v3/mt/equipment/sigs/${crId}?pageNum=${page}&pageSize=${pageSize}`;
  return request(url, { method: 'GET' });
}

/* 授权设备 */
export async function putApproveAuth(
  crId: number | string,
  equipmentIds: string[] | number[],
): ResponseBodyWithPromise<any> {
  const url = `/v3/mt/auth/accept/${crId}`;
  return request(url, { method: 'PUT', data: equipmentIds });
}

/* 申请签约 */
export async function putSigApply(
  crId: string | number,
  data: SigApplyData,
): ResponseBodyWithPromise<any> {
  const url = `/v3/mt/sig/apply/${crId}`;
  return request(url, { method: 'PUT', data });
}

/* 同意签约 */
export async function putApproveSig(
  crId: string | number,
): ResponseBodyWithPromise<any> {
  const url = `/v3/mt/sig/accept/${crId}`;
  return request(url, { method: 'PUT' });
}

/* 拒绝签约 */
export async function putRejectSig(
  crId: string | number,
): ResponseBodyWithPromise<any> {
  const url = `/v3/mt/sig/deny/${crId}`;
  return request(url, { method: 'PUT' });
}

/* 获取签约授权详情（获取team） */
export async function fetchTeam(
  crId: string | number,
): ResponseBodyWithPromise<TeamDetail[]> {
  const url = `/v3/mt/get/${crId}`;
  return request(url, { method: 'GET' });
}

/* 上传附件（合同图片） */
export async function postAttachment(file: File, token: string): Promise<any> {
  const data = new FormData();
  data.append('file', file);
  data.append('token', token);
  return request(`${UploadHost}`, {
    method: 'POST',
    data,
  });
}
