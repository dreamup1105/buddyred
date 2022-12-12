import React from 'react';
import { OrgTypeEnum } from '@/utils/constants';
import useUserInfo from '@/hooks/useUserInfo';

import styles from './index.less';

const renderTitle = (userInfo: CurrentUserInfo | undefined) => {
  if (!userInfo) {
    return '医修库管理系统';
  }
  const orgName = userInfo.org.name;
  switch (userInfo.org.orgType) {
    case OrgTypeEnum.HOSPITAL:
      return `${orgName}固定资产管理系统`;
    case OrgTypeEnum.MAINTAINER:
      return `${orgName}维保管理系统`;
    default:
      return '医修库管理系统';
  }
};

const GlobalHeaderLeft: React.FC = () => {
  const { currentUser } = useUserInfo();
  return (
    <div className={styles.left}>
      <p>{renderTitle(currentUser)}</p>
    </div>
  );
};

export default GlobalHeaderLeft;
