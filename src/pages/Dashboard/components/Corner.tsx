import React from 'react';
import styles from '../index.less';

const Corner: React.FC = () => {
  return (
    <>
      <div className={styles.leftTopCorner} />
      <div className={styles.rightTopCorner} />
      <div className={styles.leftBottomCorner} />
      <div className={styles.rightBottomCorner} />
    </>
  );
};

export default Corner;
