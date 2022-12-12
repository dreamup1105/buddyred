import React, { useMemo } from 'react';
import { Drawer, Timeline, Spin, Empty, Card } from 'antd';
import type { ITimelineItem, ITableListItem } from '../type';
import type { ITaskTimelineItem, ITaskItem } from '@/pages/Repair/Management/type';
import type {  IMaintenanceTaskItem } from '@/pages/Maintenance/type';
import { EventTypeTextEnum } from '../type';
import styles from '../index.less';

interface IComponentProps {
  params?: {
    currentEquipment?: ITableListItem | undefined;
    currentTask?: ITaskItem | IMaintenanceTaskItem | undefined;
  }
  initialData: ITimelineItem[] | ITaskTimelineItem[] | undefined;
  visible: boolean;
  loading: boolean;
  type?: 'task' | 'equipment';
  onClose: () => void;
  openMode?: 'drawer' | 'normal'
}

const EquipmentTimelineDrawer: React.FC<IComponentProps> = ({ 
  visible, 
  initialData = [], 
  loading, 
  params,
  type = 'equipment',
  openMode = 'drawer',
  onClose 
}) => {
  const cardTitle = useMemo(() => {
    switch (type) {
      case 'equipment': return `${params?.currentEquipment?.name}维保历史`;
      case 'task': return `${params?.currentTask?.equipmentName}操作历史`;
      default: return '';
    }
  }, [type, params?.currentEquipment?.name, params?.currentTask?.equipmentName]);
  let timelineDom;

  switch (type) {
    case 'equipment':
      timelineDom = (<>
        {
          initialData?.length 
          ? <Timeline mode="left">
            {
              (initialData as ITimelineItem[]).map(item => (
                <Timeline.Item key={item.id}>
                  <div className={styles.timelineTitle}>【{item.result}】{item.eventType ? EventTypeTextEnum[item.eventType] : '-'}</div>
                  <div className={styles.timelineTime}>{ item.eventTime }</div>
                </Timeline.Item>
              ))
            }</Timeline> 
          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
      </>);
      break;
    case 'task': timelineDom = <>
        {
          initialData?.length 
            ? <Timeline mode="left">
              {
                (initialData as ITaskTimelineItem[]).map(item => (
                  <Timeline.Item key={item.id}>
                    <div className={styles.timelineTitle}>【{ item.operation }】{ item.createEmployeeName }</div>
                    <div className={styles.timelineTime}>{ item.createTime }</div>
                  </Timeline.Item>
                ))
              }</Timeline> 
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
      </>; 
      break;
    default: timelineDom = <></>; break;        
  }

  if (openMode === 'drawer') {
    return (
      <Drawer visible={visible} placement="right" onClose={onClose} width={450}>
        <Card title={cardTitle} style={{ marginTop: 20 }} bordered={false}>
          <Spin spinning={loading}>
            {timelineDom}
          </Spin>
        </Card>
      </Drawer>
    )
  }

  return timelineDom;
}

export default EquipmentTimelineDrawer;
