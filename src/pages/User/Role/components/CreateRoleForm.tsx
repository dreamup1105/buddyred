import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import type { ITableListItem } from '../type';
import { OperationType } from '../type';
import { createRole, updateGroupRole } from '../service';

interface IComponentProps {
  operation: OperationType;
  visible: boolean;
  currentRecord: ITableListItem | undefined;
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateRoleForm: React.FC<IComponentProps> = ({
  operation,
  visible,
  currentRecord,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const onModalOk = async () => {
    try {
      const values = await form.validateFields();
      const { name } = values;
      setConfirmLoading(true);
      if (operation === OperationType.CREATE_ROLE) {
        await createRole(name.trim());
      } else if (operation === OperationType.RENAME) {
        await updateGroupRole({ id: currentRecord!.id, name });
      }
      form.resetFields();
      onSubmit();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const onModalCancel = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (currentRecord && visible && operation === OperationType.RENAME) {
      form.setFieldsValue({ name: currentRecord.name });
    }
  }, [currentRecord, visible, operation]);

  return (
    <Modal
      destroyOnClose
      title={operation === OperationType.CREATE_ROLE ? '添加角色' : '重命名'}
      visible={visible}
      okText="保存"
      cancelText="取消"
      confirmLoading={confirmLoading}
      maskClosable={false}
      onOk={onModalOk}
      onCancel={onModalCancel}
      forceRender
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item
          name="name"
          label="角色名称"
          rules={[
            { required: true, message: '请填写角色名称' },
            { whitespace: true, message: '角色名称不能只包含空格' },
          ]}
        >
          <Input placeholder="请填写" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoleForm;
