import React, { useEffect, useRef, useState } from 'react';
import { Card, Select } from 'antd';
import * as echarts from 'echarts/core';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import useEcharts from './hooks/useEcharts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';

echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, PieChart, BarChart, CanvasRenderer]);

const FalutEcharts: React.FC = () => {
  const repairFeeChartRef = useRef<ReactEChartsCore | null>(null);
  const [trendChartLoading, setTrendChartLoading] = useState(false);
  const { options: repairFeeChartOptions, setEchartsData: setRepairFeeChart } = useEcharts(repairFeeChartRef, trendChartLoading, 'Fee');

  const getEchartsData = () => {
    setTrendChartLoading(true);
    setRepairFeeChart({
      xAxis: ['五官科','公共卫生科','内科','外科','妇产科','放射科','消毒供应中心','精神心理科','设备科'],
      yAxis: [1,2,4,5,6,7,8,1,3]
    })
    setTrendChartLoading(false);
  }

  useEffect(() => {
    getEchartsData();
  }, [])

  return (
    <>
      <Card
        title="设备故障统计一览"
        style={{ marginBottom: 25 }}
        extra={
          <Select defaultValue="Hospital" style={{width: '200px'}}>
            <Select.Option value='Hospital'>医院</Select.Option>
            <Select.Option value='dept'>科室</Select.Option>
          </Select>
        }
      >
        <ReactEChartsCore
          ref={(e) => { repairFeeChartRef.current = e }}
          echarts={echarts}
          option={repairFeeChartOptions}
          notMerge={true}
          lazyUpdate={true}
          theme={"theme_name"}
        />
      </Card>

    </>
  );
};

export default FalutEcharts;
