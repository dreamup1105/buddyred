import React, { useEffect, useRef } from 'react';
import { Modal, Button, Descriptions, Badge, Tag, Tooltip, Space, Select } from 'antd';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import { fetchImportTaskDetails } from '../service';
import type {
  IImportTaskItem,
  IImportTaskDetail
} from '../type';
import {
  ImportStatusValueMap,
  EquipmentStatusEnum,
} from '../type';

interface IComponentProps {
  taskDetail: IImportTaskItem | undefined;
  visible: boolean;
  onCancel: () => void;
}

const { Item } = Descriptions;

const ImportTaskDetail: React.FC<IComponentProps> = ({
  taskDetail,
  visible,
  onCancel,
}) => {
  const actionRef = useRef<ActionType>();
  const currentTaskIdRef = useRef<number | null>();
  const columns: ProTableColumn<IImportTaskDetail>[] = [
    {
      title: '设备编号',
      dataIndex: 'equipmentNo',
      key: 'equipmentNo',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
    },
    {
      title: '设备别名',
      dataIndex: 'alias',
      key: 'alias',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '设备型号',
      dataIndex: 'modelName',
      key: 'modelName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '设备厂商',
      dataIndex: 'manufacturerName',
      key: 'manufacturerName',
      width: 250,
      hideInSearch: true,
    },
    {
      title: '设备序列号',
      dataIndex: 'sn',
      key: 'sn',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '所属科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      hideInSearch: true,
      key: 'status',
      width: 140,
      render: (status: EquipmentStatusEnum) => {
        switch (status) {
          case EquipmentStatusEnum.UNUSED:
            return <Badge status="default" text="停用" />;
          case EquipmentStatusEnum.READY:
            return <Badge status="success" text="启用中" />;
          default:
            return '';
        }
      },
    },
    {
      title: '首次启用日期',
      dataIndex: 'initialUseDate',
      key: 'initialUseDate',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '使用年限',
      dataIndex: 'usefulAge',
      key: 'usefulAge',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '设备价值',
      dataIndex: 'originWorth',
      key: 'originWorth',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '导入状态',
      dataIndex: 'isOk',
      key: 'isOk',
      width: 150,
      fixed: 'right',
      render: (isOk: boolean, record: IImportTaskDetail) => {
        if (isOk) {
          return <Tag color="#87d068">成功</Tag>
        }
        return <Space>
          <Tag color="#f50">失败</Tag>
          <Tooltip title={record.reason} color='#f50' zIndex={9999}>
            <a>查看原因</a>
          </Tooltip>
        </Space>
      },
      renderFormItem: () => (
        <Select placeholder="导入状态" dropdownStyle={{ zIndex: 2200 }}>
          <Select.Option key="all" value="all">
            全部
          </Select.Option>
          <Select.Option key="success" value="success">
            成功
          </Select.Option>
          <Select.Option key="fail" value="fail">
            失败
          </Select.Option>
        </Select>
      )
    },
  ];

  const onModalCancel = () => {
    actionRef.current?.resetSearchForm();
    onCancel();
  }
  
  useEffect(() => {
    if (taskDetail?.id && visible) {
      currentTaskIdRef.current = taskDetail!.id;
      actionRef.current?.reload();
    }
  }, [taskDetail, visible]);

  return (
    <Modal
      centered
      title="导入任务明细"
      visible={visible}
      width={1000}
      zIndex={2100}
      onCancel={onModalCancel}
      bodyStyle={{ height: 800, overflow: 'auto' }}
      footer={[
        <Button key="close" onClick={onModalCancel}>
          关闭
        </Button>,
      ]}
    >
      <Descriptions bordered>
        <Item label="文件名称" span={3}>
          {taskDetail?.fileName}
        </Item>
        <Item label="文件包含数量">{taskDetail?.total}</Item>
        <Item label="导入成功数量" span={2}>
          {taskDetail?.okNumber}
        </Item>
        <Item label="操作人">{taskDetail?.creatorName}</Item>
        <Item label="导入时间">{taskDetail?.createdTime}</Item>
      </Descriptions>
      <ProTable<IImportTaskDetail, any>
        rowKey="id"
        columns={columns}
        isSyncToUrl={false}
        actionRef={actionRef}
        toolBarRender={false}
        tableProps={{
          scroll: {
            x: 'max-content',
            y: 550
          }
        }}
        request={async (formValues: any) => {
          const { current, pageSize, isOk } = formValues;
          return fetchImportTaskDetails(
            currentTaskIdRef.current!,
            ImportStatusValueMap.get(isOk),
            current!,
            pageSize!,
          );
        }}
      />
    </Modal>
  );
};

export default ImportTaskDetail;
