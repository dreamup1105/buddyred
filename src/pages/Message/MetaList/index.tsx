import React, { useRef, useState } from 'react';
import { Button, message, Divider, Select, Popconfirm, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { tableHeight } from '@/utils/utils';
import omit from 'omit.js';
import useMount from '@/hooks/useMount';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import MetaDataDetailModal from './components/MetaDataDetailModal';
import type { IMetaData } from './type';
import { OperationType } from './type';
import { fetchMetaDataList, deleteMetaData, syncMeta } from './service';

const { Option } = Select;
const { confirm } = Modal;

/**
 * MetaDataListColumns
 * @abstract 消息模板列表设定
 */
const MetaDataListColumns: ProTableColumn<IMetaData>[] = [
  {
    title: 'Key',
    dataIndex: 'metaKey',
    key: 'metaKey',
  },
  {
    title: '消息标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'uri',
    dataIndex: 'uri',
    key: 'uri',
    hideInTable: true,
  },
  {
    title: '消息内容',
    dataIndex: 'content',
    key: 'content',
    hideInTable: true,
  },
  {
    title: '应用名称',
    dataIndex: 'applicationName',
    key: 'applicationName',
    renderFormItem: () => (
      <Select>
        <Option value="YRT">YRT</Option>
        <Option value="YXK">YXK</Option>
      </Select>
    ),
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    hideInSearch: true,
  },
];

const MetaDataList: React.FC = () => {
  // 消息模板列设置
  const [columns, setColumns] = useState(MetaDataListColumns);
  // 详情框可见
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  // 详情框状态
  const [operation, setOperation] = useState<OperationType>(
    OperationType.CREATE,
  );
  // 当前元消息
  const [currentMetaData, setcurrentMetaData] = useState<
    IMetaData | undefined
  >();
  // action ref
  const actionRef = useRef<ActionType>();

  /** --------------- Const here ------------------------------- */
  // 查询参数
  const DefaultQuery = {
    current: 1,
    pageSize: 30,
    applicationName: 'YXK',
    content: '',
    metaKey: '',
    title: '',
    uri: '',
  };

  /** -------------- Functions here ---------------------------- */
  /**
   * 打开详情页
   * @param meta
   */
  const onViewDetail = (meta: IMetaData, editable: boolean) => {
    setcurrentMetaData(meta);
    setDetailModalVisible(true);
    setOperation(editable ? OperationType.EDIT : OperationType.DETAIL);
  };

  const onCreateTemplate = () => {
    setDetailModalVisible(true);
    setOperation(OperationType.CREATE);
  };

  const onSyncMeta = () => {
    Modal.confirm({
      title: '确定要同步吗?',
      onOk: async () => {
        const { code } = await syncMeta();
        if (code === 0) {
          message.success('同步成功');
        }
      },
    });
  };

  /**
   * 取消详情页
   */
  const onDetailModalCancel = () => {
    setDetailModalVisible(false);
    setcurrentMetaData(undefined);
  };

  /**
   * 详情页确认按钮
   */
  const onDetailModalSubmit = async () => {
    setDetailModalVisible(false);
    message.success('保存成功');
    actionRef.current?.reload();
  };

  /**
   * 消息模板表格 - 操作栏删除元数据
   * @param id
   */
  const onMetaDataDelete = (id: string) => {
    confirm({
      title: '提示',
      content: '确定删除吗?',
      onOk: async () => {
        await deleteMetaData(id);
        message.success('操作成功');
        actionRef.current?.reload();
      },
    });
  };

  // 表格操作栏
  const operationColumn: ProTableColumn<IMetaData> = {
    title: '操作',
    key: 'operation',
    hideInSearch: true,
    render: (_, record) => {
      return (
        <>
          <a onClick={() => onViewDetail(record, true)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => onViewDetail(record, false)}>详情</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除该条记录吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => onMetaDataDelete(record.id)}
          >
            <a>删除</a>
          </Popconfirm>
        </>
      );
    },
  };

  useMount(() => {
    setColumns((prevColumns) => [...prevColumns, operationColumn]);
  });

  return (
    <PageContainer>
      <ProTable<IMetaData, typeof DefaultQuery>
        rowKey="id"
        title="消息模板列表"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        formProps={{
          labelCol: {
            span: 5,
          },
        }}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        options={{
          seqColumn: true,
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => onViewDetail(record, true),
          };
        }}
        toolBarRender={() => [
          <Button key="create" type="primary" onClick={onCreateTemplate}>
            <PlusOutlined />
            新建
          </Button>,
          <Button key="sync" type="primary" onClick={onSyncMeta}>
            <SyncOutlined />
            同步
          </Button>,
        ]}
        request={async (query) => {
          const { current, pageSize } = query;

          return fetchMetaDataList(
            omit(query, ['current', 'pageSize']),
            undefined,
            undefined,
            Number(current) || 1,
            Number(pageSize) || 30,
          );
        }}
      />
      <MetaDataDetailModal
        metaData={currentMetaData}
        operationType={operation}
        visible={detailModalVisible}
        onCancel={onDetailModalCancel}
        onSubmit={onDetailModalSubmit}
      />
    </PageContainer>
  );
};

export default MetaDataList;
