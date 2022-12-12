import { request } from 'umi';
import type { IFetchInstantData, IFetchDetail, TimeInterval } from './type';

/**
 * 设备耗电
 * @param data
 * @returns
 */
export async function fetchInstantConsumption(
  isAcl: boolean,
  data: IFetchInstantData,
) {
  return request(
    `/v3/equipment/energy/consumption/${isAcl ? 'acl/' : ''}dept/equipment`,
    {
      method: 'POST',
      data,
    },
  );
}

/**
 * 科室设备瞬时电压电流详情
 * @param data
 * @returns
 */
export async function fetchInstantDetailConsumption(data: IFetchDetail) {
  return request(`/v3/equipment/energy/consumption/dept/equipment/detail`, {
    method: 'POST',
    data,
  });
}

/**
 * 科室设备瞬时电压电流 历史记录
 * @param data
 * @returns
 */
export async function consumPtionTimeIntervalAPI(data: TimeInterval) {
  return request(`/v3/equipment/energy/consumption/time/interval`, {
    method: 'POST',
    data,
  });
}
