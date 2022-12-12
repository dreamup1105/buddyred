import type { TableProps, ColumnType } from 'antd/es/table';
import type { FormItemProps, FormInstance } from 'antd/es/form';
import type { MutableRefObject, ReactNode } from 'react';

export type TableRowSelection = TableProps<any>['rowSelection'];

export type ActionRef = MutableRefObject<
  ActionType | undefined | ((actionType: ActionType) => void)
>;

export type SearchFormRef = MutableRefObject<FormInstance | undefined>;

export type ActionType = {
  reload: (resetPageIndex?: boolean) => void;
  reset: () => void;
  resetSearchForm: () => void;
  getSearchFormValues: () => any;
  getQuery: () => any;
  getTotal: () => number;
};

export type ProTableColumn<T> = ColumnType<T> & {
  hideInSearch?: boolean;
  hideInTable?: boolean;
  formItemProps?: FormItemProps;
  valueType?: ValueType;
  valueOptions?: { label: string; value: any }[];
  renderFormItem?: (form: FormInstance) => ReactNode;
};

export type ValueType = 'text' | 'select' | 'tree-select';

export type RenderFormFunc = (config: {
  collapsed: boolean;
  loading: boolean;
  onClickCollapse: () => void;
  onSearch: () => void;
}) => ReactNode;

export type TableOptions = {
  reload?: boolean; // 刷新按钮
  setting?: boolean; // 列设置
  density?: boolean; // 密度
  seqColumn?: boolean; // 是否添加序号列展示
};
