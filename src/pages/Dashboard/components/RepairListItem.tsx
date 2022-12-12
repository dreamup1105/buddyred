import React from 'react';
import type { ITaskItem } from '@/pages/Repair/Management/type';
import { ResourcePath } from '@/utils/constants';
import DefaultImage from '@/assets/upload_equipment.png';
import { RepairOrderStatusConfig } from '@/pages/Maintenance/type';
import { Row, Col, Tag } from 'antd';
import styles from '../index.less';

interface IComponentProps {
  record: ITaskItem & { res: string | undefined };
}

const RepairListItem: React.FC<IComponentProps> = ({ record }) => {
  const statusMap = RepairOrderStatusConfig.get(record.status);
  return (
    <div className={styles.listItem}>
      <img
        src={record.res ? `${ResourcePath}${record.res}-100` : DefaultImage}
      />
      <div className={styles.content}>
        <Row style={{ marginBottom: 8 }}>
          <Col span={18} className={styles.departmentName}>
            {record.departmentName}
          </Col>
          <Col
            span={6}
            style={{ paddingTop: 6, textAlign: 'right', fontSize: 18 }}
          >
            {statusMap?.label ? (
              <Tag
                color={statusMap.badge}
                style={{
                  padding: 5,
                  fontWeight: 700,
                  fontSize: 20,
                  borderRadius: 4,
                }}
              >
                {statusMap?.label}
              </Tag>
            ) : (
              '-'
            )}
          </Col>
        </Row>
        <Row style={{ marginBottom: 8 }}>
          <Col span={24} className={styles.equipmentName}>
            {record.equipNameNew}
          </Col>
        </Row>
        <Row>
          <Col span={6}>{record.initPersonName}</Col>
          <Col span={18} style={{ textAlign: 'right' }}>
            {record.initTime}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RepairListItem;
