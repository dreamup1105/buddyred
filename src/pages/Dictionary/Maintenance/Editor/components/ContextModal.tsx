import React, { useRef } from 'react';
import { Modal, Button } from 'antd';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { ITemplateContext } from '@/pages/Dictionary/Maintenance/Template/type';

interface IComponentProps {
  visible: boolean;
  initialContextList: ITemplateContext[];
  onSelect: (selectedItem: ITemplateContext) => void;
  onCancel: () => void;
}

/**
 * 上下文项目选择框
 * @param IComponentProps
 * @returns ReactNode
 */
const ContextItemsModal: React.FC<IComponentProps> = ({
  visible,
  initialContextList = [],
  onCancel,
  onSelect,
}) => {
  const actionRef = useRef<ActionType>();

  const onSelectDetail = (record: ITemplateContext) => {
    onSelect(record);
    actionRef.current?.reset();
  };

  const columns: ProTableColumn<ITemplateContext>[] = [
    {
      title: '名称',
      dataIndex: 'label',
      hideInSearch: true,
    },
    {
      title: '操作',
      hideInSearch: true,
      render: (_, record) => [
        <a key="select" onClick={() => onSelectDetail(record)}>
          选择
        </a>,
      ],
    },
  ];

  const onModalCancel = () => {
    onCancel();
    actionRef.current?.reset();
  };

  return (
    <Modal
      title="模板上下文"
      bodyStyle={{
        height: 600,
        overflow: 'scroll',
      }}
      visible={visible}
      onCancel={onModalCancel}
      width={1200}
      footer={
        <Button key="close" onClick={onModalCancel}>
          关闭
        </Button>
      }
    >
      <ProTable<ITemplateContext, any>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        dataSource={initialContextList}
        onRow={(record) => ({
          onDoubleClick: () => onSelectDetail(record),
        })}
        isSyncToUrl={false}
        toolBarRender={false}
        tableProps={{
          pagination: false,
        }}
      />
    </Modal>
  );
};

export default ContextItemsModal;
