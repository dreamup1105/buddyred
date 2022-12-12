import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form } from 'antd';
import useMount from '@/hooks/useMount';
import useUserInfo from '@/hooks/useUserInfo';
import * as echarts from 'echarts/core';
import { LineChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { momentToString, MonthFormat } from '@/utils/utils';
import SearchForm from './components/SearchForm';
import SummaryStat from './components/SummaryStat';
import Top20Table from './components/Top20Table';
import useEcharts from './hooks/useEcharts';
import { fetchRepairSummaryStat, fetchRepairTrendStat } from '../service';
import type { IRepairSummary } from '../type';

echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, PieChart, CanvasRenderer]);

const EquipmentRepairChartPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const orgId = currentUser?.org.id;
  const [searchForm] = Form.useForm();
  const repairFeeChartRef = useRef<ReactEChartsCore | null>(null);
  const repairCountChartRef = useRef<ReactEChartsCore | null>(null);
  const repairFaultRateChartRef = useRef<ReactEChartsCore | null>(null);
  const [trendChartLoading, setTrendChartLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const { options: repairFeeChartOptions, setEchartsData: setRepairFeeChart } = useEcharts(repairFeeChartRef, trendChartLoading, 'Fee');
  const { options: repairCountChartOptions, setEchartsData: setRepairCountChart } = useEcharts(repairCountChartRef, trendChartLoading, 'Count');
  const { options: repairFaultRateChartOptions, setEchartsData: setRepairFaultRateChart } = useEcharts(repairFaultRateChartRef, summaryLoading, 'FaultRate');
  const defaultSearchFormValues = {
    dimension: '1',
    departmentIds: currentUser?.primaryDepartment ? [currentUser.primaryDepartment.id] : [],
  }
  const [summary, setSummary] = useState<IRepairSummary>();

  const loadRepairTrendStat = async () => {
    const { departmentIds = [], dimension, month } = searchForm.getFieldsValue();
    console.log('month: ', month);
    setTrendChartLoading(true);
    try {
      const formData: any = {
        orgId: orgId!,
        departmentIds,
        dimension: Number(dimension),
      };

      if (month?.length === 2) {
        formData.startTime = momentToString(month[0], MonthFormat);
        formData.endTime = momentToString(month[1], MonthFormat);
      }

      const { code, data } = await fetchRepairTrendStat(formData);

      if (code === 0) {
        const xAxis = Object.keys(data);
        const feeYAxis = xAxis.map(key => data[key].repairFee);
        const countYAxis = xAxis.map(key => data[key].repairCount);        

        setRepairFeeChart({
          xAxis,
          yAxis: feeYAxis,
        });

        setRepairCountChart({
          xAxis,
          yAxis: countYAxis,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTrendChartLoading(false);
    }
  }

  const loadRepairSummaryStat = async () => {
    setSummaryLoading(true);
    try {
      const { departmentIds = [] } = searchForm.getFieldsValue();
      const { code, data } = await fetchRepairSummaryStat(orgId!, departmentIds);
      if (code === 0) {
        setSummary(data);
        const legend = Object.keys(data.abnormalRatio);
        const pieData = legend.map(key => ({
          name: key,
          value: data.abnormalRatio[key],
        }));
        setRepairFaultRateChart({
          legend,
          pieData,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSummaryLoading(false);
    }
  }

  const onFormValuesChange = () => {
    loadRepairTrendStat();
    loadRepairSummaryStat();
  } 

  const init = () => {
    if (!orgId) {
      return;
    }
    searchForm.setFieldsValue(defaultSearchFormValues);
    loadRepairTrendStat();
    loadRepairSummaryStat();
  }

  useMount(init);

  return (
    <PageContainer>
      <SummaryStat summary={summary}/>
      <Card
        title="维修费用趋势一览"
        style={{ marginBottom: 25 }}
        extra={<SearchForm onValuesChange={onFormValuesChange} form={searchForm} />} 
      >
        <ReactEChartsCore
          ref={(e) => { repairFeeChartRef.current = e }}
          echarts={echarts}
          option={repairFeeChartOptions}
          notMerge={true}
          lazyUpdate={true}
          theme={"theme_name"}
          // style={{
          //   height: isEmpty ? 0 : 700,
          // }}
        />
      </Card>
      <Card
        title="维修次数趋势一览"
        style={{ marginBottom: 25 }}
      >
        <ReactEChartsCore
          ref={(e) => { repairCountChartRef.current = e }}
          echarts={echarts}
          option={repairCountChartOptions}
          notMerge={true}
          lazyUpdate={true}
          theme={"theme_name"}
          // style={{
          //   height: isEmpty ? 0 : 700,
          // }}
        />
      </Card>
      <Card
        title="故障率占比统计"
        style={{ marginBottom: 25 }}
      >
        <ReactEChartsCore
          ref={(e) => { repairFaultRateChartRef.current = e }}
          echarts={echarts}
          option={repairFaultRateChartOptions}
          notMerge={true}
          lazyUpdate={true}
          theme={"theme_name"}
        />
      </Card>
      <Card
        title="设备故障次数Top20"
        style={{ marginBottom: 25 }}
      >
        <Top20Table dataSource={summary?.abnormalList} loading={summaryLoading}/>
      </Card>
    </PageContainer>
  )
}

export default EquipmentRepairChartPage;
