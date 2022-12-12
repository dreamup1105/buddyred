import React, { useState, useRef } from 'react';
import ProTable from '@/components/ProTable';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import useDepartments from '@/hooks/useDepartments';
import { useModel } from 'umi';
import AuthModal from './components/ModalAuthorize';
import { fetchEmployees } from '../Employee/service';
import type { Employee } from './type';
import { tableHeight } from '@/utils/utils';
// import EmployeeList from './components/EmployeeList';

const defaultQuery = {
  current: 1,
  pageSize: 30,
  name: '',
};

const InternalAuthorityPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const orgId = initialState!.currentUser?.org.id;
  const [modalAuthVisible, setModalAuthVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<Employee>();
  const { departments } = useDepartments({ orgId: orgId! }, true);

  const handleOpenAuth = (record: Employee) => {
    setCurrentRecord(record);
    setModalAuthVisible(true);
  };

  const handleAfterSubmit = () => {
    setModalAuthVisible(false);
    setCurrentRecord(undefined);
  };

  const handleCancelAuthModal = () => {
    setModalAuthVisible(false);
    setCurrentRecord(undefined);
  };

  const columns: ProTableColumn<Employee>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '科室',
      dataIndex: 'primaryDepartmentName',
      hideInSearch: true,
    },
    {
      title: '员工编号',
      dataIndex: 'employeeNo',
      hideInSearch: true,
    },
    {
      title: '职位',
      dataIndex: 'position',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'operation',
      hideInSearch: true,
      render: (_: any, record: Employee) => {
        return <a onClick={() => handleOpenAuth(record)}>授权</a>;
      },
    },
  ];

  return (
    <PageContainer>
      {/* <EmployeeList operationColumn={operationColumn} /> */}
      <ProTable<Employee, typeof defaultQuery>
        rowKey="id"
        title="人员"
        defaultQuery={defaultQuery}
        actionRef={actionRef}
        columns={columns}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        request={async (query) => {
          const { name, current, pageSize } = query;

          return fetchEmployees({ name, orgId }, false, current, pageSize);
        }}
      />
      <AuthModal
        visible={modalAuthVisible}
        target={currentRecord}
        fullDepartments={departments}
        onCancel={handleCancelAuthModal}
        afterSubmit={handleAfterSubmit}
      />
    </PageContainer>
  );
};

export default InternalAuthorityPage;
