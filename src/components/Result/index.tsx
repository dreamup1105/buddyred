import React, { useEffect } from 'react';
import { Modal, Result } from 'antd';
import type { ResultProps } from 'antd/es/result';

interface IComponentProps {
  visible: boolean;
  title?: string;
  resultProps: ResultProps;
  delay?: number;
  closable?: boolean;
  onCancel: () => void;
}

const ResultModal: React.FC<IComponentProps> = ({
  visible,
  title = '操作结果',
  resultProps,
  closable = true,
  delay = 0,
  onCancel,
}) => {
  useEffect(() => {
    let timeout: any;
    if (visible && typeof delay === 'number' && delay !== 0) {
      timeout = setTimeout(onCancel, delay);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [visible, delay]);

  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onCancel}
      footer={null}
      closable={closable}
      maskClosable={false}
      keyboard={false}
    >
      <Result {...resultProps} />
    </Modal>
  );
};

export default ResultModal;
