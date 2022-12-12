export interface ITableListItem {
  employeeId: number;
  departmentName: string;
  employeeName: string;
  employeeNo: string;
  engineerStatus: boolean;
  phone: string;
}

export interface IFetchWorkingCondition {
  isEng: boolean;
  isHost: boolean;
  current?: number;
  pageSize?: number;
  employeeName?: string;
  primaryDeptId?: number;
}
