import React from 'react';
import styles from '../index.less';

interface IComponentProps {
  num: number;
}

const StatNumber: React.FC<IComponentProps> = ({ num }) => {
  const chars = num.toString().split('');

  return (
    <>
      {chars.map((char, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className={styles.statNumberWrapper}>
          {char}
        </div>
      ))}
    </>
  );
};

export default StatNumber;
