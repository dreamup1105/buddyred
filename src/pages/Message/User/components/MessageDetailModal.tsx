import React from 'react';
import { Modal, Descriptions, Button } from 'antd';
import type { IMessageItem } from '../../SentMessage/type';
import { metaKey } from '../type';

interface IComponentProps {
  visible: boolean;
  currentRecord: IMessageItem | undefined;
  onCancel: () => void;
  onViewDetail: (record: IMessageItem | undefined) => void;
}

const MessageDetailModal: React.FC<IComponentProps> = ({
  visible,
  currentRecord,
  onCancel,
  onViewDetail,
}) => {
  return (
    <Modal
      title="消息详情"
      width={800}
      visible={visible}
      onCancel={onCancel}
      footer={
        <>
          {/* 仅签约信息显示详情按钮 */}
          {currentRecord?.metaKey == metaKey.MAINTAIN_EXPIRE && (
            <Button type="primary" onClick={() => onViewDetail(currentRecord)}>
              详情
            </Button>
          )}
          <Button onClick={onCancel}>关闭</Button>
        </>
      }
    >
      <Descriptions bordered>
        <Descriptions.Item label="标题" span={2}>
          {currentRecord?.title ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="发送时间">
          {currentRecord?.createdTime ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="内容" span={3}>
          {currentRecord?.content ?? '-'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default MessageDetailModal;
