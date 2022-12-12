import type { MutableRefObject } from 'react';
import type { ITableListItem as EquipmentItem } from '@/pages/Assets/type';

export interface IFetchInspectionStatData {
  startTime: string; // 开始时间，查询整天以0点0分0秒开始
  endTime: string; // 结束时间，查询整天以23点59分59秒结束
  crId?: number; // 本次操作的客户id，如果是工程师则必传
}

export interface IFetchDepartmentInspectionStatData {
  date: string;
  departmentName?: string;
  crId?: number;
}

export interface IFetchInspectionRecordsData {
  pageSize: number;
  pageNum: number;
  orgId: number;
  startTime: string;
  endTime: string;
}
export interface IFetchInspectionRecordsData {
  pageSize: number;
  pageNum: number;
  orgId: number;
  startTime: string;
  endTime: string;
}

export interface fetchDepartmentInspectionStatDate {
  startTime?: string | null;
  endTime?: string | null;
  departmentName?: string;
  crId?: number;
  pageSize: number;
  pageNum: number;
}

export interface IDepartmentDetailItem {
  abnormalCount: number;
  departmentId: number;
  departmentName: string;
  normalCount: number;
  updDate: string;
}

export enum EquipmentStatus {
  NORMAL = 'NORMAL', // 正常
  ABNORMAL = 'ABNORMAL', // 异常
  NOINSPECTION = 'NOINSPECTION', // 未巡检
  IN_MAINTENANCE = 'IN_MAINTENANCE', // 维修中
}

export enum AuditStatus {
  UNREVIEWED = 'UNREVIEWED', // 验收不通过
  UNSUBMIT = 'UNSUBMIT', // 未提交验收
  TOAUDIT = 'TOAUDIT', // 待审核
  AUDITED = 'AUDITED', // 已验收
}

export interface InspectionStatItem {
  abnormalCount: number;
  alreadyInspectionDepartmentCount: number;
  dateTime: string;
  normalCount: number;
  notInspectionDepartmentCount: number;
}

export interface IFetchEquipmentsStatData {
  date: string;
  departmentId?: number;
  queryDataFlag?: boolean;
  inspectionFlag?: number; // 0: 未巡检 1: 已巡检
  crId?: number;
}

export interface IEquipmentStatItem extends EquipmentItem {
  auditStatus: AuditStatus;
  equipmentStatus: EquipmentStatus;
  inspectionEmployeeId: number;
  inspectionEmployeeName: string;
  inspectionEquipmentId: number;
  res: string;
  templateId: number;
  templateName: string;
  templateVerId: number;
  data?: {
    attachments: {
      contentType: string;
      fileName: string;
      res: string;
    }[];
    code: string;
    id: number;
    val: string;
    xval: string;
    label: string;
  }[];
}

export interface ICheckAcceptanceOrderItem {
  abnormalCount: number;
  aclCount: number;
  actualInspectionCount: number;
  auditNo: string;
  commitEmployeeId: number;
  commitEmployeeName: string;
  commitTime: string;
  departmentId: number;
  departmentName: string;
  equipmentCount: number;
  equipmentStatus: EquipmentStatus;
  id: number;
  normalCount: number;
}

export interface ICheckAcceptanceOrderDetailItem extends EquipmentItem {
  auditStatus: AuditStatus;
  equipmentStatus: EquipmentStatus;
  inspectionEmployeeId: number;
  inspectionEmployeeName: string;
  inspectionEquipmentId: number;
  templateId: number;
  templateName: string;
  templateVerId: number;
  res: string;
  data?: {
    attachments: {
      contentType: string;
      fileName: string;
      res: string;
    }[];
    id: number;
    code: string;
    val: string;
    xval: string;
    label: string;
  }[];
}

export const EquipmentStatusMap = new Map([
  [
    EquipmentStatus.NORMAL,
    {
      label: '正常',
      color: 'green',
    },
  ],
  [
    EquipmentStatus.ABNORMAL,
    {
      label: '异常',
      color: 'red',
    },
  ],
  [
    EquipmentStatus.NOINSPECTION,
    {
      label: '未巡检',
      color: 'grey',
    },
  ],
  [
    EquipmentStatus.IN_MAINTENANCE,
    {
      label: '维修中',
      color: 'yellow',
    },
  ],
]);

// 日巡检科室统计列表状态
export const EquipmentStatusEnum = new Map([
  [
    0,
    {
      label: '未验收',
      color: 'orange',
    },
  ],
  [
    1,
    {
      label: '已验收',
      color: 'green',
    },
  ],
  [
    2,
    {
      label: '未巡检',
      color: 'red',
    },
  ],
  [
    3,
    {
      label: '未提交验收',
      color: 'blue',
    },
  ],
  [
    null,
    {
      label: '',
      color: 'black',
    },
  ],
]);

export enum OperationType {
  VIEW = 'VIEW',
  PRINT = 'PRINT',
  CANCEL = 'CANCEL',
  REJECT = 'REJECT',
  ACCEPT = 'ACCEPT',
  NOOP = 'NOOP',
}

export type InspectionRecordTableType = 'Daily' | 'Pending';

export type ActionRef = MutableRefObject<
  ActionType | undefined | ((actionType: ActionType) => void)
>;

export type ActionType = {
  onContinueInspection: (record: ICheckAcceptanceOrderItem) => Promise<any>;
};

export interface IInspectionRecordItem {
  auditEmployeeId: number;
  auditEmployeeName: string;
  auditRemake: string;
  auditStatus: AuditStatus;
  auditTime: string;
  commitAuditTime: string;
  commitEmployeeId: number;
  commitEmployeeName: string;
  departmentId: number;
  departmentName: string;
  equipmentId: number;
  equipmentName: string;
  equipmentStatus: EquipmentStatus;
  id: number;
  inspectionTicketNo: string;
  lastUpdTime: string;
  lastUpdUserId: number;
  lastUpdUserName: string;
  orgId: number;
  templateId: number;
  templateName: string;
  templateVerId: number;
}

export interface queryInspections {
  crId?: number;
  endTime?: string;
  startTime?: string;
}

export interface statisticsType {
  crId?: number;
  endTime?: string;
  startTime?: string;
  isXlsx?: boolean;
}

export interface queryAllPassItem {
  isAcl: boolean;
}
