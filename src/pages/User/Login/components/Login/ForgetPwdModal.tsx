import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';

interface IComponentProps {
  visible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const ForgetPwd: React.FC<IComponentProps> = ({ visible }) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  console.log('setConfirmLoading: ', setConfirmLoading);

  return (
    <Modal
      title="忘记密码"
      width={700}
      visible={visible}
      confirmLoading={confirmLoading}
    >
      <Form form={form}>
        <Form.Item
          name="name"
          label="名称"
          rules={[
            {
              required: true,
              message: '请填写名称',
            },
            {
              type: 'string',
              max: 50,
              message: '名称长度需要50位以内',
            },
          ]}
        >
          <Input placeholder="请填写" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ForgetPwd;
