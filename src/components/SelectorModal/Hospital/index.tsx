import React from 'react';
import { Modal } from 'antd';
import ProTable from '@/components/ProTable';
import type { ProTableColumn, ActionRef } from '@/components/ProTable';
import { fetchHospitals } from '@/pages/Crm/Customer/service';
import type { IHospitalItem } from '@/pages/Crm/Customer/type';

interface IComponentProps {
  visible: boolean;
  actionRef?: ActionRef;
  onCancel: () => void;
  onSelect?: (item: IHospitalItem) => void;
}

const HospitalSelectorModal: React.FC<IComponentProps> = ({
  visible,
  actionRef,
  onCancel,
  onSelect,
}) => {
  const columns: ProTableColumn<IHospitalItem>[] = [
    {
      title: '医院名称',
      dataIndex: 'name',
      hideInTable: true,
    },
    {
      title: '医院全称',
      dataIndex: 'name',
      key: 'name',
      hideInSearch: true,
    },
    {
      title: '简称',
      dataIndex: 'alias',
      key: 'alias',
      hideInSearch: true,
    },
    {
      title: '行政区划',
      dataIndex: 'regionAddr',
      key: 'regionAddr',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 80,
      hideInSearch: true,
      render: (_, record) => (
        <>
          {record.canAdd ? (
            <a onClick={() => onSelect?.(record)}>添加</a>
          ) : (
            <span>已添加</span>
          )}
        </>
      ),
    },
  ];

  return (
    <Modal
      width={1000}
      bodyStyle={{
        height: 600,
        overflow: 'scroll',
      }}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      title="医院列表"
    >
      <ProTable<IHospitalItem, any>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        isSyncToUrl={false}
        title="医院列表"
        request={async (formValues) => {
          const { name = '' } = formValues;
          const { data, code } = await fetchHospitals({ name });
          if (code === 0) {
            return {
              success: true,
              data,
            };
          }

          return { success: false, data: [] };
        }}
      />
    </Modal>
  );
};

export default HospitalSelectorModal;
