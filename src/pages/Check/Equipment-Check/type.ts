export interface ITableListItem {
  basicInfo?: any;
  id?: string;
  detectItemType?: string;
  detectOrderType?: string;
  isReport?: number;
  records?: RecordItem[];
  securityCode?: string;
  title?: string;
  detectTools?: detectTooleItem[];
  eqName?: string;
  hospital?: string;
  tools?: any[];
}

export interface detectTooleItem {
  active?: boolean;
  address?: string;
  calibrationDate?: string;
  createTime?: string;
  id?: number;
  isDelete?: number;
  name?: string;
  number?: string;
  version?: string;
}

export interface RecordItem {
  avgRecord?: any;
  basicVal?: string;
  basicValType?: string;
  calibrationFactor?: string;
  decision?: string;
  detectCondition?: any;
  detectRes?: any;
  detectionItem?: string;
  id?: string;
  isAsk?: number;
  itemGather?: string;
  requirements?: any;
}

export interface IFetchTableFormItem {
  current: number;
  pageSize: number;
  keyword?: string;
  isReport?: number;
}
