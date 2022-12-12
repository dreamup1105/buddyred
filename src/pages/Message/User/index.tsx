import React, { useRef, useState } from 'react';
import useUserInfo from '@/hooks/useUserInfo';
import { Space, Select, DatePicker, Button, Badge } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { ReadOutlined } from '@ant-design/icons';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import ProTable from '@/components/ProTable';
import {
  momentToString,
  stringToMoment,
  WithoutTimeFormat,
} from '@/utils/utils';
import useReadState from '@/hooks/useReadState';
import { drainMessage } from './service';
import { fetchUserMessages } from '../SentMessage/service';
import type { IMessageItem } from '../SentMessage/type';
import MessageDetailModal from './components/MessageDetailModal';
import { tableHeight } from '@/utils/utils';
import { metaKey } from './type';
import { history } from 'umi';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  isReaded: '0',
  createdTime: undefined,
};

const readStatusOptions = [
  {
    label: '未读',
    value: '0',
  },
  {
    label: '已读',
    value: '1',
  },
];

const UserMessagePage: React.FC = () => {
  const [messageDetailModalVisible, setMessageDetailModalVisible] = useState(
    false,
  );
  const [currentRecord, setCurrentRecord] = useState<IMessageItem>();
  const [marking, setMarking] = useState(false);
  const { currentUser } = useUserInfo();
  const { singleMarkRead, loadUnreadCount } = useReadState();
  const userId = currentUser?.user.id;
  const actionRef = useRef<ActionType>();

  const onViewDetail = async (record: IMessageItem) => {
    setCurrentRecord(record);
    setMessageDetailModalVisible(true);
    actionRef.current?.reload();
    singleMarkRead(record.id);
  };

  const onViewDetailPage = async (record: IMessageItem | undefined) => {
    if (record?.metaKey == metaKey.MAINTAIN_EXPIRE) {
      history.push(`/crm/sign?agreeId=${record?.params.agreementId}`);
    }
  };

  const onMarkFullRead = async () => {
    if (marking) {
      return;
    }
    try {
      setMarking(true);
      await drainMessage();
      actionRef.current?.reload();
      loadUnreadCount();
    } catch (error) {
      console.error(error);
    } finally {
      setMarking(false);
    }
  };

  const columns: ProTableColumn<IMessageItem>[] = [
    {
      title: '是否已读',
      dataIndex: 'isReaded',
      hideInTable: true,
      renderFormItem: () => <Select options={readStatusOptions} />,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      hideInSearch: true,
      width: 300,
      render: (title, record) => {
        if (userId && record?.states?.[userId]?.isReaded) {
          return title;
        }

        return <Badge color="#1890ff" text={title} />;
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      hideInSearch: true,
    },
    {
      title: '发送日期',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 200,
      renderFormItem: () => (
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      ),
    },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      width: 150,
      render: (_, record) => (
        <Space>
          <a onClick={() => onViewDetail(record)}>详情</a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<IMessageItem, typeof DefaultQuery>
        rowKey="id"
        title="我的消息"
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
        request={async (query) => {
          const { current, pageSize, createdTime, isReaded } = query;
          return fetchUserMessages(
            {
              applicationName: 'YXK',
              uid: currentUser!.user.id,
              since: createdTime ? `${createdTime} 00:00:00` : undefined,
              isReaded: isReaded === '1',
            },
            undefined,
            undefined,
            Number(current) || 1,
            Number(pageSize) || 30,
          );
        }}
        hooks={{
          beforeInit: (query) => {
            return {
              ...DefaultQuery,
              ...query,
              createdTime: stringToMoment(query.createdTime),
            };
          },
          beforeSubmit: (formValues) => {
            return {
              ...formValues,
              createdTime: momentToString(
                formValues.createdTime,
                WithoutTimeFormat,
              ),
            };
          },
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => onViewDetail(record),
          };
        }}
        toolBarRender={() => [
          <Button
            key="readed"
            type="primary"
            loading={marking}
            onClick={() => onMarkFullRead()}
          >
            <ReadOutlined />
            全部置为已读
          </Button>,
        ]}
      />
      <MessageDetailModal
        visible={messageDetailModalVisible}
        currentRecord={currentRecord}
        onCancel={() => setMessageDetailModalVisible(false)}
        onViewDetail={() => onViewDetailPage(currentRecord)}
      />
    </PageContainer>
  );
};

export default UserMessagePage;
