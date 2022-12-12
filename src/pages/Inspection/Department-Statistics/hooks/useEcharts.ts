import { useState } from 'react';
import useBaseEcharts from '@/hooks/useBaseEcharts';
import type * as echarts from 'echarts/core';
import type ReactEChartsCore from 'echarts-for-react/lib/core';
import type { MutableRefObject } from 'react';
import type { PieSeriesOption } from 'echarts/charts';
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  LegendComponentOption,
} from 'echarts/components';
import type { InspectionStatItem } from '../../type';

type ECOption = echarts.ComposeOption<
  | PieSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
>;

const defaultOptions: ECOption = {
  // title: {
  //   text: '-',
  //   subtext: '-',
  //   left: 'center',
  // },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    bottom: 'bottom',
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
};

export default function useEcharts(
  ref: MutableRefObject<ReactEChartsCore | null>,
  loading: boolean,
) {
  const [options, setOptions] = useState<ECOption>(defaultOptions);

  useBaseEcharts(ref, loading);

  const setEchartsData = (statData: InspectionStatItem) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      // title: {
      //   ...prevOptions.title,
      //   text: `${statData.date}日巡检`,
      //   subtext: statData.departmentName,
      // },
      series: [
        {
          ...prevOptions.series?.[0],
          data: [
            {
              value: statData.normalCount,
              name: '正常',
              itemStyle: { color: '#91cc75' },
            },
            {
              value: statData.abnormalCount,
              name: '异常',
              itemStyle: { color: '#ee6666' },
            },
          ],
        },
      ],
    }));
  };

  return {
    setEchartsData,
    echartsOptions: options,
  };
}
