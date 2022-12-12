import { request } from 'umi';
import type { Equipment } from '../Signature/type';
import type { RepairRecord, QueryCondition, NewRecord, Part } from './type';

type ID = number | string;

/* 获取维修工单（补单）列表 */
export function fetchRecordList(
  page: number,
  pageSize: number,
  condition: QueryCondition,
): Promise<Required<ResponseBody<RepairRecord[]>>> {
  const url = `/v3/mp/repair/list?pageNum=${page}&pageSize=${pageSize}`;
  return request(url, { method: 'POST', data: condition });
}

/* 获取设备列表（已签约） */
export function fetchSigEquipments(
  pageNum: number,
  pageSize: number,
  crId: ID,
): Promise<Required<ResponseBody<Equipment[]>>> {
  const url = `/v3/mt/equipment/sigs/${crId}?pageNum=${pageNum}&pageSize=${pageSize}`;
  return request(url, { method: 'GET' });
}

/* 创建（保存）维修工单 */
export function postRecord(record: NewRecord | RepairRecord) {
  const url = `/v3/mp/repair/record/save`;
  return request(url, { method: 'POST', data: record });
}

/* 提交（工程师）维修工单补单 */
export function postRecordSubmit(taskId: ID) {
  const url = `/v3/mp/repair/record/submit/${taskId}`;
  return request(url, { method: 'PUT' });
}

/* 通过维修工单补单的审批 */
export function postPassRecordApprove(
  taskId: ID,
  data: {
    employeeId: ID;
    employeeName: string;
    reason?: string;
  },
) {
  const url = `/v3/mp/repair/record/accept/${taskId}`;
  return request(url, { method: 'PUT', data });
}

/* 拒绝维修工单补单的审批 */
export function postDenyRecordApprove(
  taskId: ID,
  data: {
    employeeId: ID;
    employeeName: string;
    reason?: string;
  },
) {
  const url = `/v3/mp/repair/record/deny/${taskId}`;
  return request(url, { method: 'PUT', data });
}

/* 保存配件 */
export function postParts(taskId: ID, parts: Part[]) {
  const url = `/v3/mp/repair/parts/${taskId}`;
  return request(url, { method: 'POST', data: parts });
}

/* 获取单个设备信息 */
export function fetchEquipment(
  id: ID,
): Promise<Required<ResponseBody<{ equipment: Equipment }>>> {
  const url = `/v3/equipment/getInfo/${id}`;
  return request(url, { method: 'GET' });
}

/* 获取配件 - 全量 */
export function fetchParts(taskId: ID): ResponseBodyWithPromise<Part[]> {
  const url = `/v3/mp/repair/parts/${taskId}`;
  return request(url, { method: 'GET' });
}
