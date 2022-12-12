import React from 'react';
import Logo from '@/assets/logo-left.png';
import Title from '@/assets/logo-right.png';
import styles from './index.less';

/**
 * 对标ProTable的操作栏
 * @param param0
 */
const MenuHeader: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <img src={Logo} alt="logo" className="logo-left" />
        <img src={Title} alt="医修库" className="logo-right" />
      </div>
    </div>
  );
};

export default MenuHeader;
