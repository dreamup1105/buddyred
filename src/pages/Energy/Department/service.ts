import { request } from 'umi';
import type { IFetchPowerConsumptionData, ICardItem } from './type';

/**
 * 科室耗电（统计汇总）
 * @param data
 * @returns
 */
export async function fetchPowerConsumption(
  isAcl: boolean,
  data: IFetchPowerConsumptionData,
): ResponseBodyWithPromise<{
  totalFaultEquipmentNo: number;
  totalEquipmentRto: number;
  deptEquipmentList: ICardItem[];
}> {
  return request(
    `/v3/equipment/energy/consumption/${
      isAcl ? 'acl/' : ''
    }hospital/equipment/detail`,
    {
      method: 'POST',
      data,
    },
  );
}
