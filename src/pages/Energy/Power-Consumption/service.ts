import { request } from 'umi';
import type { IFetchPowerConsumptionData } from './type';

/**
 * 科室耗电明细（单位kw/h）
 * @param data
 * @returns
 */
export async function fetchDepartmentPowerConsumption(
  isAcl: boolean,
  data: IFetchPowerConsumptionData,
) {
  return request(
    `/v3/equipment/energy/consumption/${isAcl ? 'acl/' : ''}dept/detail`,
    {
      method: 'POST',
      data,
    },
  );
}
