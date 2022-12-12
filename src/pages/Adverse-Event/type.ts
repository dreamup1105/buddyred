export interface IAdverseEventItem {
  adverseResult: string;
  createTime: string;
  departmentId: number;
  departmentName: string;
  employeeId: number;
  employeeName: string;
  equipmentId: number;
  equipmentName: string;
  eventLevel: string;
  eventType: string;
  happenPlace: string;
  happenTime: string;
  id: number;
  orgId: number;
  personTitle: string;
  personType: string;
  personWorkYears: number;
  reportNo: string;
  reportTime: string;
  siteSituation: string;
  taskId: number;
}

export interface IAdverseEventDetailItem {
  adverseResult: string;
  departmentId: number;
  departmentName: string;
  employeeId: number;
  employeeName: string;
  equipmentId: number;
  equipmentName: string;
  eventLevel: string;
  eventTypeList: string[];
  happenPlace: string;
  happenTime: string;
  id: number;
  orgId: number;
  personTitle: string;
  personType: string;
  personWorkYears: number;
  reportNo: string;
  reportTime: string;
  siteSituation: string;
  equipNameNew: string;
}

export interface IAdverseEventParams {
  eventLevel: string[];
  eventType: string[];
  happenPlace: string[];
  personTitle: string[];
  personType: string[];
}

export enum OperationType {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  NOOP = 'NOOP',
}
