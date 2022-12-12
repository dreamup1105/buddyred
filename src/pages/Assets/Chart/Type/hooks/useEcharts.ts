import { useState, useEffect } from 'react';
import type * as echarts from 'echarts/core';
import useBaseEcharts from '@/hooks/useBaseEcharts';
import type ReactEChartsCore from 'echarts-for-react/lib/core';
import type { MutableRefObject } from 'react';
import type { PieSeriesOption } from 'echarts/charts';
import type { TitleComponentOption, TooltipComponentOption, GridComponentOption, LegendComponentOption } from 'echarts/components';
import type { PIEDataItem, ChartGroupBy } from '../../type';

type ECOption = echarts.ComposeOption<PieSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption | LegendComponentOption>;
type ChartType = 'Type' | 'Type-And-SubType';

const defaultOptions: ECOption  = {
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
      top: 100,
      name: '设备类型',
      type: 'pie',
      selectedMode: 'single',
      radius: [0, '30%'],
      label: {
        position: 'inner',
        fontSize: 14,
      },
      labelLine: {
        show: false
      },
      data: []
    },
    {
      top: 100,
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

export default function useEcharts(
  ref: MutableRefObject<ReactEChartsCore | null>, 
  loading: boolean, 
  groupBy: ChartGroupBy,
  type: ChartType = 'Type-And-SubType'
) {
  const { echartsInstance } = useBaseEcharts(ref, loading);
  const [options, setOptions] = useState<ECOption>(defaultOptions);
  const [isEmpty, setIsEmpty] = useState(false);

  const setEchartsData = (data: PIEDataItem[][]) => {
    const nameMap = new Map([...data[0], ...data[1]].map(item => [item.name, item]));

    switch (type) {
      case 'Type-And-SubType':
        setIsEmpty(!data[0].length && !data[1].length);
        setOptions(prevOptions => ({
          ...prevOptions,
          legend: {
            ...prevOptions.legend,
            data: [...data[0], ...data[1]].map(item => item.name),
            formatter: (name) => `${name}（${nameMap.get(name)?.value}）`,
          },
          series: [{
            ...prevOptions.series?.[0],
            data: data[0],
          }, {
            ...prevOptions.series?.[1],
            data: data[1],
          }],
        }));
        break;
      case 'Type':
        setIsEmpty(!data[0].length);
        setOptions(prevOptions => ({
          ...prevOptions,
          legend: {
            ...prevOptions.legend,
            orient: 'horizontal',
            textStyle: {
              color: '#fff',
              fontSize: 16
            },
            data: [...data[0]].map(item => item.name),
            formatter: (name) => `${name}（${nameMap.get(name)?.value}）`
          },
          series: [{
            ...prevOptions.series?.[0],
            radius: [0, '100%'],
            data: data[0].sort((a: { name: string; value: number; }, b: { name: string; value: number; }) => a.value - b.value),
            label: {
              ...prevOptions.series?.[0].label,
              // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              formatter: '{b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              padding: 3,
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
                  height: 0
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
                  borderRadius: 4
                }
              },
              position: 'outer',
            },
            labelLine: {
              show: true,
            },
          }],
        }));
        break;
      default: break;
    }
  };

  useEffect(() => {
    setOptions(prevOptions => ({
      ...prevOptions,
      series: [prevOptions.series?.[0], {
        ...prevOptions.series?.[1],
        name: groupBy === 'name' ? '设备名称' : '设备别名',
      }],
    }));
  }, [groupBy]);

  return {
    setEchartsData,
    echartsOptions: options,
    echartsInstance,
    isEmpty,
  };
}
