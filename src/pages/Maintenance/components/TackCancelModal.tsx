import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import type { ITaskItem } from '../type';
import { OperationType } from '../type';
import { cancelTask, rejectTask } from '../service';

const { TextArea } = Input;

interface IComponentProps {
  visible: boolean;
  currentRecord: ITaskItem | undefined;
  operation: OperationType;
  onSubmit: () => void;
  onCancel: () => void;
}

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const getTitle = (operation: OperationType) => {
  switch (operation) {
    case OperationType.CANCEL:
      return '撤销原因';
    case OperationType.REJECT:
      return '不通过原因';
    default:
      return '';
  }
};

const TaskCancelModal: React.FC<IComponentProps> = ({
  visible,
  currentRecord,
  operation,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const onModalOk = async () => {
    setConfirmLoading(true);
    try {
      const { reason } = await form.validateFields();
      const isCancel = operation === OperationType.CANCEL;
      const service = isCancel ? cancelTask : rejectTask;
      await service(currentRecord!.id, {
        employeeId: currentRecord!.engineerId,
        employeeName: currentRecord!.engineerName,
        reason,
      });
      message.success(isCancel ? '撤销成功' : '操作成功');
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
      title={getTitle(operation)}
      visible={visible}
      confirmLoading={confirmLoading}
      maskClosable={false}
      onOk={onModalOk}
      onCancel={onModalCancel}
      forceRender
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item name="reason" label={getTitle(operation)}>
          <TextArea
            placeholder="请填写"
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

export default TaskCancelModal;
