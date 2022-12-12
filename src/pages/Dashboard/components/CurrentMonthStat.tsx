import React from 'react';
import { Row, Col } from 'antd';
import StatNumber from './Number';
import StatTrend from './Trend';
import type { IOrgSummary } from '../type';
import styles from '../index.less';

interface IComponentProps {
  orgSummary: IOrgSummary | undefined;
}

const CurrentMonthStat: React.FC<IComponentProps> = ({ orgSummary }) => {
  return (
    <>
      <Row>
        <Col span={6} className={styles.itemCenterTopStat}>
          <h6>总维修次数</h6>
          <StatNumber num={orgSummary?.totalStat.repairCount ?? 0} />
          <StatTrend />
        </Col>
        <Col span={6} className={styles.itemCenterTopStat}>
          <h6>本月设备维修</h6>
          <StatNumber num={orgSummary?.thisMonthRepairCount ?? 0} />
          <StatTrend
            ratio={orgSummary?.repairChangeRatio}
            count={orgSummary?.repairChange}
            type="Repair"
          />
        </Col>
        <Col span={6} className={styles.itemCenterTopStat}>
          <h6>本月设备保养</h6>
          <StatNumber num={orgSummary?.thisMonthMaintainCount ?? 0} />
          <StatTrend
            ratio={orgSummary?.maintainChangeRatio}
            count={orgSummary?.maintainChange}
            type="Maintain"
          />
        </Col>
        <Col span={6} className={styles.itemCenterTopStat}>
          <h6>本月设备巡检</h6>
          <StatNumber num={orgSummary?.thisMonthInspectionCount ?? 0} />
          <StatTrend
            ratio={orgSummary?.inspectionChangeRatio}
            count={orgSummary?.inspectionChange}
            type="Inspection"
          />
        </Col>
      </Row>
    </>
  );
};

export default CurrentMonthStat;
