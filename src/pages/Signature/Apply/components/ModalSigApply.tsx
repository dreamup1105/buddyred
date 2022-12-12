import React, { useState } from 'react';
import { Modal, Form, Spin, message } from 'antd';
import type { TeamDetail } from '@/pages/Team/type';
import SigForm from '../../components/SigForm';
import type { SigApplyData, ExtendedUploadFile } from '../../type';
import { putSigApply } from '../../service';

interface Props {
  visible?: boolean;
  currentTarget?: TeamDetail;
  onClose: () => void;
  afterSubmit?: (target: TeamDetail) => void;
}
const ModalSigApply: React.FC<Props> = ({
  visible = false,
  currentTarget,
  onClose,
  afterSubmit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  /* 提交签约申请 */
  const handleSubmit = async () => {
    if (!currentTarget) return;
    setLoading(true);
    try {
      const {
        sigDate,
        sigScope,
        equipmentIds,
        attachments: att,
      } = await form.validateFields();
      const attachments = att.map(
        ({ name, status, res, type, size = 0 }: ExtendedUploadFile) => {
          if (status !== 'done') {
            throw new Error(`请移除未成功上传的图片后再提交！`);
          }
          return {
            res,
            fileName: name,
            contentType: type,
            contentLength: size,
          };
        },
      );
      const applyData: SigApplyData = {
        equipmentIds,
        attachments,
        sig: {
          sigApply: '',
          sigBeginDate: sigDate[0].format('YYYY-MM-DD hh:mm:ss'),
          sigEndDate: sigDate[1].format('YYYY-MM-DD hh:mm:ss'),
          sigScopeRepairs: false,
          sigScopeMaintain: false,
          sigScopeInspection: false,
          sigScopeMeasurement: false,
        },
      };
      sigScope.forEach((key: any) => {
        applyData.sig[key] = true;
      });
      await putSigApply(currentTarget.id, applyData);
      if (afterSubmit) {
        afterSubmit(currentTarget);
      }
      form.resetFields();
      message.success('申请提交成功');
    } catch (err) {
      if (err.errorFields) {
        message.error(
          err.errorFields.map((_: any) => _.errors.join(',')).join(','),
        );
      } else {
        message.error(err.message || err.msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      title="申请签约"
      width={1000}
      visible={visible}
      maskClosable={false}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="申请"
      okButtonProps={{ loading }}
      cancelText="取消"
    >
      <Spin spinning={loading}>
        <SigForm form={form} team={currentTarget} />
      </Spin>
    </Modal>
  );
};

export default ModalSigApply;
