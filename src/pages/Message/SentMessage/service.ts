import { request } from 'umi';
import type { IQueryCondition, IUserInfoSimple, IMessageItem } from './type';

export async function fetchMetaMessages(
  data: IQueryCondition = {},
  sortBy?: string,
  sortDirection?: string,
  pageNum?: number,
  pageSize?: number,
) {
  const url = `/msg/v1/reader/list/x?pageNum=${pageNum}&pageSize=${pageSize}`;
  return request(url, {
    method: 'POST',
    data,
  });
}

/**
 * 消息列表（用户）
 * @param data
 * @param sortBy
 * @param sortDirection
 * @param pageNum
 * @param pageSize
 * @returns
 */
export async function fetchUserMessages(
  data: IQueryCondition & { uid: number },
  sortBy?: string,
  sortDirection?: string,
  pageNum?: number,
  pageSize?: number,
): ResponseBodyWithPromise<IMessageItem[]> {
  const url = `/msg/v1/reader/list?pageNum=${pageNum}&pageSize=${pageSize}`;
  return request(url, {
    method: 'POST',
    data,
  });
}

export async function fetchUserSimpleInfo(uid: number) {
  return request(`/v3/user/simple/info/${uid}`);
}

/**
 * 批量获取用户基本信息
 * @param ids
 * @returns
 */
export async function batchFetchSimpleUserInfo(
  ids: number[],
): ResponseBodyWithPromise<(IUserInfoSimple & { uid: number })[]> {
  return request(`/v3/user/simple/infos`, {
    method: 'POST',
    data: ids,
  });
}
