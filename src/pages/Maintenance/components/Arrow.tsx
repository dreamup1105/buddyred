import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import styles from '../index.less';

interface IComponentProps {
  type?: 'default' | 'transparent';
}

const Arrow: React.FC<IComponentProps> = ({ type = 'default' }) => {
  return (
    <div
      className={`${styles.arrow} ${
        type === 'transparent' ? styles.transparent : ''
      }`}
    >
      <RightOutlined />
      <RightOutlined style={{ marginLeft: -8 }} />
    </div>
  );
};

export default Arrow;
