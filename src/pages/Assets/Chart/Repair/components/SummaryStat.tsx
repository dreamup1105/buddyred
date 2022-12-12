import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import type { IRepairSummary } from '../../type';

interface IComponentProps {
  summary: IRepairSummary | undefined
}

const SummaryStat: React.FC<IComponentProps> = ({ summary }) => {
  return (
    <>
      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总设备台数"
              value={summary?.equipmentCount}
              valueStyle={{ color: 'default', fontSize: 30 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常设备数"
              value={summary?.normalCount}
              valueStyle={{ color: 'green', fontSize: 30 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="维修总次数"
              value={summary?.abnormalCount}
              valueStyle={{ color: 'red', fontSize: 30 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="维修中"
              value={summary?.repairingCount}
              valueStyle={{ color: 'default', fontSize: 30 }}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default SummaryStat;
