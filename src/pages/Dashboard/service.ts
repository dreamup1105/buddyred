import { request } from 'umi';
import type { IOrgSummary, IInspectionStatItem, IAvatarItem } from './type';

/**
 * 获取机构汇总统计数据
 */
export async function fetchOrgSummary(
  orgId: number,
): ResponseBodyWithPromise<IOrgSummary> {
  return request(`/v3/org/getSummaryStat?orgId=${orgId}`);
}

/**
 * 巡检统计（PC大屏用）
 * @param data
 * @returns
 */
export async function fetchInspectionStat(data: {
  pageNum: number;
  pageSize: number;
}): ResponseBodyWithPromise<IInspectionStatItem[]> {
  return request('/v3/it/inspectionStat', {
    method: 'POST',
    data,
  });
}

/**
 * 获取工程师头像
 * @param orgId
 * @returns
 */
export async function fetchEngineersAvators(
  orgId: number,
): ResponseBodyWithPromise<IAvatarItem[]> {
  return request(`/v3/org/organization/getEngineerInfo/${orgId}`);
}
