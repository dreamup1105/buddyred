import { request } from 'umi';
import type {
  InitMaintenanceItemData,
  IFetchTaskCountData,
  IFetchTasksData,
  ITaskDetail,
  ITaskValue,
  AcceptData,
  ITimelineItem,
  ITaskItemWithStatus,
  ITaskDetailWithTemplate,
  IBatchFetchTaskDetailsData,
  ITaskDetailsWithTemplateItem,
  UnfinishedItem,
  initiateTransferForm,
} from './type';

/**
 * 发起保养
 * @param data
 * @returns
 */
export async function initMaintenance(data: InitMaintenanceItemData[]) {
  return request('/v3/mp/maintain/init', { method: 'POST', data });
}

/**
 * 查询工单列表
 * @param data
 * @param pageNum
 * @param pageSize
 * @returns
 */
export async function fetchTasks(
  data: IFetchTasksData = {},
  isAcl: boolean = true,
  pageNum?: number,
  pageSize?: number,
) {
  const endpoint = isAcl ? '/v3/mp/maintain/acl/list' : '/v3/mp/maintain/list';
  const url = pageNum
    ? `${endpoint}?pageNum=${pageNum}&pageSize=${pageSize}`
    : endpoint;
  return request(url, {
    method: 'POST',
    data,
  });
}

/**
 * 获取工单详情（包含模板信息）
 * @param taskId
 * @returns
 */
export async function fetchTask(
  taskId: number,
): ResponseBodyWithPromise<ITaskDetail> {
  return request(`/v3/mp/maintain/getext/${taskId}`);
}

export async function fetchTaskValues(
  taskId: number,
): ResponseBodyWithPromise<ITaskValue> {
  return request(`/v3/mp/maintain/data/get/${taskId}`);
}

/**
 * 验收通过
 * @param taskId
 * @param data
 * @returns
 */
export async function acceptTask(taskId: number, data: AcceptData) {
  return request(`/v3/mp/maintain/accept/${taskId}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 验收不通过
 * @param taskId
 * @param data
 * @returns
 */
export async function rejectTask(taskId: number, data: AcceptData) {
  return request(`/v3/mp/maintain/deny/${taskId}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 按状态查询保养任务数量
 * @param data
 * @returns
 */
export async function fetchTaskCountByStatus(
  data: IFetchTaskCountData = {},
  isAcl: boolean = true,
): ResponseBodyWithPromise<ITaskItemWithStatus[]> {
  const endpoint = isAcl
    ? '/v3/mp/maintain/stat/acl/status'
    : '/v3/mp/maintain/stat/status';
  return request(endpoint, {
    method: 'POST',
    data,
  });
}

export async function fetchTaskDetailWithTemplate(
  taskId: number,
): ResponseBodyWithPromise<ITaskDetailWithTemplate> {
  return request(`/v3/mp/maintain/info/${taskId}`);
}

/**
 * 获取设备当前维修和保养的状态
 */
export async function equipmentUnfinished(data: UnfinishedItem = {}) {
  return request(`/v3/mp/common/unfinished`, {
    method: 'POST',
    data,
  });
}

/**
 * 获取设备上次保养日期
 */
export async function fetchLastTaskTimeline(
  eventType: number,
  ids: number[],
): ResponseBodyWithPromise<ITimelineItem[]> {
  return request(`/v3/equipment/timeline/last/${eventType}`, {
    method: 'POST',
    data: ids,
  });
}

export async function cancelTask(taskId: number, data: AcceptData) {
  return request(`/v3/mp/maintain/cancel/${taskId}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 批量获取保养工单详情
 * @param data
 * @returns
 */
export async function batchFetchTaskDetails(
  data: IBatchFetchTaskDetailsData,
): ResponseBodyWithPromise<ITaskDetailsWithTemplateItem[]> {
  return request(`/v3/mp/maintain/batch/export`, {
    method: 'POST',
    data,
  });
}

/**
 * 导出保养记录
 * @param data
 * @param isXlsx
 */
export async function exportMaintenanceRecords(
  data: IFetchTasksData,
  isACL: boolean,
  isXlsx: boolean = true,
) {
  return request(
    `/v3/mp/maintain/${isACL ? 'acl/' : ''}work/order/export?isXlsx=${isXlsx}`,
    {
      method: 'POST',
      getResponse: true,
      responseType: 'blob',
      data,
    },
  );
}

/**
 * 获取可转单的工程师列表
 * @param data
 * @returns
 */
export async function queryEngineerListAPI(data: {
  crId?: number;
  orgId?: number;
  equipmentId?: number;
}) {
  return request(`/v3/mp/common/queryEngineerList`, {
    method: 'POST',
    data,
  });
}

/**
 * 发起转单
 * @param data
 * @returns
 */
export async function initiateTransferAPI(data: initiateTransferForm) {
  return request(`/v3/mp/common/initiateTransfer`, {
    method: 'POST',
    data,
  });
}

/**
 * 转单 撤单 拒绝
 * @param data
 * @returns
 */
export async function revocationOrRefuseAPI(data: {
  taskId: number;
  status: string;
}) {
  return request(`/v3/mp/common/revocationOrRefuse `, {
    method: 'POST',
    data,
  });
}
