import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import useUserInfo from '@/hooks/useUserInfo';
import { reject } from '../service';
import type { ITaskItem } from '../type';

const { TextArea } = Input;

interface IComponentProps {
  visible: boolean;
  record: ITaskItem | undefined;
  onSubmit: () => void;
  onCancel: () => void;
}

const RejectModal: React.FC<IComponentProps> = ({
  visible,
  record,
  onSubmit,
  onCancel,
}) => {
  const { currentUser } = useUserInfo();
  const [form] = Form.useForm();
  const onModalCancel = () => {
    form.resetFields();
    onCancel();
  };

  const onModalOk = async () => {
    try {
      const reason = form.getFieldValue('reason');
      await reject(record!.id, {
        employeeId: currentUser!.employee.id,
        employeeName: currentUser!.employee.name,
        reason,
      });
      onSubmit();
      message.success('操作成功');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      title="不通过原因"
      visible={visible}
      onCancel={onModalCancel}
      onOk={onModalOk}
      okText="继续维修"
    >
      <Form form={form}>
        <Form.Item label="验收不通过的原因" name="reason">
          <TextArea
            placeholder="填写原因"
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

export default RejectModal;
