export interface ScarpSearchItem {
  current: number;
  pageSize: number;
  departmentIds?: number[];
  isAcl: boolean;
  keyword?: string;
  equipmentNo: string;
  orgId?: number;
}

export interface ScrapExportItem {
  departmentIds?: number[];
  isAcl: boolean;
  keyword?: string;
  orgId?: number;
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

// 设备状态
export enum EquipmentStatusEnum {
  // 未启用
  UNUSED = 'UNUSED',
  // 启用中
  READY = 'READY',
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

// 报废单状态
export enum ScarpStatus {
  INIT = 'INIT',
  REPORTING = 'REPORTING',
  PASS = 'PASS',
  REJECT = 'REJECT',
}

export const RecordStatuTextMap = new Map<string, string>([
  [ScarpStatus.INIT, '草稿'],
  [ScarpStatus.REPORTING, '申请中'],
  [ScarpStatus.PASS, '通过'],
  [ScarpStatus.REJECT, '驳回'],
]);

export const ScarpStatusEnum = new Map<any, any>([
  [
    ScarpStatus.INIT,
    {
      label: '草稿',
      color: <any>'default',
    },
  ],
  [
    ScarpStatus.REPORTING,
    {
      label: '申请中',
      color: <any>'processing',
    },
  ],
  [
    ScarpStatus.PASS,
    {
      label: '通过',
      color: <any>'success',
    },
  ],
  [
    ScarpStatus.REJECT,
    {
      label: '驳回',
      color: <any>'error',
    },
  ],
]);

export interface ScarpDetailItem {
  eqType?: string; //	设备类型
  eqVendor?: string; //	设备厂商
  eqModel?: string; //	设备型号
  eqNo?: string; //	设备编号
  repairCost?: string; //	维修费用
  approvalAdvice?: string; //	审批意见
  approvalPerson?: number; //	审批人员id
  approvalPersonName?: string; //	审批人员姓名
  approvalTime?: string; //	审批时间
  equipmentDeptName?: string; //	设备所属科室名称
  equipmentName?: string; //		设备名称
  identifyAdvice?: string; //		技术人员鉴定意见
  maintainTimes?: number; //	保养次数
  orderNo?: string; //	报废单编号
  partCount?: number; //	设备更换配件费用
  partCost?: number; //	设备更换配件数量
  repairTimes?: number; //	修理次数
  reportPersonName?: number; //	申报人姓名
  reportTime?: string; //	申报时间
  scrapReason?: string; //	报废原因
  scrapStatus?: string; //	报废单状态,可用值:INIT,REPORTING,PASS,REJECT
  reportPerson: number;
}
