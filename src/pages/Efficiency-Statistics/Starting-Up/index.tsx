import React from 'react';
import { Tabs } from 'antd';
import useHOST from '@/hooks/useHOST';
const { TabPane } = Tabs;
import { PageContainer } from '@ant-design/pro-layout';
import Company from './components/company';
import Department from './components/department';
import Engineer from './components/engineer';
import Hospital from './components/hospital';
import styles from './index.less';

// 开机率统计页面
const EfficiencyStartUpPage: React.FC = () => {
  const { isHost } = useHOST();
  return (
    <PageContainer>
      {isHost ? (
        <Tabs
          defaultActiveKey="1"
          type="card"
          size="middle"
          className={styles.efficiencyStartUp}
        >
          <TabPane tab="全院开机率" key="hospital">
            <Hospital />
          </TabPane>
          <TabPane tab="科室开机率" key="department">
            <Department />
          </TabPane>
          <TabPane tab="维修公司开机率" key="company">
            <Company type="company" />
          </TabPane>
        </Tabs>
      ) : (
        <Engineer type="engineer" />
      )}
    </PageContainer>
  );
};

export default EfficiencyStartUpPage;
