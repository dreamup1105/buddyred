import { request } from 'umi';
import type { IFetchEquipmentPowerConsumptionData } from './type';

/**
 * 设备耗电
 * @param data
 * @returns
 */
export async function fetchEquipmentPowerConsumption(
  isAcl: boolean,
  data: IFetchEquipmentPowerConsumptionData,
) {
  return request(
    `/v3/equipment/energy/consumption/${isAcl ? 'acl/' : ''}equipment/detail`,
    {
      method: 'POST',
      data,
    },
  );
}
