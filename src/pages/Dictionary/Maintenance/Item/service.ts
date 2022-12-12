import { request } from 'umi';
import type {
  IFetchMaintainItemsData,
  IMaintainItem,
  IMaintainItemDetail,
  IFetchMaintainItemDetailsData,
  ISystemMaintainItemAndDetails,
  SpecVerCreate,
} from './type';

/**
 * 查询保养项目列表
 * @param data
 * @param pageNum
 * @param pageSize
 * @returns
 */
export async function fetchMaintainItems(
  data: Partial<IFetchMaintainItemsData>,
  pageNum?: number,
  pageSize?: number,
): ResponseBodyWithPromise<IMaintainItem[]> {
  const url = pageNum
    ? `/v3/ms/spec/uds/mi/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : '/v3/ms/spec/uds/mi/list';
  return request(url, { method: 'POST', data });
}

/**
 * 查询保养项目
 * @param miId
 * @returns
 */
export async function fetchMaintainItem(
  miId: number,
): ResponseBodyWithPromise<IMaintainItem> {
  return request(`/v3/ms/spec/uds/mi/get/${miId}`);
}

/**
 * 保存保养项目及对应明细指标
 * @param data
 * @returns
 */
export async function saveMaintainItemAndDetails(data: {
  maintainItem: IMaintainItem;
  tags: string[];
  maintainItemDetails: IMaintainItemDetail[];
}) {
  return request('/v3/ms/spec/uds/save', {
    method: 'POST',
    data: {
      mi: data.maintainItem,
      itemTags: data.tags,
      details: data.maintainItemDetails,
    },
  });
}

/**
 *
 * @returns
 */
export async function fetchSystemMaintainItemsAndDetails(): ResponseBodyWithPromise<ISystemMaintainItemAndDetails> {
  return request(`/v3/ms/spec/sds/specs`);
}

/**
 * 删除保养项目
 */
export async function deleteMaintainItem(miId: number) {
  return request(`/v3/ms/spec/uds/mi/delete/${miId}`, {
    method: 'DELETE',
  });
}

/**
 * 查询保养项目下的保养明细列表
 */
export async function fetchMaintainItemDetails(
  data: Partial<IFetchMaintainItemDetailsData>,
  pageNum?: number,
  pageSize?: number,
): ResponseBodyWithPromise<IMaintainItemDetail[]> {
  const url = pageNum
    ? `/v3/ms/spec/uds/di/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : '/v3/ms/spec/uds/di/list';
  return request(url, { method: 'POST', data });
}

/**
 * 查询保养项目下的明细指标项
 * @params diId 明细项id
 * @returns
 */
export async function fetchMaintainItemDetail(
  diId: number,
): ResponseBodyWithPromise<IMaintainItemDetail> {
  return request(`/v3/ms/spec/uds/di/get/${diId}`);
}

/**
 * 保存明细指标项
 * @params data 指标项表单数据
 */
export async function saveMaintainItemDetail(
  data: IMaintainItemDetail,
): ResponseBodyWithPromise<IMaintainItemDetail> {
  return request(`/v3/ms/spec/uds/di/save`, {
    method: 'POST',
    data,
  });
}

/**
 * 删除保养项目下的明细指标项
 * @params diId 明细项id
 */
export async function deleteMaintainItemDetail(diId: number) {
  return request(`/v3/ms/spec/uds/di/delete/${diId}`, {
    method: 'DELETE',
  });
}

/**
 * 创建保养规范版本
 * @param tag
 * @returns
 */
export async function createVersion(data: SpecVerCreate) {
  return request(`/v3/ms/spec/ver/create`, {
    method: 'POST',
    data,
  });
}
