import { request } from 'umi';
import type { EquipmentDistributionItem, EquipmentTypeStatItem, IRepairSummary, IMaintenanceTrend } from './type';

/**
 * 设备分布
 * @param group 代表类型下的二级分类统计，传参为name/alias分别代表二级分类统计按name/alias统计
 * @param equipmentTypeName 设备类型名称
 */
 export async function fetchEquipmentDistributionsStat(
  group: 'name' | 'alias' = 'name',
  equipmentTypeName?: string,
  isACL?: boolean
): ResponseBodyWithPromise<EquipmentDistributionItem[]> {
  const url = `/v3/census/${isACL ? 'acl/' : ''}equipment/dist`;
  return request(url, {
    params: {
      group,
      typeName: equipmentTypeName,
    },
  });
}

/**
 * 获取科室维度的设备分类统计数据
 * @param departmentIds 
 * @returns 
 */
export async function fetchEquipmentTypesByDepartmentsStat(
  group: 'name' | 'alias' = 'name',
  departmentIds: number[]
): ResponseBodyWithPromise<EquipmentTypeStatItem[]> {
  return request(`/v3/census/equipment/list`, {
    params: {
      group,
      departmentIds,
    },
  });
}

/**
 * 维修分析汇总统计
 * @param orgId 
 * @returns 
 */
export async function fetchRepairSummaryStat(orgId: number, departmentIds: number[]): ResponseBodyWithPromise<IRepairSummary> {
  return request(`/v3/org/repairAnalysis/summary`, {
    method: 'POST',
    data: {
      orgId,
      departmentIds,
    }
  });
}


/**
 * 维修趋势（费用｜次数）
 * @param data 
 * @returns 
 */
export async function fetchRepairTrendStat(data: {
  orgId: number;
  dimension: number;
  departmentIds: number[];
  startTime?: string;
  endTime?: string;
}): ResponseBodyWithPromise<Record<string, {
  month: string;
  quarter: string;
  repairCount: number;
  repairFee: number;
  statDimensionKey: string;
  year: number;
}>> {
  return request(`/v3/org/repairAnalysis/trend`, {
    method: 'POST',
    data,
  });
}

/**
 * 保养趋势（柱状图+折线图）
 * @param data 
 * @returns 
 */
export async function fetchMaintenanceTrendStat(data: {
  orgId: number;
  dimension: number;
  departmentIds: number[]
  startTime?: string;
  endTime?: string;
}): ResponseBodyWithPromise<IMaintenanceTrend> {
  return request(`/v3/org/maintainAnalysis/trend`, {
    method: 'POST',
    data,
  });
}

/**
 * 保养分析汇总统计
 * @returns 
 */
export async function fetchMaintenanceSummaryStat(orgId: number, departmentIds: number[]): ResponseBodyWithPromise<{maintainCount: number; typeName: string}[]> {
  return request('/v3/org/maintainAnalysis/summary', {
    method: "POST",
    data: {
      orgId,
      departmentIds,
    },
  });
}