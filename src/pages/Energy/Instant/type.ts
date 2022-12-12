export interface ITableListItem {
  equipmentId: number;
  departmentName: string;
  name: string;
  modelName: string;
  manufacturerName: string;
  sn: string;
  typeName: string;
  runType: string;
  voltage: number;
  current: number;
  temperature: number;
}
export interface IFetchInstantData {
  departmentIds?: number[];
  orgId?: number;
  pageNum?: number;
  pageSize?: number;
}

export interface IFetchDetailItem {
  checkPeopleNum?: number;
  current?: number;
  manufacturerName?: string;
  modelName?: string;
  name?: string;
  status?: number;
  temperature?: number;
  usageTime?: number;
  voltage?: number;
}

export interface IFetchStatistic {
  momentPower?: number;
  deptOpenEquipment?: number;
  deptNoOpeEquipment?: number;
  deptFaultEquipment?: number;
}

export interface IFetchDetail {
  equipmentId: number;
}
// 科室耗电历史
export interface TimeInterval {
  startTime?: string;
  endTime?: string;
  equipmentId?: number;
  orgId?: number;
  pageNum: number;
  pageSize: number;
}

export interface HistoryItems {
  departmentName: string;
  equipmentName: string;
  momentCurrent: number;
  momentTime: string;
  momentVoltage: number;
  temperature: number;
}
