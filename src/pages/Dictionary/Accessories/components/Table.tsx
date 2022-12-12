import React, { useEffect } from 'react';
import { Table, Pagination, Button, Input, Form } from 'antd';
import TableToolbar from '@/components/TableToolbar';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import type {
  IManufacturerItem,
  IProductItem,
  IModelItem,
  TableType,
} from '../type';
import styles from '../index.less';

interface IComponentProps<T = IManufacturerItem | IProductItem | IModelItem> {
  columns: ColumnType<T>[];
  dataSource: T[];
  loading: boolean;
  currentRecord: T | undefined;
  type: TableType;
  pagination: {
    current?: number;
    pageSize?: number;
    total?: number;
    onPageChange?: (page: number) => void;
    onShowSizeChange?: (size: number) => void;
  };
  manufacturers?: IManufacturerItem[];
  products?: IProductItem[];
  onSearch?: (q: string) => void;
  onAdd: () => void;
  onClickRow: (row: T) => void;
  searchValue?: string;
}

const getTableConfig = (type: TableType) => {
  switch (type) {
    case 'manufacturer':
      return {
        title: '厂商列表',
        tableClassName: styles.manufacturerTable,
        btnAddLabel: '新增厂商',
      };
    case 'product':
      return {
        title: '产品列表',
        tableClassName: styles.productTable,
        btnAddLabel: '新增产品',
      };
    case 'model':
      return {
        title: '型号列表',
        tableClassName: styles.modelTable,
        btnAddLabel: '新增型号',
      };
    default:
      return {};
  }
};

const { Search } = Input;

const BizTable = <T extends Record<string, any>>({
  columns,
  dataSource,
  loading,
  currentRecord,
  type,
  manufacturers,
  products,
  pagination,
  searchValue,
  onSearch,
  onAdd,
  onClickRow,
}: IComponentProps<T>) => {
  const [form] = Form.useForm();
  const tableConfig = getTableConfig(type);
  const renderOperContent = (tableType: TableType) => {
    if (
      (tableType === 'product' && !manufacturers?.length) ||
      (tableType === 'model' && !products?.length)
    ) {
      return null;
    }

    return (
      <>
        {tableType !== 'model' && (
          <Form form={form} layout="inline">
            <Form.Item name="q">
              <Search placeholder="请输入" onSearch={onSearch} />
            </Form.Item>
          </Form>
        )}
        <Button type="primary" onClick={onAdd}>
          <PlusOutlined />
          {tableConfig?.btnAddLabel}
        </Button>
      </>
    );
  };

  useEffect(() => {
    form.setFieldsValue({ q: searchValue });
  }, [searchValue]);

  return (
    <>
      <TableToolbar
        title={tableConfig?.title}
        operContent={renderOperContent(type)}
        columns={[]}
      />
      <Table<T>
        sticky
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        className={tableConfig?.tableClassName}
        pagination={false}
        size="small"
        rowClassName={(record) =>
          currentRecord?.id === record.id ? 'ant-table-row-selected' : ''
        }
        onRow={(record) => {
          return {
            onClick: () => {
              onClickRow(record);
            },
          };
        }}
      />
      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={pagination.onPageChange}
        showTotal={(totals: number) => `共${totals}条记录`}
        className={styles.pagination}
        onShowSizeChange={(_, size) => pagination?.onShowSizeChange?.(size)}
      />
    </>
  );
};

export default BizTable;
