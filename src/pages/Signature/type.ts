import type { UploadFile } from 'antd/es/upload/interface';

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total?: number;
}

export enum WarranthyStatus {
  'ALL' = 'ALL',
  'MANUFACTURER' = 'MANUFACTURER',
  'THIRDPART' = 'THIRDPART',
  'OTHER' = 'OTHER',
  'NONE' = 'NONE',
}

export const WarranthyStatusMap = new Map<WarranthyStatus, string>([
  [WarranthyStatus.ALL, '所有'],
  [WarranthyStatus.MANUFACTURER, '厂家保修'],
  [WarranthyStatus.THIRDPART, '第三方保修'],
  [WarranthyStatus.OTHER, '其它保修'],
  [WarranthyStatus.NONE, '非在保'],
]);

export const WarranthyStatusColor = new Map<WarranthyStatus, string>([
  [WarranthyStatus.ALL, ''],
  [WarranthyStatus.MANUFACTURER, 'green'],
  [WarranthyStatus.THIRDPART, 'green'],
  [WarranthyStatus.OTHER, 'green'],
  [WarranthyStatus.NONE, ''],
]);

export interface Equipment {
  id: number;
  name: string;
  equipmentNo: string;
  modelName: string;
  producerName: string;
  manufacturerName: string;
  sn: string;
  departmentId: string | number;
  departmentName: string;
  warranthyStatus: WarranthyStatus;
  isSigned?: boolean;
}

export interface SearchCondition {
  departmentId?: (number | string)[];
  warranthyStatus?: WarranthyStatus[];
}

export interface SigApplyData {
  sig: {
    sigApply: string;
    sigBeginDate: string;
    sigEndDate: string;
    sigScopeRepairs: boolean;
    sigScopeMaintain: boolean;
    sigScopeInspection: boolean;
    sigScopeMeasurement: boolean;
  };
  equipmentIds: (number | string)[];
  attachments: {
    category: string;
    fileName: string;
    mime: string;
    res: string;
  }[];
}

export const SigScopeMap = new Map<string, string>([
  ['sigScopeRepairs', '维修'],
  ['sigScopeMaintain', '保养'],
  ['sigScopeInspection', '巡检'],
  ['sigScopeMeasurement', '计量检测'],
]);

export interface ExtendedUploadFile extends UploadFile<any> {
  res?: string;
  src?: string;
}
