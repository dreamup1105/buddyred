import React from 'react';
import styles from '../index.less';

interface IComponentProps {
  orgName: string | undefined;
}

const DashboardHeader: React.FC<IComponentProps> = ({ orgName }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{orgName}</h1>
      <h6>YIXIUKU</h6>
    </div>
  );
};

export default DashboardHeader;
