export interface IOrgSummary {
  monthStats: {
    createTime: string;
    departmentId: number;
    id: number;
    inspectionCount: number;
    maintainCount: number;
    orgId: number;
    repairCount: number;
    statMonth: string;
    statMonthStr: string;
  }[];
  totalStat: {
    equipmentCount: number;
    inspectingCount: number;
    maintainingCount: number;
    modifyTime: string;
    orgId: number;
    repairCount: number;
    repairEquipmentCount: number;
    repairingCount: number;
  };
  thisMonthInspectionCount: number;
  thisMonthMaintainCount: number;
  thisMonthRepairCount: number;
  repairChangeRatio: number; // 维修数环比增长率
  repairChange: number; // 维修数环比变化数
  maintainChangeRatio: number;
  maintainChange: number;
  inspectionChangeRatio: number;
  inspectionChange: number;
}

export interface IInspectionStatItem {
  abnormalCount: number;
  actualInspectionCount: number;
  auditEmployeeId: number;
  auditEmployeeName: string;
  auditNo: string;
  auditRemake: string;
  auditResult: boolean;
  auditStatus: boolean;
  auditTime: string;
  commitCrId: number;
  commitEmployeeId: number;
  commitEmployeeName: string;
  commitTime: string;
  departmentId: number;
  departmentName: string;
  equipmentCount: number;
  id: number;
  normalCount: number;
  orgId: number;
}

export interface IAvatarItem {
  engineerStatus: boolean;
  name: string;
  picKey: string;
}
