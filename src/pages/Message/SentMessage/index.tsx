import React, { useRef, useState } from 'react';
import { Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import useMount from '@/hooks/useMount';
import ProTable from '@/components/ProTable';
import { tableHeight } from '@/utils/utils';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import SentListDetailModal from './components/SentListDetailModal';
import type { ISentListData, IApplicationName } from './type';
import { fetchMetaMessages } from './service';

const { Option } = Select;

/**
 * SentMessageColumn
 * @abstract 消息模板列表设定
 */
const SentMessageColumn: ProTableColumn<ISentListData>[] = [
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
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    hideInSearch: true,
  },
];

const MetaDataList: React.FC = () => {
  /** --------------- State here ------------------------------- */
  // 消息模板列设置
  const [columns, setColumns] = useState(SentMessageColumn);
  // 详情框可见
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  // 当前元消息
  const [currentMessageData, setCurrentMessageData] = useState<
    ISentListData | undefined
  >();
  // action ref
  const actionRef = useRef<ActionType>();

  /** --------------- Const here ------------------------------- */
  // 查询参数
  const DefaultQuery = {
    current: 1,
    pageSize: 30,
    applicationName: 'YXK' as IApplicationName,
    isReaded: null,
    since: null,
    metaKey: undefined,
    title: undefined,
  };

  /** -------------- Functions here ---------------------------- */
  /**
   * 打开详情页
   * @param sentMessage
   */
  const onViewDetail = (sentMessage: ISentListData) => {
    setCurrentMessageData(sentMessage);
    setDetailModalVisible(true);
  };

  /**
   * 取消详情页
   */
  const onDetailModalCancel = () => {
    setDetailModalVisible(false);
    setCurrentMessageData(undefined);
  };

  // 表格操作栏
  const operationColumn: ProTableColumn<ISentListData> = {
    title: '操作',
    key: 'operation',
    hideInSearch: true,
    render: (_, record) => {
      return (
        <>
          <a onClick={() => onViewDetail(record)}>详情</a>
        </>
      );
    },
  };

  useMount(() => {
    setColumns((prevColumns) => [...prevColumns, operationColumn]);
  });

  return (
    <PageContainer>
      <ProTable<ISentListData, typeof DefaultQuery>
        rowKey="id"
        title="已发送消息列表"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        formProps={{
          labelCol: {
            span: 5,
          },
        }}
        options={{
          seqColumn: true,
        }}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => onViewDetail(record),
          };
        }}
        request={async (query) => {
          const { current, pageSize, applicationName, metaKey, title } = query;
          return fetchMetaMessages(
            {
              applicationName,
              metaKey,
              title,
            },
            undefined,
            undefined,
            Number(current) || 1,
            Number(pageSize) || 30,
          );
        }}
      />
      <SentListDetailModal
        messageData={currentMessageData}
        visible={detailModalVisible}
        onCancel={onDetailModalCancel}
      />
    </PageContainer>
  );
};

export default MetaDataList;
