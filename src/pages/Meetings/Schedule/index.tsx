import React, { useState, useEffect } from 'react';
import { history, useParams } from 'umi';

import { ScheduleMeeting } from './components/Schedule/index.esm.js';

import { Row, Col, Input, Button, Form, notification } from 'antd';
import {
  UserOutlined,
  FieldTimeOutlined,
  VideoCameraOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  FireOutlined,
} from '@ant-design/icons';

import { stringToMoment, momentToString } from '@/utils/utils';
import { fetchMeetingById, msgSend } from '../service';
import { IFetchMeetingItem, IMsgSendRequest } from '../type';

import styles from '../index.less';

const availableTimeslots = [0, 1, 2, 3, 4, 5].map((id) => {
  return {
    id,
    startTime: new Date(
      new Date(new Date().setDate(new Date().getDate() + id)).setHours(
        9,
        0,
        0,
        0,
      ),
    ),
    endTime: new Date(
      new Date(new Date().setDate(new Date().getDate() + id)).setHours(
        17,
        0,
        0,
        0,
      ),
    ),
  };
});

const SchedulePage: React.FC = () => {
  const params = useParams<{ id: string | undefined }>();
  const [userForm] = Form.useForm();
  const [confirmed, setConfirmed] = useState(false);
  const [meeting, setMeeting] = useState<IFetchMeetingItem[]>([]);
  const [scheduleTime, setScheduleTime] = useState<object>({});
  const [visibleUserForm, setVisibleUserForm] = useState(false);

  const loadMeeting = async (meetingId: string) => {
    try {
      const res = await fetchMeetingById(meetingId);
      // res.code === 0 && setMeeting(res.data);
      setMeeting(res.data);
    } catch (error) {
      history.push('/meetings/all');
    }
  };

  useEffect(() => {
    document.title = `医修库会议 | 议程 - ${params?.id}`;
    if (params.id) {
      loadMeeting(params.id);
    } else {
      // history.push('/meetings/all')
    }
    console.log('MeetingId: ' + params?.id);
  }, [params?.id]);

  const onUserFormFinish = async (values: any) => {
    const data = {
      metaKey: 'YXK-schedule-meeting',
      params: {
        meetingId: meeting?.id,
        meetingCode: meeting?.code,
        fullName: values.fullName,
        email: values.email,
        scheduledTime: momentToString(
          stringToMoment(scheduleTime['startTime']),
        ),
      },
    } as IMsgSendRequest;
    console.log(params);
    try {
      const res = await msgSend(data);
      // res.code === 0 && await notification.success({
      //   message: '完成已成设置',
      //   description: '已成功设置议程!',
      // });
      // res.code === 0 && await setConfirmed(true)
      res.code = 0;
      setConfirmed(true);
    } catch (error) {
      console.error(error);
      notification.error({
        message: '未完成议程设置',
        description: '未完成议程设置!',
      });
    }
  };

  const onScheduleConfirm = (selected: object) => {
    setScheduleTime(selected);
    setVisibleUserForm(true);
  };

  return (
    <div className={styles.schedule}>
      {!confirmed && (
        <Row>
          <Col className={styles.scheduleInfo} span={7}>
            <Row>
              {visibleUserForm && (
                <a
                  onClick={() => setVisibleUserForm(false)}
                  className={styles.scheduleBack}
                >
                  <ArrowLeftOutlined />
                  &nbsp;Back
                </a>
              )}
            </Row>
            <h3 className={styles.scheduleGray}>
              <UserOutlined />
              &nbsp;{meeting?.userId}
            </h3>
            <h2>
              <a href={`${window.location.origin}/room/${meeting?.code}`}>
                {meeting?.title}
              </a>
            </h2>
            <h3 className={styles.scheduleGray}>
              <FieldTimeOutlined />
              &nbsp;30分钟
            </h3>
            <p>
              <VideoCameraOutlined />
              &nbsp;<b>确认后提供网络会议详细信息</b>
            </p>
            <p>通过视频会议，我们就可以更好地了解并回答您的疑问。</p>
          </Col>
          {!visibleUserForm && (
            <Col className={styles.scheduleForm} span={17}>
              <h3 className={styles.sfHeader}>请选择时间</h3>
              <ScheduleMeeting
                borderRadius={10}
                primaryColor="#0069ff"
                eventDurationInMinutes={30}
                availableTimeslots={availableTimeslots}
                onStartTimeSelect={onScheduleConfirm}
              />
            </Col>
          )}
          {visibleUserForm && (
            <Col className={styles.scheduleUser} span={17}>
              <h3>请输入以下信息</h3>
              <Form
                form={userForm}
                className="schedule-form"
                name="register"
                onFinish={onUserFormFinish}
              >
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    {
                      type: 'email',
                      message: '无效邮箱!',
                    },
                    {
                      required: true,
                      message: '请输入您的邮箱!',
                    },
                  ]}
                >
                  <Input placeholder="E-mail" />
                </Form.Item>
                <Form.Item
                  name="fullName"
                  label="姓名"
                  rules={[
                    {
                      required: true,
                      message: '请输入您的姓名!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Input placeholder="姓名" />
                </Form.Item>
                <Form.Item
                  name="intro"
                  label="请分享任何有助于为我们的会议做准备的信息"
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    设定会议
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          )}
        </Row>
      )}
      {confirmed && (
        <Row>
          <Col className={styles.scheduleConfirm} offset={8} span={8}>
            <div className={styles.scheduleConfirmInfo}>
              <h2 className={styles.scheduleConfirmUserText}>
                <UserOutlined />
                &nbsp;{meeting?.userId}
              </h2>
              <h1 className={styles.textCenter}>已确认</h1>
              <h3 className={styles.textCenter}>
                您已设置议程: {meeting?.userId}
              </h3>
            </div>
            <div>
              <h2>
                <a href={`${window.location.origin}/room/${meeting?.code}`}>
                  <FireOutlined />
                  &nbsp;{meeting?.title}
                </a>
              </h2>
              <h3>
                <CalendarOutlined />
                &nbsp;参会时间:{' '}
                <b>
                  {momentToString(stringToMoment(scheduleTime['startTime']))}
                </b>
              </h3>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SchedulePage;
