import React from 'react';
import { Modal, Button, Descriptions, Spin } from 'antd';
import { OrgTypeTextEnum, OrgStatusEnum } from '@/utils/constants';
import type { OrgDetail } from '../type';

interface ComponentProps {
  loading: boolean;
  visible: boolean;
  initialDetail: OrgDetail | undefined;
  onCancel: () => void;
}

const Detail: React.FC<ComponentProps> = ({
  loading,
  visible,
  initialDetail,
  onCancel,
}) => {
  return (
    <Modal
      title="机构详情"
      visible={visible}
      width={800}
      onCancel={() => onCancel()}
      footer={[
        <Button key="close" onClick={() => onCancel()}>
          关闭
        </Button>,
      ]}
      forceRender
    >
      <Spin spinning={loading}>
        <Descriptions>
          <Descriptions.Item label="机构名称">
            {initialDetail?.name}
          </Descriptions.Item>
          <Descriptions.Item label="手机号">
            {initialDetail?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {initialDetail?.email}
          </Descriptions.Item>
          <Descriptions.Item label="机构类型">
            {initialDetail && OrgTypeTextEnum[initialDetail?.orgType]}
          </Descriptions.Item>
          <Descriptions.Item label="机构类型">
            {initialDetail && OrgStatusEnum[initialDetail?.status]}
          </Descriptions.Item>
          <Descriptions.Item label="统一社会信用代码">
            {initialDetail?.uscc}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {initialDetail?.createdTime}
          </Descriptions.Item>
          <Descriptions.Item label="地址">
            {initialDetail?.address}
          </Descriptions.Item>
          <Descriptions.Item label="备注">
            {initialDetail?.description}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default Detail;
