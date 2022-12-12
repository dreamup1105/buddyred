import { request } from 'umi';
import type { ScarpSearchItem, ScrapExportItem } from './type';

/**
 * 分页查询报废设备列表
 * @returns
 */
export function getEquipmentInfo(data: ScarpSearchItem) {
  return request(`/v3/pe/scrap/queryEquipmentListByPage`, {
    method: 'POST',
    data: data,
  });
}

/**
 * 根据设备Id获取报废详情
 * @returns
 */
export function getScrapInfoByEquipment(equipmentId: number) {
  return request(
    `/v3/pe/scrap/getScrapInfoByEquipmentId?equipmentId=${equipmentId}`,
    { method: 'GET' },
  );
}

/**
 * 报废设备导出
 * @returns
 */
export function ScarpEquipmentListExport(
  data: ScrapExportItem,
  isXlsx: boolean = true,
) {
  return request(`/v3/pe/scrap/scrapEquipmentList/export?isXlsx=${isXlsx}`, {
    method: 'POST',
    getResponse: true,
    responseType: 'blob',
    data: data,
  });
}
