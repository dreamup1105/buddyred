import { request } from 'umi';
import type { IFetchEquipmentsParams } from './type';

/**
 * list 登录用户 最终有效授权设备（含显式、继承 和 蕴含固有）
 * @param params
 */
export async function fetchEquipments(
  data: IFetchEquipmentsParams,
  pageNum: number,
  pageSize: number,
) {
  return request(
    `/v3/equipment/view/acl/list?pageNum=${pageNum}&pageSize=${pageSize}`,
    {
      method: 'POST',
      data,
    },
  );
}

/**
 * list 指定employee最终有效授权设备（含显式、继承 和 蕴含固有）
 * @param data
 * @param pageNum
 * @param pageSize
 * @param employeeId
 */
export async function fetchEquipmentsByEmployeeId(
  data: IFetchEquipmentsParams,
  pageNum: number,
  pageSize: number,
  employeeId: number,
) {
  return request(
    `/v3/equipment/view/acl/list/${employeeId}?pageNum=${pageNum}&pageSize=${pageSize}`,
    {
      method: 'POST',
      data,
    },
  );
}

/**
 *   list 特定principal的授权设备（仅显式授权）。例如:
 *   1) 设: departmentA(equipmentA1, euipmentA2), departmentB(equipmentB1, equipmentB2), deaprtmentC(employeeE1).
 *   2) 有如下授权: a)departmentA授予deaprtmentC, b)equipmentA2授予 employeeE1, c)departmentB授予employeeE1.
 *   3) 则employeeE1有: b/c两项显式授权(即 A2,B1,B2)， 不包含从departmentC继承的A1.
 *   (签约申请时，展示给维修商用户 选择签约设备的界面 需要此接口: 以maintainTeam id为principalId) )
 *   (如果工程师界面是以不同签约机构分别查看设备的 也可以选定team id查询)
 * @param data
 * @param pageNum
 * @param pageSize
 * @param principalId
 */
export async function fetchEquipmentsByPrincipal(
  data: IFetchEquipmentsParams,
  pageNum: number,
  pageSize: number,
  principalId: number,
) {
  return request(
    `/v3/equipment/view/acl/list/explicit/${principalId}?pageNum=${pageNum}&pageSize=${pageSize}`,
    {
      method: 'POST',
      data,
    },
  );
}

/**
 * 获取设备制造商
 */
export async function fetchManufactures(
  q: string = '',
  pageNum?: number,
  pageSize?: number,
) {
  const endpoint = pageNum
    ? `/v3/prd/equipment/manufacturer/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : `/v3/prd/equipment/manufacturer/list`;
  return request(endpoint, {
    method: 'POST',
    data: {
      q,
    },
  });
}

/**
 * 获取设备名称
 * @param manufacturerId 厂商ID
 * @param q 搜索关键字
 * @param pageNum
 * @param pageSize
 */
export async function fetchProducts(
  manufacturerId: number,
  q: string = '',
  pageNum?: number,
  pageSize?: number,
) {
  const endpoint = pageNum
    ? `/v3/prd/product/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : `/v3/prd/product/list`;
  return request(endpoint, {
    method: 'POST',
    data: {
      q,
      manufacturerId,
    },
  });
}

/**
 * 获取型号
 * @param productId
 * @param q
 * @param pageNum
 * @param pageSize
 */
export async function fetchModels(
  productId: number,
  q: string = '',
  pageNum?: number,
  pageSize?: number,
) {
  const endpoint = pageNum
    ? `/v3/prd/model/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : `/v3/prd/model/list`;
  return request(endpoint, {
    method: 'POST',
    data: {
      q,
      productId,
    },
  });
}
