import React, { useCallback, useState } from 'react';
import { Table, Form, Select, Tag, Pagination, Button, message } from 'antd';
import debounce from 'lodash.debounce';
import type { ColumnsType } from 'antd/es/table/Table';
import type { ChildProps } from '@/pages/Team/components/ItemSelect';
import type { Department } from '@/pages/Internal-Authority/type';
import useMount from '@/hooks/useMount';
import { fetchDepartments } from '@/pages/Internal-Authority/service';
import type { SearchCondition, Equipment } from '../../type';
import {
  WarranthyStatus,
  WarranthyStatusMap,
  WarranthyStatusColor,
} from '../../type';

/**
 * 此模块为授权设备给维修机构时使用的待选设备列表
 * 带有表头条件查询组件，分页组件
 */
const EquipmentList: React.FC<
  ChildProps<Equipment, SearchCondition, { orgId: number | string }>
> = ({
  items,
  value,
  searchLoading,
  pagination,
  loaderConfig: { orgId },
  onChange,
  onSearch,
  onPageChange,
}) => {
  const [searchForm] = Form.useForm();
  const [departmentsLoading, setDepartmentsLoading] = useState<boolean>(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const columns: ColumnsType<Equipment> = [
    {
      title: '编号',
      dataIndex: 'equipmentNo',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '型号',
      dataIndex: 'modelName',
    },
    {
      title: '厂商',
      dataIndex: 'manufacturerName',
    },
    {
      title: '序列号',
      dataIndex: 'sn',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
    },
    {
      title: '在保状态',
      key: '',
      render: (_: any, { warranthyStatus }) => {
        return (
          <Tag color={WarranthyStatusColor.get(warranthyStatus)}>
            {WarranthyStatusMap.get(warranthyStatus)}
          </Tag>
        );
      },
    },
  ];

  const handleChangePage = (page: number, pageSize = 10) => {
    onPageChange({ current: page, pageSize });
  };

  const handleSearch = () => {
    const values = searchForm.getFieldsValue() as SearchCondition;
    if (values.departmentId === undefined) {
      delete values.departmentId;
    }
    if (values.warranthyStatus) {
      onSearch({
        ...values,
        warranthyStatus: values.warranthyStatus.filter(
          (_) => _ !== WarranthyStatus.ALL,
        ),
      });
    }
  };

  const statuOptions = Object.keys(WarranthyStatus).map((_) => ({
    label: WarranthyStatusMap.get(_ as WarranthyStatus),
    value: _,
  }));

  useMount(() => {
    onSearch({});
  });

  const loadDepartments = useCallback(
    debounce(async (name: string) => {
      try {
        setDepartmentsLoading(true);
        const { data } = await fetchDepartments(20, 1, { orgId, name });
        setDepartments(data);
      } catch (err) {
        message.error('部门加载失败');
      } finally {
        setDepartmentsLoading(false);
      }
    }, 500),
    [orgId],
  );

  return (
    <div>
      <Form
        style={{ marginBottom: 24 }}
        form={searchForm}
        layout="inline"
        initialValues={{ warranthyStatus: [] }}
      >
        <Form.Item name="departmentId" label="部门">
          <Select
            showSearch
            placeholder="部门名"
            mode="multiple"
            style={{ width: 240 }}
            filterOption={false}
            loading={departmentsLoading}
            onSearch={loadDepartments}
          >
            {departments.map((_) => (
              <Select.Option key={_.id} value={_.id}>
                {_.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="warranthyStatus" label="在保状态">
          <Select
            placeholder="在保状态"
            mode="multiple"
            style={{ width: 240 }}
            options={statuOptions}
          />
        </Form.Item>
        <Form.Item>
          <Button onClick={handleSearch} type="primary">
            查找
          </Button>
        </Form.Item>
      </Form>
      <Table<Equipment>
        rowKey="id"
        size="small"
        pagination={false}
        dataSource={items}
        columns={columns}
        loading={searchLoading}
        rowSelection={{
          type: 'checkbox',
          preserveSelectedRowKeys: true,
          selectedRowKeys: value ? value.map((_) => _.id) : undefined,
          onChange: (_, records) => {
            if (onChange) {
              onChange(records);
            }
          },
        }}
      />
      <Pagination
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `共${total}条记录`}
        style={{ textAlign: 'right', marginTop: 16 }}
        pageSize={pagination.pageSize}
        current={pagination.current}
        total={pagination.total}
        onChange={handleChangePage}
      />
    </div>
  );
};

export default EquipmentList;
