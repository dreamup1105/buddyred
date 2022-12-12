export interface ITableListItem {
  crId?: number;
  createdTime?: number;
  departmentId?: number;
  departmentName?: string;
  equipmentId?: number;
  equipmentName?: string;
  equipmentNo?: string;
  isScrap?: string;
  orgId?: number;
  orgName?: string;
  practicalDuration?: number;
  ratio?: number;
  shouldDuration?: number;
  sn?: string;
  stopDuration?: number;
}

export interface IFetchTableFormItem {
  current: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
  departmentId?: number;
  companyId?: number;
  keyword?: SVGStringList;
}
