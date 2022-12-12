import React from 'react';
import { Row, Col } from 'antd';
import styles from '../index.less';

interface IComponentProps {
  total: number | undefined; // 设备总数
  priceTotal: number | undefined; // 设备总额
}

const EquipmentTableTitle: React.FC<IComponentProps> = ({
  total,
  priceTotal
}) => {
  return (
    <Row style={{ height: '64px' }} className={styles.equipmentTableTitle}>
      <Col span={6}><h3>固定资产列表</h3></Col>
      <Col span={18} style={{ fontWeight: 'normal' }}>
      (设备总额：<span style={{ marginRight: 10 }}>{ priceTotal?.toLocaleString() }</span> 设备总数：<span>{ total }</span>)      </Col>
    </Row>
  )
}

export default EquipmentTableTitle;
