import React, { useState, useRef } from 'react';
// import useUserInfo from '@/hooks/useUserInfo';

import { Divider, Popconfirm, message, Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';

// import {
//   MEETINGUrl
// } from '@/utils/constants';

import {
  fetchMeetingsByUserId,
  // fetchMeetingById,
  // saveMeeting,
  deleteMeetingById,
  // saveHistory,
} from '../service';

import type {
  IFetchMeetingItem,
  // IFetchHistoryItem,
  OperationType,
} from '../type';

import MeetingForm from './components/MeetingForm';

import styles from '../index.less';

const MEETURL = '/room/';

const MeetingAllPage: React.FC = () => {
  // const { currentUser } = useUserInfo();
  const actionRef = useRef<ActionType>();

  const [meetingFormVisible, setMeetingFormVisible] = useState<boolean>(false);
  const [operation, setOperation] = useState<OperationType>(OperationType.NOOP);

  const [meetFormInitialValues, setMeetFormInitialValues] =
    useState<IFetchMeetingItem>();
  // const [meetingModalLoading, setMeetingModalLoading] = useState<boolean>(false);

  const reload = () => {
    actionRef.current?.reload();
  };

  const onJoin = async (record: IFetchMeetingItem) => {
    try {
      // const history = {
      //   code: record.code,
      // } as IFetchHistoryItem;
      // let res = await saveHistory(history);
      // if (res.code === 0) {
      //   onDelete(record);
      // }
    } catch (err) {
      console.error(err);
    }
    window.open(MEETURL + record.code, '_blank');
  };

  // const onEdit = async (record: IFetchMeetingItem) => {
  //   setMeetFormInitialValues(record);
  //   setOperation(OperationType.EDIT);
  //   setMeetingFormVisible(true);
  // }

  const onDelete = async (record: IFetchMeetingItem) => {
    try {
      const res = await deleteMeetingById(record.id);
      reload();

      if (res.code !== 0) {
        console.error(res.msg);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onCreateMeeting = () => {
    setOperation(OperationType.CREATE);
    setMeetingFormVisible(true);
  };

  const onSubmitMeetForm = (m_operation: OperationType) => {
    setMeetingFormVisible(false);
    setMeetFormInitialValues(undefined);
    reload();

    let msg = '';
    switch (m_operation) {
      case OperationType.CREATE:
        msg = '已创建';
        break;
      case OperationType.EDIT:
        msg = '已修改';
        break;
      case OperationType.VIEW:
      case OperationType.SCHEDULE:
      case OperationType.NOOP:
        msg = '';
        break;
    }
    message.success(msg);
  };

  const onCancelMeetForm = () => {
    setMeetingFormVisible(false);
    setMeetFormInitialValues(undefined);
  };

  const onGenerateUrl = (record: IFetchMeetingItem) => {
    // const GPATH = window.location.origin + MEETURL + record.code;
    const GPATH = window.location.origin + '/schedule/meeting/' + record.id;
    navigator.clipboard.writeText(GPATH);
    notification.open({
      message: '会议网址',
      description: '已复制到剪贴板! ' + GPATH,
      onClick: () => {
        console.log('通知已点击!');
      },
    });
  };

  const renderActions = (record: IFetchMeetingItem) => {
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
            title="生成网址吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              try {
                onGenerateUrl(record);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <a className={styles.scheduleJoin}>日程</a>
          </Popconfirm>
          <Divider type="vertical" />
        </>
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

  const columns: ProTableColumn<IFetchMeetingItem>[] = [
    // {
    //   title: '会议ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   hideInSearch: true,
    // },
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
      render: (_, record) => renderActions(record),
    },
  ];

  return (
    <PageContainer>
      <ProTable<IFetchMeetingItem, any>
        title="会议管理"
        rowKey="id"
        request={async () => {
          const res = await fetchMeetingsByUserId();

          return {
            data: res.data,
            success: true,
            total: res.data.length,
          };
        }}
        toolBarRender={() => [
          <Button key="create" type="primary" onClick={onCreateMeeting}>
            <PlusOutlined />
            创建会议
          </Button>,
        ]}
        columns={columns}
        isSyncToUrl={false}
        actionRef={actionRef}
        tableProps={{
          pagination: false,
        }}
      />
      <MeetingForm
        operation={operation}
        visible={meetingFormVisible}
        initialValues={meetFormInitialValues}
        onSubmit={onSubmitMeetForm}
        onCancel={onCancelMeetForm}
      />
    </PageContainer>
  );
};

export default MeetingAllPage;
