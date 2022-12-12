export interface ITableListItem {
  accomplishFrequency?: number;
  departmentId?: number;
  departmentName?: string;
  maintainFrequency?: number;
  orgId?: number;
  orgName?: string;
  ratio?: string;
  repairsFrequency?: number;
}

export interface IFetchTableFormItem {
  current: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
  departmentId?: number;
  companyId?: number;
}
