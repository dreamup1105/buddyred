import React from 'react';
import { Tag, Form, Select } from 'antd';
import type { ColumnType, ColumnGroupType } from 'antd/es/table/interface';
import type { ColumnsType } from 'antd/es/table/Table';
import useQuery from '@/hooks/useQuery';
import { withListPage } from '@/components/ListPage';
import { fetchRecordList } from '../service';
import type {
  SearchParams,
  QueryObject,
  OtherLoaderParams,
  RepairRecord,
} from '../type';
import { RecordStatus, RecordStatuColorMap, RecordStatuTextMap } from '../type';

const defaultSearchParams: SearchParams = {
  statu: RecordStatus.ALL,
};

const defaultQuery: QueryObject = {
  ...defaultSearchParams,
  current: 1,
  pageSize: 10,
};

const ListPage = withListPage<
  RepairRecord,
  SearchParams,
  OtherLoaderParams,
  QueryObject
>((pagination, search, otherLoaderParams = {}) => {
  const newSearch = { ...search };
  let status: RecordStatus[] = [];
  if (search.statu === RecordStatus.ALL || search.statu === undefined) {
    status = [
      RecordStatus.RECORDING,
      RecordStatus.PENDING_RECORD,
      RecordStatus.FIXED,
    ];
  } else {
    status = [search.statu];
  }
  delete newSearch.statu;
  return fetchRecordList(pagination.current, pagination.pageSize, {
    ...otherLoaderParams,
    ...newSearch,
    status,
  });
}, defaultSearchParams);

interface Props {
  title?: string;
  listRefreshMark?: number;
  operationContent?: React.ReactNode;
  operationColumn?: ColumnType<RepairRecord> | ColumnGroupType<RepairRecord>;
  otherLoaderParams?: OtherLoaderParams;
}
const RecordList: React.FC<Props> = ({
  title = '工单列表',
  listRefreshMark = 0,
  operationContent,
  operationColumn,
  otherLoaderParams,
  children,
}) => {
  const [query, setQuery] = useQuery<QueryObject>(defaultQuery);
  const columns: ColumnsType<RepairRecord> = [
    {
      title: '发起人',
      dataIndex: 'createdByName',
    },
    {
      title: '验收人',
      dataIndex: 'checkerName',
    },
    {
      title: '工程师',
      dataIndex: 'engineerName',
    },
    {
      title: '机构',
      dataIndex: 'orgName',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
    },
    {
      title: '设备',
      dataIndex: 'equipmentName',
    },
    {
      title: '工单状态',
      key: 'status',
      render: (_: string, record: RepairRecord) => (
        <Tag color={RecordStatuColorMap.get(record.status)}>
          {RecordStatuTextMap.get(record.status)}
        </Tag>
      ),
    },
  ];
  if (operationColumn) {
    columns.push(operationColumn);
  }

  const searchFormItem = [
    <Form.Item label="工单状态" name="statu">
      <Select
        options={[
          {
            label: RecordStatuTextMap.get(RecordStatus.ALL),
            value: RecordStatus.ALL,
          },
          {
            label: RecordStatuTextMap.get(RecordStatus.FIXED),
            value: RecordStatus.FIXED,
          },
          {
            label: RecordStatuTextMap.get(RecordStatus.RECORDING),
            value: RecordStatus.RECORDING,
          },
          {
            label: RecordStatuTextMap.get(RecordStatus.PENDING_RECORD),
            value: RecordStatus.PENDING_RECORD,
          },
        ]}
      />
    </Form.Item>,
  ];

  return (
    <ListPage
      title={title}
      query={query}
      setQuery={setQuery}
      columns={columns}
      otherLoaderParams={otherLoaderParams}
      searchFormItems={searchFormItem}
      operationContent={operationContent}
      refreshMark={listRefreshMark}
    >
      {children}
    </ListPage>
  );
};

export default RecordList;
