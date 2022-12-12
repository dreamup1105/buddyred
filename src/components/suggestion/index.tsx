import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Rate } from 'antd';
import type { formTiem } from './type';

const { TextArea } = Input;

interface IComponentProps {
  visible: boolean;
  onSubmit: (form: formTiem) => void;
  onCancel: () => void;
}

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const SuggestionModal: React.FC<IComponentProps> = ({
  visible,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const onModalOk = async () => {
    setConfirmLoading(true);
    try {
      await onSubmit(form.getFieldsValue());
      form.resetFields();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const onModalCancel = () => {
    onCancel();
    form.resetFields();
  };

  useEffect(() => {
    // 默认五星好评
    form.setFieldsValue({
      rate: 5,
    });
  }, [visible]);

  return (
    <Modal
      title={`审核意见`}
      visible={visible}
      confirmLoading={confirmLoading}
      maskClosable={false}
      onOk={onModalOk}
      onCancel={onModalCancel}
      forceRender
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item name="rate" label="审核评分">
          <Rate defaultValue={5} />
        </Form.Item>
        <Form.Item name="reason" label={`审核意见`}>
          <TextArea
            placeholder="请填写审核意见"
            maxLength={300}
            autoSize={{
              minRows: 3,
            }}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SuggestionModal;
