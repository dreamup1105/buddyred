import { request } from 'umi';
import type {
  IFetchCustomersData,
  IFetchTemplatesData,
  ICustomerItem,
  ICustomerItemWithExtraInfo,
  ISaveCustomerData,
  ISaveTemplateData,
  IFetchEmployeesData,
  ISaveEmployeeData,
  CustomerDetailTemplate,
  ITemplateItem,
  IHospitalItem,
  IEmployeeItem,
  CustomerDetail,
  EmployeeType,
} from './type';

/**
 * 查询客户关系列表
 * @param params
 */
export async function fetchCustomers(
  params: IFetchCustomersData,
): ResponseBodyWithPromise<ICustomerItem[]> {
  return request(`/v3/cr/list`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 查询客户关系列表（附带人员信息）
 * @param params
 * @returns
 */
export async function fetchCustomersWithExtraInfo(
  params: IFetchCustomersData,
): ResponseBodyWithPromise<ICustomerItemWithExtraInfo[]> {
  return request(`/v3/cr/list/ext`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 查询客户详情
 */
export async function fetchCustomerDetail(
  hospitalId: number,
): ResponseBodyWithPromise<CustomerDetail> {
  return request(`/v3/cr/info/${hospitalId}`, {
    method: 'POST',
  });
}

/**
 * 查询医院
 * @returns
 */
export async function fetchHospitals(data?: {
  id?: number;
  name?: string;
  pageNum?: number;
  pageSize?: number;
}): ResponseBodyWithPromise<IHospitalItem[]> {
  return request(`/v3/cr/hospital/list`, { method: 'POST', data });
}

/**
 * 保存客户
 */
export async function saveCustomer(
  data: ISaveCustomerData,
): ResponseBodyWithPromise<ICustomerItem> {
  return request(`/v3/cr/save`, {
    method: 'POST',
    data,
  });
}

/**
 * 删除客户
 */
export async function deleteCustomer(id: number) {
  return request(`/v3/cr/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取模板列表
 * /v3/cr/template/list  旧接口 查询该医院下的模板列表
 */
export async function fetchTemplates(
  data: IFetchTemplatesData,
): ResponseBodyWithPromise<ITemplateItem[]> {
  return request(`/v3/ms/spec/template/listMaintainTemByPage`, {
    method: 'POST',
    data,
  });
}

/**
 * 添加维保模板
 */
export async function addTemplate(
  data: ISaveTemplateData,
): ResponseBodyWithPromise<CustomerDetailTemplate> {
  return request(`/v3/cr/template/save`, {
    method: 'POST',
    data,
  });
}

export async function fetchEmployees(
  data: IFetchEmployeesData,
): ResponseBodyWithPromise<IEmployeeItem[]> {
  return request(`/v3/cr/engineer/list`, {
    method: 'POST',
    data,
  });
}

/**
 * 根据crId查询该客户关系所对应的人员
 * @param crId
 * @returns
 */
export async function fetchEmployeesByCrId(
  crId: number,
): ResponseBodyWithPromise<Omit<IEmployeeItem, 'canAdd'>[]> {
  return request(`/v3/cr/cr/engineer/list?crId=${crId}`);
}

/**
 * 根据crId查询该客户关系所对应的模板
 * @param crId
 * @returns
 */
export async function fetchTemplatesByCrId(crId: number) {
  return request(`/v3/cr/cr/template/list?crId=${crId}`);
}

export async function saveEmployee(data: ISaveEmployeeData) {
  return request(`/v3/cr/engineer/save`, {
    method: 'POST',
    data,
  });
}

/**
 * 删除人员
 * @param crId
 * @param employeeId
 * @returns
 */
export async function deleteEmployee(
  crId: number,
  employeeId: number,
  employeeType: EmployeeType,
) {
  return request(
    `/v3/cr/engineer/${crId}/${employeeId}?employeeType=${employeeType}`,
    {
      method: 'DELETE',
    },
  );
}

/**
 * 删除模板
 * @param crId
 * @param templateId
 * @returns
 */
export async function deleteTemplate(crId: number, templateId: number) {
  return request(`/v3/cr/template/${crId}/${templateId}`, {
    method: 'DELETE',
  });
}

/**
 * 设置业务验收时间
 * @param data
 * @returns
 */
export async function setupGlobalBizParams(data: {
  crId: number;
  label: string;
  val: string;
  id: number;
}) {
  return request(`/v3/cr/params/save`, {
    method: 'POST',
    data,
  });
}

/**
 * 检查输入设备id，返回未签约给指定customer的设备id
 * @param crId
 * @param equipmentIds
 * @returns
 */
export async function checkEquipments(
  crId: number,
  equipmentIds: number[],
): ResponseBodyWithPromise<number[]> {
  return request(`/v3/cr/checkfor/${crId}`, {
    method: 'POST',
    data: equipmentIds,
  });
}
