import { SignStatus } from '@/pages/Crm/Customer/type';

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

export interface IGenDraftSignData {
  agreeTypes: SignProjects;
  beginDate: string;
  endDate: string;
  crId: number;
  aid?: number;
}

export interface IFetchSignListData {
  agreeStatus?: SignStatus;
  beginDate?: string;
  endDate?: string;
  orgId?: number;
  orgName?: string;
  pageNum?: number;
  pageSize?: number;
  agreeId?: number;
  departmentId?: number;
}

export interface IFetchCompanyListData {
  id?: number;
  name?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface ICompanyItem {
  crId: number;
  id: number;
  name: string;
}

export const SignProjectsOptions = [
  {
    label: '维修',
    value: SignProjects.REPAIR,
  },
  {
    label: '保养',
    value: SignProjects.MAINTAIN,
  },
  {
    label: '巡检',
    value: SignProjects.INSPECTION,
  },
  {
    label: '检测',
    value: SignProjects.CHECK,
  },
];

export interface ISignContent {
  agreeCount: number;
  agreeStatus: SignStatus;
  agreeTypes: SignProjects[];
  beginDate: string;
  crId: number;
  createTime: string;
  endDate: string;
  orgName: string;
  id: number;
  scopeCheck: boolean;
  scopeInspection: boolean;
  scopeLook: boolean;
  scopeMaintain: boolean;
  scopeRepair: boolean;
  updateTime: string;
}

export const SignStatusOptions = [
  {
    label: '草稿',
    value: SignStatus.DRAFT,
  },
  {
    label: '待生效',
    value: SignStatus.TO_BE_EFFECTIVE,
  },
  {
    label: '执行中',
    value: SignStatus.EXECUTION,
  },
  {
    label: '已过期',
    value: SignStatus.EXPIRED,
  },
  {
    label: '已终止',
    value: SignStatus.TERMINATED,
  },
];

export interface ISignEquipmentItem {
  departmentId: number;
  departmentName: string;
  equipmentNo: string;
  id: number;
  manufacturerName: string;
  modelName: string;
  name: string;
  sn: string;
  tag: string[];
}
