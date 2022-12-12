import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import type { ICheckAcceptanceOrderItem } from '../../type';
import { checkInspectionDone } from '../../service';

const { TextArea } = Input;

interface IComponentProps {
  visible: boolean;
  currentRecord: ICheckAcceptanceOrderItem | undefined;
  onSubmit: () => void;
  onCancel: () => void;
}

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const TaskCancelModal: React.FC<IComponentProps> = ({
  visible,
  currentRecord,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const onModalOk = async () => {
    setConfirmLoading(true);
    try {
      const { reason = '' } = await form.validateFields();
      await checkInspectionDone({
        auditResult: false,
        inspectionAuditId: currentRecord!.id,
        remake: reason,
      });
      message.success('操作成功');
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

  return (
    <Modal
      title="继续巡检"
      visible={visible}
      confirmLoading={confirmLoading}
      maskClosable={false}
      zIndex={2000}
      onOk={onModalOk}
      onCancel={onModalCancel}
      forceRender
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item name="reason" label="不通过原因">
          <TextArea placeholder="请填写" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskCancelModal;
