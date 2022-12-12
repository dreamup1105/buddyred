import React, { useState, useRef } from 'react';
import { Card, Form, Empty } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import useMount from '@/hooks/useMount';
import * as echarts from 'echarts/core';
import { TreemapChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import EquipmentDistributionTable from './components/EquipmentDistributionsTable';
import SearchForm from './components/SearchForm';
import { fetchEquipmentDistributionsStat } from '../service';
import { DataTransformers } from '../helper';
import type { EquipmentDistributionTableItem } from '../type';
import styles from './index.less';
import useEcharts from './hooks/useEcharts';

echarts.use([TitleComponent, TooltipComponent, GridComponent, TreemapChart, CanvasRenderer]);

const defaultSearchFormValues = {
  group: 'name',
  typeName: '全部',
}

// 设备分布图
const EquipmentDistributionPage: React.FC = () => {
  const [searchForm] = Form.useForm();
  const echartsRef = useRef<ReactEChartsCore | null>(null);
  const [tableDataSource, setTableDataSource] = useState<EquipmentDistributionTableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartTitle, setChartTitle] = useState('');
  const { echartsOptions, setEchartsData, isEmpty } = useEcharts(echartsRef, loading, chartTitle);

  const loadEquipmentDistributions = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { group, typeName } = searchForm.getFieldsValue();
      const { data = [] } = await fetchEquipmentDistributionsStat(group, typeName === '全部' ? '' : typeName, false);
      const transformedEchartsData = DataTransformers.transformEquipmentDistuibutions(data);
      const transformedTableData = DataTransformers.flatEquipmentDistributionsForTable(data);
      setEchartsData(transformedEchartsData);
      setTableDataSource(transformedTableData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const init = () => {
    searchForm.setFieldsValue(defaultSearchFormValues);
    loadEquipmentDistributions();
  }

  const onFormValuesChange = (changedValues: any) => {
    if (changedValues.typeName) {
      setChartTitle(changedValues.typeName);
    }
    loadEquipmentDistributions();
  }

  useMount(init);

  return (
    <PageContainer>
      <Card 
        title="设备分布图" 
        extra={<SearchForm onValuesChange={onFormValuesChange} form={searchForm} />} 
        style={{ width: '100%' }}
      >
        { isEmpty && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无图表数据" /> }
        <div className={styles.chartWrapper}>
          <ReactEChartsCore
            ref={(e) => { echartsRef.current = e }}
            echarts={echarts}
            option={echartsOptions}
            notMerge={true}
            lazyUpdate={true}
            theme={"theme_name"}
            onChartReady={() => {}}
            style={{
              height: isEmpty ? 0 : 700,
            }}
          />
        </div>
        <EquipmentDistributionTable 
          dataSource={tableDataSource}
          loading={loading}
        />
      </Card>
    </PageContainer>
  );
};

export default EquipmentDistributionPage;
