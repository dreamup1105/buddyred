import type { PaginationConfig } from '@/components/ListPage';

export interface Engineer {
  id: string | number;
  name: string;
  phone?: string;
}

export interface Teammate {
  employeeId: string | number;
  name: string;
  phone?: string;
}

export interface Organization {
  id: number;
  name: string;
}

export interface Team {
  id?: number;
  name: string;
  leaderId?: number;
  leaderName?: string;
  engineers: Teammate[];
  orgId: number;
  orgName: string;
  siteOrgId?: number;
  siteOrgName?: string;
  sigStatus?: SigStatus;
  authStatus?: AuthStatus;
}

export interface TeamWithEngineers {
  team: Team;
  engineers: Teammate[];
}

export interface TeamDetail {
  id: number;
  orgId: number;
  orgName: string;
  siteOrgId: number;
  siteOrgName: string;
  name: string;
  leaderId: number;
  leaderName: string;
  phone: string;
  authStatus: AuthStatus;
  sigStatus: SigStatus;
  authApply: string;
  authApplyTime: string;
  authReplyTime: string;
  sigApply: string;
  sigApplyTime: string;
  sigReplyTime: string;
  sigBeginDate: string;
  sigEndDate: string;
  sigScopeRepairs: boolean;
  sigScopeMaintain: boolean;
  sigScopeInspection: boolean;
  sigScopeMeasurement: boolean;
}

export interface ListTeamCondition {
  orgId?: string | number;
  siteOrgId?: string | number;
  authStatus?: AuthStatus;
  sigStatus?: SigStatus;
}

export enum OrgType {
  'HOSPITAL' = 'HOSPITAL',
  'PLATFORM' = 'PLATFORM',
  'MAINTAINER' = 'MAINTAINER',
  'MANUFACTURER' = 'MANUFACTURER',
}
export enum AuthStatus {
  'ALL' = 'ALL',
  'AUTH_NONE' = 'AUTH_NONE',
  'AUTH_APPLIED' = 'AUTH_APPLIED',
  'AUTH_ACCEPTED' = 'AUTH_ACCEPTED',
  'AUTH_DENIED' = 'AUTH_DENIED',
}

export enum SigStatus {
  'ALL' = 'ALL',
  'SIG_NONE' = 'SIG_NONE',
  'SIG_APPLIED' = 'SIG_APPLIED',
  'SIG_ACCEPTED' = 'SIG_ACCEPTED',
  'SIG_DENIED' = 'SIG_DENIED',
  'SIG_TERMINATED' = 'SIG_TERMINATED',
}

export const StatusMap = new Map([
  ['ALL', '所有'],
  ['SIG_NONE', '未签约'],
  ['SIG_APPLIED', '签约申请中'],
  ['SIG_ACCEPTED', '已签约'],
  ['SIG_DENIED', '签约失败'],
  ['SIG_TERMINATED', '签约已失效'],
  ['AUTH_NONE', '未授权'],
  ['AUTH_APPLIED', '授权申请中'],
  ['AUTH_ACCEPTED', '已授权'],
  ['AUTH_DENIED', '授权失败'],
]);

export const StatusColorMap = new Map<SigStatus | AuthStatus, string>([
  [AuthStatus.AUTH_NONE, ''],
  [AuthStatus.AUTH_APPLIED, 'orange'],
  [AuthStatus.AUTH_ACCEPTED, 'green'],
  [AuthStatus.AUTH_DENIED, 'red'],
  [SigStatus.SIG_NONE, ''],
  [SigStatus.SIG_APPLIED, 'orange'],
  [SigStatus.SIG_ACCEPTED, 'green'],
  [SigStatus.SIG_DENIED, 'red'],
  [SigStatus.SIG_TERMINATED, 'red'],
]);

export type OtherLoaderParams =
  | Pick<ListTeamCondition, 'orgId'>
  | Pick<ListTeamCondition, 'siteOrgId'>;

export type SearchParams = Omit<ListTeamCondition, 'orgId' | 'siteOrgId'>;

export interface QueryObject extends PaginationConfig, SearchParams {}
