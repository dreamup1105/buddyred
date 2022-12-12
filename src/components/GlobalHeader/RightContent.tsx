import React from 'react';
import Avatar from './AvatarDropdown';
import MoveApp from './MoveApp';
import CustomerSwitch from './CustomerSwitch';
import NoticeIcon from './NoticeIcon';
import Logout from './Logout';
import styles from './index.less';

const GlobalHeaderRight: React.FC = () => {
  return (
    <div className={styles.right}>
      <MoveApp />
      <NoticeIcon />
      <Logout />
      <CustomerSwitch />
      <Avatar />
    </div>
  );
};

export default GlobalHeaderRight;
