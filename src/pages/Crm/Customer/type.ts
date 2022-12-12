import type { TemplateBizType } from '@/pages/Dictionary/Maintenance/Editor/type';

export enum SignStatus {
  DRAFT = 'DRAFT',
  TO_BE_EFFECTIVE = 'TO_BE_EFFECTIVE',
  EXECUTION = 'EXECUTION',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
}

export const SignStatusMap = new Map([
  [
    SignStatus.DRAFT,
    {
      text: '草稿',
      color: '#d9d9d9',
      status: 'Default',
    },
  ],
  [
    SignStatus.TO_BE_EFFECTIVE,
    {
      text: '待生效',
      color: '#108ee9',
      status: 'processing',
    },
  ],
  [
    SignStatus.EXECUTION,
    {
      text: '执行中',
      color: '#87d068',
      status: 'success',
    },
  ],
  [
    SignStatus.EXPIRED,
    {
      text: '已过期',
      color: '#d9d9d9',
      status: 'warning',
    },
  ],
  [
    SignStatus.TERMINATED,
    {
      text: '已终止',
      color: '#ff4d4f',
      status: 'error',
    },
  ],
]);

export interface IFetchCustomersData {
  agreeStatus?: SignStatus;
  apply?: string;
  beginDate?: string;
  endDate?: string;
  hospitalName?: string;
  isAgree?: boolean;
  orgId?: number;
  pageNum?: number;
  pageSize?: number;
}

export interface ICustomerItem {
  agreementTotalCount: number;
  deletedBy: number;
  deletedTime: string;
  id: number;
  isDeleted: boolean;
  orgId: number;
  orgName: string;
  siteOrgId: number;
  siteOrgName: string;
  siteOrgLogo: string;
}

export interface ICustomerItemWithExtraInfo extends ICustomerItem {
  engineers: Omit<IEmployeeItem, 'canAdd'>[];
  templates: Omit<ITemplateItem, 'canAdd'>[];
}

export type ISaveCustomerData = Partial<ICustomerItem>;

export interface CustomerDetailParams {
  crId: number;
  id: number;
  label: string;
  labelId: number;
  val: string;
  type: 'INT' | 'STRING';
  unit: string;
}

export interface CustomerDetailTemplate {
  applyType: TemplateBizType;
  contentType: string;
  description: string;
  id: number;
  isDeprecated: boolean;
  lastModifiedBy: number;
  lastModifiedByName: string;
  lastModifiedTime: string;
  name: string;
  specVerId: number;
  specVerNo: number;
  specVerTag: string;
  verId: number;
}

export interface CustomerDetailEmployee {
  accountId: number;
  avatar: string;
  certificateNo: string;
  createdTime: string;
  description: string;
  email: string;
  employeeId: number;
  employeeNo: string;
  employeeType: EmployeeType;
  id: number;
  name: string;
  orgId: number;
  parentEmployeeId: number;
  parentEmployeeName: string;
  phone: string;
  position: string;
  primaryDepartmentId: number;
  primaryDepartmentName: string;
  sex: string;
}

export interface CustomerDetail {
  addr: string;
  agreementTotalCount: number;
  alias: string;
  contactor: string;
  engineers: CustomerDetailEmployee[];
  hospitalLogo: string;
  id: number;
  name: string;
  params: CustomerDetailParams[];
  regionAddr: string;
  regionCode: string;
  tel: string;
  templates: CustomerDetailTemplate[];
}

export interface IHospitalItem {
  alias: string;
  canAdd: boolean;
  id: number;
  name: string;
  regionAddr: string;
  regionCode: string;
}

export interface IFetchTemplatesData {
  crId?: number | null;
  name?: string;
  pageNum?: number;
  pageSize?: number;
  templateFor?: string;
  orgId?: number | null;
}

export interface ITemplateItem {
  applyType: TemplateBizType;
  canAdd: boolean;
  id: number;
  name: string;
  specVerId: number;
  specVerNo: number;
  specVerTag: string;
  verId: number;
}

export interface ISaveTemplateData {
  crId: number;
  id?: number;
  templateIds: number[];
}

export interface IFetchEmployeesData {
  crId: number;
  name?: string;
  orgId?: number;
  pageNum?: number;
  pageSize?: number;
}

export enum EmployeeType {
  ENGINEER = 'ENGINEER',
  MANAGER = 'MANAGER',
  OTHER = 'OTHER',
}

export interface ISaveEmployeeData {
  canAdd?: boolean;
  crId: number;
  departmentName: string;
  employeeId: number;
  employeeNo: string;
  employeeType: EmployeeType;
  id?: number;
  name: string;
  phone: string;
}

export interface IEmployeeItem {
  canAdd: boolean;
  departmentName: string;
  employeeNo: string;
  employeeType: 'ENGINEER' | 'MANAGER';
  id: number;
  name: string;
  phone: string;
}

export type ICustomerMap = Map<
  number,
  {
    id: number;
    name: string;
    orgName: string;
    engineers: ICustomerItemWithExtraInfo['engineers'];
    templates: ICustomerItemWithExtraInfo['templates'];
  }
>;
