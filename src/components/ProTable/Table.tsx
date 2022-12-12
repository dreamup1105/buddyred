import React, { useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Form, Table, Pagination } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { FormProps } from 'antd/es/form';
import type { TableProps, TablePaginationConfig } from 'antd/es/table';
import useQuery from '@/hooks/useQuery';
import useMount from '@/hooks/useMount';
import { toSeq } from '@/utils/utils';
import SearchFormRender from './FormRender';
import ToolbarRender from './components/Toolbar';
import type {
  TableRowSelection,
  ActionRef,
  SearchFormRef,
  ProTableColumn,
  RenderFormFunc,
  TableOptions,
} from './type';
import styles from './index.less';

type ExcludedTableProps =
  | 'pagination'
  | 'dataSource'
  | 'columns'
  | 'onRow'
  | 'rowSelection'
  | 'loading'
  | 'title';

const DefaultPagination: TablePaginationConfig = {
  current: 1,
  pageSize: 30,
};

const DefaultTableOptions: TableOptions = {
  density: true,
  reload: true,
  setting: true,
};

export interface IComponentProps<T, Q> {
  rowKey: string;
  title?: string | ReactNode;
  columns: ProTableColumn<T>[];
  dataSource?: T[];
  params?: Record<string, any>; // 请求所需的额外参数
  onRow?: TableProps<T>['onRow'];
  rowSelection?: TableRowSelection;
  isSyncToUrl?: boolean; // 是否将查询表单值同步到url地址栏
  request?: (
    query: Q,
  ) => Promise<{ data: T[]; total?: number; [key: string]: any }>;
  defaultQuery?: Q & { current: number; pageSize: number };
  renderForm?: RenderFormFunc;
  hooks?: {
    beforeInit?: (query: Q) => any;
    beforeSubmit?: (formValues: any) => any;
    beforeReset?: (query: Q) => any;
    onSearch?: () => void; // 点击搜索/查询时触发
    onReset?: () => void; // 点击重置时触发
    onReload?: () => void; // 点击toolbar刷新时触发
    onLoad?: (dataSource: T[], total: number) => void; // 数据加载完成后触发
    postData?: (dataSource: T[]) => T[]; // 对通过 request 获取的数据进行处理
    onLoadingChange?: (loading?: boolean) => void; // loading 被修改时触发，一般是网络请求导致的
    onRequestError?: (error: any) => void; // 请求发生错误时触发
    onFormValuesChange?: (changedValues: any, values: any) => void; // 查询表单发生变化时触发
  };
  options?: TableOptions;
  toolBarRender?: (() => ReactNode[] | false) | false;
  formProps?: FormProps;
  tableProps?: Omit<TableProps<T>, ExcludedTableProps> & {
    pagination?: boolean;
  };
  actionRef?: ActionRef;
  formRef?: SearchFormRef;
}

const ProTable = <T extends Record<string, any>, Q>({
  rowKey,
  title,
  onRow,
  columns = [],
  dataSource: rawDataSource,
  params = {},
  isSyncToUrl = true,
  request,
  defaultQuery,
  renderForm,
  options = DefaultTableOptions,
  toolBarRender,
  rowSelection,
  actionRef,
  formRef,
  formProps = {},
  tableProps,
  hooks,
}: IComponentProps<T, Q>) => {
  const [searchForm] = Form.useForm();
  const [query, setQuery] = useQuery<Q & { current: number; pageSize: number }>(
    defaultQuery as any,
  );
  const [currentColumns, setCurrentColumns] = useState(columns);
  const [collapsed, setCollapsed] = useState(true);
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(DefaultPagination);
  const [tableSize, setTableSize] = useState<TableProps<T>['size']>();
  // 请求数据源
  const loadDataSource = useMemo(() => {
    return async () => {
      if (loading || typeof rawDataSource !== 'undefined' || !request) {
        return;
      }

      setLoading(true);

      try {
        const searchParams = isSyncToUrl
          ? query
          : await searchForm.validateFields();
        const { data, total: totals = 0 } =
          (await request({ ...searchParams, ...params })) || {};
        let newData = data;
        if (hooks?.postData) {
          newData = hooks.postData(data);
        }
        setDataSource(newData);
        setTotal(totals);
        hooks?.onLoad?.(data, totals);
      } catch (error) {
        console.error(error);
        hooks?.onRequestError?.(error);
      } finally {
        setLoading(false);
      }
    };
  }, [request, params, query, loading, isSyncToUrl, rawDataSource]);

  // 收起/展开
  const onClickCollapse = () => {
    setCollapsed(!collapsed);
  };

  // 搜索
  const onSearch = async () => {
    if (hooks?.onSearch) {
      hooks.onSearch();
    }
    if (isSyncToUrl) {
      try {
        const formValues = await searchForm.validateFields();
        setQuery((prevQuery) => {
          const newQuery = {
            ...prevQuery,
            ...(hooks?.beforeSubmit
              ? hooks.beforeSubmit(formValues)
              : formValues),
          };

          /// 点击搜索按钮，自动重定向到第一页
          if (newQuery.current) {
            newQuery.current = 1;
          }

          return newQuery;
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      searchForm.setFieldsValue({ current: 1 });
      setPagination((prev) => ({ ...prev, current: 1 }));
      loadDataSource();
    }
  };

  // 页码change
  const onPageChange = (page: number) => {
    if (isSyncToUrl) {
      setQuery((prevQuery) => ({
        ...prevQuery,
        current: page,
      }));
    } else {
      searchForm.setFieldsValue({
        current: page,
      });
      setPagination((prev) => ({ ...prev, current: page }));
      loadDataSource();
    }
  };

  // 每页条数change
  const onShowSizeChange = (current: number, pageSize: number) => {
    if (isSyncToUrl) {
      setQuery((prevQuery) => ({
        ...prevQuery,
        pageSize,
      }));
    } else {
      searchForm.setFieldsValue({
        pageSize,
      });
      setPagination((prev) => ({ ...prev, pageSize }));
      loadDataSource();
    }
  };

  // 初始化
  const init = () => {
    if (isSyncToUrl) {
      const newQuery = hooks?.beforeInit ? hooks.beforeInit(query) : query;

      if (typeof newQuery.collapsed === 'boolean' && !newQuery.collapsed) {
        setCollapsed(false);
      }

      delete newQuery?.collapsed;

      searchForm.setFieldsValue({
        ...defaultQuery,
        ...newQuery,
      });
    } else {
      searchForm.setFieldsValue({
        current: 1,
        pageSize: 30,
      });
      loadDataSource();
    }
  };

  // 列展示change
  const onColumnChange = (values: CheckboxValueType[]) => {
    setCurrentColumns(
      columns.filter(
        (column) =>
          values.includes(column.title as string) && !column.hideInTable,
      ),
    );
  };

  // 密度change
  const onDensityChange = (sizeType: TableProps<T>['size']) => {
    setTableSize(sizeType);
  };

  // 添加序号列
  const addSeqColumn = (columnsData: ProTableColumn<T>[]) => {
    if (options.seqColumn) {
      const hasSeqColumn = columnsData.some(
        (c) => c.title === '序号' && c.key === 'seq',
      );
      if (hasSeqColumn) {
        const seqColumnIndex = columnsData.findIndex(
          (i) => i.key === 'seq' && i.title === '序号',
        );
        columnsData.splice(seqColumnIndex, 1);
      }

      return [
        {
          hideInSearch: true,
          title: '序号',
          key: 'seq',
          width: 65,
          render: (_, __, index: number) =>
            toSeq(
              index + 1,
              isSyncToUrl
                ? Number(query.current ?? 1)
                : pagination.current ?? 1,
              isSyncToUrl
                ? Number(query.pageSize ?? 30)
                : pagination.pageSize ?? 30,
            ),
        } as ProTableColumn<T>,
        ...columnsData,
      ];
    }
    return columnsData;
  };

  useEffect(() => {
    if (isSyncToUrl) {
      loadDataSource();
    }
  }, [query, isSyncToUrl]);

  useEffect(() => {
    if (columns && Array.isArray(columns)) {
      setCurrentColumns(columns.filter((c) => !c.hideInTable));
    }
  }, [columns]);

  useEffect(() => {
    hooks?.onLoadingChange?.(loading);
  }, [loading]);

  if (actionRef) {
    // eslint-disable-next-line no-param-reassign
    actionRef.current = {
      reload: (resetPageIndex) => {
        if (hooks?.onReload) {
          hooks.onReload();
        }
        if (isSyncToUrl) {
          // 是否重置到第一页，在某些情况下，比如新增条目之后，需重新刷新列表的场景
          if (resetPageIndex) {
            setQuery((prevQuery) => ({ ...prevQuery, current: 1 }));
          } else {
            setQuery((prevQuery) => ({ ...prevQuery }));
          }
        } else {
          if (resetPageIndex) {
            searchForm.setFieldsValue({ current: 1 });
            setPagination((prevPagination) => ({
              ...prevPagination,
              current: 1,
            }));
          }
          loadDataSource();
        }
      },
      reset: () => {
        searchForm.resetFields();
        if (hooks?.onReset) {
          hooks.onReset();
        }
        if (isSyncToUrl) {
          const newQuery = hooks?.beforeReset
            ? hooks.beforeReset({ ...query })
            : defaultQuery;
          setQuery(() => ({ ...newQuery }));
        } else {
          loadDataSource();
          searchForm.setFieldsValue({ ...DefaultPagination });
          setPagination({ ...DefaultPagination });
        }
      },
      resetSearchForm: () => {
        searchForm.resetFields();
        searchForm.setFieldsValue({ ...DefaultPagination });
        setPagination({ ...DefaultPagination });
      },
      getQuery: () => query,
      getSearchFormValues: () => searchForm.getFieldsValue(),
      getTotal: () => total,
    };
  }

  useMount(() => {
    init();
    if (formRef) {
      // eslint-disable-next-line no-param-reassign
      formRef.current = searchForm;
    }
  });

  return (
    <div className={styles.proTableWrapper}>
      <SearchFormRender
        isSyncToUrl={isSyncToUrl}
        actionRef={actionRef}
        form={searchForm}
        loading={loading}
        formProps={formProps}
        columns={columns}
        pagination={tableProps?.pagination}
        collapsed={collapsed}
        onClickCollapse={onClickCollapse}
        onFormValuesChange={hooks?.onFormValuesChange}
        onSearch={onSearch}
        renderForm={renderForm}
      />
      <ToolbarRender
        title={title}
        columns={columns}
        actionRef={actionRef!}
        options={{ ...DefaultTableOptions, ...options }}
        tableSize={tableSize}
        onColumnChange={onColumnChange}
        onDensityChange={onDensityChange}
        toolBarRender={toolBarRender}
      />
      <Table
        {...tableProps}
        bordered
        rowKey={rowKey}
        dataSource={rawDataSource || dataSource}
        columns={addSeqColumn(currentColumns)}
        loading={loading}
        onRow={onRow}
        rowSelection={rowSelection}
        pagination={false}
        size={tableSize}
      />
      {!!total && tableProps?.pagination !== false && (
        <Pagination
          current={
            isSyncToUrl ? Number(query?.current || 1) : pagination.current
          }
          pageSize={
            isSyncToUrl ? Number(query?.pageSize || 30) : pagination.pageSize
          }
          pageSizeOptions={[10, 20, 30, 50, 100, 200]}
          total={total}
          showSizeChanger
          showQuickJumper
          showTotal={(totals) => `共${totals}条记录`}
          onChange={onPageChange}
          onShowSizeChange={onShowSizeChange}
          style={{ textAlign: 'right', marginTop: 16 }}
        />
      )}
    </div>
  );
};

const ProTableWrap = <T, Q>(params: IComponentProps<T, Q>) => {
  function ErrorFallback({ error, resetErrorBoundary }: any) {
    return (
      <div
        role="alert"
        style={{
          width: '100%',
          height: '100%',
          background: '#fff',
          textAlign: 'center',
        }}
      >
        <p>发生错误</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>重试</button>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ProTable {...params} />
    </ErrorBoundary>
  );
};

export default ProTableWrap;
