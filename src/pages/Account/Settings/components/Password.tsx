import React, { useState } from 'react';
import useUserInfo from '@/hooks/useUserInfo';
import { Modal, Form, message } from 'antd';
import { modifyPassword } from '@/services/account';
import PasswordFormItem from './PasswordFormItem';

interface IComponentProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const PasswordModal: React.FC<IComponentProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { currentUser } = useUserInfo();
  const [form] = Form.useForm();
  const onModalCancel = () => {
    onCancel();
  };
  const onModalOk = async () => {
    if (!currentUser?.user.id) {
      return;
    }
    const formValues = await form.validateFields();
    const { password, newPassword } = formValues;
    try {
      setConfirmLoading(true);
      const { code } = await modifyPassword(
        currentUser.user.id,
        password,
        newPassword,
      );
      if (code === 0) {
        message.success('修改成功');
        form.resetFields();
        onSubmit();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };
  return (
    <Modal
      title="修改密码"
      visible={visible}
      maskClosable={false}
      onCancel={onModalCancel}
      onOk={onModalOk}
      confirmLoading={confirmLoading}
    >
      <Form labelCol={{ span: 5 }} form={form}>
        <PasswordFormItem form={form} type="password" />
        <PasswordFormItem form={form} type="newPassword" />
        <PasswordFormItem form={form} type="reNewPassword" />
        <Form.Item label="    " colon={false}>
          <p style={{ color: '#aaa' }}>
            密码为8-16位字符，需同时包含字母和数字
          </p>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordModal;
