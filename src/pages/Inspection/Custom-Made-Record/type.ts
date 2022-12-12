export interface CustomEquipmentTable {
  dataTime: string;
  employeeName: string;
  equipmentName: string;
  equipmentNo: string;
  equipmentStatus: string;
  inspectionId: number;
  manufacturerName: string;
  modelName: string;
  sn: string;
  typeName: string;
}

export interface LendingStaticItem {
  auditingNum?: number;
  initNum?: number;
  passNum?: number;
  secondedNum?: number;
  transferNum?: number;
}

export const SelectEquipmentColumn = [
  {
    title: '设备名称',
    dataIndex: 'equipmentName',
    key: 'equipmentName',
    hideInSearch: true,
  },
  {
    title: '设备型号',
    dataIndex: 'modelName',
    key: 'modelName',
    hideInSearch: true,
  },
  {
    title: '制造商名称',
    dataIndex: 'manufacturerName',
    key: 'manufacturerName',
    hideInSearch: true,
  },
  {
    title: '设备自编号',
    dataIndex: 'equipmentNo',
    key: 'equipmentNo',
    hideInSearch: true,
  },
  {
    title: '设备序列号',
    dataIndex: 'sn',
    key: 'sn',
    hideInSearch: true,
  },
  {
    title: '设备类型',
    dataIndex: 'typeName',
    key: 'typeName',
    hideInSearch: true,
  },
];

export enum startStatus {
  TRANSFER = 'TRANSFER',
  SECONDED = 'SECONDED',
}

// 启用状态
export const startStatusOptions = [
  {
    label: '启用',
    value: '0',
  },
  {
    label: '停用',
    value: '1',
  },
];

export const startStatusEnum = new Map<any, any>([
  [
    startStatus.TRANSFER,
    {
      label: '启用',
      color: <any>'success',
    },
  ],
  [
    startStatus.SECONDED,
    {
      label: '停用',
      color: <any>'default',
    },
  ],
]);

// 自检时间
export const weekOptions = [
  {
    label: '周一',
    value: '0',
  },
  {
    label: '周二',
    value: '1',
  },
  {
    label: '周三',
    value: '2',
  },
  {
    label: '周四',
    value: '3',
  },
  {
    label: '周五',
    value: '4',
  },
  {
    label: '周六',
    value: '5',
  },
  {
    label: '周日',
    value: '6',
  },
];

export interface selectEveryGroupFormItem {
  crId?: number;
  isAcl?: boolean;
  startTime?: string;
  endTime?: string;
  keyword?: string;
}

export interface ICardItem {
  days: number;
  departmentName: string;
  equipmentCount: number;
  groupId: number;
  groupName: string;
  headName: string;
}

export interface selectGroupFormItem {
  crId?: number;
  isAcl?: boolean;
  groupId: number;
  current: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
  keyword?: string;
}

export interface customRecordTable {
  groupName: string;
  departmentName: string;
  equipmentCount: number;
  normalCount: number;
  abnormalCount: string;
  inRepairCount: number;
  inSecondedCount: string;
  notInspectionCount: number;
  employeeName: string;
  updDate: string;
  id: number;
  inspectionType: string;
  groupId: number;
}

export interface selectEquipmentFormItem {
  startTime?: string;
  endTime?: string;
  groupId?: number;
  inspectionType?: string;
}

export const equipmentStatusMap = new Map<string, string>([
  ['NOINSPECTION', '未自检'],
  ['NORMAL', '正常'],
  ['ABNORMAL', '异常'],
  ['UNDERREPAIR', '维修中'],
  ['SUBTENANCY', '转借中'],
]);
