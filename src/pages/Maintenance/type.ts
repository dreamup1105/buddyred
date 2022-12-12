import type { ReactNode } from 'react';

export enum MenuType {
  All = 'All', // 保养管理
  Initial_Maintenance = 'Initial_Maintenance', // 发起保养
  To_Be_Responded = 'To_Be_Responded', // 待响应
  To_Be_Maintained = 'To_Be_Maintained', // 待保养
  In_The_Maintenance = 'In_The_Maintenance', // 保养中
  Transfer_Order = 'Transfer_Order', // 转单
  Waiting_For_Acceptance = 'Waiting_For_Acceptance', // 待验收
  Acceptance_Completed = 'Acceptance_Completed', // 已验收
  Maintenance_Add_Order = 'Maintenance_Add_Order', // 保养补单
  Maintenance_Plan = 'Maintenance_Plan', // 保养计划
  Association_Settings = 'Association_Settings', // 关联设置
}

export enum RepairMenuType {
  All = 'All', // 维修管理
  Report_For_Repair = 'Report_For_Repair', // 报修
  Reported_For_Repair = 'Reported_For_Repair', // 已报修
  Transfer_Order = 'Transfer_Order', // 转单
  Waiting_For_Acceptance = 'Waiting_For_Acceptance', // 待验收
  Acceptance_Completed = 'Acceptance_Completed', // 已验收
  In_The_Repair = 'In_The_Repair', // 维修中
  To_Be_Responded = 'To_Be_Responded', // 待响应
  Repair_Report = 'Repair_Report', // 维修报告
  Repair_Supplement = 'Repair_Supplement', // 补单
}

export enum MenuTextType {
  All = '保养管理',
  Initial_Maintenance = '发起保养',
  To_Be_Responded = '待响应',
  To_Be_Maintained = '待保养',
  In_The_Maintenance = '保养中',
  Transfer_Order = '转单',
  Waiting_For_Acceptance = '待验收',
  Acceptance_Completed = '已验收',
}

export enum RepairMenuTextType {
  All = '维修管理',
  Report_For_Repair = '报修',
  Reported_For_Repair = '已报修',
  Transfer_Order = '转单',
  Waiting_For_Acceptance = '待验收',
  Acceptance_Completed = '已验收',
  In_The_Repair = '维修中',
  Repair_Supplement = '补单',
  Repair_Report = '维修报告',
  To_Be_Responded = '待维修',
}

export interface InitMaintenanceItemData {
  taskInfo: {
    deadline?: string;
    departmentId: number;
    departmentName: string;
    engineerId?: number;
    engineerName?: string;
    equipmentId?: number;
    equipmentName?: string;
    initPersonId: number;
    initPersonName: string;
    initPersonTel?: string;
    initReason?: string;
    orgId: number;
    orgName: string;
    planBeginTime?: string;
    crId?: number;
  };
}

export enum OrderStatus {
  CANCELED = 'CANCELED', // 取消
  RECORDING = 'RECORDING', // (补)录入中
  PENDING_RECORD = 'PENDING_RECORD', // (补录)待确认
  INIT = 'INIT', // 发起(待响应)
  ASSIGNED = 'ASSIGNED', // 已指派
  DOING = 'DOING', // 操作中
  PENDING = 'PENDING', // 待确认
  FIXED = 'FIXED', // 已完成
  TRANSFER = 'TRANSFER', // 转单中
}

export const OrderStatusConfig = new Map([
  [
    OrderStatus.CANCELED,
    {
      label: '已撤单',
      badge: '#ccc',
    },
  ],
  [
    OrderStatus.RECORDING,
    {
      label: '补录中',
      badge: '#108ee9',
    },
  ],
  [
    OrderStatus.PENDING_RECORD,
    {
      label: '(补录)待确认',
      badge: '#108ee9',
    },
  ],
  [
    OrderStatus.INIT,
    {
      label: '待响应',
      badge: '#108ee9',
    },
  ],
  [
    OrderStatus.ASSIGNED,
    {
      label: '待保养',
      badge: '#108ee9',
    },
  ],
  [
    OrderStatus.DOING,
    {
      label: '保养中',
      badge: '#108ee9',
    },
  ],
  [
    OrderStatus.TRANSFER,
    {
      label: '转单中',
      badge: '#4398d1',
    },
  ],
  [
    OrderStatus.PENDING,
    {
      label: '待确认',
      badge: '#108ee9',
    },
  ],
  [
    OrderStatus.FIXED,
    {
      label: '已验收',
      badge: '#87d068',
    },
  ],
]);

export const RepairOrderStatusConfig = new Map([
  [
    OrderStatus.CANCELED,
    {
      label: '已撤单',
      badge: '#ccc',
    },
  ],
  [
    OrderStatus.RECORDING,
    {
      label: '补录中',
      badge: '#108ee9',
    },
  ],
  [
    OrderStatus.PENDING_RECORD,
    {
      label: '(补录)待确认',
      badge: '#108ee9',
    },
  ],
  [
    OrderStatus.INIT,
    {
      label: '待响应',
      badge: '#108ee9',
    },
  ],
  [
    OrderStatus.ASSIGNED,
    {
      label: '待维修',
      badge: '#108ee9',
    },
  ],
  [
    OrderStatus.DOING,
    {
      label: '维修中',
      badge: '#108ee9',
    },
  ],
  [
    OrderStatus.TRANSFER,
    {
      label: '转单中',
      badge: '#4398d1',
    },
  ],
  [
    OrderStatus.PENDING,
    {
      label: '待确认',
      badge: '#108ee9',
    },
  ],
  [
    OrderStatus.FIXED,
    {
      label: '已验收',
      badge: '#87d068',
    },
  ],
]);

export interface IFetchTasksData {
  checkerId?: number;
  createdBy?: number;
  departmentId?: number[];
  engineerId?: number;
  equipmentName?: string;
  initPersonId?: number;
  isEvaluated?: boolean;
  orgId?: number[];
  since?: string;
  status?: OrderStatus[];
  taskNo?: string;
  crId?: number[];
}

export enum InitChannel {
  ONLINE = 'ONLINE',
  TEL = 'TEL',
  WEIXIN = 'WEIXIN',
  OTHER = 'OTHER',
}

export enum PostSuggestion {
  NORMAL = 'NORMAL',
  DEGRADE = 'DEGRADE',
  SCRAP = 'SCRAP',
}

export enum ReportStatus {
  NONE = 'NONE',
  DRAFT = 'DRAFT',
  NORMAL = 'NORMAL',
}

export enum ReportStatusText {
  NONE = '待录入',
  DRAFT = '待确认',
  NORMAL = '已完成',
}

enum Suggestion {
  NONE = 'NONE',
  REPAIR = 'REPAIR',
}

export enum TaskType {
  INSPECTION = 'INSPECTION',
  MAINTAIN = 'MAINTAIN',
  REPAIR = 'REPAIR',
}

export interface ITaskItem {
  bindTem?: boolean;
  checkedTime: string;
  checkerId: number;
  checkerName: string;
  createdBy: number;
  createdByName: string;
  deadline: string;
  departmentId: number;
  departmentName: string;
  engineerId: number;
  engineerName: string;
  equipmentId: number;
  equipmentName: string;
  fee: number;
  id: number;
  initChannel: InitChannel;
  initPersonId: number;
  initPersonName: string;
  initPersonTel: string;
  initReason: string;
  initTime: string;
  isEvaluated: boolean;
  lastMpTime: string;
  opBeginTime: string;
  opEndTime: string;
  orgId: number;
  orgName: string;
  planBeginTime: string;
  postSuggest: PostSuggestion;
  reason2: string;
  reportStatus: ReportStatus;
  status: OrderStatus;
  suggest: Suggestion;
  taskNo: string;
  taskType: TaskType;
  crId: number;
  teamName: string;
  ver: number;
  isScrap: string;
  planEndTime: string;
  equipNameNew: string;
  newEngineerId: number;
}

export interface IMaintenanceTaskItem {
  bindTem?: boolean;
  checkedTime: string;
  checkerId: number;
  checkerName: string;
  createdBy: number;
  createdByName: string;
  deadline: string;
  departmentId: number;
  departmentName: string;
  engineerId: number;
  engineerName: string;
  equipmentId: number;
  equipmentName: string;
  fee: number;
  id: number;
  initChannel: InitChannel;
  initPersonId: number;
  initPersonName: string;
  initPersonTel: string;
  initReason: string;
  initTime: string;
  isEvaluated: boolean;
  lastMpTime: string;
  opBeginTime: string;
  opEndTime: string;
  orgId: number;
  orgName: string;
  planBeginTime: string;
  postSuggest: PostSuggestion;
  reason2: string;
  reportStatus: ReportStatus;
  status: OrderStatus;
  suggest: Suggestion;
  taskNo: string;
  taskType: TaskType;
  crId: number;
  teamName: string;
  ver: number;
  isScrap: string;
  planEndTime: string;
  equipNameNew: string;
  newEngineerId: number;
}

export interface ITaskDetail {
  extInfo: {
    templateId: number;
    templateName: string;
    templateVerId: number;
  };
  taskInfo: {
    checkedTime: string;
    checkerId: number;
    checkerName: string;
    createdBy: number;
    createdByName: string;
    deadline: string;
    departmentId: number;
    departmentName: string;
    engineerId: number;
    engineerName: string;
    equipmentId: number;
    equipmentName: string;
    fee: number;
    id: number;
    initChannel: InitChannel;
    initPersonId: number;
    initPersonName: string;
    initPersonTel: string;
    initReason: string;
    initTime: string;
    isEvaluated: boolean;
    lastMpTime: string;
    opBeginTime: string;
    opEndTime: string;
    orgId: number;
    orgName: string;
    planBeginTime: string;
    postSuggest: PostSuggestion;
    reason2: string;
    reportStatus: ReportStatus;
    status: OrderStatus;
    suggest: Suggestion;
    taskNo: string;
    taskType: TaskType;
    crId: number;
    teamName: string;
    ver: number;
  };
}

export interface ITaskValue {
  attachments: {
    contentType: string;
    fileName: string;
    res: string;
  }[];
  context: ITaskValueContextItem[];
  values: ITaskValueValuesItem[];
}

export interface ITaskValueValuesItem {
  attachments: {
    contentType: string;
    fileName: string;
    res: string;
  }[];
  id: number;
  code: string;
  val: string[];
  xval: string;
}

export interface ITaskValueContextItem {
  id: number;
  code: string;
  val: string;
  label: string;
}

export interface AcceptData {
  employeeId: number;
  employeeName: string;
  taskScore: number;
  reason?: string;
}

export interface IFetchTaskCountData {
  departmentId?: number[];
  engineerId?: number;
  opBeginTime?: {
    maxValue?: string;
    minValue?: string;
  };
  opEndTime?: {
    maxValue?: string;
    minValue?: string;
  };
  orgId?: number[];
  status?: OrderStatus;
  crId?: number[];
}

export interface ITaskItemWithStatus {
  count: number;
  fee: number;
  groupValue: OrderStatus;
  minutes: number;
  groupKey: number;
}

export const BizConfig = new Map([
  [
    MenuType.To_Be_Responded,
    {
      status: OrderStatus.INIT,
      label: '待响应',
    },
  ],
  [
    MenuType.To_Be_Maintained,
    {
      status: OrderStatus.ASSIGNED,
      label: '待保养',
    },
  ],
  [
    MenuType.Transfer_Order,
    {
      status: OrderStatus.TRANSFER,
      label: '转单中',
    },
  ],
  [
    MenuType.In_The_Maintenance,
    {
      status: OrderStatus.DOING,
      label: '保养中',
    },
  ],
  [
    MenuType.Waiting_For_Acceptance,
    {
      status: [OrderStatus.PENDING, OrderStatus.PENDING_RECORD],
      label: '待验收',
    },
  ],
  [
    MenuType.Acceptance_Completed,
    {
      status: [OrderStatus.FIXED],
      label: '已验收',
    },
  ],
]);

export const RepairBizConfig = new Map([
  [
    RepairMenuType.Reported_For_Repair,
    {
      status: [OrderStatus.ASSIGNED, OrderStatus.INIT],
      label: '已报修',
    },
  ],
  [
    RepairMenuType.Waiting_For_Acceptance,
    {
      status: [OrderStatus.PENDING, OrderStatus.PENDING_RECORD],
      label: '待验收',
    },
  ],
  [
    RepairMenuType.Acceptance_Completed,
    {
      status: OrderStatus.FIXED,
      label: '已验收',
    },
  ],
  [
    RepairMenuType.In_The_Repair,
    {
      status: OrderStatus.DOING,
      label: '维修中',
    },
  ],
  [
    RepairMenuType.Transfer_Order,
    {
      status: OrderStatus.TRANSFER,
      label: '转单中',
    },
  ],
  [
    RepairMenuType.To_Be_Responded,
    {
      status: [OrderStatus.INIT, OrderStatus.ASSIGNED],
      label: '等待维修',
    },
  ],
  [
    RepairMenuType.Repair_Report,
    {
      reportStatus: [
        ReportStatus.NONE,
        ReportStatus.DRAFT,
        ReportStatus.NORMAL,
      ],
      status: [
        OrderStatus.PENDING,
        OrderStatus.PENDING_RECORD,
        OrderStatus.FIXED,
      ],
      label: '维修报告',
    },
  ],
]);

export enum PageType {
  REPAIR = 'REPAIR',
  MAINTENANCE = 'MAINTENANCE',
  SIMPLE_REPAIR = 'SIMPLE_REPAIR',
}

export const PageConfig = new Map([
  [
    PageType.MAINTENANCE,
    {
      bizConfig: BizConfig,
      baseHref: 'maintenance',
    },
  ],
  [
    PageType.REPAIR,
    {
      bizConfig: RepairBizConfig,
      baseHref: 'repair/management',
    },
  ],
]);

export enum OperationType {
  VIEW = 'VIEW',
  PRINT = 'PRINT',
  CANCEL = 'CANCEL',
  REJECT = 'REJECT',
  ACCEPT = 'ACCEPT',
  EXPORT = 'EXPORT',
  NOOP = 'NOOP',
}

export interface CardType {
  menu: MenuType | RepairMenuType;
  title: string;
  icon: string;
  enTitle: ReactNode;
  bgColor: string;
  arrow?: false;
  count?: number;
  status?: OrderStatus;
}

export interface ITaskDetailWithTemplate {
  ext: ITaskDetail;
  maintainTaskData: ITaskValue;
  repairPartList: {
    amount: number;
    id: number;
    manufacturerName: string;
    modelId: number;
    modelName: string;
    productName: string;
    quantity: number;
    sn: string;
  }[];
  template: {
    body: string;
    meta: {
      codeList: string[];
      codes: string[];
      context: {
        code: string;
        label: string;
        val: string;
      }[];
      specVerId: number;
    };
  };
}

export type ITaskDetailsWithTemplateItem = ITaskDetailWithTemplate & {
  maintainTask: ITaskItem;
};

export enum EventType {
  INPUT = 'INPUT', // 设备录入
  READY = 'READY', // 启用
  TERMINATED = 'TERMINATED', // 停用
  INSPECTION = 'INSPECTION', // 巡检
  MAINTAIN = 'MAINTAIN', // 保养
  REPAIR = 'REPAIR', // 维修
}

export enum EventTypeOfInt {
  INPUT = 0, // 设备录入
  READY = 1, // 启用
  TERMINATED = 2, // 停用
  INSPECTION = 3, // 巡检
  MAINTAIN = 4, // 保养
  REPAIR = 5, // 维修
}

export interface ITimelineItem {
  equipmentId: number;
  eventData: string;
  eventTime: string;
  eventType: string;
  id: number;
}

export interface IBatchFetchTaskDetailsData {
  checkerId: number;
  crId: number[];
  createdBy: number;
  departmentId: number[];
  endDate: string;
  engineerId: number;
  engineerName: string;
  equipmentName: string;
  equipmentNo: string;
  initPersonId: number;
  isEvaluated: boolean;
  maintainTaskIds: number[];
  manufacturerName: string;
  modelName: string;
  orgId: number[];
  since: string;
  sn: string;
  startDate: string;
  status: OrderStatus[];
  taskNo: string;
}

export interface UnfinishedItem {
  equipmentList?: number[];
  taskType?: string; // 维修-REPAIR 保养-MAINTAIN
}

export interface initiateTransferForm {
  taskId: number;
  newOrgId: number;
  newOrgName: string;
  newEngineerId: number;
  newEngineerName: string;
}
