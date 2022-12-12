export interface TableFormItem {
  orgId?: number;
  isAcl?: boolean;
  keyword?: string;
  startTime?: string;
  endTime?: string;
  current?: number;
  pageSize?: number;
  isEnable?: number | null;
}

export interface CustomTable {
  groupName?: string;
  eqCnt?: number;
  deptName?: string;
  headName?: string;
  id?: string;
  isEnable?: number;
  createPersonName?: string;
  createTime?: string;
  isScrap?: string;
}

export interface SelectedEquipmentItem {
  alias?: string;
  id?: number;
  equipmentNo?: string;
  manufacturerName?: string;
  modelName?: string;
  name?: string;
  orderId?: number;
  sn?: string;
  typeName?: string;
}

// 选择设备table Column
export const SelectEquipmentColumn = [
  {
    title: '设备名称',
    dataIndex: 'name',
    key: 'name',
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

// 启用状态
export const enableOptions = [
  {
    label: '启用',
    value: 1,
  },
  {
    label: '停用',
    value: 0,
  },
];

export const enableEnum = new Map<any, any>([
  [
    1,
    {
      label: '启用',
      color: <any>'success',
    },
  ],
  [
    0,
    {
      label: '停用',
      color: <any>'red',
    },
  ],
]);

// 自检时间
export const weekOptions = [
  {
    label: '周一',
    value: 'MONDAY',
  },
  {
    label: '周二',
    value: 'TUESDAY',
  },
  {
    label: '周三',
    value: 'WEDNESDAY',
  },
  {
    label: '周四',
    value: 'THURSDAY',
  },
  {
    label: '周五',
    value: 'FRIDAY',
  },
  {
    label: '周六',
    value: 'SATURDAY',
  },
  {
    label: '周日',
    value: 'SUNDAY',
  },
];
