export interface IMetaData {
  applicationName: string;
  content: string;
  createdTime: string;
  description?: string;
  id: string;
  metaKey: string;
  params?: string[];
  permissions?: string[];
  sound?: string;
  title: string;
  uri?: string;
}

export interface IQueryCondition {
  applicationName?: string;
  content?: string;
  metaKey?: string;
  title?: string;
  uri?: string;
}

export interface ISaveMetaData {
  applicationName: string;
  content: string;
  createdTime?: string;
  description?: string;
  id?: string;
  metaKey: string;
  params?: string[];
  permissions?: string[];
  sound?: string;
  title: string;
  uri?: string;
}

export interface IMetaDataDetailForm {
  id?: string;
  createTime?: string;
  metaKey?: string;
  applicationName?: string;
  title?: string;
  content?: string;
  uri?: string;
  sound?: string;
  param?: string[];
  permissions?: string[];
  description?: string;
}

export enum OperationType {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DETAIL = 'DETAIL',
  NOOP = 'NOOP',
}
