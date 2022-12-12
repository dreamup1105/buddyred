import { useEffect } from 'react';
import useUnmount from '@/hooks/useUnmount';
import type ReactEChartsCore from 'echarts-for-react/lib/core';
import type { MutableRefObject } from 'react';

export default function useBaseEcharts(
  ref: MutableRefObject<ReactEChartsCore | null>,
  loading?: boolean,
) {
  useEffect(() => {
    if (loading) {
      ref.current?.getEchartsInstance().showLoading();
    } else {
      ref.current?.getEchartsInstance().hideLoading();
    }
  }, [loading]);

  useUnmount(() => {
    ref.current?.getEchartsInstance().dispose();
  });

  return {
    echartsInstance: ref.current?.getEchartsInstance(),
  };
}
