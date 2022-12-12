import { useState } from 'react';
import type { MutableRefObject } from 'react';
import type ReactEChartsCore from 'echarts-for-react/lib/core';
import type * as echarts from 'echarts/core';
import useBaseEcharts from '@/hooks/useBaseEcharts';
import type { PieSeriesOption, LineSeriesOption } from 'echarts/charts';
import type { TitleComponentOption, TooltipComponentOption, GridComponentOption, LegendComponentOption } from 'echarts/components';

type ChartType = 'Fee' | 'Count' | 'FaultRate';
type ECPIEOption = echarts.ComposeOption<PieSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption | LegendComponentOption>;
type ECLINEOption = echarts.ComposeOption<LineSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption | LegendComponentOption>;


const defaultFeeChartOptions: ECLINEOption = {
  title: { text: '维修费用（单位：元）'},
  tooltip: {
    trigger: 'axis',
    formatter: '{b0}: {c0}元',
    alwaysShowContent: true,
    axisPointer: {
      type: 'cross',
    }
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    name: '费用',
    axisLine: {
      show: true,
      lineStyle: {
        color: '#5470C6'
      }
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      label: {
        show: true,
        position: 'top'
      }
    }
  ]
}

const defaultCountChartOptions: ECLINEOption = {
  title: { text: '维修次数（单位：次）' },
  tooltip: {
    trigger: 'axis',
    formatter: '{b0}: {c0}次',
    alwaysShowContent: true,
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    name: '次数',
    axisLine: {
      show: true,
      lineStyle: {
        color: '#5470C6'
      }
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      label: {
        show: true,
        position: 'top'
      }
    }
  ]
}

const defaultPieChartOptions: ECPIEOption  = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    data: [],
    type: 'scroll',
    orient: 'vertical',
    left: 10,
    top: 20
  },
  series: [
    {
      name: '设备类型',
      type: 'pie',
      radius: ['45%', '60%'],
      labelLine: {
        length: 30,
      },
      label: {
        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
        backgroundColor: '#F6F8FC',
        borderColor: '#8C8D8E',
        borderWidth: 1,
        borderRadius: 4,
        rich: {
          a: {
            color: '#6E7079',
            lineHeight: 22,
            align: 'center'
          },
          hr: {
            borderColor: '#8C8D8E',
            width: '100%',
            borderWidth: 1,
            height: 0
          },
          b: {
            color: '#4C5058',
            fontSize: 14,
            fontWeight: 'bold',
            lineHeight: 33
          },
          per: {
            color: '#fff',
            backgroundColor: '#4C5058',
            padding: [3, 4],
            borderRadius: 4
          }
        }
      },
      data: []
    }
  ]
}

export default function useEcharts(ref: MutableRefObject<ReactEChartsCore | null>, loading: boolean, type: ChartType) {
  const { echartsInstance } = useBaseEcharts(ref, loading);
  const [options, setOptions] = useState<ECPIEOption | ECLINEOption>(() => {
    switch (type) {
      case 'Fee': return defaultFeeChartOptions;
      case 'Count': return defaultCountChartOptions;
      case 'FaultRate': return defaultPieChartOptions;
      default: return {};
    }
  });

  const setEchartsData = (data: any) => {
    switch (type) {
      case 'Fee': 
      case 'Count':
        setOptions((prevOptions) => ({
          ...prevOptions,
          xAxis: {
            ...prevOptions.xAxis,
            data: data.xAxis,
          },
          series: [{
            ...prevOptions.series?.[0],
            data: data.yAxis,
          }]
        }));
        break;
      case 'FaultRate': 
        setOptions(prevOptions => ({
          ...prevOptions,
          legend: {
            ...prevOptions.legend,
            data: data.legend,
            // formatter: (name) => `${name}（${nameMap.get(name)?.value}）`
          },
          series: [{
            ...prevOptions.series?.[0],
            data: data.pieData.sort((a: { name: string; value: number; }, b: { name: string; value: number; }) => a.value - b.value),
          }],
        }));
        break;
      default: break;
    }
  }

  return {
    options,
    echartsInstance,
    setEchartsData
  }
}