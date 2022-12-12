import React from 'react';
import { Modal, Button } from 'antd';
import ProTable from '@/components/ProTable';
import type { ProTableColumn, ActionRef } from '@/components/ProTable';
import type { IEmployeeItem } from '@/pages/Crm/Customer/type';
import { fetchEmployees } from '@/pages/Crm/Customer/service';

interface IComponentProps {
  crId: number | undefined;
  visible: boolean;
  selectedEmployeeIds: number[];
  actionRef?: ActionRef;
  onCancel: () => void;
  onSelect: (selectedItem: IEmployeeItem) => void;
}

const DefaultQuery = {
  current: 1,
  pageSize: 10,
  name: '',
};

const EmployeeSelectorModal: React.FC<IComponentProps> = ({
  crId,
  visible,
  selectedEmployeeIds,
  actionRef,
  onSelect,
  onCancel,
}) => {
  const columns: ProTableColumn<IEmployeeItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '员工编号',
      dataIndex: 'employeeNo',
      key: 'employeeNo',
      hideInSearch: true,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      hideInSearch: true,
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      hideInSearch: true,
      render: (_, record) => {
        if (!selectedEmployeeIds.includes(record.id)) {
          return <a onClick={() => onSelect(record)}>添加</a>;
        }
        return '已添加';
      },
    },
  ];

  return (
    <Modal
      width={1000}
      bodyStyle={{ height: 600, overflow: 'auto' }}
      visible={visible}
      title="选择人员"
      onCancel={onCancel}
      footer={
        <>
          <Button onClick={onCancel}>关闭</Button>
        </>
      }
    >
      <ProTable<IEmployeeItem, typeof DefaultQuery>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        isSyncToUrl={false}
        request={async (query) => {
          const { name, pageSize, current } = query;
          if (!crId) {
            return {
              success: false,
              data: [],
            };
          }
          return fetchEmployees({
            crId,
            name,
            pageNum: current,
            pageSize,
          });
        }}
      />
    </Modal>
  );
};

export default EmployeeSelectorModal;
