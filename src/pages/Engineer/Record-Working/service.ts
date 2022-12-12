import { request } from 'umi';
import type { IfetchWorkingRecord } from './type';

/**
 * 工程师工作记录统计
 * @param data
 * @returns
 */
export async function getWorkingRecordAPI(data: IfetchWorkingRecord) {
  return request(`/v3/ms/statistical/getWorkingRecord`, {
    method: 'POST',
    data,
  });
}

/**
 * 工程师工作记录统计导出Excel
 * @param data
 * @returns
 */
export async function workingRecordExportAPI(data: IfetchWorkingRecord) {
  return request(`/v3/ms/statistical/workingRecord/export`, {
    method: 'POST',
    data,
    getResponse: true,
    responseType: 'blob',
  });
}
