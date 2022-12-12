import React from 'react';
import { Card, Typography } from 'antd';
import type { ICardItem } from '../type';
import styles from '../index.less';

const { Paragraph } = Typography;

interface IComponentProps {
  data: ICardItem;
}

const CardItem: React.FC<IComponentProps> = ({ data }) => {
  return (
    <Card className={styles.btCard} title={`${data.groupName}`} hoverable>
      <Paragraph className={styles.paramsRow} ellipsis={{ rows: 2 }}>
        所在科室：{data.departmentName}
      </Paragraph>
      <Paragraph className={styles.paramsRow} ellipsis={{ rows: 2 }}>
        设备总数：{data.equipmentCount}
      </Paragraph>
      <Paragraph className={styles.paramsRow} ellipsis={{ rows: 2 }}>
        自检天数：{data.days}
      </Paragraph>
      <Paragraph className={styles.paramsRow} ellipsis={{ rows: 2 }}>
        主要负责人：{data.headName}
      </Paragraph>
    </Card>
  );
};

export default CardItem;
