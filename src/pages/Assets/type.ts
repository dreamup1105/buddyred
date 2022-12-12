import type { ITableListItem as DeptTableListItem } from '@/pages/Department/type';

export interface ITableListItem {
  // 设备别名
  alias: string;
  // 代理经销商
  dealer: string;
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
  // 厂商名称
  manufacturerName: string;
  // 品牌名称
  brandName: string;
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

  orgName: string;
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
  // 上次(保养/维修)时间
  lastMpTime?: string;
  equipNameNew: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ISaveEquipmentData {
  // 附件
  attachments?: Attachment[];
  contract?: Attachment[];
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
    isScrap: string;
    registrationNumber?: string;
  };
  inquiries?: IInquirie[];
  // 设备标签
  tags?: string[];
}

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
  },
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
  }[]
};

export interface TableListData {
  list: ITableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface IFetchEquipmentsData {
  ids: number[],
  departmentId?: number[];
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
  isSigned?: boolean;
  orgId?: number;
  q?: string;
  status?: EquipmentStatusEnum;
  tag?: string[];
  typeId?: number[];
  warranthyStatus?: EquipmentWarrantyStatusEnum;
}

export interface IFetchTagsData {
  name?: string;
  tagRank?: number;
  templateFor?: string;
  orgId?: number | null;
}

export interface IManufacturerItem {
  description: string | null;
  id: number;
  keywords: string;
  name: string;
}

export interface IProductItem {
  description: string;
  id: number;
  keywords: string;
  // 品牌id
  manufactureId: number;
  name: string;
}

export interface IModelItem {
  description: string;
  id: number;
  name: string;
  // 产品id
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

export enum EquipmentOriginEnum {
  DOMESTIC = 'DOMESTIC',
  IMPORTED = 'IMPORTED'
}

export const EquipmentOrigin = [
  {
    label: "国产",
    value: "DOMESTIC",
  }, 
  {
    label: "进口",
    value: "IMPORTED",
  }
]

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
    label: '询价购置',
    value: 'INQUERY',
  },
  {
    label: '招标购置',
    value: 'BID',
  },
  {
    label: '单一来源购置',
    value: 'SINGLE',
  },
  {
    label: '竞争性谈判购置',
    value: 'NEGOTIATION',
  },
];

export enum PurchaseMethodEnum {
  INQUERY = 'INQUERY',
  SINGLE = 'SINGLE',
  NEGOTIATION = 'NEGOTIATION',
  BID = 'BID'
}

export enum PurchaseMethodTextEnum {
  INQUERY = '询价购置',
  SINGLE = '单一来源购置',
  NEGOTIATION = '竞争性谈判购置',
  BID = '招标购置'
}

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
  MERGE = 'MERGE'
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
  equipmentId?: number[];
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

export interface IAccessoriesItem {
  id?: number;
  manufacturerName: string;
  manufacturerId?: number;
  modelId?: number;
  modelName: string;
  name: string;
  productName: string;
  productId?: number;
  sn?: string;
}

export interface IModelView {
  id: number;
  keywords: string;
  manufacturerId: number;
  manufacturerName: string;
  name: string;
  productId: number;
  productName: string;
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

export type RemoteSelectLabel = '设备厂商' | '设备名称' | '设备型号' | '设备标签' | '配件厂商' | '配件名称' | '配件型号';

export enum BizType {
  EQUIPMENT = 'EQUIPMENT', // 设备维保
  ASSETS = 'ASSETS' // 固定资产
}

export interface IBizConfig {
  bizType: BizType;
  service: (params: any, pageNum: number, pageSize: number) => Promise<any>;
  tableTitle: string;
}

export interface ExcludeEquipments {
  keys: Set<number>;
  dataSource: ITableListItem[];
  total: number;
}

// 导入任务明细中导入状态表单项转换map
export const ImportStatusValueMap = new Map([
  ['all', undefined],
  ['success', true],
  ['fail', false],
]);

export interface IInquirie {
  // 询价单位
  company?: string;
  // 联系人
  contactPerson?: string;
  // 联系电话
  contactTel?: string;
}

type TimelineExcluding = 'INPUT' | 'READY' | 'TERMINATED' | 'INSPECTION' | 'MAINTAIN' | 'REPAIR';
type TimelineIncluding = TimelineExcluding;

export interface IFetchEquipmentTimelineData {
  excluding?: TimelineExcluding[];
  including?: TimelineIncluding[];
  since?: string;
}

export interface ITimelineItem {
  equipmentId: number;
  eventData: string;
  eventTime: string;
  eventType: TimelineIncluding;
  id: number;
  result: string;
}
export interface ILendingItem {
  equipmentId: number;
  orderType: string;
  createTime: string;
  orderStatus: string;
  sourceDeptName: string;
  targetDeptName: string;
}

export enum EventTypeTextEnum {
  INPUT = '录入',
  READY = '启用',
  TERMINATED = '终止',
  INSPECTION = '巡检',
  MAINTAIN = '保养',
  REPAIR = '维修'
}

export interface labelItem {
  label?: string;
  value: string;
  line: number;
}