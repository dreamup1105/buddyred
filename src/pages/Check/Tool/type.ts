export interface ITableListItem {
  name?: string;
  number?: string;
  version?: string;
  address?: string;
  calibrationDate?: string;
  id?: number;
}

export interface IFetchTableFormItem {
  current: number;
  pageSize: number;
  keyword?: string;
}
