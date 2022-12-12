import React from 'react';
import { Modal, Input, TreeSelect } from 'antd';
import omit from 'omit.js';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import type { DepartmentTreeNode, EmployeeItem } from '@/pages/Employee/type';
import { fetchOrgEmployees } from '@/pages/Employee/service';
import styles from '../index.less';

interface IComponentProps {
  visible: boolean;
  departmentsTreeData: DepartmentTreeNode[];
  onCancel: () => void;
  onSelect: (staffItem: EmployeeItem) => void;
}

const StaffSelect: React.FC<IComponentProps> = ({
  visible,
  departmentsTreeData,
  onCancel,
  onSelect,
}) => {
  const onSelectStaff = (record: EmployeeItem) => {
    onSelect(record);
  };

  const columns: ProColumns<EmployeeItem>[] = [
    {
      title: '序号',
      width: 65,
      search: false,
      render: (text: any, record: EmployeeItem, index: number) => index + 1,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '科室',
      dataIndex: 'primaryDepartmentName',
      key: 'primaryDepartmentName',
      search: false,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '员工编号',
      key: 'employeeNo',
      dataIndex: 'employeeNo',
      renderFormItem: (item, { type }) => {
        if (type === 'form') {
          return null;
        }
        return <Input />;
      },
    },
    {
      title: '科室',
      key: 'primaryDepartmentId',
      hideInTable: true,
      dataIndex: 'primaryDepartmentId',
      renderFormItem: (item, { type }) => {
        if (type === 'form') {
          return null;
        }
        return (
          <TreeSelect
            placeholder="请选择"
            treeData={departmentsTreeData}
            treeNodeFilterProp="title"
            treeDefaultExpandAll
            virtual={false}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'operation',
      search: false,
      render: (_, record) => <a onClick={() => onSelectStaff(record)}>选择</a>,
    },
  ];

  return (
    <Modal
      visible={visible}
      title="医护人员选择列表"
      width={1000}
      onCancel={onCancel}
      className={styles.staffSelectModal}
      footer={null}
    >
      <ProTable
        rowKey="id"
        columns={columns}
        request={async (params = {}) => {
          return fetchOrgEmployees(
            omit(params, ['current', 'pageSize']),
            false,
            params.current,
            params.pageSize,
          );
        }}
        search={{
          defaultCollapsed: visible,
          labelWidth: 'auto',
        }}
      />
    </Modal>
  );
};

export default StaffSelect;
