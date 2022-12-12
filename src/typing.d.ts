declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.mp3';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'shallowequal';
declare module 'qrcode.react';
declare module 'js-cookie';

// google analytics interface
interface GAFieldsObject {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
}
interface Window {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string,
  ) => void;
  MessageSocketInstance: any;
  reloadAuthorized: () => void;
}

declare let ga: (
  command: 'send',
  hitType: 'event' | 'pageview',
  fieldsObject: GAFieldsObject | string,
) => void;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;
interface AddressOption {
  childrenNumber: number;
  code: string;
  id: number;
  name: string;
  parentId: number;
  label?: string;
  value?: string;
  isLeaf?: boolean;
  children?: AddressOption[];
}

interface ResponseBody<T = any> {
  code: number;
  data: T;
  extData: any;
  internalError: any;
  msg: string | null;
  total?: number;
}

interface ISelectOption {
  label: string;
  value: any;
  key?: any;
}

interface IRequestOptions {
  signal?: AbortSignal | null;
}

type ResponseBodyWithPromise<T = any> = Promise<ResponseBody<T>>;

type AppEnv = 'dev' | 'test' | 'pre';

type Gender = 'UNKNOWN' | 'MALE' | 'FEMALE';

type DefaultSortOrder = 'descend' | 'ascend' | null | undefined;
interface FetchDictionaryParams {
  code?: string;
  name?: string;
  parentId?: number;
}

interface FetchNameDictionaryParams {
  name?: string;
  parentId?: number;
}

interface SaveDictionaryParams {
  id?: number;
  name: string;
  parentId?: number;
  sortNumber?: number;
}

interface CodePathItem {
  childrenNumber: number | null;
  code: string;
  id: number;
  name: string;
  parentId: number;
}

interface NameDictItem {
  childrenNumber: number;
  id: number;
  name: string;
  parentId: number;
  sortNumber: number;
}

interface Customer {
  agreementTotalCount: number;
  deletedBy: number;
  deletedTime: string;
  id: number;
  isDeleted: boolean;
  orgId: number;
  orgName: string;
  siteOrgId: number;
  siteOrgLogo: string;
  siteOrgName: string;
}

interface CurrentUserInfo {
  employee: {
    // 雇员(nullable)
    accountId: number; // 登录账号id
    avatar: string; // 用户头像key
    certificateNo: string; // 证件号
    createdTime: string; // 创建时间
    description: string; // 描述
    email: string; // 电子邮件
    employeeNo: string; // 员工编号
    id: number;
    name: string; // 姓名
    orgId: number; // 部门所属机构id
    parentEmployeeId: number; // 父级员工id
    parentEmployeeName: string; // 父级员工姓名
    phone: string; // 手机号
    position: string; // 职位
    primaryDepartmentId: number; // 所属部门id
    primaryDepartmentName: string; // 部门名称
    sex: Gender; // 性别,可用值:UNKNOWN,MALE,FEMALE
  };
  org: {
    // 机构
    alias: string; // 机构简称
    accountId: number; // 管理员账号id
    address: string; // 地址
    createdTime: string; // 创建(注册)时间
    description: string; // 描述
    email: string; // 邮箱
    id: number;
    name: string; // 机构名称
    orgType: OrgTypeEnum; // 机构类型,可用值:PLATFORM,HOSPITAL,MAINTAINER,MANUFACTURER
    parentOrgId: number; // 父级机构id
    phone: string; // 手机号
    regionCode: string; // 行政区划代码
    status: string; // 状态,可用值:DRAFT,ACCEPTED,REJECTED
    uscc: string; // 统一社会信用代码
  };
  primaryDepartment: {
    // 所属部门(employee=null时为空)
    childrenNumber: number; // 孩子数(仅list响应)
    departmentNo: string; // 部门编号
    description: string; // 描述
    id: number;
    keywords: string; // 关键字
    leaderId: number; // 主管员工id
    leaderName: string; // 主管姓名
    name: string; // 名称
    orgId: number; // 所属机构id
    parentDepartmentId: number; // 父级部门id
    phone: string; // 手机号
  };
  relDepartments: {
    // 关联部门
    childrenNumber: number; // 孩子数(仅list响应)
    departmentNo: string; // 部门编号
    description: string; // 描述
    id: number;
    keywords: string; // 关键字
    leaderId: number; // 主管员工id
    leaderName: string; // 主管姓名
    name: string; // 名称
    orgId: number; // 所属机构id
    parentDepartmentId: number; // 父级部门id
    phone: string; // 手机号
  }[];
  user: {
    createdTime: string;
    id: number;
    isAdmin: boolean; // 是否机构管理员
    isDisabled: boolean; // 是否禁用
    lastPasswordTime: string; // 最近密码设置时间
    orgId: number; // 所属机构id
    passwordCycle: number; // 密码周期(天)
    phone: string; // 电话
    roleId: number; // 角色id
    username: string; // 登录名(通常与phone相同)
  };
  customers: Customer[];
}

interface CurrentUserExtInfo {
  isMaintainer: boolean;
  isHospital: boolean;
  isPlatform: boolean;
  isManufacturer: boolean;
  isCustomersEmpty: boolean;
  currentCustomer: Customer | null | undefined;
}

interface IMenuItem {
  path?: string;
  name?: string;
  component?: string;
  layout?: boolean;
  hideInMenu?: boolean;
  flag?: string;
  apis?: string[];
  authority?: {
    flag?: string;
  }[];
}

enum OrgTypeEnum {
  'HOSPITAL' = 'HOSPITAL', // 医院
  'PLATFORM' = 'PLATFORM', // 平台
  'MAINTAINER' = 'MAINTAINER', // 工程师
  'MANUFACTURER' = 'MANUFACTURER', // 厂商
}

declare namespace Template {
  interface ITemplateItem {
    id: number;
    name: string;
    note: string;
  }

  interface ISetTemplateToOrgData {
    group: number;
    includeRoles: boolean;
    template: number;
  }
}

interface Attachment {
  res: string;
  fileName?: string;
  contentType?: string;
  contentLength?: number;
  category?: string;
}

interface WechatUserInfo {
  city: string;
  country: string;
  createTime: string;
  headimgurl: string;
  id: number;
  modifyTime: string;
  bindTime: string;
  nickname: string;
  openid: string;
  province: string;
  sex: number;
}
