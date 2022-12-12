import { useState } from 'react';
import type { MutableRefObject } from 'react';
import type ReactEChartsCore from 'echarts-for-react/lib/core';
import type * as echarts from 'echarts/core';
import useBaseEcharts from '@/hooks/useBaseEcharts';
import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
} from 'echarts/charts';
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  LegendComponentOption,
} from 'echarts/components';

export type ChartType =
  | 'Repair'
  | 'Inspection'
  | 'Maintain'
  | 'EquipmentType'
  | 'Summary';
type ECLINEOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
>;
type ECPIEOption = echarts.ComposeOption<
  | PieSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
>;

const defaultPIEOptions: ECPIEOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    data: [],
    type: 'scroll',
    orient: 'vertical',
    left: 10,
    top: 20,
  },
  series: [
    {
      name: '设备类型',
      type: 'pie',
      selectedMode: 'single',
      radius: [0, '30%'],
      label: {
        position: 'inner',
        fontSize: 14,
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
    {
      name: '设备名称',
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
            align: 'center',
          },
          hr: {
            borderColor: '#8C8D8E',
            width: '100%',
            borderWidth: 1,
            height: 0,
          },
          b: {
            color: '#4C5058',
            fontSize: 14,
            fontWeight: 'bold',
            lineHeight: 33,
          },
          per: {
            color: '#fff',
            backgroundColor: '#4C5058',
            padding: [3, 4],
            borderRadius: 4,
          },
        },
      },
      data: [],
    },
  ],
};

const defaultLineOrBarOptions: ECLINEOption = {
  tooltip: {
    trigger: 'axis',
    formatter: '{b0}: {c0}次',
    alwaysShowContent: true,
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
    name: '次数',
    axisLine: {
      show: true,
      lineStyle: {
        color: '#5470C6',
      },
    },
  },
  series: [
    {
      data: [],
      type: 'bar',
      label: {
        show: true,
        valueAnimation: true,
        position: 'top',
        fontSize: 16,
        color: '#fff',
      },
    },
  ],
};

export default function useEcharts(
  ref: MutableRefObject<ReactEChartsCore | null>,
  loading: boolean,
  type: ChartType,
) {
  const { echartsInstance } = useBaseEcharts(ref, loading);
  const [options, setOptions] = useState<ECLINEOption | ECPIEOption>(() => {
    switch (type) {
      case 'EquipmentType':
        return defaultPIEOptions;
      default:
        return defaultLineOrBarOptions;
    }
  });

  const setEchartsData = (data: any) => {
    switch (type) {
      case 'EquipmentType':
        break;
      case 'Summary':
        setOptions((prevOptions) => ({
          ...prevOptions,
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['巡检数', '维修数', '保养数'],
            textStyle: {
              color: '#fff',
              fontSize: 16,
            },
          },
          xAxis: {
            ...prevOptions.xAxis,
            data: data.xAxis,
          },
          series: [
            {
              ...prevOptions.series?.[0],
              label: {
                show: false,
              },
              name: '巡检数',
              data: data.yAxis[0],
              type: 'line',
            },
            {
              ...prevOptions.series?.[0],
              label: {
                show: false,
              },
              name: '维修数',
              data: data.yAxis[1],
              type: 'line',
            },
            {
              ...prevOptions.series?.[0],
              label: {
                show: false,
              },
              name: '保养数',
              data: data.yAxis[2],
              type: 'line',
            },
          ],
        }));
        break;
      default:
        setOptions((prevOptions) => ({
          ...prevOptions,
          xAxis: {
            ...prevOptions.xAxis,
            data: data.xAxis,
          },
          series: [
            {
              ...prevOptions.series?.[0],
              data: data.yAxis,
              type: type === 'Repair' ? 'line' : 'bar',
            },
          ],
        }));
        break;
    }
  };

  return {
    options,
    echartsInstance,
    setEchartsData,
  };
}
