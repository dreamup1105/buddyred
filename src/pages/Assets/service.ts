import { request } from 'umi';
import type { NameDictionarysEnum } from '@/utils/constants';
import type {
  IFetchEquipmentsData,
  IExportEquipmentData,
  ISaveEquipmentData,
  IFetchImportTasksData,
  IFetchTagsData,
  IManufacturerItem,
  IFetchEquipmentTimelineData,
  IProductItem,
  ITimelineItem,
  IModelItem,
  IAccessoriesItem,
  IModelView,
  EquipmentDetail,
  EquipmentDetailEx,
  labelItem
} from './type';

/**
 * 设备查询
 * @param params
 */
export async function fetchEquipments(
  data: IFetchEquipmentsData,
  pageNum: number,
  pageSize: number,
) {
  return request(`/v3/equipment/list?pageNum=${pageNum}&pageSize=${pageSize}`, {
    method: 'POST',
    data,
  });
}

/**
 * 查询设备总额
 * @param data 
 * @param isACL 
 * @returns 
 */
export async function fetchEquipmentsTotalPrice(
  data: IFetchEquipmentsData,
  isACL: boolean,
): ResponseBodyWithPromise<number> {
  const url = `/v3/equipment/${isACL ? 'view/acl/' : ''}getEquipmentTotalPrice`;
  return request(url, {
    method: 'POST',
    data,
  });
}

/**
 * 获取设备信息
 * @param id
 */
export async function fetchEquipmentInfo(id: number) {
  return request(`/v3/equipment/getInfo/${id}`);
}

/**
 * 批量获取设备信息
 * @param ids
 */
export async function batchFetchEquipmentInfo(data?: IFetchEquipmentsData): ResponseBodyWithPromise<EquipmentDetailEx[]> {
  return request(`/v3/equipment/getInfoEx`, {
    method: 'POST',
    data,
  });
}

/**
 * 全量获取设备信息
 * @param ids
 */
 export async function fetchFullEquipmentInfo(data: IFetchEquipmentsData): ResponseBodyWithPromise<EquipmentDetailEx[]> {
  return request(`/v3/equipment/getInfoEx/exclude`, {
    method: 'POST',
    data,
  });
}

/**
 * 删除设备
 * @param id
 */
export async function deleteEquipment(id: number) {
  return request(`/v3/equipment/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 保存设备 (包含设备关联的 标签、附件)
 * @param data
 */
export async function saveEquipment(data: ISaveEquipmentData): ResponseBodyWithPromise<EquipmentDetail> {
  return request(`/v3/equipment/save`, {
    method: 'post',
    data,
  });
}

/**
 * 获取设备附件类别
 */
export async function fetchAttachmentCategorys() {
  return request(`/v3/equipment/enum/attachmentCateory`);
}

/**
 * 获取设备事件类型（Enum）
 */
export async function getEquipmentEventTypeEnum() {
  return request(`/v3/equipment/enum/equipmentEventType`);
}

/**
 * 获取设备维保状态（Enum）
 */
export async function getEquipmentStatusEnum() {
  return request(`/v3/equipment/enum/equipmentStatus`);
}

/**
 * 获取设备来源（Enum）
 */
export async function getSourceTypeEnum() {
  return request(`/v3/equipment/enum/sourceType`);
}

/**
 * 获取设备保修状态（Enum）
 */
export async function getWarrantyStatusEnum() {
  return request(`/v3/equipment/enum/warranthyStatus`);
}

/**
 * 获取设备厂商
 */
export async function fetchManufacturers(
  q: string = '',
  pageNum?: number,
  pageSize?: number,
): ResponseBodyWithPromise<IManufacturerItem[]> {
  const endpoint = pageNum
    ? `/v3/prd/equipment/manufacturer/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : `/v3/prd/equipment/manufacturer/list`;
  return request(endpoint, {
    method: 'POST',
    data: {
      q,
    },
  });
}

/**
 * 获取设备名称
 * @param manufacturerId 品牌ID
 * @param q 搜索关键字
 * @param pageNum
 * @param pageSize
 */
export async function fetchProducts(
  manufacturerId: number,
  q: string = '',
  pageNum?: number,
  pageSize?: number,
): ResponseBodyWithPromise<IProductItem[]> {
  const endpoint = pageNum
    ? `/v3/prd/equipment/product/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : `/v3/prd/equipment/product/list`;
  return request(endpoint, {
    method: 'POST',
    data: {
      q,
      manufacturerId,
    },
  });
}

/**
 * 获取型号
 * @param productId
 * @param q
 * @param pageNum
 * @param pageSize
 */
export async function fetchModels(
  productId: number,
  q: string = '',
  pageNum?: number,
  pageSize?: number,
): ResponseBodyWithPromise<IModelItem[]> {
  const endpoint = pageNum
    ? `/v3/prd/equipment/model/list?pageNum=${pageNum}&pageSize=${pageSize}`
    : `/v3/prd/equipment/model/list`;
  return request(endpoint, {
    method: 'POST',
    data: {
      q,
      productId,
    },
  });
}

export async function fetchModelView(id: number): ResponseBodyWithPromise<IModelView> {
  return request(`/v3/prd/part/modelView/get/${id}`);
}

/**
 * 设备合并
 * @param coveredEquipmentId 被合并的设备id
 * @param checkedEquipmentId 要合并的设备id（选择的设备）
 */
export async function fetchMergeEquipment(coveredEquipmentId?: number, checkedEquipmentId?: number) {
  return request(`/v3/equipment/mergeEquipment`, {
    method: 'POST',
    data: {
      coveredEquipmentId,
      checkedEquipmentId
    }
  });
}

/**
 * 获取设备标签
 * @param data
 * @param pageNum 
 * @param pageSize
 */
export async function fetchTags(
  data: IFetchTagsData,
  type: NameDictionarysEnum,
  requestOptions?: IRequestOptions,
) {
  return request(
    `/v3/common/tag/list/${type}`,
    {
      method: 'POST',
      data,
      ...requestOptions,
    },
  );
}

/**
 * 获取导入任务列表
 * @param pageNum
 * @param pageSize
 * @param data
 */
export async function fetchImportTasks(
  pageNum: number,
  pageSize: number,
  data: IFetchImportTasksData,
) {
  return request(
    `/v3/equipment/xport/task/list?pageNum=${pageNum}&pageSize=${pageSize}`,
    {
      method: 'POST',
      data,
    },
  );
}

/**
 * 获取导入任务（轮询）
 * @param id
 */
export async function fetchImportTaskById(id: number) {
  return request(`/v3/equipment/xport/task/get/${id}`);
}

/**
 * 删除某一个导入任务
 * @param id
 */
export async function deleteImportTask(id: number) {
  return request(`/v3/equipment/xport/task/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取导入任务明细
 * @param id
 * @param pageNum
 * @param pageSize
 */
export async function fetchImportTaskDetails(
  id: number,
  isOk?: boolean,
  pageNum?: number,
  pageSize?: number,
) {
  return request( `/v3/equipment/xport/task/details/${id}`, {
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      isOk,
    },
  });
}

/**
 * 导入设备
 * @param file
 * @param orgId
 */
export async function importEquipmentForV3(file: File, orgId: number) {
  return request(`/v3/equipment/xport/import/${orgId}`, {
    method: 'POST',
    data: {
      file,
    },
  });
}

/**
 * 导入设备（老版本）
 * @param file
 * @param orgId
 */
export async function importEquipmentForV1(file: File, orgId: number) {
  return request(`/v3/equipment/xport/import/v1/${orgId}`, {
    method: 'POST',
    data: {
      file,
    },
  });
}

/**
 * 【平台】 导入 多个医院 的设备。
 *  1.自动创建医院(如果不存在); 2.自动创建部门(如果不存在)；3.返回导入任务id列表(每医院一个任务)
 * @param file
 */
export async function importAllEquipmentForV3(file: File) {
  return request(`/v3/equipment/xport/import`, {
    method: 'POST',
    data: {
      file,
    },
  });
}

/**
 * 【平台】 导入 多个医院 的设备。(老版本)
 *  1.自动创建医院(如果不存在); 2.自动创建部门(如果不存在)；3.返回导入任务id列表(每医院一个任务)
 * @param file
 */
export async function importAllEquipmentForV1(file: File) {
  return request(`/v3/equipment/xport/import/v1`, {
    method: 'POST',
    data: {
      file,
    },
  });
}

/**
 * 导出设备
 * @param data
 * @param isXlsx
 */
export async function exportEquipment(
  data: IExportEquipmentData,
  isXlsx: boolean,
) {
  return request(`/v3/equipment/xport/export?isXlsx=${isXlsx}`, {
    method: 'POST',
    getResponse: true,
    responseType: 'blob',
    data,
  });
}

/**
 * 全量导出设备
 * @param data
 * @param isXlsx
 */
 export async function exportFullEquipment(
  data: IExportEquipmentData,
  isXlsx: boolean,
  isACL: boolean,
) {
  const url = `/v3/equipment/xport/export/${isACL ? 'acl/' : ''}exclude?isXlsx=${isXlsx}`;
  return request(url, {
    method: 'POST',
    getResponse: true,
    responseType: 'blob',
    data,
  });
}

/**
 * 保存设备附件
 * @param equipmentId 
 * @param data 
 */
export async function saveParts(
  equipmentId: number,
  data: IAccessoriesItem[]
) {
  return request(`/v3/equipment/part/${equipmentId}`, {
    method: 'POST',
    data,
  });
}

/**
 * 获取设备附件
 * @param equipmentId
 */
export async function getParts(equipmentId: number): ResponseBodyWithPromise<IAccessoriesItem[]> {
  return request(`/v3/equipment/part/${equipmentId}`);
}

/**
 * 设备编号(顺序号)
 */
export async function createEquipmentNo() {
  return request(`/v3/common/sn/equipmentNo`, {
    method: 'POST',
  });
}

/**
 * 查询设备时间线（生命周期）
 */
export async function fetchEquipmentTimeline(
  id: number, 
  data?: IFetchEquipmentTimelineData, 
  pageNum?: number, 
  pageSize?: number,
  // sortBy?: string[],
  // sortDirection?: string[],
): ResponseBodyWithPromise<ITimelineItem[]> {
  const url = pageNum 
    ? `/v3/equipment/timeline/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}` 
    : `/v3/equipment/timeline/list/${id}`;
  return request(url, {
    method: 'POST',
    data,
  });
}

/**
 * 保存或者修改自定义标签内容
 */
 export async function labelPrintSaveAPI(data?: {
  contentText?: labelItem[];
  hospitalId?: number | null;
  hospitalName?: string | null;
  id?: number;
 }) {
  return request(`/v3/equipment/label/print/save`, {
    method: 'POST',
    data: data
  });
}

/**
 * 查询自定义标签内容
 */
 export async function labelPrintSelectAPI(hospitalId?: number | null) {
  return request(`/v3/equipment/label/print/select?hospitalId=${hospitalId}`, {
    method: 'GET',
  });
}

/**
 * 查询转借历史记录
 */
 export async function selectRecordByEquipmentId(equipmentId?: number | null) {
  return request(`/v3/eq/lent/selectRecordByEquipmentId?EquipmentId=${equipmentId}`, {
    method: 'GET',
  });
}

export const TemplateForV3 = '/v3/equipment/xport/template';
export const TemplateForV1 = '/v3/equipment/xport/template/v1';
export const ImportEquipmentActionForV3 = '/v3/equipment/xport/import/';
export const ImportEquipmentActionForV1 = '/v3/equipment/xport/import/v1/';
