import type { ReactNodeArray } from 'react';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Form,
  Row,
  Col,
  Table,
  Pagination,
  Button,
  Space,
  message,
} from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ColumnsType } from 'antd/es/table/Table';
import TableToolbar from '@/components/TableToolbar';
import type { PaginationConfig } from './type';
import { getSearchCol } from './helper';
import styles from './index.less';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface WrapperProps<I, S, O, Q> {
  title?: string;
  itemKey?: string;
  columns?: ColumnsType<I>;
  otherLoaderParams?: O;
  query: Q;
  operationContent?: React.ReactNode;
  searchFormItems?: React.ReactNodeArray;
  refreshMark?: number;
  setQuery: (fn: (prev: Q) => Q) => any;
  onRowDoubleClick?: (item: I) => void;
}

/**
 * 说明：列表类型的页面通常都有相同的布局、基于表单的条件查询模型、列表交互模型、列表数据流更新模型
 * 此组件将这些公共的部分进行组合，细节差异则由父组件定义并传入
 * @param listLoader 加载列表数据所使用的异步函数
 * @param defaultS 默认的查询参数对象
 * @param WrappedComponent HOC包装的对象组件（预留，目前未附加功能，只提供渲染）
 */
export function withListPage<
  I,
  S extends Record<string, unknown>,
  O,
  Q extends PaginationConfig,
>(
  listLoader: (
    pagination: PaginationConfig,
    search: S,
    otherLoaderParams?: O,
  ) => Promise<{ data: I[]; total: number }>,
  defaultS?: S,
  WrappedComponent?: React.FC,
) {
  /**
   * 包装完成后的高阶组件
   * @param props HOC的props
   * @param props.title 列表标题
   * @param props.itemKey 每行数据的唯一键，对应Table的props.rowKey
   * @param props.columns 对应Table的props.columns
   * @param props.otherLoaderParams 请求列表时所需要的额外参数，来自于父级组件，组件调用listLoader时将其作为参数传入
   * @param props.query useQuery返回的query对象
   * @param props.operationContent 列表头部的操作组件（比如新增功能的Button）
   * @param props.searchFormItems 列表查询区域的Form.Item组件数组
   * @param props.refreshMark 父组件需要手动更新列表时，使此参数发生变化（number + 1）即可
   * @param props.setQuery useQuery返回的setQuery函数
   * @param props.onRowDoubleClick 列表项被双击时触发的事件
   * @param props.children 这同时也是一个组合组件，通常可用来组合一些编辑功能模态组件（父级定义）
   */
  const Parent: React.FC<WrapperProps<I, S, O, Q>> = ({
    title = '列表',
    itemKey = 'id',
    columns = [],
    otherLoaderParams,
    query,
    operationContent,
    searchFormItems = [],
    refreshMark = 0,
    setQuery,
    onRowDoubleClick,
    children,
  }) => {
    const [form] = Form.useForm();
    const [expand, setExpand] = useState<boolean>(false);
    const [items, setItems] = useState<I[]>([]);
    const [itemTotal, setItemTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [filtedColumns, setFiltedColumns] = useState<ColumnsType<I>>(columns);
    // otherLoaderParams由于来自于父组件，若上层未作优化处理，每次父组件发生变化时，其也会发生变化(Object.is)
    // 列表数据更新的逻辑(loadItems)不依赖于otherLoaderParams对象的变化，只依赖于对象内具体属性的变化，在此做useRef处理
    const refOtherLoaderParams = useRef<O | undefined>(otherLoaderParams);
    refOtherLoaderParams.current = otherLoaderParams;

    const loadItems = useCallback(async (q: Q) => {
      try {
        setLoading(true);
        const search: any = { ...q };
        delete search.current;
        delete search.pageSize;
        delete search.total;
        const { current, pageSize } = q;
        const { data, total = 0 } = await listLoader(
          { current, pageSize },
          search,
          refOtherLoaderParams.current,
        );
        setItems(data);
        setItemTotal(total);
      } catch (err) {
        message.error(err.message || err.msg);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, []);

    const handleExpandSearcher = () => {
      setExpand(!expand);
    };

    const handleSearch = () => {
      setQuery((_) => ({ ..._, ...form.getFieldsValue() }));
    };

    // const handleResetSearch = async () => {
    //   if (defaultS) {
    //     form.setFieldsValue(defaultS);
    //     setQuery((_) => ({ ..._, ...defaultS }));
    //   } else {
    //     form.resetFields();
    //     setQuery(
    //       ({ current, pageSize }) =>
    //         ({
    //           current,
    //           pageSize,
    //           ...form.getFieldsValue(),
    //         } as Q),
    //     );
    //   }
    // };

    const handleChangePage = (next: number) => {
      setQuery((_) => ({ ..._, current: next }));
    };

    const handleChangePageSize = (pageSize: number) => {
      setQuery((_) => ({ ..._, pageSize }));
    };

    const handleChangeColumn = (values: ColumnsType<I>) => {
      setFiltedColumns(values);
    };

    useEffect(() => {
      loadItems(query);
    }, [query, refreshMark, loadItems]);

    return (
      <PageContainer className={styles.wrapper}>
        <div className={styles.headerSearchWrapper}>
          <Form form={form} labelCol={{ span: 5 }} initialValues={defaultS}>
            <Row gutter={16}>
              {(() => {
                const nodes: ReactNodeArray = [];
                const l = Math.min(3, searchFormItems.length);
                for (let i = 0; i < l; i += 1) {
                  nodes.push(
                    <Col key={i} span={6}>
                      {searchFormItems[i]}
                    </Col>,
                  );
                }
                return nodes;
              })()}
              {(() => {
                const nodes: ReactNodeArray = [];
                const l = searchFormItems.length;
                if (!expand || l < 4) return nodes;
                for (let i = 3; i < l; i += 1) {
                  nodes.push(
                    <Col key={i} span={6}>
                      {searchFormItems[i]}
                    </Col>,
                  );
                }
                return nodes;
              })()}
              <Col
                span={getSearchCol(searchFormItems.length, expand)}
                style={{ textAlign: 'left' }}
              >
                <Form.Item>
                  <Space>
                    {/* <Button onClick={handleResetSearch}>重置</Button> */}
                    <Button type="primary" onClick={handleSearch}>
                      搜索
                    </Button>
                    {searchFormItems.length > 3 ? (
                      <a onClick={handleExpandSearcher}>
                        {expand ? (
                          <>
                            收起
                            <UpOutlined />
                          </>
                        ) : (
                          <>
                            展开
                            <DownOutlined />
                          </>
                        )}
                      </a>
                    ) : (
                      ''
                    )}
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <TableToolbar
          title={title}
          operContent={operationContent}
          columns={columns}
          onColumnChange={handleChangeColumn}
          onRefresh={() => loadItems(query)}
        />
        <Table<any>
          rowKey={itemKey}
          pagination={false}
          loading={loading}
          dataSource={items}
          columns={filtedColumns.length ? filtedColumns : columns}
          onRow={(record: I) => ({
            onDoubleClick: () => {
              if (onRowDoubleClick) {
                onRowDoubleClick(record);
              }
            },
          })}
        />
        <Pagination
          current={query.current}
          total={itemTotal}
          pageSize={query.pageSize}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共${total}条记录`}
          onChange={handleChangePage}
          onShowSizeChange={handleChangePageSize}
          style={{ textAlign: 'right', marginTop: 16 }}
        />
        {children}
        {WrappedComponent ? <WrappedComponent /> : ''}
      </PageContainer>
    );
  };

  return Parent;
}
