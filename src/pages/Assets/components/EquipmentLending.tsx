import React from 'react';
import {
  ArrowRightOutlined,
} from '@ant-design/icons';
import { Timeline, Empty } from 'antd';
import type { ILendingItem } from '../type';
import styles from '../index.less';

interface IComponentProps {
  initialData: ILendingItem[] | undefined;
}

const EquipmentTimelineDrawer: React.FC<IComponentProps> = ({ 
  initialData = [], 
}) => {
  return initialData?.length 
  ? <Timeline mode="left">
    {
      (initialData as ILendingItem[]).map((item, index) => (
        <Timeline.Item key={index.toString()}>
          <div className={styles.timelineTitle}>【{item.orderStatus}】{item.orderType || '-'}</div>
          <div className={styles.timeSubtitle}>
            {item.sourceDeptName || ''}
            <ArrowRightOutlined style={{marginRight: '10px', marginLeft: '10px'}} />
            {item.targetDeptName || '-'}</div>
          <div className={styles.timelineTime}>{ item.createTime }</div>
        </Timeline.Item>
      ))
    }</Timeline> 
  : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
}

export default EquipmentTimelineDrawer;
