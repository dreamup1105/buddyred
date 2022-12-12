import { request } from 'umi';
import type {
  IFetchInspectionStatData,
  InspectionStatItem,
  IFetchEquipmentsStatData,
  IEquipmentStatItem,
  ICheckAcceptanceOrderItem,
  ICheckAcceptanceOrderDetailItem,
  IFetchInspectionRecordsData,
  fetchDepartmentInspectionStatDate,
  queryInspections,
  statisticsType,
  queryAllPassItem,
} from './type';

/**
 * 查询时间段内每天的某些科室的设备正异常总数，此接口为医生和工程师使用，
 * 对于医生来说是查询自己授权科室的设备，对于工程师来说是查询与自己team签约的设备
 * @param data
 */
export async function fetchACLInspectionStat(
  data: IFetchInspectionStatData,
): ResponseBodyWithPromise<InspectionStatItem[]> {
  return request(`/v3/it/acl/dayList`, {
    method: 'POST',
    data,
  });
}

/**
 * 查询全院设备时间段内每天的正异常总数，此接口为拥有全院设备权限（设备管理员）使用
 * @param data
 * @returns
 */
export async function fetchInspectionStat(
  data: IFetchInspectionStatData,
): ResponseBodyWithPromise<InspectionStatItem[]> {
  return request(`/v3/it/dayList`, {
    method: 'POST',
    data,
  });
}

// 查询某天医院(所有|部分)科室巡检情况
export async function fetchDepartmentInspectionStat(
  data: fetchDepartmentInspectionStatDate,
  isACL: boolean,
): ResponseBodyWithPromise {
  const url = isACL ? '/v3/it/acl/dayList/detail' : '/v3/it/dayList/detail';
  return request(url, {
    method: 'POST',
    data,
  });
}

// 查询时间段内某些科室设备的巡检情况（医生/工程师）
export async function fetchACLInspectionEquipments(
  data: IFetchEquipmentsStatData,
): ResponseBodyWithPromise<IEquipmentStatItem[]> {
  return request(`/v3/it/acl/getEquipments`, {
    method: 'POST',
    data,
  });
}

// 查询时间段内某些科室设备的巡检情况（全院设备）
export async function fetchInspectionEquipments(
  data: IFetchEquipmentsStatData,
): ResponseBodyWithPromise<{
  abnormalCount: number;
  aclCount: number;
  auditStatus: string;
  count: number;
  departmentId: number;
  departmentName: string;
  normalCount: number;
  equipmentDetails: IEquipmentStatItem[];
  timeQuantum: string;
}> {
  return request(`/v3/it/department/detail`, {
    method: 'POST',
    data,
  });
}

// 查询验收单（工程师/医生）team ID，如果当前人是医生，此值传0
export async function fetchACLPendingInspectionOrders(
  crId: number | undefined,
  isMaintainer: boolean,
): ResponseBodyWithPromise<ICheckAcceptanceOrderItem[]> {
  const url = isMaintainer
    ? `/v3/it/acl/queryInspectionAuditAcl/${crId}`
    : '/v3/it/acl/queryInspectionAuditAcl';
  return request(url);
}

// 查询验收单（全院设备）
export async function fetchPendingInspectionOrders(): ResponseBodyWithPromise<
  ICheckAcceptanceOrderItem[]
> {
  return request('/v3/it/queryInspectionAuditAcl');
}

// 查询验收单明细
export async function fetchPendingInspectionOrderDetails(
  inspectionAuditId: number,
  inspectionFlag: number, // 0: 未巡检 1: 已巡检
): ResponseBodyWithPromise<ICheckAcceptanceOrderDetailItem[]> {
  return request(
    `/v3/it/acl/queryInspectionAuditDetail/${inspectionAuditId}?inspectionFlag=${inspectionFlag}`,
  );
}

// 验收通过｜不通过
export async function checkInspectionDone(data: {
  auditResult: boolean;
  inspectionAuditId: number;
  remake?: string;
}) {
  return request(`/v3/it/auditComplete`, {
    method: 'POST',
    data,
  });
}

// 撤回巡检数据验收申请
export async function revokeInspectionApplication(data: {
  departmentId: number;
  crId?: number;
}) {
  return request(`/v3/it/revocationAccept`, {
    method: 'POST',
    data,
  });
}

/**
 * 巡检列表查询
 * @param data
 * @returns
 */
export async function fetchInspectionRecords(
  data: Partial<IFetchInspectionRecordsData>,
  isACL: boolean,
) {
  return request(`/v3/it/${isACL ? 'acl/' : ''}list`, {
    method: 'POST',
    data,
  });
}

/**
 * 导出巡检记录
 * @param data
 * @param isXlsx
 */
export async function exportInspectionRecords(
  data: {
    startDate: string;
    endDate: string;
  },
  isACL: boolean,
  isXlsx: boolean = true,
) {
  return request(
    `/v3/it/${isACL ? 'acl/' : ''}work/order/export?isXlsx=${isXlsx}`,
    {
      method: 'POST',
      data,
      getResponse: true,
      responseType: 'blob',
    },
  );
}

/**
 * 科室巡检统计导出Excel
 * @returns
 */
export async function exportStatistic(
  data: statisticsType,
  isACL: boolean,
  isXlsx: boolean = true,
) {
  return request(
    `/v3/it/${
      isACL ? 'acl/' : ''
    }departments/statistics/export?isXlsx=${isXlsx}`,
    {
      method: 'POST',
      data,
      getResponse: true,
      responseType: 'blob',
    },
  );
}

/**
 * 日巡检中查询日历组件时间段内每天是否有巡检数据
 * @returns
 */
export async function queryInspectionSituationAPI(
  isACL: boolean,
  data: queryInspections,
) {
  return request(
    `${
      isACL
        ? '/v3/it/acl/queryInspectionSituationAcl'
        : '/v3/it/queryInspectionSituation'
    }`,
    {
      method: 'POST',
      data,
    },
  );
}

/**
 * 待验收 一键验收
 * @returns
 */
export async function queryAllPass(data: queryAllPassItem) {
  return request(`/v3/it/allPass`, {
    method: 'POST',
    data,
  });
}
