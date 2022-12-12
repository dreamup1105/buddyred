import React, { useMemo, Fragment } from 'react';
import { Row, Col } from 'antd';
import type { Part } from '@/pages/Repair/type';
import { accAdd } from '@/utils/utils';
import styles from '../index.less';

interface IComponentProps {
  parts: Part[];
  theme?: 'repair' | 'maintenance';
}

const Parts: React.FC<IComponentProps> = ({ parts = [], theme = 'repair' }) => {
  const partTotalFee = useMemo(() => {
    if (!parts) {
      return 0;
    }
    return parts.reduce((acc, cur) => accAdd(acc, cur.amount), 0);
  }, [parts]);

  return (
    <div
      className={`${styles.partsWrapper} ${
        theme === 'maintenance' ? styles.maintenance : ''
      }`}
    >
      <div
        className={styles.partsTitle}
        style={{
          borderBottom: parts?.length
            ? `1px solid ${theme === 'maintenance' ? '#0d74c6' : '#1890ff'}`
            : 'none',
        }}
      >
        配件信息表
      </div>
      <div className={styles.content}>
        {parts
          ? parts.map((part, index) => (
              <Fragment key={part.customIndex || index}>
                <Row className={styles.row}>
                  <Col
                    span={5}
                    className={`${styles.cell} ${styles.cellLabel}`}
                  >
                    配件名称
                  </Col>
                  <Col span={7} className={styles.cell}>
                    {part.productName}
                  </Col>
                  <Col
                    span={5}
                    className={`${styles.cell} ${styles.cellLabel}`}
                  >
                    配件厂家
                  </Col>
                  <Col span={7} className={styles.cell}>
                    {part.manufacturerName}
                  </Col>
                </Row>
                <Row className={styles.row}>
                  <Col
                    span={5}
                    className={`${styles.cell} ${styles.cellLabel}`}
                  >
                    配件型号
                  </Col>
                  <Col span={7} className={styles.cell}>
                    {part.modelName}
                  </Col>
                  <Col
                    span={5}
                    className={`${styles.cell} ${styles.cellLabel}`}
                  >
                    配件序列号
                  </Col>
                  <Col span={7} className={styles.cell}>
                    {part.sn}
                  </Col>
                </Row>
                <Row className={styles.row}>
                  <Col
                    span={5}
                    className={`${styles.cell} ${styles.cellLabel}`}
                  >
                    配件数量
                  </Col>
                  <Col span={7} className={styles.cell}>
                    {part.quantity}
                  </Col>
                  <Col
                    span={5}
                    className={`${styles.cell} ${styles.cellLabel}`}
                  >
                    配件价格
                  </Col>
                  <Col span={7} className={styles.cell}>
                    {part.amount}
                  </Col>
                </Row>
              </Fragment>
            ))
          : null}
      </div>
      {parts && parts.length ? (
        <div className={styles.fee}>
          <Row>
            <Col span={5} className={`${styles.cell} ${styles.cellLabel}`}>
              配件总价
            </Col>
            <Col
              span={19}
              className={styles.cell}
              style={{ textAlign: 'right', paddingRight: 15 }}
            >
              ¥{partTotalFee}
            </Col>
          </Row>
        </div>
      ) : null}
    </div>
  );
};

export default Parts;
