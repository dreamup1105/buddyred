import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { saveDictionary } from '@/services/dictionary';
import type { ITableListItem, Operation, IBizConfig } from '../type';

interface IComponentProps {
  operation: Operation;
  visible: boolean;
  currentRecord: ITableListItem | undefined;
  bizConfig: IBizConfig | undefined;
  onSubmit: (newDictItem: ITableListItem) => void;
  onCancel: () => void;
}

const CreateDictForm: React.FC<IComponentProps> = ({
  operation,
  visible,
  currentRecord,
  bizConfig,
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
      setConfirmLoading(true);
      const { name } = values;
      const params: SaveDictionaryParams = {
        name: name.trim(),
      };

      switch (operation) {
        case 'Create-Sub':
          params.parentId = currentRecord?.id;
          break;
        case 'Create-Sibling':
          params.parentId = currentRecord?.parentId || 0;
          break;
        case 'Edit':
          params.parentId = currentRecord?.parentId;
          params.id = currentRecord?.id;
          break;
        default:
          break;
      }

      const { code, data } = await saveDictionary(bizConfig!.dictType, params);
      if (code === 0) {
        form.resetFields();
        onSubmit(data);
      }
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
    if (currentRecord && visible && operation === 'Edit') {
      form.setFieldsValue({ name: currentRecord.name });
    }
  }, [currentRecord, visible, operation]);

  return (
    <Modal
      destroyOnClose
      title={
        operation === 'Create-Sibling'
          ? bizConfig?.createDictFormModal.sibling
          : bizConfig?.createDictFormModal.sub
      }
      visible={visible}
      maskClosable={false}
      okText="保存"
      cancelText="取消"
      confirmLoading={confirmLoading}
      onOk={onModalOk}
      onCancel={onModalCancel}
      forceRender
    >
      <Form form={form} {...formItemLayout}>
        {operation === 'Create-Sub' ? (
          <Form.Item
            name="name"
            label={bizConfig?.createDictFormModal.parentLabel}
          >
            <span>{currentRecord!.name}</span>
          </Form.Item>
        ) : null}
        <Form.Item
          name="name"
          label={bizConfig?.createDictFormModal.label}
          rules={[
            { required: true, message: bizConfig?.createDictFormModal.message },
            {
              whitespace: true,
              message: `${bizConfig?.createDictFormModal.label}不能只包含空格`,
            },
          ]}
        >
          <Input placeholder="请填写" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDictForm;
