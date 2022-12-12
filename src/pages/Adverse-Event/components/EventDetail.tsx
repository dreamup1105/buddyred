import React from 'react';
import { Modal, Form, Descriptions, Tag } from 'antd';
import type { IAdverseEventDetailItem } from '../type';
import type { OperationType } from '../type';

interface IComponentProps {
  initialValues: IAdverseEventDetailItem | undefined;
  visible: boolean;
  operation: OperationType;
  onAfterCancel: () => void;
}

const EventDetailModal: React.FC<IComponentProps> = ({
  visible,
  initialValues,
  onAfterCancel,
}) => {
  const [form] = Form.useForm();

  const onModalCancel = () => {
    form.resetFields();
    onAfterCancel();
  };

  return (
    <Modal
      title="详情"
      visible={visible}
      okText="保存"
      cancelText="取消"
      onCancel={onModalCancel}
      maskClosable={false}
      width={800}
      footer={null}
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="报告日期">
          {initialValues?.reportTime}
        </Descriptions.Item>
        <Descriptions.Item label="事件发生日期">
          {initialValues?.happenTime}
        </Descriptions.Item>
        <Descriptions.Item label="设备名称" span={2}>
          {initialValues?.equipNameNew}
        </Descriptions.Item>
        <Descriptions.Item label="在场人员或相关科室" span={2}>
          {initialValues?.siteSituation}
        </Descriptions.Item>
        <Descriptions.Item label="事件发生场所" span={2}>
          {initialValues?.happenPlace}
        </Descriptions.Item>
        <Descriptions.Item label="不良后果" span={2}>
          <div style={{ width: '500px' }}>{initialValues?.adverseResult}</div>
        </Descriptions.Item>
        <Descriptions.Item label="不良事件类别" span={2}>
          <div style={{ width: '500px' }}>
            {initialValues?.eventTypeList.map((i) => (
              <Tag key={i} style={{ marginRight: '5px' }}>
                {i}
              </Tag>
            ))}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="不良事件等级" span={2}>
          {initialValues?.eventLevel}
        </Descriptions.Item>
        <Descriptions.Item label="当事人类别">
          {initialValues?.personType}
        </Descriptions.Item>
        <Descriptions.Item label="当事人职称">
          {initialValues?.personTitle}
        </Descriptions.Item>
        <Descriptions.Item label="当事人工作年限" span={2}>
          {initialValues?.personWorkYears}
        </Descriptions.Item>
        <Descriptions.Item label="报告人" span={2}>
          {initialValues?.employeeName}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default EventDetailModal;
