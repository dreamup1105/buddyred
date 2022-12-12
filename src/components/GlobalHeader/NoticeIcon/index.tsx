import React, { useState } from 'react';
import { Spin, Tabs, Row, Col, Dropdown, List, message, Badge } from 'antd';
import { history } from 'umi';
import { BellOutlined } from '@ant-design/icons';
import useUserInfo from '@/hooks/useUserInfo';
import { fetchUserMessages } from '@/pages/Message/SentMessage/service';
import type { IMessageItem } from '@/pages/Message/SentMessage/type';
import { drainMessage } from '@/pages/Message/User/service';
import styles from '../index.less';

const { TabPane } = Tabs;

const NoticeIcon: React.FC = () => {
  const { currentUser, initialState, setInitialState } = useUserInfo();
  const [spinning, setSpinning] = useState(false);
  const [messages, setMessages] = useState<IMessageItem[]>([]);
  const userId = currentUser?.user.id;

  // 全部置为已读
  const onMarkFullRead = async () => {
    try {
      const { code } = await drainMessage();
      if (code === 0) {
        message.success('操作成功');
        setInitialState({
          ...initialState,
          message: {
            unreadCount: 0,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSelect = (record: IMessageItem) => {
    history.push(`/message/detail/${record.id}`);
  };

  const renderMessagePopoverContent = () => {
    return (
      <div
        style={{ width: 400, zIndex: 1000 }}
        className={styles.noticeWrapper}
      >
        <Spin spinning={spinning}>
          <Tabs defaultActiveKey="1" centered>
            <TabPane tab="我的消息" key="1">
              <List
                itemLayout="horizontal"
                dataSource={messages}
                renderItem={(item) => (
                  <List.Item
                    style={{ paddingLeft: 10, paddingRight: 10 }}
                    onClick={() => onSelect(item)}
                  >
                    <List.Item.Meta
                      title={
                        userId && item?.states?.[userId]?.isReaded ? (
                          <a>{item.title}</a>
                        ) : (
                          <Badge color="#1890ff" text={item.title} />
                        )
                      }
                      description={item.createdTime}
                    />
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
          <Row className={styles.noticeBottomBar}>
            <Col
              span={12}
              className={styles.noticeBottomBarLeft}
              onClick={() => onMarkFullRead()}
            >
              全部置为已读
            </Col>
            <Col
              span={12}
              onClick={() => history.push('/message/user')}
              className={styles.noticeBottomBarRight}
            >
              查看更多
            </Col>
          </Row>
        </Spin>
      </div>
    );
  };

  const onVisibleChange = async (visible: boolean) => {
    if (visible && currentUser?.user.id) {
      try {
        setSpinning(true);
        const { data = [], total } = await fetchUserMessages(
          {
            applicationName: 'YXK',
            isReaded: false,
            uid: currentUser.user.id,
          },
          undefined,
          undefined,
          1,
          6,
        );
        setMessages(data);
        setInitialState({
          ...initialState,
          message: {
            unreadCount: total,
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setSpinning(false);
      }
    }
  };

  return (
    <Dropdown
      placement="bottomCenter"
      overlay={renderMessagePopoverContent}
      onVisibleChange={onVisibleChange}
    >
      <span className={styles.action} style={{ fontSize: 20 }}>
        <Badge
          count={initialState?.message?.unreadCount}
          size="small"
          offset={[4, 0]}
        >
          <a>
            <BellOutlined style={{ fontSize: 20 }} />
          </a>
        </Badge>
      </span>
    </Dropdown>
  );
};

export default NoticeIcon;
