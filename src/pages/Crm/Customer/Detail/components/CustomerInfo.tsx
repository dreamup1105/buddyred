import React from 'react';
import { Card, Row, Col, Descriptions } from 'antd';
import { ResourcePath } from '@/utils/constants';
import IconFont from '@/components/IconFont';
import type { CustomerDetail } from '../../type';
import styles from '../../index.less';

interface IComponentProps {
  initialData: CustomerDetail | undefined;
}

const CustomerInfo: React.FC<IComponentProps> = ({ initialData }) => {
  return (
    <Card style={{ height: '100%' }} bordered={false}>
      <Row gutter={16}>
        <Col span={8}>
          <div>
            {initialData?.hospitalLogo ? (
              <img
                src={`${ResourcePath}${initialData.hospitalLogo}`}
                style={{ width: '100%' }}
              />
            ) : (
              <IconFont
                type="iconyiyuan"
                className={styles.defaultHospitalIcon}
              />
            )}
          </div>
        </Col>
        <Col span={16}>
          <Descriptions>
            <Descriptions.Item label="联系电话" span={3}>
              {initialData?.tel}
            </Descriptions.Item>
            <Descriptions.Item label="行政区划" span={3}>
              {initialData?.regionAddr}
            </Descriptions.Item>
            <Descriptions.Item label="地址" span={3}>
              {initialData?.addr}
            </Descriptions.Item>
            <Descriptions.Item label="签约设备总数" span={3}>
              {initialData?.agreementTotalCount}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};

export default CustomerInfo;
