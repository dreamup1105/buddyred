import React from 'react';
import { useState, useEffect } from 'react';
import {
  Modal,
  Row,
  Col,
  Form,
  Input,
  Tag,
  Select,
  Button,
  Tabs,
  Space,
  Popover,
} from 'antd';
import type { ISentListData, IUserInfoSimple } from '../type';
import { batchFetchSimpleUserInfo } from '../service';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface IComponentProps {
  /** 消息数据 */
  messageData?: ISentListData;
  /** 是否可见 */
  visible: boolean;
  /** 弹框关闭绑定方法 */
  onCancel: () => void;
}

const SentListDetailModal: React.FC<IComponentProps> = ({
  messageData,
  visible,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [userInfos, setUserInfos] = useState<
    (IUserInfoSimple & { uid: number })[]
  >([]);

  const loadUserInfos = async () => {
    if (messageData?.targets?.users?.length) {
      try {
        const { code, data } = await batchFetchSimpleUserInfo(
          messageData.targets.users.map((i) => i.userId),
        );
        if (code === 0) {
          setUserInfos(data);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setUserInfos([]);
    }
  };

  const init = async () => {
    loadUserInfos();
    form.setFieldsValue({
      id: messageData?.id,
      createTime: messageData?.createdTime,
      metaKey: messageData?.metaKey,
      applicationName: messageData?.applicationName,
      title: messageData?.title,
      content: messageData?.content,
      uri: messageData?.uri,
      sound: messageData?.sound,
      params: JSON.stringify(messageData?.params, null, '\t'),
      permissions: messageData?.permissions,
      targets: JSON.stringify(messageData?.targets, null, '\t'),
      states: messageData?.states,
    });
  };

  /**
   * 编辑或查看时，设定元数据
   */
  useEffect(() => {
    if (!visible) {
      return;
    }

    init();
  }, [messageData, visible]);

  /**
   * 渲染用户信息PopOver内容
   * @returns 内容
   */
  const renderUserInfo = (userItem: any) => {
    return (
      <>
        <div>用户: {userItem?.username}</div>
        <div>部门: {userItem?.departmentName}</div>
        <div>单位: {userItem?.orgName}</div>
      </>
    );
  };

  /**
   * 渲染id和创建时间
   * @returns 内容
   */
  const renderIdAndCreateTime = () => {
    return (
      <Row gutter={16}>
        <Col span={12}>
          <p>元数据id: {messageData?.id}</p>
        </Col>
        <Col span={12}>
          <p>创建时间: {messageData?.createdTime}</p>
        </Col>
      </Row>
    );
  };

  return (
    <Modal
      title="消息模板详情"
      width="900px"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            form.resetFields();
            onCancel();
          }}
        >
          关闭
        </Button>,
      ]}
    >
      <Tabs type="card">
        <TabPane tab="视图" key="1">
          <Form form={form} style={{ padding: '20px' }} layout="vertical">
            {renderIdAndCreateTime()}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="metaKey" label="元数据key">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="applicationName" label="应用名称">
                  <Select>
                    <Option value="YRT">YRT</Option>
                    <Option value="YXK">YXK</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="title" label="消息标题">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="content" label="消息内容">
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="uri" label="uri">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="sound" label="sound">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="params" label="消息参数">
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Row>
                  <Col span={24} style={{ paddingBottom: 8 }}>
                    <label>消息权限</label>
                  </Col>
                </Row>
                {messageData?.permissions?.map((permissions: any) => {
                  return (
                    <>
                      <Tag color="blue" key={permissions}>
                        {permissions}
                      </Tag>
                    </>
                  );
                })}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="targets" label="发送目标">
                  <TextArea rows={4}>{messageData?.targets}</TextArea>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Row>
                  <Col span={24} style={{ paddingBottom: 8 }}>
                    <label>用户</label>
                  </Col>
                </Row>
                <Space>
                  {userInfos.map((userItem) => {
                    return (
                      <Popover
                        content={renderUserInfo(userItem)}
                        key={userItem.uid}
                      >
                        <Tag color="blue">{userItem.uid}</Tag>
                      </Popover>
                    );
                  })}
                </Space>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane tab="原始数据" key="2">
          {renderIdAndCreateTime()}
          <Row gutter={16}>
            <Col span={24}>
              <TextArea
                rows={40}
                defaultValue={JSON.stringify(messageData, null, '\t')}
              />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default SentListDetailModal;
