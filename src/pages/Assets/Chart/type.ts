import type { ReactNode } from 'react';

export interface EquipmentDistributionItem {
  departmentName: string | ReactNode; // 部门名
  departmentId: number | undefined;
  count: number;
  types: { // 部门下该类别设备分布统计
    subTypes: { // 该类别下按alias/name分类的统计
      name: string; // 设备别名/name
      count: number; // 该别名设备统计数量
    }[];
    count: number; // 该类别统计数量
    name: string; // 设备类别名/name
  }[];
}

export interface TreeMapDataItem {
  name: string;
  value: number;
  path: string;
  children?: TreeMapDataItem[];
}

export interface PIEDataItem {
  name: string;
  value: number;
  parentName?: string;
}

export interface EquipmentDistributionTableItem {
  departmentName: string;
  departmentEquipmentCount: number;
  typeName: string;
  typeCount: number;
  subTypeName: string;
  subTypeCount: number;
  departmentRowSpan: number; // 科室行合并单元格数量
  typeRowSpan: number; // 类型行合并单元格数量
}

export interface EquipmentTypeStatItem {
  count: number;
  name: string;
  subTypes: {
    count: number;
    name: string;
  }[];
}

export interface IRepairSummary {
  abnormalCount: number;
  abnormalList: {
    departmentId: number;
    departmentName: string;
    equipmentNo: string;
    id: number;
    modelId: number;
    modelName: string;
    name: string;
    repairCount: number;
    typeName: string;
  }[];
  abnormalRatio: Record<string, number>;
  normalCount: number;
  repairingCount: 0
  equipmentCount: number;
}

export type ChartGroupBy = 'name' | 'alias';

export type IMaintenanceTrend = Record<string, {
    createMaintainCount: number;
    finishMaintainCount: number;
    finishRatio: number;
    month: string;
    quarter: string;
    year: number;
  }>;