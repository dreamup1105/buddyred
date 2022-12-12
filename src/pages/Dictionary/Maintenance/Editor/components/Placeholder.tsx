import React from 'react';
import styles from '../index.less';

interface IComponentProps {
  title: string;
}

const Placeholder: React.FC<IComponentProps> = ({ title }) => {
  return <div className={styles.placeholder}>{title}</div>;
};

export default Placeholder;
