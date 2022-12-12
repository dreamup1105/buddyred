import type {
  TaskType,
  OrderStatus,
  InitChannel,
  PostSuggestion,
  ReportStatus,
} from '@/pages/Maintenance/type';
import type { EquipmentDetail } from '@/pages/Assets/type';

export interface IFetchTasksData {
  checkerId?: number;
  createdBy?: number;
  departmentId?: number[];
  engineerId?: number;
  initPersonId?: number;
  equipmentName?: string;
  isEvaluated?: boolean;
  orgId?: number[];
  reportStatus?: ReportStatus[];
  since?: string;
  status?: OrderStatus[];
  taskNo?: string;
  crId?: number[];
}

export interface InitRepairData {
  adverseEventReq?: {
    adverseResult: string;
    eventLevel: string;
    eventTypeList: string[];
    happenPlace: string;
    happenTime: string;
    personTitle: string;
    personType: string;
    personWorkYears: number;
    reportTime: string;
    siteSituation: string;
  };
  planEndTime?: string | null;
  createdBy?: number;
  createdByName?: string;
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
  orgName: string | undefined;
  planBeginTime?: string;
  crId?: number;
  teamName?: string;
  createAdverseEvent?: boolean;
}

export interface InitRepairRes {
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
  initChannel: string;
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
  postSuggest: string;
  reason2: string;
  repairResult: string;
  reportStatus: string;
  status: string;
  taskNo: string;
  taskType: string;
  crId: number;
  teamName: string;
  ver: number;
}

export interface ITaskItem {
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
  repairResult: string;
  reportStatus: ReportStatus;
  status: OrderStatus;
  taskNo: string;
  taskType: TaskType;
  crId: number;
  teamName: string;
  ver: number;
  equipNameNew: string;
  isScrap: string;
  planEndTime: string;
  newEngineerId: number;
}

export interface IRepairReport {
  equipmentInfo: EquipmentDetail;
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
  repairReport: {
    confirmTime: string;
    createdTime: string;
    description: string;
    diagnosis: string;
    fault: string;
    fee: number;
    id: number;
    lastModifiedTime: string;
  };
  simpleAttachmentInfoList: Attachment[];
}

export type IBatchRepairReportItem = IRepairReport & {
  repairTask: ITaskItem;
};

export interface ITaskTimelineItem {
  createEmployeeId: number;
  createEmployeeName: string;
  createTime: string;
  equipmentId: number;
  id: number;
  operation: string;
  remark: string;
  taskId: number;
}

export enum OperationType {
  VIEW = 'VIEW',
  PRINT = 'PRINT',
  CANCEL = 'CANCEL',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  TAKE = 'TAKE',
  EXPORT = 'EXPORT',
  NOOP = 'NOOP',
}

export interface IBatchFetchRepairReportData {
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
  manufacturerName: string;
  modelName: string;
  orgId: number[];
  repairTaskIds: number[];
  reportStatus: ReportStatus[];
  since: string;
  sn: string;
  startDate: string;
  status: string[];
  taskNo: string;
}
