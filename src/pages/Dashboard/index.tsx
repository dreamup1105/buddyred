import React, { useRef, useState } from 'react';
import useMount from '@/hooks/useMount';
import * as echarts from 'echarts/core';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import DashboardHeader from './components/Header';
import DashboardLeft from './components/Left';
import DashboardRight from './components/Right';
import DashboardCenter from './components/Center';
import { fetchOrgSummary } from './service';
import type { IOrgSummary } from './type';
import useUserInfo from '@/hooks/useUserInfo';
import useScale from './hooks/useScale';
import styles from './index.less';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  PieChart,
  BarChart,
  CanvasRenderer,
]);

const DashboardPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const [orgSummary, setOrgSummary] = useState<IOrgSummary>();
  const containerRef = useRef<HTMLDivElement>(null);
  useScale(containerRef);

  const init = async () => {
    if (!currentUser?.org.id) {
      return;
    }
    document.title = `${currentUser.org.name}-数据大屏展示`;
    try {
      const { code, data } = await fetchOrgSummary(currentUser?.org.id);
      if (code === 0) {
        setOrgSummary(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useMount(init);

  return (
    <div ref={containerRef} className={styles.dashboardContainer}>
      <DashboardHeader orgName={currentUser?.org.name} />
      <div className={styles.contentContainer}>
        <DashboardLeft orgSummary={orgSummary} />
        <DashboardCenter orgSummary={orgSummary} />
        <DashboardRight />
      </div>
    </div>
  );
};

export default DashboardPage;
