import React, { useState, useEffect, useRef } from 'react';
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import ProTable from '@/components/ProTable';
import type { ProTableColumn, ActionType } from '@/components/ProTable';
import EmployeeSelectorModal from '@/components/SelectorModal/Employee';
import { saveEmployee, deleteEmployee } from '../../../service';
import type { IEmployeeItem, CustomerDetailEmployee } from '../../../type';
import { EmployeeType } from '../../../type';

interface IComponentProps {
  initialData: CustomerDetailEmployee[] | undefined;
}

const EmployeeTab: React.FC<IComponentProps> = ({ initialData }) => {
  const {
    location: { query },
  } = history;
  const actionRef = useRef<ActionType>();
  const [employeeType, setEmployeeType] = useState<EmployeeType>();
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState<CustomerDetailEmployee[]>([]);

  const onAddEmployee = (type: EmployeeType) => {
    actionRef.current?.reload();
    setEmployeeType(type);
    setVisible(true);
  };

  const onSelectEmployee = async (selectedItem: IEmployeeItem) => {
    setVisible(false);
    if (!query?.id) {
      return;
    }
    try {
      const { code, data } = await saveEmployee({
        crId: Number(query!.id),
        departmentName: selectedItem.departmentName,
        employeeId: selectedItem.id,
        employeeNo: selectedItem.employeeNo,
        employeeType: employeeType as EmployeeType,
        name: selectedItem.name,
        phone: selectedItem.phone,
      });
      if (code === 0) {
        setDataSource((prevData) => [data, ...prevData]);
        message.success('添加成功');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDelEmployee = async (record: CustomerDetailEmployee) => {
    if (!query?.id) {
      return;
    }
    try {
      const { code } = await deleteEmployee(
        Number(query.id),
        record.employeeId,
        record.employeeType,
      );
      if (code === 0) {
        message.success('删除成功');
        setDataSource((prevData) => prevData.filter((i) => i.id !== record.id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ProTableColumn<any>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
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
      title: '类型',
      dataIndex: 'employeeType',
      key: 'employeeType',
      hideInSearch: true,
      render: (type) => {
        if (type === 'ENGINEER') {
          return '工程师';
        }
        return '管理员';
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <>
            <Popconfirm
              title="确定要删除该条记录吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => onDelEmployee(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (initialData) {
      setDataSource(initialData);
    }
  }, [initialData]);

  return (
    <>
      <ProTable
        rowKey="id"
        columns={columns}
        isSyncToUrl={false}
        dataSource={dataSource}
        tableProps={{
          pagination: false,
        }}
        toolBarRender={() => {
          return [
            <Button
              key="manager"
              type="primary"
              onClick={() => onAddEmployee(EmployeeType.MANAGER)}
            >
              <PlusOutlined />
              添加管理
            </Button>,
            <Button
              key="engineer"
              type="primary"
              onClick={() => onAddEmployee(EmployeeType.ENGINEER)}
            >
              <PlusOutlined />
              添加工程师
            </Button>,
          ];
        }}
      />
      <EmployeeSelectorModal
        crId={query?.id ? Number(query.id) : undefined}
        actionRef={actionRef}
        selectedEmployeeIds={dataSource.map((item) => item.employeeId)}
        visible={visible}
        onCancel={() => {
          actionRef.current?.resetSearchForm();
          setVisible(false);
        }}
        onSelect={onSelectEmployee}
      />
    </>
  );
};

export default EmployeeTab;
