import React from 'react';
import { Row, Col, Form, Input, Button, Space } from 'antd';
import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import type { ActionRef, ActionType } from '@/components/ProTable';

interface IComponentProps {
  collapsed: boolean;
  loading: boolean;
  actionRef: ActionRef;
  onSearch: () => void;
  onClickCollapse: () => void;
}

const StatusSearchForm: React.FC<IComponentProps> = ({
  loading,
  collapsed,
  actionRef,
  onSearch,
  onClickCollapse,
}) => {
  return collapsed ? (
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item name="metaKey">
          <Input placeholder="Key" suffix={<SearchOutlined />} />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Button onClick={() => onSearch?.()} loading={loading} type="primary">
          搜索
        </Button>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
        <a onClick={onClickCollapse}>
          更多搜索
          <DownOutlined />
        </a>
      </Col>
    </Row>
  ) : (
    <>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <a onClick={onClickCollapse}>
            收起
            <UpOutlined />
          </a>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="平台名称" name="applicationName">
            <Input placeholder="请输入平台名称" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="消息内容" name="content">
            <Input placeholder="请输入消息内容" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="消息标题" name="title">
            <Input placeholder="请输入消息标题" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="跳转URI" name="uri">
            <Input placeholder="请输入跳转URI" />
          </Form.Item>
        </Col>
        <Col span={8} style={{ textAlign: 'right', alignSelf: 'center' }}>
          <Space>
            <Button onClick={() => (actionRef.current as ActionType).reset()}>
              重置
            </Button>
            <Button type="primary" loading={loading} onClick={onSearch}>
              查询
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default StatusSearchForm;
