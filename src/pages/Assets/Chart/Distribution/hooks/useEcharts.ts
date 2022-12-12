import { useEffect, useState } from 'react';
import * as echarts from 'echarts/core';
import useBaseEcharts from '@/hooks/useBaseEcharts';
import type ReactEChartsCore from 'echarts-for-react/lib/core';
import type { MutableRefObject } from 'react';
import type { TreemapSeriesOption } from 'echarts/charts';
import type { TitleComponentOption, TooltipComponentOption, GridComponentOption } from 'echarts/components';
import type { TreeMapDataItem } from '../../type';

type ECOption = echarts.ComposeOption<TreemapSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption>;

const formatUtil = echarts.format;

const getLevelOption = () => [
  {
    itemStyle: {
      borderColor: '#777',
      borderWidth: 0,
      gapWidth: 1
    },
    upperLabel: {
      show: false
    }
  },
  {
    itemStyle: {
      borderColor: '#555',
      borderWidth: 5,
      gapWidth: 1
    },
    emphasis: {
      itemStyle: {
        borderColor: '#ddd'
      }
    }
  },
  {
    colorSaturation: [0.35, 0.5],
    itemStyle: {
      borderWidth: 5,
      gapWidth: 1,
      borderColorSaturation: 0.6,
    }
  }
];

const defaultOptions: ECOption  = {
  tooltip: {
    formatter (info: any) {
      const { value } = info;
      const { treePathInfo } = info;
      const treePath = [];

      // eslint-disable-next-line no-plusplus
      for (let i = 1; i < treePathInfo.length; i++) {
        treePath.push(treePathInfo[i].name);
      }

      return [
        `<div class="tooltip-title">${  formatUtil.encodeHTML(treePath.join('/'))  }</div>`,
        `数量：${value}`,
      ].join('');
    }
  },
  breadcrumb: {
    show: true,
    top: 5
  },
  title: {
    text: '全部设备分布图',
    left: 'center',
    top: 5,
    textStyle: {
      fontSize: 30,
    },
  },
  series: [
    {
      name: '设备分布图',
      type: 'treemap',
      visibleMin: 300,
      width: '100%',
      label: {
        show: true,
        align: 'center',
        verticalAlign: 'middle',
        width: '100%',
        height: 100,
        fontSize: 20,
        formatter(params: any) {
          const { data } = params;
          return `${ data.name }

（${data.value}台）
          `; 
        }
      },
      upperLabel: {
        show: true,
        height: 30,
        formatter(params: any) {
          const { data } = params;
          return `
            ${ data.name } （${data.value}台）
          `; 
        }
      },
      itemStyle: {
        borderColor: '#fff',
      },
      levels: getLevelOption(),
      data: [],
    }
  ]
}

export default function useEcharts(ref: MutableRefObject<ReactEChartsCore | null>, loading: boolean, title: string) {
  const [options, setOptions] = useState<ECOption>(defaultOptions);
  const [isEmpty, setIsEmpty] = useState(false);
  const { echartsInstance } = useBaseEcharts(ref, loading);
  const setEchartsData = (data: TreeMapDataItem[]) => {
    setIsEmpty(!data?.length);
    setOptions(prevOptions => ({
      ...prevOptions,
      series: [{
        ...prevOptions.series?.[0],
        data,
      }],
    }));
  };

  useEffect(() => {
    setOptions(prevOptions => {
      return {
        ...prevOptions,
        title: {
          ...prevOptions.title,
          text: `${title || '全部'}`,
        },
      }
    });
  }, [title]);

  return {
    setEchartsData,
    echartsOptions: options,
    echartsInstance,
    isEmpty,
  };
}
