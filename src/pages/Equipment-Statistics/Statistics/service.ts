import { request } from 'umi';
import type { statisticsForm } from './type';

/**
 * 签约医院数量/签约设备数量
 * @param data
 * @returns
 */
export async function statMainAPI(data: statisticsForm) {
  return request(`/v3/ms/statistical/eq/statMainByEq`, {
    method: 'POST',
    data,
  });
}

/**
 * 按照不同维度统计设备数量
 * @param data
 * @returns
 */
export async function statEqCntByConditionAPI(data: statisticsForm) {
  return request(`/v3/ms/statistical/eq/statEqCntByCondition`, {
    method: 'POST',
    data,
  });
}

/**
 * 查询签约设备信息列表
 * @param data
 * @returns
 */
export async function listCrEquipmentAPI(data: statisticsForm) {
  return request(`/v3/ms/statistical/eq/listCrEquipment`, {
    method: 'POST',
    data,
  });
}

/**
 * 签约设备信息导出Excel:
 * @param data
 * @returns
 */
export async function statisticalExportAPI(data: statisticsForm) {
  return request(`/v3/ms/statistical/eq/export`, {
    method: 'POST',
    data,
    getResponse: true,
    responseType: 'blob',
  });
}

/**
 * :维修公司根据设备id查询设备签约历史
 * @param data
 * @returns
 */
export async function listAgreementByEqIdAPI(eqId: number | undefined) {
  return request(`/v3/ms/statistical/eq/listAgreementByEqId?eqId=${eqId}`, {
    method: 'GET',
  });
}
