import React from 'react';
import { Tooltip } from 'antd';
import IconFont from '@/components/IconFont';
import { logout } from '@/services/login';
import { stopMessageTask } from '@/utils/ws';
import styles from './index.less';

const Logout: React.FC = () => {
  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      stopMessageTask();
      window.location.replace('/login');
    }
  };

  return (
    <Tooltip placement="bottom" title="退出">
      <a className={styles.action} onClick={onLogout}>
        <IconFont type="icontuichu1" />
      </a>
    </Tooltip>
  );
};

export default Logout;
