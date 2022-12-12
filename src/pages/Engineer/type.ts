export interface IFetchMaintenanceRecordForm {
  empIds?: number[] | null | undefined;
  isEng: boolean;
  isHost: boolean;
  taskType?: string;
  current?: number;
  pageSize?: number;
  empId?: number;
  hospitalIds?: number[];
  departmentsId?: number[] | undefined;
  employeeName?: string;
  equipmentName?: string;
  startTime?: string | null | undefined;
  endTime?: string | null | undefined;
}

export interface IFetchMaintenanceRecord {
  bindingId?: number;
  checkedTime?: string;
  departmentName?: string;
  engineerName?: string;
  equipmentName?: string;
  expense?: string;
  orgName?: string;
  partCost?: string;
  productName?: string;
  summationCost?: string;
  taskNo?: string;
  initTime?: string;
  responseTime?: string;
  beginTime?: string;
  partTime?: string;
  consumeTime?: number;
  wholeTime?: number;
  taskScore?: number;
}

export enum taskType {
  REPAIR = 'REPAIR',
  MAINTAIN = 'MAINTAIN',
  INSPECTION = 'INSPECTION',
}
