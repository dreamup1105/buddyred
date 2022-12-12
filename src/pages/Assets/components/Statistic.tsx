import type { CSSProperties } from 'react';
import React from 'react';
import { Row, Col, Statistic, Card } from 'antd';

const cardStyle: CSSProperties = {
  border: '1px solid #f0f0f0',
  textAlign: 'center',
};

const StatisticComponent: React.FC = () => {
  return (
    <Row gutter={50} style={{ width: '60%', margin: '0 auto' }}>
      <Col span={8}>
        <Card style={cardStyle}>
          <Statistic title="设备总数" value={123} />
        </Card>
      </Col>
      <Col span={8}>
        <Card style={cardStyle}>
          <Statistic title="设备总价值" value={123} />
        </Card>
      </Col>
      <Col span={8}>
        <Card style={cardStyle}>
          <Statistic title="高值设备价值" value={123} />
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticComponent;
