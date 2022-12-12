import { request } from 'umi';
import type { IFetchWorkingCondition } from './type';

/**
 * 查询工程师工作状态
 * @param data
 * @returns
 */
export async function getWorkingConditionAPI(data: IFetchWorkingCondition) {
  return request(`/v3/ms/statistical/getWorkingCondition`, {
    method: 'POST',
    data,
  });
}
