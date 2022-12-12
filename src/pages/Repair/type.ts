import type { PaginationConfig } from '@/components/ListPage';

type ID = string | number;

export enum RecordStatus {
  ALL = 'ALL',
  CANCELED = 'CANCELED',
  RECORDING = 'RECORDING',
  PENDING_RECORD = 'PENDING_RECORD',
  INIT = 'INIT',
  ASSIGNED = 'ASSIGNED',
  DOING = 'DOING',
  PENDING = 'PENDING',
  FIXED = 'FIXED',
}

export const RecordStatuTextMap = new Map<string, string>([
  [RecordStatus.ALL, '全部'],
  [RecordStatus.CANCELED, '已取消'],
  [RecordStatus.RECORDING, '补录中'],
  [RecordStatus.PENDING_RECORD, '补单待审批'],
  [RecordStatus.INIT, '已发起'],
  [RecordStatus.ASSIGNED, '已接单'],
  [RecordStatus.DOING, '维保中'],
  [RecordStatus.PENDING, '维保待审批'],
  [RecordStatus.FIXED, '已完成'],
]);

export const RecordStatuColorMap = new Map<string, string>([
  [RecordStatus.CANCELED, 'default'],
  [RecordStatus.RECORDING, 'orange'],
  [RecordStatus.PENDING_RECORD, 'orange'],
  [RecordStatus.INIT, 'orange'],
  [RecordStatus.ASSIGNED, 'orange'],
  [RecordStatus.DOING, 'orange'],
  [RecordStatus.PENDING, 'orange'],
  [RecordStatus.FIXED, 'green'],
]);

export enum InitChannel {
  ONLINE = 'ONLINE',
  TEL = 'TEL',
  WEIXIN = 'WEIXIN',
  OTHER = 'OTHER',
}

export enum InitChannelText {
  ONLINE = '线上报修',
  TEL = '电话报修',
  WEIXIN = '微信报修',
  OTHER = '其他',
}

export enum TaskType {
  INSPECTION = 'INSPECTION',
  MAINTAIN = 'MAINTAIN',
  REPAIR = 'REPAIR',
}

export enum PostSuggest {
  NORMAL = 'NORMAL',
  DEGRADE = 'DEGRADE',
  SCRAP = 'SCRAP',
}

export enum PostSuggestText {
  NORMAL = '正常使用',
  DEGRADE = '降级使用',
  SCRAP = '建议报废',
}

export enum RepairResult {
  FIXED = 'FIXED',
  MISTAKE = 'MISTAKE',
  INITOR_ASK_CANCEL = 'INITOR_ASK_CANCEL',
}

export enum RepairResultText {
  FIXED = '维修完成',
  MISTAKE = '误报',
  INITOR_ASK_CANCEL = '医生要求撤单',
}

export enum ReportStatus {
  NONE = 'NONE',
  DRAFT = 'DRAFT',
  NORMAL = 'NORMAL',
}

export enum AttachmentCategory {
  'AUDIO' = 'error_description_audio_recorder', // 设备报修/保养的故障描述语音文件
  'PHOTO_ERROR' = 'error_description_photo', // 设备报修/保养的故障描述图片文件
  'PHOTO_RECORD' = 'engineer_replenishment_photo', // 维修机构补单的维修工单上传图片文件
}

export interface RepairRecord {
  id: ID;
  checkerId: ID;
  checkerName: string;
  createdBy: ID;
  createdByName: string;
  createdTime: string;
  departmentId: ID;
  departmentName: string;
  engineerId: ID;
  engineerName: string;
  equipmentId: ID;
  equipmentName: string;
  initChannel: InitChannel;
  initPersonId: ID;
  initPersonName: string;
  initPersonTel: string;
  initReason: string;
  initTime: string;
  opBeginTime: string;
  opEndTime: string;
  lastModifiedTime: string;
  orgId: ID;
  orgName: string;
  planBeginTime: string;
  postSuggest: PostSuggest;
  repairResult: RepairResult;
  reportStatus: ReportStatus;
  status: RecordStatus;
  taskNo: string;
  taskType: TaskType;
  crId: ID;
  teamName: string;
}

export interface Part {
  id?: ID;
  amount: number; // 金额
  manufacturerName: string;
  modelId?: ID;
  modelName: string;
  productName: string;
  sn?: string;
  quantity: number; // 数量
  customIndex?: number;
}

export interface SearchParams {
  statu?: RecordStatus;
}

export interface QueryObject extends SearchParams, PaginationConfig {}

export interface OtherLoaderParams {
  orgId?: ID[];
  checkerId?: ID;
  engineerId?: ID;
  createdBy?: ID;
}

export interface QueryCondition extends SearchParams, OtherLoaderParams {
  status?: RecordStatus[];
}

export type NewRecord = Pick<
  RepairRecord,
  | 'orgId'
  | 'orgName'
  | 'createdBy'
  | 'createdByName'
  | 'initPersonId'
  | 'initPersonName'
  | 'departmentId'
  | 'departmentName'
  | 'equipmentId'
  | 'equipmentName'
  | 'crId'
  | 'teamName'
  | 'engineerId'
  | 'engineerName'
>;
