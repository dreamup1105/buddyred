import React from 'react';
import { Modal, Button } from 'antd';

interface Props {
  title?: string;
  visible?: boolean;
  onClose: () => void;
}
const ModalDetail: React.FC<Props> = ({
  title = '详情',
  visible = false,
  onClose,
  children,
}) => {
  return (
    <Modal
      title={title}
      width={1000}
      visible={visible}
      onCancel={onClose}
      footer={<Button onClick={onClose}>关闭</Button>}
    >
      {children}
    </Modal>
  );
};

export default ModalDetail;
