import React from 'react';
import { Card, Typography } from 'antd';
import { history } from 'umi';
import type { ICardItem } from '../type';
import styles from '../index.less';

const { Paragraph } = Typography;

interface IComponentProps {
  data: ICardItem;
}

const CardItem: React.FC<IComponentProps> = ({ data }) => {
  const actions = [
    <a
      key="consumption"
      onClick={() =>
        history.push(`/energy/instant?departmentIds=${data.departmentId}`)
      }
    >
      瞬时电压电流
    </a>,
    <a
      key="instant"
      onClick={() =>
        history.push(
          `/energy/power-consumption?departmentIds=${data.departmentId}`,
        )
      }
    >
      科室耗电明细
    </a>,
  ];
  return (
    <Card
      className={styles.btCard}
      title={`${data.deptName}（${data.totalDeptRto * 100}%）`}
      actions={actions}
      hoverable
    >
      <Paragraph className={styles.paramsRow} ellipsis={{ rows: 2 }}>
        设备总数：{data.deptTotalEquipment}
      </Paragraph>
      <Paragraph className={styles.paramsRow} ellipsis={{ rows: 2 }}>
        已开机数：{data.deptOpenEquipment}
      </Paragraph>
      <Paragraph className={styles.paramsRow} ellipsis={{ rows: 2 }}>
        故障设备：{data.deptFaultEquipment}
      </Paragraph>
      <Paragraph className={styles.paramsRow} ellipsis={{ rows: 2 }}>
        未开机数：{data.deptNoOpeEquipment}
      </Paragraph>
      <Paragraph className={styles.paramsRow} ellipsis={{ rows: 2 }}>
        瞬时耗电：{data.momentPower} kw
      </Paragraph>
      <Paragraph className={styles.paramsRow} ellipsis={{ rows: 2 }}>
        总&nbsp;&nbsp;耗&nbsp;&nbsp;电：{data.totalPowerConsumption} kw/h
      </Paragraph>
    </Card>
  );
};

export default CardItem;
