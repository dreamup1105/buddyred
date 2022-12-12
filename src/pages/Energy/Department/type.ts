export interface ICardItem {
  departmentId: number;
  deptFaultEquipment: number;
  deptName: string;
  deptNoOpeEquipment: number;
  deptOpenEquipment: number;
  deptTotalEquipment: number;
  momentPower: number;
  totalPowerConsumption: number;
  totalDeptRto: number;
}

export interface IFetchPowerConsumptionData {
  departmentIds?: number[];
  orgId?: number;
}
