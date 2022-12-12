import React, { useRef } from 'react';
// import useUserInfo from '@/hooks/useUserInfo';

import {
  Divider,
  Popconfirm,
  // message,
  // Button
} from 'antd';
// import {
//   PlusOutlined,
// } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';

// import {
//   MEETINGUrl
// } from '@/utils/constants';

import { fetchHistoriesByUserId, deleteHistoryById } from '../service';

import type { IFetchHistoryItem } from '../type';

import styles from '../index.less';

const MEETURL = '/room/';

const MeetingAllPage: React.FC = () => {
  // const { currentUser } = useUserInfo();
  const actionRef = useRef<ActionType>();

  const reload = () => {
    actionRef.current?.reload();
  };

  const onJoin = async (record: IFetchHistoryItem) => {
    window.open(MEETURL + record.code, '_blank');
  };

  const onDelete = async (record: IFetchHistoryItem) => {
    try {
      const res = await deleteHistoryById(record.id);
      reload();

      if (res.code !== 0) {
        console.error(res.msg);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderActions = (record: IFetchHistoryItem) => {
    return (
      <>
        <>
          <Popconfirm
            title="参加会议吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              try {
                onJoin(record);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <a className={styles.meetJoin}>参加会议</a>
          </Popconfirm>
          <Divider type="vertical" />
        </>
        {/* <>
          <a onClick={() => onEdit(record)}>编辑</a>
          <Divider type="vertical" />
        </> */}
        <>
          <Popconfirm
            title="取消吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={async () => {
              try {
                onDelete(record);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <a className={styles.meetDanger}>删除</a>
          </Popconfirm>
        </>
      </>
    );
  };

  const columns: ProTableColumn<IFetchHistoryItem>[] = [
    // {
    //   title: '会议ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   hideInSearch: true,
    // },
    {
      title: '创建人',
      dataIndex: 'nickName',
      key: 'nickName',
      hideInSearch: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      hideInSearch: true,
    },
    {
      title: '会议码',
      dataIndex: 'code',
      key: 'code',
      hideInSearch: true,
    },
    {
      title: '参会时间',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      hideInSearch: true,
      width: 190,
    },
    // {
    //   title: '主持人',
    //   dataIndex: 'username',
    //   key: 'username',
    //   hideInSearch: true,
    // },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      hideInSearch: true,
      width: 190,
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      hideInSearch: true,
      width: 140,
      render: (_, record) => renderActions(record),
    },
  ];

  return (
    <PageContainer>
      <ProTable<IFetchHistoryItem, any>
        title="会议记录"
        rowKey="id"
        columnEmptyText="匿名"
        request={async () => {
          const res = await fetchHistoriesByUserId();

          return {
            data: res.data,
            success: true,
            total: res.data.length,
          };
        }}
        columns={columns}
        isSyncToUrl={false}
        actionRef={actionRef}
        tableProps={{
          pagination: false,
        }}
      />
    </PageContainer>
  );
};

export default MeetingAllPage;
