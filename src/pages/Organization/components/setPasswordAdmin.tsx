import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { intOrLetterRegExp } from '@/utils/utils';

interface IComponentProps {
  visible: boolean;
  onSubmit: (pwd: string) => void;
  onCancel: () => void;
}

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const PasswordModal: React.FC<IComponentProps> = ({
  visible,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const onModalOk = async () => {
    setConfirmLoading(true);
    try {
      const { pwd } = await form.validateFields();
      onSubmit(pwd);
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
      form.resetFields();
    }
  };

  const onModalCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="重置密码"
      visible={visible}
      confirmLoading={confirmLoading}
      maskClosable={false}
      onOk={onModalOk}
      onCancel={onModalCancel}
      forceRender
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item
          name="pwd"
          label="密码"
          rules={[
            {
              required: true,
            },
            { pattern: intOrLetterRegExp, message: '密码只能由数字或字母组合' },
            { max: 16, message: '密码最多不超过16位' },
            { min: 8, message: '密码最少为8位' },
          ]}
        >
          <Input placeholder="请输入重置的密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordModal;
