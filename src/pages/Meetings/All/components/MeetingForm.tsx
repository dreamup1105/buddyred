import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  // Select,
  Row,
  Col,
} from 'antd';
// import {
//   ReloadOutlined,
// } from '@ant-design/icons';

// import omit from 'omit.js';

import { MEETCODELen } from '@/utils/constants';
import { saveMeeting } from '../../service';

import { IFetchMeetingItem } from '../../type';
import { OperationType } from '../../type';

interface IComponentProps {
  visible: boolean;
  meetingId: number | undefined;
  initialValues: IFetchMeetingItem | undefined;
  operation: OperationType;
  onSubmit: (values: IFetchMeetingItem, operation: OperationType) => void;
  onCancel: () => void;
}

// const { TextArea } = Input;
// const { Option } = Select;
const getModalTitle = (operation: OperationType) => {
  switch (operation) {
    case OperationType.VIEW:
      return '浏览';
    case OperationType.CREATE:
      return '创建';
    case OperationType.EDIT:
      return '编辑';
    default:
      return '';
  }
};

const MeetingForm: React.FC<IComponentProps> = ({
  visible,
  initialValues,
  // meetingId,
  operation,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const onModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
      };
      console.log(values);
      setConfirmLoading(true);
      const res = await saveMeeting(formData);
      console.log(res);
      onSubmit(operation);
    } catch (error) {
      console.error(error);
    } finally {
      form.resetFields();
      setConfirmLoading(false);
    }
  };

  const generateCode = () => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < MEETCODELen; i++) {
      result += characters.charAt(Math.floor(Math.random() * 62));
    }
    return result;
  };

  const onModalCancel = async () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (operation === OperationType.CREATE && visible) {
      form.setFieldsValue({
        ...initialValues,
        code: generateCode(),
      });
    }
  }, [initialValues, operation, visible]);

  return (
    <Modal
      visible={visible}
      title={getModalTitle(operation)}
      okText="保存"
      cancelText="取消"
      confirmLoading={confirmLoading}
      maskClosable={false}
      onOk={onModalOk}
      onCancel={onModalCancel}
      width={650}
      forceRender
    >
      <Form form={form}>
        <Row>
          <Col span={24}>
            <Form.Item
              labelAlign="right"
              label="标题"
              name="title"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              labelAlign="right"
              label="会议码"
              name="code"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              rules={[{ required: true, min: MEETCODELen }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default MeetingForm;
