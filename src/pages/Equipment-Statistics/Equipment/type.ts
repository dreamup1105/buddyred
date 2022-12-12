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

export interface statisticsForm {
  isEng?: boolean;
  pageNum?: number;
  pageSize?: number;
  eqType?: number;
  eqUsefulAge?: string;
  hospitalId?: number;
  manufacturerName?: string;
  keyword?: string;
  statType?: string;
}

export enum statType {
  BY_HOSPITAL = 'BY_HOSPITAL',
  BY_EQ_TYPE = 'BY_EQ_TYPE',
  BY_USEFUL_AGE = 'BY_USEFUL_AGE',
  BY_MANUFACTURER = 'BY_MANUFACTURER',
}

export const statTypeOptions = [
  {
    value: statType.BY_HOSPITAL,
    label: '按医院',
  },
  {
    value: statType.BY_EQ_TYPE,
    label: '按设备类型',
  },
  {
    value: statType.BY_USEFUL_AGE,
    label: '按使用年限',
  },
  {
    value: statType.BY_MANUFACTURER,
    label: '按制造厂商',
  },
];

export const StatTypeMap = new Map([
  [
    statType.BY_HOSPITAL,
    {
      label: '医院',
      value: statType.BY_HOSPITAL,
      key: 'hospitalId',
    },
  ],
  [
    statType.BY_EQ_TYPE,
    {
      label: '设备类型',
      value: statType.BY_EQ_TYPE,
      key: 'eqType',
    },
  ],
  [
    statType.BY_USEFUL_AGE,
    {
      label: '使用年限',
      value: statType.BY_USEFUL_AGE,
      key: 'eqUsefulAge',
    },
  ],
  [
    statType.BY_MANUFACTURER,
    {
      label: '制造厂商',
      value: statType.BY_MANUFACTURER,
      key: 'manufacturerName',
    },
  ],
]);

export interface ITableListHistoryItem {
  agreeStatus?: string;
  agreeTypes?: string[];
  beginDate?: string;
  endDate?: string;
}

export enum SignProjects {
  LOOK = 'LOOK',
  REPAIR = 'REPAIR',
  MAINTAIN = 'MAINTAIN',
  INSPECTION = 'INSPECTION',
  CHECK = 'CHECK',
}

export const SignProjectsMap = new Map([
  [SignProjects.MAINTAIN, '保养'],
  [SignProjects.REPAIR, '维修'],
  [SignProjects.INSPECTION, '巡检'],
  [SignProjects.CHECK, '检测'],
  [SignProjects.LOOK, '查看'],
]);

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
