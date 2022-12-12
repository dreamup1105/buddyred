import React, { useState } from 'react';
import { Modal, Button, Select } from 'antd';
import ProTable from '@/components/ProTable';
import type { ProTableColumn, ActionRef } from '@/components/ProTable';
import { fetchTemplates } from '@/pages/Crm/Customer/service';
import type { ITemplateItem } from '@/pages/Crm/Customer/type';
import { TemplateBizTextType } from '@/pages/Dictionary/Maintenance/Editor/type';
import useUserInfo from '@/hooks/useUserInfo';
import { PlusOutlined } from '@ant-design/icons';
interface IComponentProps {
  crId: number | undefined;
  visible: boolean;
  actionRef?: ActionRef;
  hospitalName?: string;
  onCancel: () => void;
  onSelect: (selectedItem: ITemplateItem) => void;
  onSelectAll: (selectedItem: number[]) => void;
}

const DefaultQuery = {
  current: 1,
  pageSize: 10,
  name: '',
  templateFor: 'HOSTPITAL',
};

const EmployeeSelectorModal: React.FC<IComponentProps> = ({
  crId,
  visible,
  actionRef,
  hospitalName,
  onSelect,
  onSelectAll,
  onCancel,
}) => {
  const { currentUser } = useUserInfo();
  const orgId = currentUser?.org.id;
  const [selectedEquipKeys, setSelectedEquipKeys] = useState<number[]>([]);

  const onAddTemplate = () => {
    onSelectAll(selectedEquipKeys);
    setSelectedEquipKeys([]);
  };

  const rowSelection: any['rowSelection'] = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectedEquipKeys,
    onChange: (selectedRowKeys: any) => {
      console.log(selectedRowKeys);
      setSelectedEquipKeys(selectedRowKeys as number[]);
    },
  };

  const onCancelModal = () => {
    onCancel();
    setSelectedEquipKeys([]);
  };

  const columns: ProTableColumn<ITemplateItem>[] = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属机构',
      dataIndex: 'templateFor',
      key: 'templateFor',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select defaultValue={'HOSTPITAL'}>
            <Select.Option value="HOSTPITAL">
              {hospitalName ?? '医院'}
            </Select.Option>
            <Select.Option value="OTHER_PLATFORM">本机构</Select.Option>
            <Select.Option value="PLATFORM">平台</Select.Option>
          </Select>
        );
      },
    },
    {
      title: '所属机构',
      dataIndex: 'orgName',
      key: 'orgName',
      hideInSearch: true,
    },
    {
      title: '类型',
      dataIndex: 'applyType',
      key: 'applyType',
      hideInSearch: true,
      render: (type) => TemplateBizTextType[type] ?? '',
    },
    {
      title: '规范版本',
      dataIndex: 'specVerNo',
      key: 'specVerNo',
      hideInSearch: true,
    },
    {
      dataIndex: 'action',
      key: 'action',
      hideInSearch: true,
      render: (_, record) => {
        if (record.canAdd) {
          return <a onClick={() => onSelect(record)}>添加</a>;
        }
        return '已添加';
      },
    },
  ];

  return (
    <Modal
      width={1200}
      bodyStyle={{ height: 600, overflow: 'auto' }}
      visible={visible}
      title="选择模板"
      onCancel={onCancelModal}
      footer={
        <>
          <Button onClick={onCancelModal}>关闭</Button>
        </>
      }
    >
      <ProTable<ITemplateItem, typeof DefaultQuery>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        isSyncToUrl={false}
        toolBarRender={() => {
          return [
            <Button key="create" type="primary" onClick={onAddTemplate}>
              <PlusOutlined />
              批量添加
            </Button>,
          ];
        }}
        rowSelection={rowSelection}
        request={async (query) => {
          const { current, pageSize, name, templateFor } = query;
          // 维修公司查询可选保养模板：
          // 1-平台：template_for =0，org_id不传，cr_id要传
          // 2-自建：template_for = 1,org_id要传，cr_id要传
          // 3-签约关系医院：template_for= 1,org_id不传，cr_id要传
          return fetchTemplates({
            crId: crId,
            name,
            orgId: templateFor === 'OTHER_PLATFORM' ? orgId : null,
            pageNum: Number(current) || 1,
            pageSize: Number(pageSize) || 10,
            templateFor:
              templateFor == 'PLATFORM' ? 'PLATFORM' : 'OTHER_PLATFORM',
          });
        }}
      />
    </Modal>
  );
};

export default EmployeeSelectorModal;
