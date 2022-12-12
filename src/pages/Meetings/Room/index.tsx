import React, { useState, useEffect } from 'react';
import { useParams } from 'umi';

import YxkMeet from './components/YxkMeet';
import { Row, Col, Input, Button } from 'antd';

import styles from './index.less';

import { MEETINGUrl } from '@/utils/constants';

const roomName = 'yxkRoom';
const Loader: React.FC = () => {
  return <h3 className={styles.loaderFullText}>正在加载会议...</h3>;
};

const RoomPage: React.FC = () => {
  const params = useParams<{ id: string | undefined }>();
  const [userFullName, setUserFullName] = useState<string>('');
  const [meetName, setMeetName] = useState<string>('');
  const [visibleMeet, setVisibleMeet] = useState(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFullName(e.target.value);
  };

  const onSubmitJoin = () => {
    setVisibleMeet(true);
    setMeetName(userFullName);
  };

  useEffect(() => {
    document.title = `医修库会议 | ${params?.id}`;
    console.log(roomName + params?.id);
  }, [params?.id]);

  return (
    <div className={styles.roomContainer}>
      <Row>
        {!visibleMeet && (
          <Col span={6} className={styles.roomLeft}>
            <h2 className={styles.roomLeftHeader}>参加会议</h2>
            <Input
              className={styles.roomLeftInput}
              placeholder="请输入您的姓名..."
              onChange={onInputChange}
            />
            <Button
              className={styles.roomLeftSubmit}
              type="primary"
              onClick={onSubmitJoin}
            >
              加入
            </Button>
          </Col>
        )}
        <Col className={styles.roomRight} span={visibleMeet ? 24 : 18}>
          {meetName === '' && (
            <>
              <h3 className={styles.loaderText}>医修库会议</h3>
            </>
          )}
          {meetName !== '' && (
            <YxkMeet
              domain={MEETINGUrl}
              // roomName={roomName + params?.id}
              roomName={roomName + ' with newone'}
              displayName={meetName}
              loadingComponent={Loader}
              containerStyle={{
                width: visibleMeet ? '100vw' : 'auto',
                height: '100vh',
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RoomPage;
