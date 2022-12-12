import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { saveManufacturer, saveProduct, saveModel } from '../service';
import type {
  IManufacturerItem,
  IProductItem,
  IModelItem,
  BizType,
} from '../type';
import { OperationType, OperationTextType } from '../type';

type TableListItem = IManufacturerItem | IProductItem | IModelItem;

interface IComponentProps {
  operation: OperationType;
  visible: boolean;
  currentRecord: TableListItem | undefined;
  bizType: BizType | undefined;
  params?: { manufacturerId?: number; productId?: number };
  onSubmit: (operation: OperationType) => void;
  onCancel: () => void;
}

const CreateDictForm: React.FC<IComponentProps> = ({
  operation,
  visible,
  currentRecord,
  params,
  bizType,
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

      switch (operation) {
        case OperationType.CREATE_MANUFACTURER: // 新增厂商
          await saveManufacturer(bizType!, { name });
          break;
        case OperationType.CREATE_PRODUCT: // 新增产品
          await saveProduct(bizType!, {
            name,
            manufacturerId: params!.manufacturerId!,
          });
          break;
        case OperationType.CREATE_MODEL: // 新增型号
          await saveModel(bizType!, { name, productId: params!.productId! });
          break;
        case OperationType.EDIT_MANUFACTURER: // 编辑厂商
          await saveManufacturer(bizType!, { name, id: currentRecord!.id });
          break;
        case OperationType.EDIT_PRODUCT: // 编辑产品
          await saveProduct(bizType!, {
            name,
            manufacturerId: params!.manufacturerId!,
            id: currentRecord!.id,
          });
          break;
        case OperationType.EDIT_MODEL: // 编辑型号
          await saveModel(bizType!, {
            name,
            productId: params!.productId!,
            id: currentRecord!.id,
          });
          break;
        default:
          break;
      }

      form.resetFields();
      onSubmit(operation);
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
    if (currentRecord && visible) {
      if (
        operation === OperationType.EDIT_MANUFACTURER ||
        operation === OperationType.EDIT_PRODUCT ||
        operation === OperationType.EDIT_MODEL
      ) {
        form.setFieldsValue({ name: currentRecord.name });
      }
    }
  }, [currentRecord, visible, operation]);

  return (
    <Modal
      destroyOnClose
      title={OperationTextType[operation]}
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
          label="名称"
          rules={[
            { required: true, message: '名称不能为空！' },
            { whitespace: true, message: '名称不能只包含空格' },
          ]}
        >
          <Input placeholder="请填写" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDictForm;
