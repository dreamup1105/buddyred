import React, { useState } from 'react';
import { message, Modal, Button, Input } from 'antd';
import { useModel } from 'umi';
import type { RepairRecord } from '../../type';
import RecordDetail from '../../components/RecordDetail';
import { postDenyRecordApprove, postPassRecordApprove } from '../../service';

interface ModalRecordApproveProps {
  visible?: boolean;
  record?: RepairRecord;
  onClose: () => void;
  afterSubmit?: (record: RepairRecord) => void;
}
const ModalRecordApprove: React.FC<ModalRecordApproveProps> = ({
  visible = false,
  record,
  onClose,
  afterSubmit,
}) => {
  const { initialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(false);
  const [reasonModalVis, setReasonModalVis] = useState(false);
  const [reason, setReason] = useState('');

  const handleEditDenyReason = () => {
    setReasonModalVis(true);
  };

  const handleApprove = async (isDeny?: boolean) => {
    if (!initialState || !initialState.currentUser || !record) return;
    const { id, name } = initialState.currentUser.employee;
    try {
      setLoading(true);
      if (isDeny) {
        await postDenyRecordApprove(record.id, {
          employeeId: id,
          employeeName: name,
          reason,
        });
      } else {
        await postPassRecordApprove(record.id, {
          employeeId: id,
          employeeName: name,
        });
      }
      setReasonModalVis(false);
      onClose();
      if (afterSubmit) {
        afterSubmit(record);
      }
      message.success('工单补单审批成功');
    } catch (err) {
      message.error(err.message || err.msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title="维修工单补单审批"
      width={1000}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button
          key="d"
          onClick={handleEditDenyReason}
          type="primary"
          danger
          disabled={loading}
        >
          拒绝
        </Button>,
        <Button
          key="p"
          onClick={() => handleApprove()}
          type="primary"
          disabled={loading}
        >
          通过
        </Button>,
        <Button key="c" onClick={onClose}>
          取消
        </Button>,
      ]}
    >
      <RecordDetail record={record} />
      <Modal
        title="请填写审批不通过的原因"
        visible={reasonModalVis}
        maskClosable={false}
        onCancel={() => setReasonModalVis(false)}
        cancelText="取消"
        onOk={() => handleApprove(true)}
        okText="提交"
        okButtonProps={{ danger: true }}
      >
        <Input
          placeholder="原因"
          value={reason}
          onChange={(e) => setReason(e.currentTarget.value)}
        />
      </Modal>
    </Modal>
  );
};

export default ModalRecordApprove;
