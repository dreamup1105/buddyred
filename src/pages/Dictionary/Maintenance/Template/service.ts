import { request } from 'umi';
import type {
  ITemplateItem,
  IVersionItem,
  ITemplateContext,
  IFetchTemplatesData,
  ISaveTemplateData,
  IFetchVersionsData,
  ISaveTemplateRes,
  ISaveTemplateBasicInfoData,
} from './type';
/**
 * 查询保养模板列表
 * @param params
 * @param pageNum
 * @param pageSize
 * @returns
 */
export async function fetchTemplates(
  data: Partial<IFetchTemplatesData>,
  pageNum?: number,
  pageSize?: number,
): ResponseBodyWithPromise<ITemplateItem[]> {
  const url = pageNum
    ? `/v3/ms/spec/template/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : '/v3/ms/spec/template/list';
  return request(url, { method: 'POST', data });
}

/**
 * 查询保养模板基本信息
 * @param id 模板id
 */
export async function fetchTemplate(
  id: number,
): ResponseBodyWithPromise<ITemplateItem> {
  return request(`/v3/ms/spec/template/get/${id}`);
}

/**
 * 删除模板
 * @param id
 * @returns
 */
export async function deleteTemplate(id: number) {
  return request(`/v3/ms/spec/template/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 保存模板基本信息
 */
export async function saveTemplateBasicInfo(
  data: ISaveTemplateBasicInfoData,
): ResponseBodyWithPromise<ITemplateItem> {
  return request(`/v3/ms/spec/template/save`, {
    method: 'POST',
    data,
  });
}

/**
 * 查询模板内容
 */
export async function fetchTemplateContent(
  id: number,
  tempalteVerId: number,
): ResponseBodyWithPromise<ISaveTemplateData> {
  return request(
    `/v3/ms/spec/template/rtx/get/${id}?tempalteVerId=${tempalteVerId}`,
  );
}

/**
 * 保存模板内容
 * @param id
 * @param data
 * @returns
 */
export async function saveTemplateContent(
  id: number,
  data: ISaveTemplateData,
): ResponseBodyWithPromise<ISaveTemplateRes> {
  return request(`/v3/ms/spec/template/rtx/save/${id}`, {
    method: 'POST',
    data,
  });
}

/**
 * 获取保养规范版本列表
 * @param data
 * @returns
 */
export async function fetchVersions(
  data: IFetchVersionsData = {},
  pageNum?: number,
  pageSize?: number,
): ResponseBodyWithPromise<IVersionItem[]> {
  const url = pageNum
    ? `/v3/ms/spec/ver/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : `/v3/ms/spec/ver/list`;
  return request(url, {
    method: 'POST',
    data,
  });
}

/**
 * 获取保养模板上下文列表
 * @returns
 */
export async function fetchTemplateContext(): ResponseBodyWithPromise<
  ITemplateContext[]
> {
  return request(`/v3/ms/env`);
}
