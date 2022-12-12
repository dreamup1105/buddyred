import type { ReactNode } from 'react';
import React from 'react';
import { Row, Col } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

interface IComponenetProps {
  visible: boolean;
  leftContent?: ReactNode | undefined;
  rightContent?: ReactNode | undefined;
  [key: string]: any;
}

const Footerbar: React.FC<IComponenetProps> = ({
  visible,
  leftContent,
  rightContent,
  ...restProps
}) => {
  const cls = classnames(styles.container, 'footer-bar');

  return (
    <div
      className={cls}
      style={{
        display: visible ? 'block' : 'none',
      }}
      {...restProps}
    >
      <Row>
        <Col span={12}>{leftContent}</Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          {rightContent}
        </Col>
      </Row>
    </div>
  );
};

export default Footerbar;
