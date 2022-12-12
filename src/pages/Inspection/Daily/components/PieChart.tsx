import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { PieChart } from 'echarts/charts';
import { Empty } from 'antd';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import useEcharts from '../hooks/useEcharts';
import type { InspectionStatItem } from '../../type';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
]);

interface IComponentProps {
  loading: boolean;
  statInfo: InspectionStatItem | undefined;
}

const PIEChart: React.FC<IComponentProps> = ({ statInfo, loading }) => {
  const echartsRef = useRef<ReactEChartsCore | null>(null);
  const { echartsOptions, setEchartsData } = useEcharts(echartsRef, loading);

  useEffect(() => {
    if (statInfo) {
      setEchartsData(statInfo);
    }
  }, [statInfo]);

  if (!statInfo) {
    return <Empty description="暂无数据" />;
  }

  return (
    <ReactEChartsCore
      ref={(e) => {
        echartsRef.current = e;
      }}
      echarts={echarts}
      option={echartsOptions}
      notMerge={true}
      lazyUpdate={true}
      theme={'theme_name'}
      style={{
        height: 250,
      }}
    />
  );
};

export default PIEChart;
