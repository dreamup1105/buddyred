import type { ITableListItem as DeptTableListItem } from '@/pages/Department/type';

export interface ITableItem {
  id: string;
  orderNo: string;
  equipmentName: string;
  equipmentDeptName?: string;
  reportTime?: string;
  approvalPersonName?: string;
  approvalTime?: string;
  orderStatus?: string;
  equipmentId: number;
  reportPerson?: number;
  personId?: number;
}

// 申购单状态
export enum OrderStatus {
  ADD = 'ADD',
  INIT = 'INIT',
  APPROVAL = 'APPROVAL',
  PASS = 'PASS',
  REJECT = 'REJECT',
  ENABLE = 'ENABLE',
  CANCEL = 'CANCEL',
}

export const OrderStatuTextMap = new Map<string, string>([
  [OrderStatus.ADD, '新增'],
  [OrderStatus.INIT, '草稿'],
  [OrderStatus.APPROVAL, '审批中'],
  [OrderStatus.PASS, '通过'],
  [OrderStatus.REJECT, '驳回'],
  [OrderStatus.ENABLE, '启用'],
  [OrderStatus.CANCEL, '撤单'],
]);

export const OrderStatusEnum = new Map<any, any>([
  [
    OrderStatus.ADD,
    {
      label: '新增',
      color: <any>'default',
    },
  ],
  [
    OrderStatus.INIT,
    {
      label: '草稿',
      color: <any>'default',
    },
  ],
  [
    OrderStatus.APPROVAL,
    {
      label: '申请中',
      color: <any>'processing',
    },
  ],
  [
    OrderStatus.PASS,
    {
      label: '通过',
      color: <any>'success',
    },
  ],
  [
    OrderStatus.REJECT,
    {
      label: '驳回',
      color: <any>'error',
    },
  ],
  [
    OrderStatus.ENABLE,
    {
      label: '启用',
      color: <any>'success',
    },
  ],
  [
    OrderStatus.CANCEL,
    {
      label: '撤单',
      color: <any>'danger',
    },
  ],
]);

export interface SbscriptionDetailItem {
  reportPersonName?: number; //	申报人姓名
  reportTime?: string; //	申报时间
  scrapReason?: string;
  scrapStatus?: string;
  reportPerson: number;
  id: string; //订单id
  detailList?: equipmentItems[]; //设备列表
}

export interface equipmentItems {
  alias?: string;
  brandName?: string;
  id?: string | number;
  manufacturerName?: string;
  modelId?: number;
  modelName?: string;
  name?: string;
  purchaseCount?: number;
  rowId?: number | string;
  singlePrice?: number;
  totalPrice?: number;
  typeId?: number;
  typeName?: string;
  usefulAge?: number;
}

export interface SubscriptionSearchFormItem {
  orgId?: number;
  isAcl: boolean;
  keyword: string;
  current: number;
  pageSize: number;
  orderStatus?: string | null;
}
export interface ICertCategoryItem {
  key: string;
  value: string;
  fileList: any;
}

// 设备状态
export enum EquipmentStatusEnum {
  // 未启用
  UNUSED = 'UNUSED',
  // 启用中
  READY = 'READY',
  LENT = 'LENT',
  TERMINATED = 'TERMINATED',
}

// 设备状态文本
export enum EquipmentStatusTextEnum {
  // 未启用
  UNUSED = '未启用',
  // 启用中
  READY = '启用中',
  LENT = 'LENT',
  TERMINATED = 'TERMINATED',
}

// 设备保修状态
export enum EquipmentWarrantyStatusEnum {
  MANUFACTURER = 'MANUFACTURER',
  THIRDPART = 'THIRDPART',
  OTHER = 'OTHER',
  NONE = 'NONE',
}

export const EquipmentWarrantyStatusOptions = [
  {
    value: 'MANUFACTURER',
    label: '厂家保修',
  },
  {
    value: 'THIRDPART',
    label: '第三方保修',
  },
  {
    value: 'OTHER',
    label: '其它保修',
  },
  {
    value: 'NONE',
    label: '非在保',
  },
];

export enum OperationType {
  IMPORT = 'IMPORT',
  INPUT = 'INPUT',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  COPY = 'COPY',
  DETAIL = 'DETAIL',
  MAINTAIN = 'MAINTAIN',
  REPAIR = 'REPAIR',
  NOOP = 'NOOP',
}

export type EquipmentTypeItem = NameDictItem & {
  children?: NameDictItem[];
};

export type EquipmentTagItem = EquipmentTypeItem;

export type DepartmentItem = Omit<DeptTableListItem, 'children'> & {
  children?: DepartmentItem[];
};

export type EquipmentDetail = ISaveEquipmentData;

export type EquipmentDetailEx = ISaveEquipmentData & {
  org: {
    accountId: number;
    address: string;
    alias: string;
    createdTime: string;
    description: string;
    email: string;
    id: number;
    name: string;
    orgType: string;
    parentOrgId: number;
    phone: string;
    regionCode: string;
    status: string;
    uscc: string;
  };
  crs?: {
    agreementTotalCount: number;
    alias: string;
    deletedBy: number;
    deletedTime: string;
    id: number;
    isDeleted: boolean;
    orgId: number;
    orgName: string;
    phone: string;
    siteOrgId: number;
    siteOrgLogo: string;
    siteOrgName: string;
  }[];
};

export interface ISaveEquipmentData {
  createdTime?: string;
  departmentId: number;
  departmentName: string;
  depreciationRate: number;
  equipmentNo?: string;
  id?: number;
  initialUseDate?: string;
  isSigned?: true;
  maintainPeriod: number;
  manufacturerName: string;
  modelId?: number;
  modelName: string;
  name: string;
  brandName: string;
  netWorth?: number;
  obtainedBy: EquipmentSourceEnum;
  obtainedDate?: string;
  obtainedFrom?: string;
  orgId: number;
  origin: EquipmentOriginEnum;
  originWorth: number;
  ownerDepartmentId: number;
  ownerDepartmentName: string;
  productionDate?: string;
  purchaseMethod: PurchaseMethodEnum;
  roomNo: string;
  sn: string;
  srcContactPerson?: string;
  srcContactTel?: string;
  status: EquipmentStatusEnum;
  statusChangedReason: string;
  statusChangedTime?: string;
  typeId: number;
  typeName: string;
  usefulAge: number;
  warranthyEndDate?: string;
  warranthyStatus: EquipmentWarrantyStatusEnum;
  equipNameNew: string;
}

// 设备来源
export enum EquipmentSourceEnum {
  // 购买
  PURCHASED = 'PURCHASED',
  // 馈赠
  GIFT = 'GIFT',
  // 借调
  BORROWED = 'BORROWED',
  // 调拨
  ALLOTTED = 'ALLOTTED',
}

export enum EquipmentOriginEnum {
  DOMESTIC = 'DOMESTIC',
  IMPORTED = 'IMPORTED',
}

export const EquipmentOrigin = [
  {
    label: '国产',
    value: 'DOMESTIC',
  },
  {
    label: '进口',
    value: 'IMPORTED',
  },
];

export enum PurchaseMethodEnum {
  INQUERY = 'INQUERY',
  SINGLE = 'SINGLE',
  NEGOTIATION = 'NEGOTIATION',
  BID = 'BID',
}

export enum PurchaseMethodTextEnum {
  INQUERY = '询价购置',
  SINGLE = '单一来源购置',
  NEGOTIATION = '竞争性谈判购置',
  BID = '招标购置',
}

export interface IInquirie {
  // 询价单位
  company?: string;
  // 联系人
  contactPerson?: string;
  // 联系电话
  contactTel?: string;
}
