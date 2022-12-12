import { request } from 'umi';
import type {
  IAdverseEventItem,
  IAdverseEventDetailItem,
  IAdverseEventParams,
} from './type';

/**
 * 查询不良事件列表
 * @param data
 * @returns
 */
export async function fetchAdverseEvents(
  isAcl: boolean,
  data: {
    orgId: number;
    pageNum: number;
    pageSize: number;
    searchText: string;
    reportDate?: {
      maxValue?: string;
      minValue?: string;
    };
    happenDate?: {
      maxValue?: string;
      minValue?: string;
    };
  },
): ResponseBodyWithPromise<IAdverseEventItem[]> {
  const url = isAcl
    ? '/v3/org/adverseEvent/acl/list'
    : '/v3/org/adverseEvent/list';
  return request(url, {
    method: 'POST',
    data,
  });
}

/**
 * 查询不良事件详情
 * @param eventId
 * @returns
 */
export async function fetchAdverseEventDetail(
  eventId: number,
): ResponseBodyWithPromise<IAdverseEventDetailItem> {
  return request(`/v3/org/adverseEvent/detail?eventId=${eventId}`);
}

/**
 * 获取不良事件参数
 * @returns
 */
export async function fetchAdverseEventParams(): ResponseBodyWithPromise<IAdverseEventParams> {
  return request(`/v3/org/adverseEvent/param`);
}

/**
 * 删除不良事件记录
 * @param eventId
 * @returns
 */
export async function deleteAdverseEvent(eventId: number) {
  return request(`/v3/org/adverseEvent/delete?eventId=${eventId}`);
}

/**
 * 创建不良事件
 * @param data
 * @returns
 */
export async function saveAdverseEvent(data: {
  adverseResult: string;
  equipmentId: number;
  equipmentName: string;
  eventLevel: string;
  eventTypeList: string[];
  happenPlace: string;
  happenTime: string;
  personTitle: string;
  personType: string;
  personWorkYears: number;
  reportTime: string;
  siteSituation: string;
}) {
  return request(`/v3/org/adverseEvent/create`, {
    method: 'POST',
    data,
  });
}

/**
 * 导出一份不良事件报告
 * @param id
 * @returns
 */
export function exportAdverseEvent(id: number) {
  return `/v3/export/adverseEvent/${id}`;
}

/**
 * 导出不良事件上报记录
 * @param orgId
 * @param isXlsx
 * @returns
 */
export function exportAdverseEventReportRecords(
  orgId: number,
  isXlsx: boolean,
) {
  return `/v3/export/adverseEvent/list?orgId=${orgId}&isXlsx=${isXlsx}`;
}

/**
 * 导出多份不良事件报告（zip形式导出）
 * @param ids
 * @returns
 */
export function batchExportAdverseEvent(ids: number[]) {
  return `/v3/export/adverseEvent/zip?ids=${ids}`;
}
