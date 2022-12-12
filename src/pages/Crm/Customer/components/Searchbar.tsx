import React from 'react';
import { Button, Form, Radio, Row, Col, Input, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';

interface IComponentProps {
  form: FormInstance<any>;
  onSearch: () => Promise<any>;
}

const Searchbar: React.FC<IComponentProps> = ({ form, onSearch }) => {
  return (
    <Form form={form}>
      <Row gutter={8}>
        <Col span={4}>
          <Form.Item label="" name="signStatus">
            <Radio.Group>
              <Radio.Button value="0">全部</Radio.Button>
              <Radio.Button value="1">已签约</Radio.Button>
              <Radio.Button value="2">未签约</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="" name="hospitalName">
            <Input placeholder="医院名称" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Space>
            <Button type="primary" onClick={() => onSearch()}>
              搜索
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                form.setFieldsValue({ signStatus: '0' });
                onSearch();
              }}
            >
              重置
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default Searchbar;
