import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form } from 'antd';
import useMount from '@/hooks/useMount';
import useUserInfo from '@/hooks/useUserInfo';
import * as echarts from 'echarts/core';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { momentToString, MonthFormat } from '@/utils/utils';
import SearchForm from '../Repair/components/SearchForm';
import useEcharts from './hooks/useEcharts';
import { fetchMaintenanceTrendStat, fetchMaintenanceSummaryStat } from '../service';

echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, PieChart, BarChart, CanvasRenderer]);

const EquipmentMaintenanceChartPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const orgId = currentUser?.org.id;
  const [searchForm] = Form.useForm();
  const countChartRef = useRef<ReactEChartsCore | null>(null);
  const distributionChartRef = useRef<ReactEChartsCore | null>(null);
  const [countChartLoading, setCountChartLoading] = useState(false);
  const [distributionLoading, setDistributionLoading] = useState(false);
  const { options: countChartOptions, setEchartsData: setCountChartData } = useEcharts(countChartRef, countChartLoading, 'Count');
  const { options: distributionChartOptions, setEchartsData: setDistributionChartData } = useEcharts(distributionChartRef, distributionLoading, 'Distribution');
  const defaultSearchFormValues = {
    dimension: '1',
    departmentIds: currentUser?.primaryDepartment ? [currentUser.primaryDepartment.id] : [],
  }

  const loadTrendStat = async () => {
    const { departmentIds = [], dimension, month } = searchForm.getFieldsValue();
    try {
      setCountChartLoading(true);

      const formData: any = {
        orgId: orgId!,
        departmentIds,
        dimension: Number(dimension),
      }

      if (month?.length === 2) {
        formData.startTime = momentToString(month[0], MonthFormat);
        formData.endTime = momentToString(month[1], MonthFormat);
      }

      const { code, data } = await fetchMaintenanceTrendStat(formData);

      if (code === 0) {
        const xAxis = Object.keys(data);
        const initCountBar: {name: string; value: number; }[] = [];
        const finishedCountBar: {name: string; value: number; }[] = [];
        const finishedRateLine: {name: string; value: number; }[] = [];
        xAxis.forEach(key => {
          initCountBar.push({
            name: '发起保养数',
            value: data[key].createMaintainCount,
          });
          finishedCountBar.push({
            name: '保养完成数',
            value: data[key].finishMaintainCount,
          });
          finishedRateLine.push({
            name: '保养完成率',
            value: data[key].finishRatio,
          });
        });
        setCountChartData({
          xAxis,
          initCountBar,
          finishedCountBar,
          finishedRateLine,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCountChartLoading(false);
    }
  }

  const loadDistributionStat = async () => {
    setDistributionLoading(true);
    try {
      const { departmentIds = [] } = searchForm.getFieldsValue();
      const { code, data } = await fetchMaintenanceSummaryStat(orgId!, departmentIds);
      if (code === 0) {
        const legend = data.map(i => i.typeName);
        const pieData = data.map(item => ({
          name: item.typeName,
          value: item.maintainCount,
        }));
        setDistributionChartData(
          {
            legend,
            pieData,
          }
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDistributionLoading(false);
    }
  }

  const onFormValuesChange = () => {
    loadDistributionStat();
    loadTrendStat();
  } 

  const init = () => {
    if (!orgId) {
      return;
    }
    searchForm.setFieldsValue(defaultSearchFormValues);
    loadDistributionStat();
    loadTrendStat();
  }

  useMount(init);

  return (
    <PageContainer>
      <Card
        title="设备保养趋势"
        style={{ marginBottom: 25 }}
        extra={<SearchForm onValuesChange={onFormValuesChange} form={searchForm} />} 
      >
        <ReactEChartsCore
          ref={(e) => { countChartRef.current = e }}
          echarts={echarts}
          option={countChartOptions}
          notMerge={true}
          lazyUpdate={true}
          theme={"theme_name"}
          // style={{
          //   height: isEmpty ? 0 : 700,
          // }}
        />
      </Card>
      <Card
        title="设备保养分布"
        style={{ marginBottom: 25 }}
      >
        <ReactEChartsCore
          ref={(e) => { distributionChartRef.current = e }}
          echarts={echarts}
          option={distributionChartOptions}
          notMerge={true}
          lazyUpdate={true}
          theme={"theme_name"}
        />
      </Card>
    </PageContainer>
  )
}

export default EquipmentMaintenanceChartPage;
