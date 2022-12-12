import { request } from 'umi';
import type { IQueryCondition, ISaveMetaData } from './type';

export async function fetchMetaDataList(
  data: IQueryCondition = {},
  sortBy?: string,
  sortDirection?: string,
  pageNum?: number,
  pageSize?: number,
) {
  const url = `/msg/v1/meta/list?pageNum=${pageNum}&pageSize=${pageSize}`;
  return request(url, {
    method: 'POST',
    data,
  });
}

export async function saveMetaData(data: ISaveMetaData) {
  const url = `/msg/v1/meta/save`;
  return request(url, {
    method: 'POST',
    data,
  });
}

export async function deleteMetaData(id: string) {
  const url = `/msg/v1/meta/delete/${id}`;
  return request(url, {
    method: 'DELETE',
  });
}

/**
 * 同步(dev库中的scope为prod的模板消息同步至prod库.)
 * @returns
 */
export async function syncMeta() {
  return request('/msg/v1/meta/sync', {
    method: 'PUT',
  });
}
