import { useState } from 'react';
import type { MutableRefObject } from 'react';
import type ReactEChartsCore from 'echarts-for-react/lib/core';
import type * as echarts from 'echarts/core';
import useBaseEcharts from '@/hooks/useBaseEcharts';
import type { PieSeriesOption, LineSeriesOption, BarSeriesOption } from 'echarts/charts';
import type { TitleComponentOption, TooltipComponentOption, GridComponentOption, LegendComponentOption } from 'echarts/components';

type ChartType = 'Distribution' | 'Count';
type ECPIEOption = echarts.ComposeOption<PieSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption | LegendComponentOption>;
type ECMixOption = echarts.ComposeOption<LineSeriesOption | BarSeriesOption| TitleComponentOption | TooltipComponentOption | GridComponentOption | LegendComponentOption>;

const colors = ['#5470C6', '#91CC75', '#EE6666'];

const defaultCountChartOptions: ECMixOption = {
  color: colors,
  tooltip: {
    trigger: 'axis',
    alwaysShowContent: true,
    axisPointer: {
      type: 'cross'
    }
  },
  grid: {
    right: '20%'
  },
  legend: {
    data: ['发起保养数', '保养完成数', '保养完成率']
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      // prettier-ignore
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '比例',
      min: 0,
      max: 100,
      position: 'right',
      interval: 10,
      axisLine: {
        show: true,
        lineStyle: {
          color: colors[2]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: 'Precipitation',
      show: false,
      min: 0,
      max: 250,
      position: 'right',
      offset: 80,
      axisLine: {
        show: true,
        lineStyle: {
          color: colors[1]
        }
      },
      axisLabel: {
        formatter: '{value} ml'
      }
    },
    {
      type: 'value',
      name: '次数',
      min: 0,
      max: 250,
      position: 'left',
      axisLine: {
        show: true,
        lineStyle: {
          color: colors[0]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: '发起保养数',
      type: 'bar',
      yAxisIndex: 2,
      data: []
    },
    {
      name: '保养完成数',
      type: 'bar',
      yAxisIndex: 2,
      data: []
    },
    {
      name: '保养完成率',
      type: 'line',
      // yAxisIndex: 2,
      data: []
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
  const [options, setOptions] = useState<ECPIEOption | ECMixOption>(() => {
    switch (type) {
      case 'Count': return defaultCountChartOptions;
      case 'Distribution': return defaultPieChartOptions;
      default: return {};
    }
  });

  const setEchartsData = (data: any) => {
    switch (type) {
      case 'Count':
        setOptions(prevOptions => ({
          ...prevOptions,
          xAxis: [{
            ...prevOptions.xAxis?.[0],
            data: data.xAxis ?? [],
          }],
          series: [{
            ...prevOptions.series?.[0],
            data: data.initCountBar,
          }, {
            ...prevOptions.series?.[1],
            data: data.finishedCountBar,
          }, {
            ...prevOptions.series?.[2],
            data: data.finishedRateLine,
          }],
        }));
        break;
      case 'Distribution': 
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