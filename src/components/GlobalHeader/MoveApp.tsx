import React from 'react';
import useUserInfo from '@/hooks/useUserInfo';
import { Dropdown, Image } from 'antd';
import { AndroidOutlined } from '@ant-design/icons';
import styles from './index.less';
import appPro from '@/assets/android/yxk_bjyixiu_app_pro.png';
import ipadPro from '@/assets/android/yxk_bjyixiu_ipad_pro.png';

const NoticeIcon: React.FC = () => {
  const { currentUser } = useUserInfo();
  const isMaintainer = currentUser?.isMaintainer; // 是否为工程师
  const appList = [
    {
      key: '0',
      isShow: true,
      label: 'app端',
      src: appPro,
    },
    // 只有工程师端才有ipad
    {
      key: '1',
      isShow: isMaintainer,
      label: 'ipad端',
      src: ipadPro,
    },
  ];

  const renderMessagePopoverContent = () => {
    return (
      <div
        style={{ width: 400, zIndex: 1000 }}
        className={styles.moveAppWrapper}
      >
        {appList.map(
          (item) =>
            item.isShow && (
              <div key={item.key} className={styles.moveAppItem}>
                <Image width={150} src={item.src} />
                <div>{item.label}</div>
              </div>
            ),
        )}
        <div className={styles.moveAppTip}>
          （此二维码仅供安卓用户下载，苹果用户下载请到苹果应用商店）
        </div>
      </div>
    );
  };

  return (
    <Dropdown placement="bottomCenter" overlay={renderMessagePopoverContent}>
      <span className={styles.action} style={{ fontSize: 20 }}>
        <AndroidOutlined style={{ fontSize: 20 }} />
      </span>
    </Dropdown>
  );
};

export default NoticeIcon;
