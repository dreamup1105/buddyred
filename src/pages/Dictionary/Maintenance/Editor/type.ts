import type { ITaskValueValuesItem } from '@/pages/Maintenance/type';

export interface IMaintainItem {
  id: number;
  code: string;
  name: string;
  groupName: string;
  lastModifiedBy: number;
  lastModifiedByName: string;
  lastModifiedTime: string;
}

export interface IMaintainItemWithVersion {
  id: number;
  code: string;
  name: string;
  groupName: string;
  details: IMaintainItemDetailWithVersion[];
  itemTags: string[];
}

export interface IMaintainItemDetailWithVersion {
  id: number;
  code: string;
  defaultValue: string;
  isMultivalue: boolean;
  label: string;
  options: string[] | null;
  spec: string;
}

export interface IMaintainItemDetail {
  code: string;
  id: number;
  isMultivalue: boolean;
  label: string;
  lastModifiedBy: number;
  lastModifiedByName: string;
  lastModifiedTime: string;
  miId: number;
  options: string[];
  spec: string;
}

export interface IFetchMaintainItemsData {
  code?: string;
  groupName?: string;
  name?: string;
}

export interface IFetchMaintainItemDetailData {
  code?: string;
  label?: string;
  miId?: number;
}

export interface ISaveMaintainItemData {
  code: string;
  groupName: string;
  id: number;
  lastModifiedBy: number;
  lastModifiedByName: string;
  lastModifiedTime: string;
  name: string;
}

export interface IComponentNode {
  type: ComponentType;
  id: string;
  parentId: string | null;
  children?: IComponentNode[];
  bizId?: number;
  properties?: {
    value?: any;
    name?: string;
    details?: IDetailItem[];
    groupName?: string;
    logoSrc?: string | undefined;
    title?: string;
    subTitle?: string;
    style?: Record<string, any>;
    contextBizId?: number;
    contextValue?: string;
    contextCode?: string;
    contextType?: 'top' | 'bottom'; // 系统上下文项目的位置
  };
}

export interface IDetailItem {
  id: number;
  code: string | string[];
  defaultValue: string;
  isMultivalue: boolean;
  label: string;
  options: string[] | null;
  spec: string | null;
  value?: ITaskValueValuesItem;
}

export type ISaveMaintainItemDetailData = IMaintainItemDetail;

export type ICodeItem = { code: string; id: string };

export type ComponentType =
  | 'HEADER' // 头部区域
  | 'GROUP' // 组
  | 'SYSTEM' // 系统基本信息
  | 'CONTEXT' // 系统上下文
  | 'CONTEXT_ITEM' // 系统上下文(具体的某个项目)
  | 'TITLE' // 主标题
  | 'SUB_TITLE' // 二级标题
  | 'LOGO' // 模板Logo
  | 'BIZ_ITEM' // 业务项目（保养｜维修｜巡检）
  | 'APPENDIX'; // 附录

export type EditorRenderMode =
  | 'EDIT' // 编辑模式
  | 'PREVIEW' // 预览模式
  | 'PREVIEW_WITH_VALUE'
  | 'DETAIL'; // 详情模式（会回填值）

export type ActiveRecord =
  | { type: InsertPosition; record: IComponentNode }
  | undefined;

export type ActiveContextRecord =
  | {
      record: IComponentNode;
      type: ContextType;
      position: InsertPosition;
    }
  | undefined;

export type ContextType = 'top' | 'bottom';

export type InsertPosition = 'before' | 'after';

export interface ActionType {
  getComponentData: () => IComponentNode[];
  updateSpecVersion: (bizItems: IMaintainItemWithVersion[]) => void;
}

export const InitComponentData: IComponentNode[] = [
  {
    type: 'HEADER',
    properties: {
      title: '标题',
      subTitle: '二级标题',
      logoSrc: '',
    },
    id: 'header',
    parentId: null,
  },
  {
    type: 'CONTEXT',
    children: [],
    id: 'context',
    parentId: null,
  },
];

export enum TemplateBizType {
  MAINTAIN = 'MAINTAIN',
  REPAIR = 'REPAIR',
  INSPECTION = 'INSPECTION',
}

export enum TemplateBizTextType {
  MAINTAIN = '保养',
  REPAIR = '维修',
  INSPECTION = '巡检',
}

export const TemplateBizTypeOptions = [
  {
    label: '保养',
    value: TemplateBizType.MAINTAIN,
  },
  {
    label: '维修',
    value: TemplateBizType.REPAIR,
  },
  {
    label: '巡检',
    value: TemplateBizType.INSPECTION,
  },
];

export enum ITemplateVersion {
  v1 = 'v1',
}
