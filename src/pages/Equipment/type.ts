import type { ITableListItem as DeptTableListItem } from '@/pages/Department/type';

export interface ITableListItem {
  // 录入时间
  createdTime: string;
  departmentId: number;
  // 所在部门名称
  departmentName: string;
  // 折旧率(小数)
  depreciationRate: number;
  // 设备自编号
  equipmentNo: string;
  id: number;
  // 初次使用日期
  initialUseDate: string;
  // 是否签约
  isSigned: boolean;
  // 保养周期(天)
  maintainPeriod: number;
  // 制造商名称
  manufacturerName: string;
  // 设备型号id
  modelId: number;
  // 设备型号
  modelName: string;
  // 设备名称
  name: string;
  // 当前净值
  netWorth: number;
  // 设备来源,可用值:PURCHASED,GIFT,BORROWED,ALLOTTED
  obtainedBy: EquipmentSourceEnum;
  // 来源日期
  obtainedDate: string;
  // 来源单位
  obtainedFrom: string;
  orgId: number;
  // 原值
  originWorth: number;
  ownerDepartmentId: number;
  // 所属部门名称
  ownerDepartmentName: string;
  // 出产日期
  productionDate: string;
  // 房间号
  roomNo: string;
  // 序列号(原厂)
  sn: string;
  // 来源方联系人
  srcContactPerson: string;
  // 来源方联系电话
  srcContactTel: string;
  // (启用)状态,可用值:UNUSED,READY,LENT,TERMINATED
  status: EquipmentStatusEnum;
  // 状态变更原因
  statusChangedReason: string;
  // 状态变更时间
  statusChangedTime: string;
  typeId: number;
  // 设备类型名称
  typeName: string;
  // 使用年限
  usefulAge: number;
  warranthyEndDate: string;
  // 保修状态,可用值:MANUFACTURER,THIRDPART,OTHER,NONE
  warranthyStatus: EquipmentWarrantyStatusEnum;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ISaveEquipmentData {
  // 附件
  attachments?: {
    category?: string;
    fileName?: string;
    mime?: string;
    res: string;
  }[];
  equipment: {
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
    netWorth?: number;
    obtainedBy: string;
    obtainedDate: string;
    obtainedFrom?: string;
    orgId: number;
    originWorth: number;
    ownerDepartmentId: number;
    ownerDepartmentName: string;
    productionDate: string;
    purchaseMethod: PurchaseMethodEnum;
    roomNo: string;
    sn: string;
    srcContactPerson?: string;
    srcContactTel?: string;
    status: EquipmentStatusEnum;
    statusChangedReason: string;
    statusChangedTime: string;
    typeId: number;
    typeName: string;
    usefulAge: number;
    warranthyEndDate: string;
    warranthyStatus: EquipmentWarrantyStatusEnum;
  };
  // 设备标签
  tags?: { key: number; value: string }[];
}

export type EquipmentDetail = ISaveEquipmentData;

export interface TableListData {
  list: ITableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface IFetchEquipmentsParams {
  departmentId?: number[];
  isSigned?: boolean;
  equipmentNo?: string;
  // 首次启用日期
  initialUseDate?: {
    maxValue?: string;
    minValue?: string;
  };
  // 原值
  originWorth?: {
    maxValue?: number;
    minValue?: number;
  };
  // 使用年限
  usefulAge?: {
    maxValue?: number;
    minValue?: number;
  };
  orgId: number;
  q?: string;
  status?: EquipmentStatusEnum;
  tagId?: number[];
  typeId?: number[];
  warranthyStatus?: EquipmentWarrantyStatusEnum;
}

export interface IManufactureItem {
  description: string | null;
  id: number;
  keywords: string;
  name: string;
}

export interface IProductItem {
  description: string;
  id: number;
  keywords: string;
  manufactureId: number;
  name: string;
}

export interface IModelItem {
  description: string;
  id: number;
  name: string;
  productId: number;
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

export enum EquipmentSourceTextEnum {
  // 购买
  PURCHASED = '购买',
  // 馈赠
  GIFT = '馈赠',
  // 借调
  BORROWED = '借调',
  // 调拨
  ALLOTTED = '调拨',
}

export const EquipmentSource = [
  {
    label: '购买',
    value: 'PURCHASED',
  },
  {
    label: '馈赠',
    value: 'GIFT',
  },
  {
    label: '借调',
    value: 'BORROWED',
  },
  {
    label: '调拨',
    value: 'ALLOTTED',
  },
];

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

// 设备保修状态
export enum EquipmentWarrantyStatusTextEnum {
  MANUFACTURER = '在保',
  THIRDPART = '在保',
  OTHER = '在保',
  NONE = '未在保',
}

export const PurchaseMethod = [
  {
    label: '自行购买',
    value: 'SELF',
  },
  {
    label: '公开招标',
    value: 'BID',
  },
  {
    label: '社会集资',
    value: 'FUND',
  },
];

export enum PurchaseMethodEnum {
  SELF = 'SELF',
  BID = 'BID',
  FUND = 'FUND',
}

export type EquipmentTypeItem = NameDictItem & {
  children?: NameDictItem[];
};

export type EquipmentTagItem = EquipmentTypeItem;

export type DepartmentItem = Omit<DeptTableListItem, 'children'> & {
  children?: DepartmentItem[];
};

export interface ICertCategoryItem {
  key: string;
  value: string;
  fileList: any;
}
export interface IAttachmentItem {
  category?: string;
  fileName?: string;
  mime?: string;
  // 文件资源（id）
  res: string;
}

export interface IImportTaskItem {
  // 导入时间
  createdTime: string;
  creatorId: number;
  // 操作人
  creatorName: string;
  // 失败数
  failedNumber: number;
  // 文件名
  fileName: string;
  finishedTime: string;
  id: number;
  // 导入状态
  status: ImportStatusEnum;
  // 成功数
  okNumber: number;
  orgId: number;
  orgName: string;
  // 设备数
  total: number;
  percent?: number;
}

export interface IFetchImportTasksData {
  fileName?: string;
  orgId?: number;
  orgName?: string;
}

export interface ImportTaskDetail {
  departmentName: string;
  depreciationRate: number;
  equipmentNo: string;
  id: number;
  initialUseDate: string;
  isOk: boolean;
  maintainPeriod: number;
  manufacturerName: string;
  modelName: string;
  name: string;
  netWorth: number;
  obtainedBy: string;
  obtainedDate: string;
  obtainedFrom: string;
  originWorth: number;
  productionDate: string;
  reason: string;
  roomNo: string;
  sn: string;
  status: string;
  statusChangedTime: string;
  taskId: number;
  typeName: string;
  usefulAge: number;
  warranthyEndDate: string;
  warranthyStatus: EquipmentWarrantyStatusEnum;
}

export interface IExportEquipmentData {
  departmentId?: number[];
  isSigned?: boolean;
  orgId: number;
  q?: string;
  status?: EquipmentStatusEnum[];
  tagId?: number[];
  typeId?: number[];
  warranthyStatus?: EquipmentWarrantyStatusEnum[];
}

export interface IImportTaskDetail {
  departmentName: string;
  depreciationRate: number;
  equipmentNo: string;
  id: number;
  initialUseDate: string;
  isOk: boolean;
  maintainPeriod: number;
  manufacturerName: string;
  modelName: string;
  name: string;
  netWorth: number;
  obtainedBy: string;
  obtainedDate: string;
  obtainedFrom: string;
  originWorth: number;
  productionDate: string;
  reason: string;
  roomNo: string;
  sn: string;
  status: string;
  statusChangedTime: string;
  taskId: number;
  typeName: string;
  usefulAge: number;
  warranthyEndDate: string;
  warranthyStatus: EquipmentWarrantyStatusEnum;
}

export enum ImportStatusEnum {
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
  ABORTED = 'ABORTED',
}

export const FieldLabelMap = new Map([
  [
    'PURCHASED',
    {
      originWorth: '购买价值',
      obtainedDate: '购买日期',
      obtainedFrom: '供货单位',
    },
  ],
  [
    'GIFT',
    {
      originWorth: '原始价值',
      obtainedDate: '馈赠日期',
      obtainedFrom: '馈赠单位',
    },
  ],
  [
    'BORROWED',
    {
      originWorth: '原始价值',
      obtainedDate: '借调日期',
      obtainedFrom: '设备原单位',
    },
  ],
  [
    'ALLOTTED',
    {
      originWorth: '原始价值',
      obtainedDate: '调拨日期',
      obtainedFrom: '调拨单位',
    },
  ],
]);

export type ImportVersion = 'V1' | 'V3';
