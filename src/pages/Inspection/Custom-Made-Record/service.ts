import { request } from 'umi';
import type {
  selectEveryGroupFormItem,
  selectGroupFormItem,
  selectEquipmentFormItem,
} from './type';

/**
 * 定制巡检记录 - Tab页列表查询
 * @returns
 */
export function selectEveryGroupStatAPI(data: selectEveryGroupFormItem) {
  return request(`/v3/customization/selectEveryGroupStat`, {
    method: 'POST',
    data: data,
  });
}

/**
 * 定制巡检记录 - 自检组巡检记录列表
 * @returns
 */
export function selectGroupInspectionRecordAPI(data: selectGroupFormItem) {
  return request(`/v3/customization/selectGroupInspectionRecord`, {
    method: 'POST',
    data: data,
  });
}

/**
 * 定制巡检记录 - 查询每个自检组内的设备总数、正异常数量和设备列表
 * @returns
 */
export function selectEquipmentListAPI(data: selectEquipmentFormItem) {
  return request(`/v3/customization/selectEquipmentList`, {
    method: 'POST',
    data: data,
  });
}
