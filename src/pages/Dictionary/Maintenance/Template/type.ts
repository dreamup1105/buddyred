import type { TemplateBizType } from '@/pages/Dictionary/Maintenance/Editor/type';

export interface IFetchTemplatesData {
  isDeprecated?: boolean;
  name?: string;
  specVerNo?: number;
  specVerTag?: string;
  applyType?: TemplateBizType;
  crId?: number;
  orgId?: number | null;
  templateFor?: string;
}

export interface IFetchVersionsData {
  tag?: string;
  verNo?: number;
  orgId?: number | null;
  templateFor?: string;
}

export interface ITemplateItem {
  applyType: TemplateBizType;
  contentType: string;
  description: string;
  id: number;
  isDeprecated: boolean;
  lastModifiedBy: number;
  lastModifiedByName: string;
  lastModifiedTime: string;
  name: string;
  specVerId: number;
  specVerNo: number;
  specVerTag: string;
  verId: number;
  templateFor: string;
}

export interface IVersionItem {
  id: number;
  lastModifiedBy: number;
  lastModifiedByName: string;
  lastModifiedTime: string;
  size: number;
  tag: string;
  ts: string;
  verNo: number;
}

export interface ISaveTemplateBasicInfoData {
  applyType: TemplateBizType; // 模板类型
  description?: string;
  id?: number;
  isDeprecated?: boolean;
  name: string;
  specVerId?: number;
  orgId?: number | null;
  templateFor?: string;
}

export interface ISaveTemplateData {
  body: string;
  meta: {
    applyType: TemplateBizType; // 模板类型
    itemIds: number[];
    codeList: number[];
    context?: {
      code: string;
      id: number;
      label: string;
      val: string;
    }[];
    specVerId: number;
  };
}

export interface ISaveTemplateRes {
  maintainTemplate: {
    applyType: TemplateBizType;
    contentType: string;
    description: string;
    id: number;
    isDeprecated: boolean;
    lastModifiedBy: string;
    lastModifiedByName: string;
    lastModifiedTime: string;
    name: string;
    specVerId: number;
    specVerNo: number;
    specVerTag: string;
    verId: number;
  };
  templateMeta: {
    applyType: TemplateBizType;
    codeList: string[];
    contentType: string;
    context: ITemplateContext[];
    itemIds: number[];
    message: string[];
    specVerId: number;
  };
}

export interface ITemplateContext {
  label: string;
  code: string;
  val: string;
  id: number;
  details?: any;
}

export type ITableListItem = ITemplateItem;

export enum OperationType {
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  PREVIEW = 'PREVIEW',
  NOOP = 'NOOP',
}
