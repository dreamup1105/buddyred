import React from 'react';
import { Row, Col } from 'antd';
import styles from '../index.less';
import type { IFetchStatistic } from '../type';
import Load from '@/assets/energy/load.png';
import Repair from '@/assets/energy/repair.png';
import Standby from '@/assets/energy/standby.png';
import Working from '@/assets/energy/working.png';

interface IComponentProps {
  data: IFetchStatistic;
}

const Statistic: React.FC<IComponentProps> = ({ data }) => {
  return (
    <Row className={styles.equipmentStatistics}>
      <Col span={6} style={{ textAlign: 'center' }}>
        <img src={Load} className={styles.equipmentStatusIcon} />
        <div className={styles.equipmentStatisticsValue}>
          {data.momentPower ?? 0}kw
        </div>
        <div>设备负荷</div>
      </Col>
      <Col span={6} style={{ textAlign: 'center' }}>
        <img src={Working} className={styles.equipmentStatusIcon} />
        <div className={styles.equipmentStatisticsValue}>
          {data.deptOpenEquipment ?? 0}
        </div>
        <div>已开机数</div>
      </Col>
      <Col span={6}>
        <img src={Standby} className={styles.equipmentStatusIcon} />
        <div className={styles.equipmentStatisticsValue}>
          {data.deptNoOpeEquipment ?? 0}
        </div>
        <div>未开机数</div>
      </Col>
      <Col span={6} style={{ textAlign: 'center' }}>
        <img src={Repair} className={styles.equipmentStatusIcon} />
        <div className={styles.equipmentStatisticsValue}>
          {data.deptFaultEquipment ?? 0}
        </div>
        <div>故障设备</div>
      </Col>
    </Row>
  );
};

export default Statistic;
