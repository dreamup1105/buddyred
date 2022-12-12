import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import type { InspectionStatItem } from '../../type';

interface IComponentProps {
  statInfo: InspectionStatItem | undefined;
}

const OverallStat: React.FC<IComponentProps> = ({ statInfo }) => {
  return (
    <>
      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="已巡检科室数"
              value={statInfo?.alreadyInspectionDepartmentCount}
              valueStyle={{ color: 'default', fontSize: 30 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="未巡检科室数"
              value={statInfo?.notInspectionDepartmentCount}
              valueStyle={{ color: 'default', fontSize: 30 }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="正常数量"
              value={statInfo?.normalCount}
              valueStyle={{ color: 'green', fontSize: 30 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="异常数量"
              value={statInfo?.abnormalCount}
              valueStyle={{ color: 'red', fontSize: 30 }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OverallStat;
