import React, { useState } from 'react';
import { Form, message } from 'antd';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';

interface IComponentProps {
  visible: boolean;
  onSubmit: (tag: string) => void;
  onCancel: () => void;
}

const CreateVersionForm: React.FC<IComponentProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editableForm] = Form.useForm();

  return (
    <ModalForm
      title="创建版本"
      visible={visible}
      form={editableForm}
      modalProps={{
        width: 400,
        maskClosable: false,
        confirmLoading,
        onCancel: () => {
          editableForm.resetFields();
          onCancel();
        },
      }}
      onFinish={async (values) => {
        const { tag } = values;
        if (!tag || tag.trim() == '') {
          message.error('版本不能为空');
          return;
        }
        setConfirmLoading(true);
        try {
          await onSubmit(tag);
          editableForm.resetFields();
          return true;
        } catch (error) {
          console.error(error);
          return false;
        } finally {
          setConfirmLoading(false);
        }
      }}
      layout="horizontal"
    >
      <ProForm.Group>
        <ProFormText name="tag" label="版本" placeholder="请输入" />
      </ProForm.Group>
    </ModalForm>
  );
};

export default CreateVersionForm;
