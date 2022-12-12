import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';
import RemoteSelect from '@/pages/Assets/components/RemoteSelect';
import type { EditingPart } from './type';

interface ModalAddPartProps {
  visible?: boolean;
  onCancel: () => void;
  onSubmit: (part: EditingPart) => void;
}
const ModalAddPart: React.FC<ModalAddPartProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [remoteSelectParams, setRemoteSelectParams] = useState<{
    manufacturerId?: string | number;
    productId?: string | number;
  }>();

  const handleSubmit = async () => {
    const part = (await form.validateFields()) as EditingPart;
    onSubmit(part);
  };

  const handleAfterValueChange = (changedValue: any) => {
    if (changedValue.manufacturer !== undefined) {
      form.resetFields(['product', 'model']);
      setRemoteSelectParams({
        ...remoteSelectParams,
        manufacturerId: changedValue.manufacturer.value,
      });
    }
    if (changedValue.product !== undefined) {
      form.resetFields(['model']);
      setRemoteSelectParams({
        ...remoteSelectParams,
        productId: changedValue.product.value,
      });
    }
  };

  return (
    <Modal
      title="新增配件"
      visible={visible}
      onCancel={onCancel}
      cancelText="取消"
      onOk={handleSubmit}
      okText="新增"
      maskClosable={false}
    >
      <Form form={form} onValuesChange={handleAfterValueChange}>
        <Form.Item
          label="配件厂商"
          name="manufacturer"
          labelCol={{ span: 6 }}
          rules={[{ required: true, message: '请选择厂商' }]}
        >
          <RemoteSelect
            type="part-manufacturer"
            placeholder="请选择"
            params={remoteSelectParams}
          />
        </Form.Item>
        <Form.Item
          label="配件名称"
          name="product"
          labelCol={{ span: 6 }}
          rules={[{ required: true, message: '请选择配件' }]}
        >
          <RemoteSelect
            type="part-product"
            placeholder="请选择"
            params={remoteSelectParams}
          />
        </Form.Item>
        <Form.Item
          name="model"
          label="配件型号"
          labelCol={{ span: 6 }}
          rules={[{ required: true, message: '请选择配件型号' }]}
        >
          <RemoteSelect
            type="part-model"
            placeholder="请选择"
            params={remoteSelectParams}
          />
        </Form.Item>
        <Form.Item name="sn" label="配件序列号" labelCol={{ span: 6 }}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddPart;
