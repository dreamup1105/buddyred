export interface ITableListItem {
  employeeId?: number;
  employeeName?: string;
  employeeNo?: string;
  repairCount?: number;
  repairCost?: number;
  maintainCount?: number;
  maintainCost?: number;
  inspectionCount?: number;
  accessoriesCost?: number;
  totalCost?: number;
  summationCost?: number;
  mountingsCost?: number;
}

export interface IfetchWorkingRecord {
  isEng: boolean;
  isHost: boolean;
  startTime?: string | null | undefined;
  endTime?: string | null | undefined;
  employeeName?: string;
  current?: number;
  pageSize?: number;
  hospitalIds?: (number | string)[];
}
