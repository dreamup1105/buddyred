export interface LendignTableFormItem {
  orgId?: number;
  isAcl?: boolean;
  keyword?: string;
  beginTime?: string;
  endTime?: string;
  current?: number;
  pageSize?: number;
  orderStatus?: string | null;
  orderType?: string | null;
}

export interface ICertCategoryItem {
  key: string;
  value: string;
  fileList: any;
}

export enum LendingType {
  TRANSFER = 'TRANSFER',
  SECONDED = 'SECONDED'
}

export const RecordTypeTextMap = new Map<string, string>([
  [LendingType.TRANSFER, '转科单'],
  [LendingType.SECONDED, '借调单']
])

// 转借单类型
export const lendingTypeOptions = [
  {
    label: '转科单',
    value: 'TRANSFER'
  },
  {
    label: '借调单',
    value: 'SECONDED'
  }
]

export enum LendingStatus {
  INIT = 'INIT',
  AUDITING = 'AUDITING',
  PASS = 'PASS',
}

export const RecordStatuTextMap = new Map<string, string>([
  [LendingStatus.INIT, '草稿'],
  [LendingStatus.AUDITING, '申请中'],
  [LendingStatus.PASS, '审批结束'],
]);

export const lendingStatusOptions = [
  {
    label: '草稿',
    value: 'INIT'
  },
  {
    label: '申请中',
    value: 'AUDITING'
  },
  {
    label: '审批结束',
    value: 'PASS'
  },
]

export const LendingStatusEnum = new Map<any, any>([
  [
    LendingStatus.INIT,
    {
      label: '草稿',
      color: <any>'default',
    },
  ],
  [
    LendingStatus.AUDITING,
    {
      label: '申请中',
      color: <any>'processing',
    },
  ],
  [
    LendingStatus.PASS,
    {
      label: '审批结束',
      color: <any>'success',
    },
  ]
]);


export const LendingTypeEnum = new Map<any, any>([
  [
    LendingType.TRANSFER,
    {
      label: '转科单',
      color: <any>'magenta',
    },
  ],
  [
    LendingType.SECONDED,
    {
      label: '借调单',
      color: <any>'volcano',
    },
  ]
]);


export interface LendingTable {
  createPerson: number;
  auditAble: number;
  createPersonName: string;
  createTime: string;
  id: number;
  lastModifyPersonName: string;
  lastModifyTime: string;
  orderNo: string;
  orderStatus: string;
  orderType: string;
  sourceDeptName: string;
  targetDeptName: string;
  isReturn: number;
}

export interface SelectedEquipmentItem {
  alias?: string;
  eqId?: number;
  equipmentNo?: string;
  manufacturerName?: string;
  modelName?: string;
  name?: string;
  orderId?: number;
  sn?: string;
  typeName?: string;
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
]