import type { TemplateFor } from '../type';
export interface IFetchMaintainItemsData {
  groupName: string;
  name: string;
  tagName?: string[];
  orgId?: number | null;
  templateFor?: string;
}

export interface IFetchMaintainItemDetailsData {
  code: string;
  label: string;
  miId: number;
}

// 保养项目
export interface IMaintainItem {
  groupName?: string;
  id?: number;
  lastModifiedBy?: number;
  lastModifiedByName?: string;
  lastModifiedTime?: string;
  itemTags?: string[];
  name: string;
  orgId?: number | null;
  templateFor?: string;
}

// 保养指标项
export interface IMaintainItemDetail {
  defaultValue?: string;
  id: number;
  isMultivalue?: boolean; // 是否多值
  label?: string;
  lastModifiedBy?: number;
  lastModifiedByName?: string;
  lastModifiedTime?: string;
  miId?: number; // 保养项目id(单独保存时必须，与Mi整体保存时不必)
  options?: string[]; // 选项列表(总长200)
  spec?: string; // 规范(单位/要求/说明...)
  component?: 'select' | 'input' | string;
}

export interface ISystemMaintainItem {
  groupName?: string;
  code?: string;
  name: string;
  details?: [
    {
      code: string;
      label: string;
      spec: string;
      options: string[];
      defaultValue: string;
      isMultivalue: boolean;
    },
  ];
}

export interface ISystemMaintainItemAndDetails {
  items: ISystemMaintainItem[];
  codes: string[];
  ts: string;
}

export type IMaintainItemDetailWithTransformOptions = Omit<
  IMaintainItemDetail,
  'options'
> & {
  options?: { label: string; key: string }[] | undefined;
};

export type ITableListItem = IMaintainItem;

export enum OperationType {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  NOOP = 'NOOP',
}

// 保养项目新增
export interface SpecVerCreate {
  orgId?: number | null;
  tag?: string;
  templateFor?: TemplateFor;
}
