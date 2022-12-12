export interface ITableListItem {
  departmentId: string;
  departmentName: string;
  equipmentCount: number;
  powerConsumption: number;
  statDimensionKey: string;
}

export interface IFetchPowerConsumptionData {
  startTime?: string;
  endTime?: string;
  departmentIds?: number[];
  orgId?: number;
  pageSize: number;
  pageNum: number;
}
