import React from 'react';
import { Spin, Modal, Button, Descriptions } from 'antd';
import { GenderEnum } from '@/utils/constants';
import type { EmployeeDetail } from '../type';

interface IComponentProps {
  loading: boolean;
  visible: boolean;
  initialDetail: EmployeeDetail | undefined;
  onCancel: () => void;
}

const getGenderText = (gender: Gender | undefined): string => {
  switch (gender) {
    case GenderEnum.UNKNOWN:
      return '未知';
    case GenderEnum.MALE:
      return '男';
    case GenderEnum.FEMALE:
      return '女';
    default:
      return '';
  }
};

const Detail: React.FC<IComponentProps> = ({
  loading,
  visible,
  initialDetail,
  onCancel,
}) => (
  <Modal
    title="人员详情"
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
        <Descriptions.Item label="姓名">
          {initialDetail?.name}
        </Descriptions.Item>
        <Descriptions.Item label="员工编号">
          {initialDetail?.employeeNo}
        </Descriptions.Item>
        <Descriptions.Item label="证件号">
          {initialDetail?.certificateNo}
        </Descriptions.Item>
        <Descriptions.Item label="电话">
          {initialDetail?.phone}
        </Descriptions.Item>
        <Descriptions.Item label="邮箱">
          {initialDetail?.email}
        </Descriptions.Item>
        <Descriptions.Item label="性别">
          {initialDetail && getGenderText(initialDetail?.sex)}
        </Descriptions.Item>
        <Descriptions.Item label="职位">
          {initialDetail?.position}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {initialDetail?.createdTime}
        </Descriptions.Item>
        <Descriptions.Item label="备注">
          {initialDetail?.description}
        </Descriptions.Item>
      </Descriptions>
    </Spin>
  </Modal>
);

export default Detail;
