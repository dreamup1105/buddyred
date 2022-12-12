import React from 'react';
import { Modal, Tag, Space, Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import type { IMaintainItemDetailWithVersion } from '../type';

interface IComponentProps {
  visible: boolean;
  details: IMaintainItemDetailWithVersion[];
  onCancel: () => void;
}

const ItemDetailsModal: React.FC<IComponentProps> = ({
  visible,
  details = [],
  onCancel,
}) => {
  const columns: ProColumns<IMaintainItemDetailWithVersion>[] = [
    {
      title: '名称',
      dataIndex: 'label',
    },
    {
      title: '选项',
      dataIndex: 'options',
      render: (_, record) => {
        return (
          <Space>
            {record.options?.map((option: any) => (
              <Tag key={option}>{option}</Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '后缀',
      dataIndex: 'spec',
    },
  ];

  return (
    <Modal
      title="详情"
      visible={visible}
      onCancel={onCancel}
      width={1200}
      footer={<Button onClick={onCancel}>关闭</Button>}
    >
      <ProTable<IMaintainItemDetailWithVersion>
        search={false}
        toolBarRender={false}
        pagination={false}
        columns={columns}
        rowKey="id"
        dataSource={details}
        headerTitle="明细列表"
      />
    </Modal>
  );
};

export default ItemDetailsModal;
