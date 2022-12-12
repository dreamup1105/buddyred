import React from 'react';
import Logo from '@/assets/logo.png';
import styles from '../../index.less';

const Title: React.FC = () => {
  return (
    <div className={styles.titleWrapper}>
      <div className={styles.logoWrapper}>
        <img src={Logo} alt="logo" />
      </div>
      <div className={styles.nameWrapper}>
        <h2>医疗设备信息管理平台</h2>
        <h3>MEDICAL EQUIPMENT INFORMATION MANAGEMENT PLATFORM</h3>
      </div>
    </div>
  );
};

export default Title;
