export interface ITableListItem {
  departmentId: number;
  departmentName: string;
  detectNum: number;
  equipmentId: number;
  equipmentName: string;
  manufacturerName: string;
  modelName: string;
  powerConsumption: number;
  sn: string;
  typeName: string;
}

export interface IFetchEquipmentPowerConsumptionData {
  departmentId?: number;
  endTime?: string;
  equipmentId?: number;
  equipmentName?: string;
  orgId: number;
  pageNum?: number;
  pageSize?: number;
  startTime?: string;
}
