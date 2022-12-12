import React from 'react';
import { Form, Input, message } from 'antd';
import type { ColumnType, ColumnGroupType } from 'antd/es/table/interface';
import type { ColumnsType } from 'antd/es/table/Table';
import { useModel } from 'umi';
import useQuery from '@/hooks/useQuery';
import { withListPage } from '@/components/ListPage';
import type {
  SearchParams,
  QueryObject,
  OtherLoaderParams,
  Employee,
} from '../type';
import { fetchEmployees } from '../../Employee/service';

const defaultSearch: SearchParams = {
  name: '',
};

const defaultQuery: QueryObject = {
  ...defaultSearch,
  current: 1,
  pageSize: 10,
  total: 0,
};

const ListPage = withListPage<
  Employee,
  SearchParams,
  OtherLoaderParams,
  QueryObject
>((pagination, search, otherLoaderParams) => {
  if (!otherLoaderParams) {
    throw new Error('otherLoaderParams: orgId cant not be undefined');
  }
  return fetchEmployees(
    { ...search, ...otherLoaderParams },
    false,
    pagination.current,
    pagination.pageSize,
  ) as Promise<Required<ResponseBody<Employee[]>>>;
}, defaultSearch);

/**
 * TeamList
 */
interface Props {
  title?: string;
  listRefreshMark?: number;
  operationContent?: React.ReactNode;
  operationColumn?: ColumnType<Employee> | ColumnGroupType<Employee>;
}
const EmployeeList: React.FC<Props> = ({
  title = '人员列表',
  listRefreshMark = 0,
  operationContent,
  operationColumn,
  children,
}) => {
  const { initialState } = useModel('@@initialState');
  const [query, setQuery] = useQuery<QueryObject>(defaultQuery);

  if (!initialState || !initialState.currentUser) {
    message.error('登录信息错误');
    return null;
  }
  const otherLoaderParams = { orgId: initialState.currentUser.org.id };

  const columns: ColumnsType<Employee> = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '员工编号',
      dataIndex: 'employeeNo',
    },
    {
      title: '职位',
      dataIndex: 'position',
    },
  ];

  if (operationColumn) {
    columns.push(operationColumn);
  }

  const searchFormItems = [
    <Form.Item label="姓名" name="name">
      <Input />
    </Form.Item>,
  ];

  return (
    <ListPage
      title={title}
      query={query}
      setQuery={setQuery}
      otherLoaderParams={otherLoaderParams}
      searchFormItems={searchFormItems}
      operationContent={operationContent}
      columns={columns}
      refreshMark={listRefreshMark}
    >
      {children}
    </ListPage>
  );
};

export default EmployeeList;
