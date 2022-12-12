import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Spin, message } from 'antd';
import type { TeamDetail } from '@/pages/Team/type';
import { putAuthApply } from '../../service';

interface Props {
  visible?: boolean;
  currentTarget?: TeamDetail;
  onClose: () => void;
  afterSubmit?: (target: TeamDetail) => void;
}
const ModalAuthApply: React.FC<Props> = ({
  visible = false,
  currentTarget,
  onClose,
  afterSubmit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  /* 提交授权申请 */
  const handleSubmit = async () => {
    if (!currentTarget) return;
    setLoading(true);
    try {
      const authMsg = form.getFieldValue('authApply') || '';
      await putAuthApply(currentTarget.id, authMsg);
      if (afterSubmit) {
        afterSubmit(currentTarget);
      }
      message.success('申请提交成功');
    } catch (err) {
      message.error('申请提交失败');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible || !currentTarget) return;
    form.setFieldsValue({
      name: currentTarget.name,
      siteOrgName: currentTarget.siteOrgName,
      authApply: '我需要查看您方的设备信息，请允批准，谢谢！',
    });
  }, [visible, currentTarget, form]);

  return (
    <Modal
      title="申请授权"
      visible={visible}
      maskClosable={false}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="申请"
      okButtonProps={{ loading }}
      cancelText="取消"
    >
      <Spin spinning={loading}>
        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item label="申请方" name="name">
            <Input disabled />
          </Form.Item>
          <Form.Item label="审批方" name="siteOrgName">
            <Input disabled />
          </Form.Item>
          <Form.Item label="申请留言" name="authApply">
            <Input />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalAuthApply;
