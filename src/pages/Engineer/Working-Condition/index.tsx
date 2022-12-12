import React, { useRef } from 'react';
import { Badge } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@/components/ProTable';
import useUserInfo from '@/hooks/useUserInfo';
import useDepartments from '@/hooks/useDepartments';
import DepartmentSelector from '@/components/DepartmentSelector';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { ITableListItem } from './type';
import { getWorkingConditionAPI } from './service';
import useENG from '@/hooks/useENG';
import useHOST from '@/hooks/useHOST';
import { tableHeight } from '@/utils/utils';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  employeeName: undefined,
  primaryDeptId: undefined,
};

// 工程师工作状态
const WorkingConditionPage: React.FC = () => {
  const { isEng } = useENG();
  const { isHost } = useHOST();
  const { currentUser } = useUserInfo();
  const actionRef = useRef<ActionType>();
  const orgId = currentUser?.org.id;
  const { departmentsTreeData } = useDepartments({ orgId: orgId! }, true);

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '序号',
      key: 'index',
      width: 65,
      render: (t: any, r: any, index: number) => index + 1,
      hideInSearch: true,
    },
    {
      title: '姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 140,
    },
    {
      title: '部门',
      dataIndex: 'primaryDeptId',
      key: 'primaryDeptId',
      width: 140,
      hideInTable: true,
      renderFormItem: () => (
        <DepartmentSelector
          treeSelectProps={{
            treeData: departmentsTreeData,
            virtual: false,
          }}
        />
      ),
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '编号',
      dataIndex: 'employeeNo',
      key: 'employeeNo',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'engineerStatus',
      key: 'engineerStatus',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        if (record.engineerStatus) {
          return <Badge status="success" text="工作中" />;
        } else {
          return <Badge status="warning" text="待工" />;
        }
      },
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 100,
      hideInSearch: true,
    },
  ];

  return (
    <PageContainer>
      <ProTable<ITableListItem, typeof DefaultQuery>
        rowKey="employeeId"
        title="工程师工作状态列表"
        defaultQuery={DefaultQuery}
        actionRef={actionRef}
        columns={columns}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        request={async (query) => {
          const { current, pageSize, employeeName, primaryDeptId } = query;
          return getWorkingConditionAPI({
            current: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
            employeeName,
            primaryDeptId,
            isEng,
            isHost,
          });
        }}
      />
    </PageContainer>
  );
};

export default WorkingConditionPage;
