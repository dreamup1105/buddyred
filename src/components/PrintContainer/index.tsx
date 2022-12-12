import React from 'react';
import styles from './index.less';

const PrintContainer: React.FC = (props: any) => {
  return <div className={styles.printContainer}>{props.children}</div>;
};

export default PrintContainer;
