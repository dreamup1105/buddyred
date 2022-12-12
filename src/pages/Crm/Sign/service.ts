import { request } from 'umi';
import type {
  IGenDraftSignData,
  IFetchSignListData,
  IFetchCompanyListData,
  ICompanyItem,
  ISignContent,
  ISignEquipmentItem,
} from './type';

/**
 * 生成签约草稿
 */
export async function genDraftSign(
  data: IGenDraftSignData,
): ResponseBodyWithPromise<ISignContent> {
  return request(`/v3/cr/agreement/draft`, {
    method: 'POST',
    data,
  });
}

/**
 * 查询签约列表
 */
export async function fetchSignList(
  data: Partial<IFetchSignListData>,
): ResponseBodyWithPromise<ISignContent[]> {
  return request(`/v3/cr/agreement/list`, {
    method: 'POST',
    data,
  });
}

/**
 * 获取签约公司
 * @returns
 */
export async function fetchCompanyList(
  data?: IFetchCompanyListData,
): ResponseBodyWithPromise<ICompanyItem[]> {
  return request(`/v3/cr/company/list`, {
    method: 'POST',
    data,
  });
}

/**
 * 保存选择的设备
 * @param id
 * @param equipmentIds
 * @param isFullSelectMode 是否为全选模式
 * @returns
 */
export async function saveSignEquipments(
  id: number,
  equipmentIds: number[],
  isFullSelectMode: boolean,
) {
  const url = isFullSelectMode
    ? '/v3/cr/agreement/equipment/storage/x'
    : '/v3/cr/agreement/equipment/storage';

  return request(url, {
    method: 'PUT',
    data: {
      id,
      equipmentIds,
    },
  });
}

/**
 * 确定签约
 * @param id  签约草稿id
 * @returns
 */
export async function ensureSign(id: number) {
  return request(`/v3/cr/agreement/ensure/${id}`, {
    method: 'PUT',
  });
}

/**
 * 删除草稿状态的签约
 * @param signId 签约id
 * @returns
 */
export async function deleteDraftSign(signId: number) {
  return request(`/v3/cr/agreement/delete/${signId}`, {
    method: 'DELETE',
  });
}

/**
 * 终止签约
 * @param signId
 * @returns
 */
export async function terminateSign(signId: number) {
  return request(`/v3/cr/agreement/terminated/${signId}`, {
    method: 'PUT',
  });
}

/**
 * 查询签约设备
 */
export async function fetchSignEquipments(data: {
  aid: number;
  departmentId?: string;
  name?: string;
  pageNum?: number;
  pageSize?: number;
  tag?: string;
}): ResponseBodyWithPromise<ISignEquipmentItem[]> {
  return request(`/v3/cr/agreement/equipment/list`, {
    method: 'POST',
    data,
  });
}

/**
 * 查询签约基本信息
 * @param signId
 * @returns
 */
export async function fetchSignDetail(
  signId: number,
): ResponseBodyWithPromise<ISignContent> {
  return request(`/v3/cr/agreement/${signId}`);
}

/**
 * 获取复制的签约基本信息
 * @param signId
 * @returns
 */
export async function fetchCopySignDetail(
  signId: number,
): ResponseBodyWithPromise<ISignContent> {
  return request(`/v3/cr/agreement/copy/${signId}`, {
    method: 'POST',
  });
}

/**
 * 删除签约设备
 * @param data
 * @returns
 */
export async function deleteEquipment(data: {
  id: number;
  equipmentIds: number[];
}) {
  return request(`/v3/cr/agreement/equipment/remove`, {
    method: 'PUT',
    data,
  });
}

/**
 * 根据签约id查询所有签约设备所在科室
 * @returns
 */
export async function listAgreementHosDeptAPI(agreeId?: number) {
  return request(`/v3/cr/agreement/listAgreementHosDept?agreeId=${agreeId}`, {
    method: 'GET',
  });
}
