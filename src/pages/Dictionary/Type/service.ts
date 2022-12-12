import { request } from 'umi';

/**
 * 获取设备类型对应的保养项目
 * @param equipmentTypeId 设备类型ID
 */
export async function fetchMaintainProjectsByEquipTypeId(
  equipmentTypeId: number,
) {
  return request(`/v3/dict/type2maintain/list/${equipmentTypeId}`);
}

/**
 * 保存设备类型对应的保养项(全量)
 * @param equipmentTypeId 设备类型id
 * @param projectIds  保养项目的id数组
 */
export async function saveMaintainProjectsOfEquipmentType(
  equipmentTypeId: number,
  projectIds: number[],
) {
  return request(`/v3/dict/type2maintain/save/${equipmentTypeId}`, {
    method: 'POST',
    data: projectIds,
  });
}
