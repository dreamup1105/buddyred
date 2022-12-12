import type { NameDictionarysEnum } from '@/utils/constants';

export interface ITableListItem {
  id: number;
  parentId: number;
  name: string;
  sortNumber: number;
  childrenNumber: number;
  children?: ITableListItem[];
}

/**
 * Create-Sub 新增子级设备
 * Create-Sibling 新增同级设备
 * View 详情
 * Relate 关联
 * Edit 编辑
 */
export type Operation =
  | 'Create-Sub'
  | 'Create-Sibling'
  | 'View'
  | 'Relate'
  | 'Edit'
  | 'Replace'
  | 'Noop';

export interface MaintainItem {
  // 设备类型ID
  equipmentTypeId: number;
  id: number;
  // 保养项目ID
  maintainItemId: number;
}

export enum BizType {
  TYPE = 'TYPE',
  MAINTAIN = 'MAINTAIN',
  ACCESSORIES = 'ACCESSORIES',
}

export interface IBizConfig {
  bizType: BizType;
  dictType: NameDictionarysEnum;
  tableTitle: string;
  toolbarBtns: {
    sub: string;
    sibling: string;
  };
  createDictFormModal: {
    sub: string;
    sibling: string;
    parentLabel: string;
    label: string;
    message: string;
  };
  replaceProjectModal: {
    placeholder: string;
  };
}
