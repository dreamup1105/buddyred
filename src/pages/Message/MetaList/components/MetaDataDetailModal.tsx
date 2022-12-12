import React from 'react';
import { useState, useEffect } from 'react';
import { Modal, Row, Col, Form, Input, Select } from 'antd';
import TagList from '@/pages/Dictionary/Maintenance/Item/components/TagList';
import type { IMetaData } from '../type';
import { OperationType } from '../type';
import { saveMetaData } from '../service';

const { TextArea } = Input;
const { Option } = Select;

interface IComponentProps {
  metaData?: IMetaData;
  operationType: OperationType;
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const getTitle = (operationType: OperationType) => {
  switch (operationType) {
    case OperationType.CREATE:
      return '新建消息模板';
    case OperationType.DETAIL:
      return '详情';
    case OperationType.EDIT:
      return '编辑消息模板';
    default:
      return '消息模板';
  }
};

const MetaDataDetailModal: React.FC<IComponentProps> = ({
  metaData,
  operationType,
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const formItemLayout = {
    // labelCol: { span: 8 },
    // wrapperCol: { span: 24 },
  };
  const [formEditable, setFormEditable] = useState(true); // 表单是否可编辑

  /**
   * 编辑或查看时，设定元数据
   */
  useEffect(() => {
    if (!visible) {
      return;
    }
    if (operationType !== OperationType.CREATE) {
      // 根据元数据设定表单数据
      form.setFieldsValue({
        ...metaData,
        params: metaData?.params
          ? metaData.params.map((item) => ({ key: item, label: item }))
          : [],
        permissions: metaData?.permissions
          ? metaData.permissions.map((item) => ({ key: item, label: item }))
          : [],
      });

      // 设定是否可编辑
      setFormEditable(operationType === OperationType.EDIT);
    } else {
      form.setFieldsValue({
        applicationName: 'YXK',
        content: '',
        createdTime: '',
        description: '',
        id: '',
        metaKey: '',
        params: [],
        permissions: [],
        sound: '',
        title: '',
        uri: '',
      });
    }
  }, [visible]);

  const renderIdAndCreateTime = () => {
    if (operationType !== OperationType.CREATE) {
      return (
        <Row gutter={16}>
          <Col span={12}>
            <p>元数据id: {metaData?.id}</p>
          </Col>
          <Col span={12}>
            <p>创建时间: {metaData?.createdTime}</p>
          </Col>
        </Row>
      );
    }
    return null;
  };

  const onModalOk = async () => {
    try {
      const formValues = await form.validateFields();
      const { code } = await saveMetaData({
        ...formValues,
        params: formValues.params.map(
          (item: { key: string; label: string }) => item.label,
        ),
        permissions: formValues.permissions
          .filter(
            (item: { key: string; label: string }) => !Number.isNaN(item.label),
          )
          .map((item: { key: string; label: string }) => item.label),
      });
      if (code === 0) {
        onSubmit();
        form.resetFields();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal
        title={getTitle(operationType)}
        width="900px"
        visible={visible}
        onCancel={() => {
          form.resetFields();
          onCancel();
        }}
        onOk={onModalOk}
      >
        <Form
          form={form}
          style={{ padding: '20px' }}
          layout="vertical"
          {...formItemLayout}
        >
          {renderIdAndCreateTime()}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="id" label="" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="metaKey"
                label="元数据key"
                rules={[{ required: true }]}
              >
                <Input disabled={!formEditable} placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="applicationName"
                label="应用名称"
                rules={[{ required: true }]}
              >
                <Select disabled={!formEditable}>
                  <Option value="YRT">YRT</Option>
                  <Option value="YXK">YXK</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="title"
                label="消息标题"
                rules={[{ required: true }]}
              >
                <Input disabled={!formEditable} placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="content"
                label="消息内容"
                rules={[{ required: true }]}
              >
                <TextArea
                  rows={4}
                  disabled={!formEditable}
                  placeholder="请输入"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="scope"
                label="scope"
                rules={[{ required: true }]}
              >
                <Select disabled={!formEditable}>
                  <Option value="TEST">TEST</Option>
                  <Option value="PROD">PROD</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="uri" label="uri">
                <Input disabled={!formEditable} placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sound" label="sound">
                <Input disabled={!formEditable} placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="params" label="消息参数">
                <TagList color="blue" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="permissions" label="消息权限">
                <TagList color="blue" type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="description" label="消息描述">
                <TextArea
                  rows={4}
                  disabled={!formEditable}
                  placeholder="请输入"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default MetaDataDetailModal;
