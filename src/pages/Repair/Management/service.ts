import { request } from 'umi';
import type {
  IFetchTaskCountData,
  ITaskItemWithStatus,
} from '@/pages/Maintenance/type';
import type {
  InitRepairData,
  InitRepairRes,
  IFetchTasksData,
  IRepairReport,
  ITaskTimelineItem,
  IBatchFetchRepairReportData,
  IBatchRepairReportItem,
} from './type';

/**
 * 获取医院客户关系对应的所有维修公司以及配置的工程师信息列表
 * @returns
 */
export async function fetchListCrOrg() {
  return request('/v3/cr/listCrOrg', {
    method: 'GET',
  });
}

/**
 * 发起简易报修
 * @returns
 */
export async function fetchSimplaRepairInit(params: InitRepairData) {
  return request('/v3/mp/repair/simpleRepairInit', {
    method: 'POST',
    data: params,
  });
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
  const endpoint = isAcl ? '/v3/mp/repair/acl/list' : '/v3/mp/repair/list';
  const url = pageNum
    ? `${endpoint}?pageNum=${pageNum}&pageSize=${pageSize}`
    : endpoint;
  return request(url, {
    method: 'POST',
    data,
  });
}

/**
 * 按状态查询维修任务数量
 * @param data
 * @returns
 */
export async function fetchTaskCountByStatus(
  data: IFetchTaskCountData = {},
  isAcl: boolean = true,
): ResponseBodyWithPromise<ITaskItemWithStatus[]> {
  const endpoint = isAcl
    ? '/v3/mp/repair/stat/acl/status'
    : '/v3/mp/repair/stat/status';
  return request(endpoint, {
    method: 'POST',
    data,
  });
}

/**
 * 发起维修
 * @param data
 * @returns
 */
export async function initRepair(
  data: InitRepairData,
): ResponseBodyWithPromise<InitRepairRes> {
  return request('/v3/mp/repair/init', { method: 'POST', data });
}

/**
 * 撤单
 * @param taskId
 * @param data
 * @returns
 */
export async function cancelTask(
  taskId: number,
  data: {
    employeeId: number;
    employeeName: string;
    reason?: string;
  },
) {
  return request(`/v3/mp/repair/cancel/${taskId}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 维修通过
 * @param taskId
 * @param data
 * @returns
 */
export async function accept(
  taskId: number,
  data: {
    employeeId: number;
    employeeName: string;
    reason?: string;
    taskScore?: number;
  },
) {
  return request(`/v3/mp/repair/accept/${taskId}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 维修不通过 - 继续维修
 * @param taskId
 * @param data
 * @returns
 */
export async function reject(
  taskId: number,
  data: {
    employeeId: number;
    employeeName: string;
    reason?: string;
  },
) {
  return request(`/v3/mp/repair/deny/${taskId}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 获取维修报告详情
 * @param equipmentId
 * @param taskId
 * @returns
 */
export async function fetchRepairReport(
  equipmentId: number,
  taskId: number,
): ResponseBodyWithPromise<IRepairReport> {
  return request(
    `/v3/mp/repair/report/info?equipmentId=${equipmentId}&taskId=${taskId}`,
  );
}

/**
 * 批量获取维修报告详情
 * @param data
 * @returns
 */
export async function batchFetchRepairReport(
  data: Partial<IBatchFetchRepairReportData>,
): ResponseBodyWithPromise<IBatchRepairReportItem[]> {
  return request(`/v3/mp/repair/batch/export`, {
    method: 'POST',
    data,
  });
}

/**
 * 工程师接单
 * @param taskId
 * @param data
 * @returns
 */
export async function takeOrder(
  taskId: number,
  data: {
    crId: number | null;
    engineerId: number | any;
    engineerName: string | any;
  },
) {
  return request(`/v3/mp/repair/assign/${taskId}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 获取保养/维护/巡检单的操作详情
 * @param taskId
 * @returns
 */
export async function fetchTaskTimelineDetail(
  taskId: number,
): ResponseBodyWithPromise<ITaskTimelineItem[]> {
  return request(`/v3/mp/common/operationDetails?taskId=${taskId}`);
}

/**
 * 导出维修工单
 * @param data
 * @param isXlsx
 */
export async function exportRepairRecords(
  data: IFetchTasksData,
  isACL: boolean,
  isXlsx: boolean = true,
) {
  return request(
    `/v3/mp/repair/${isACL ? 'acl/' : ''}work/order/export?isXlsx=${isXlsx}`,
    {
      method: 'POST',
      getResponse: true,
      responseType: 'blob',
      data,
    },
  );
}
