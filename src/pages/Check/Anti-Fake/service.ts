import { request } from 'umi';
import type { IFetchTableFormItem, IFetchDetailItem } from './type';

/**
 * 分页查询设备检测单防伪信息
 * @param data
 * @returns
 */
export async function securityListByPageAPI(data: IFetchTableFormItem) {
  return request(`/v3/detection/security/listByPage`, {
    method: 'POST',
    data,
  });
}

/**
 * 保存或更新设备检测单防伪信息
 * @param data
 * @returns
 */
export async function securitySaveOrUpdateAPI(data: IFetchDetailItem) {
  return request(`/v3/detection/security/saveOrUpdate`, {
    method: 'POST',
    data,
  });
}

/**
 * 根据防伪码获取设备检测单防伪信息
 * @param securityCode
 * @returns
 */
export async function securityGetBySecurityCodeAPI(securityCode: string) {
  return request(
    `/v3/detection/security/getBySecurityCode?securityCode=${securityCode}`,
    {
      method: 'GET',
    },
  );
}

/**
 * 根据防伪信息Id将设备检测单防伪信息置为无效
 * @param id
 * @returns
 */
export async function securityInvalidSecurityByIdAPI(id?: string) {
  return request(`/v3/detection/security/invalidSecurityById?id=${id}`, {
    method: 'GET',
  });
}
