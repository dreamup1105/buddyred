import React, { useState } from 'react';
import { Modal, message, Button, Space } from 'antd';
import type { TeamDetail } from '@/pages/Team/type';
import { putRejectSig, putApproveSig } from '../../service';
import SigDetail from '../../components/SigDetail';

interface Props {
  visible?: boolean;
  currentTarget?: TeamDetail;
  onClose: () => void;
  afterSubmit?: (target: TeamDetail) => void;
}
const ModalSigApprove: React.FC<Props> = ({
  visible = false,
  currentTarget,
  onClose,
  afterSubmit,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  /* 通过签约 */
  const handleSig = async () => {
    if (!currentTarget) return;
    try {
      setLoading(true);
      await putApproveSig(currentTarget.id);
      if (afterSubmit) {
        afterSubmit(currentTarget);
      }
      message.success('签约成功');
    } catch (err) {
      message.error(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* 拒绝签约 */
  const handleReject = () => {
    if (!currentTarget) return;
    Modal.confirm({
      title: '拒绝签约',
      content: `确定拒绝${currentTarget.name}的签约申请吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        try {
          await putRejectSig(currentTarget.id);
          if (afterSubmit) {
            afterSubmit(currentTarget);
          }
          message.success('拒绝签约成功');
        } catch (err) {
          message.error(`操作失败：${err.message}`);
          console.log(err);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <Modal
      title="签约"
      width={1000}
      visible={visible}
      maskClosable={false}
      onCancel={onClose}
      okButtonProps={{ loading }}
      footer={
        <Space>
          <Button onClick={onClose}>关闭</Button>
          <Button
            type="primary"
            danger
            onClick={handleReject}
            loading={loading}
          >
            拒绝
          </Button>
          <Button type="primary" onClick={handleSig} loading={loading}>
            签约
          </Button>
        </Space>
      }
    >
      <SigDetail team={currentTarget} />
    </Modal>
  );
};

export default ModalSigApprove;
