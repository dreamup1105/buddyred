import React from 'react';
import { useModel } from 'umi';
import useMount from '@/hooks/useMount';
import WelcomeLeft from '@/assets/welcome-left.png';
import WelcomeRight from '@/assets/welcome-right.png';
import styles from './index.less';

const WelcomePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  useMount(() => {
    document.title = '欢迎使用医修库管理系统';
  });

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h5>尊敬的{initialState?.currentUser?.employee?.name}</h5>
        <img src={WelcomeLeft} />
      </div>
      <div className={styles.right}>
        <img src={WelcomeRight} />
      </div>
    </div>
  );
};

export default WelcomePage;
