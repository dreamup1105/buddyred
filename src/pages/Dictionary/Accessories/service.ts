import { request } from 'umi';
import type {
  ISaveManufacturerData,
  ISaveProductData,
  IFetchProductsData,
  ISaveModelData,
  IFetchModelsData,
  IManufacturerItem,
  IProductItem,
  IModelItem,
  BizType,
} from './type';

/**
 * 保存制造商
 * @param equipmentTypeId 设备类型id
 * @param projectIds  保养项目的id数组
 */
export async function saveManufacturer(
  type: BizType,
  data: ISaveManufacturerData,
) {
  return request(`/v3/prd/${type}/manufacturer/save`, {
    method: 'POST',
    data,
  });
}

/**
 * 删除制造商
 * @param id
 */
export async function delManufacturer(type: BizType, id: number) {
  return request(`/v3/prd/${type}/manufacturer/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取制造商列表
 * @param id
 */
export async function fetchManufacturers(
  type: BizType,
  q: string,
  pageNum?: number,
  pageSize?: number,
  requestOptions?: IRequestOptions,
): ResponseBodyWithPromise<IManufacturerItem[]> {
  const endpoint = pageNum
    ? `/v3/prd/${type}/manufacturer/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : `/v3/prd/${type}/manufacturer/list`;
  return request(endpoint, {
    method: 'POST',
    data: {
      q,
    },
    ...requestOptions,
  });
}

/**
 * 获取某一制造商
 * @param id
 */
export async function fetchManufacturer(type: BizType, id: number) {
  return request(`/v3/prd/${type}/manufacturer/get/${id}`);
}

/**
 * 保存产品品名
 * @param data
 */
export async function saveProduct(type: BizType, data: ISaveProductData) {
  return request(`/v3/prd/${type}/product/save`, {
    method: 'POST',
    data,
  });
}

/**
 * 删除产品品名
 * @param id
 */
export async function delProduct(type: BizType, id: number) {
  return request(`/v3/prd/${type}/product/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取产品列表
 * @param id
 */
export async function fetchProducts(
  type: BizType,
  data: IFetchProductsData,
  pageNum?: number,
  pageSize?: number,
  requestOptions?: IRequestOptions,
): ResponseBodyWithPromise<IProductItem[]> {
  const endpoint = pageNum
    ? `/v3/prd/${type}/product/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : `/v3/prd/${type}/product/list`;
  return request(endpoint, {
    method: 'POST',
    data,
    ...requestOptions,
  });
}

/**
 * 获取某一产品
 * @param id
 */
export async function fetchProduct(type: BizType, id: number) {
  return request(`/v3/prd/${type}/product/get/${id}`);
}

/**
 * 保存型号
 * @param data
 */
export async function saveModel(type: BizType, data: ISaveModelData) {
  return request(`/v3/prd/${type}/model/save`, {
    method: 'POST',
    data,
  });
}

/**
 * 删除型号
 * @param id
 */
export async function delModel(type: BizType, id: number) {
  return request(`/v3/prd/${type}/model/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取型号列表
 * @param id
 */
export async function fetchModels(
  type: BizType,
  data: IFetchModelsData,
  pageNum?: number,
  pageSize?: number,
  requestOptions?: IRequestOptions,
): ResponseBodyWithPromise<IModelItem[]> {
  const endpoint = pageNum
    ? `/v3/prd/${type}/model/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : `/v3/prd/${type}/model/list`;
  return request(endpoint, {
    method: 'POST',
    data,
    ...requestOptions,
  });
}

/**
 * 获取某一型号
 * @param id
 */
export async function fetchModel(type: BizType, id: number) {
  return request(`/v3/prd/${type}/model/get/${id}`);
}

/**
 * 替换制造商
 * @param srcId
 * @param targetId
 * @param doDelete
 */
export async function replaceManufacturer(
  type: BizType,
  srcId: number,
  targetId: number,
  doDelete?: boolean,
) {
  return request(
    `/v3/prd/${type}/manufacturer/replace/${srcId}/${targetId}?doDelete=${doDelete}`,
    {
      method: 'PUT',
    },
  );
}

/**
 * 替换产品
 * @param srcId
 * @param targetId
 * @param doDelete
 */
export async function replaceProduct(
  type: BizType,
  srcId: number,
  targetId: number,
  doDelete?: boolean,
) {
  return request(
    `/v3/prd/${type}/product/replace/${srcId}/${targetId}?doDelete=${doDelete}`,
    {
      method: 'PUT',
    },
  );
}

/**
 * 替换型号
 * @param srcId
 * @param targetId
 * @param doDelete
 */
export async function replaceModel(
  type: BizType,
  srcId: number,
  targetId: number,
  doDelete?: boolean,
) {
  return request(
    `/v3/prd/${type}/model/replace/${srcId}/${targetId}?doDelete=${doDelete}`,
    {
      method: 'PUT',
    },
  );
}
