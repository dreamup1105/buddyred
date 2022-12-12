import React, { useRef, useState } from 'react';
import { Card, Form, Empty, Row, Col, Statistic } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import useMount from '@/hooks/useMount';
import useUserInfo from '@/hooks/useUserInfo';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import SearchForm from './components/SearchForm';
import { fetchEquipmentTypesByDepartmentsStat } from '../service';
import useEcharts from './hooks/useEcharts';
import { DataTransformers, calculateEquipmentTotal } from '../helper';
import type { ChartGroupBy } from '../type';

echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, PieChart, CanvasRenderer]);

// 设备分类统计图
const EquipmentTypeChartPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [groupBy, setGroupBy] = useState<ChartGroupBy>('name');
  const echartsRef = useRef<ReactEChartsCore | null>(null);
  const { echartsOptions, setEchartsData, isEmpty } = useEcharts(echartsRef, loading, groupBy);
  const [equipmentTotal, setEquipmentTotal] = useState(0);
  const defaultSearchFormValues = {
    group: 'name',
    departmentIds: currentUser?.primaryDepartment ? [currentUser.primaryDepartment.id] : [],
  }

  const loadChartsDataSource = async () => {
    const { departmentIds = [], group } = searchForm.getFieldsValue();
    if (loading || !departmentIds.length) {
      return;
    }
    setLoading(true);
    try {
      const { data = [] } = await fetchEquipmentTypesByDepartmentsStat(group, departmentIds);
      const transformedData = DataTransformers.transformDataToPIEChart(data);
      setEquipmentTotal(calculateEquipmentTotal(data));
      setEchartsData(transformedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const onFormValuesChange = (changedValues: any) => {
    if (changedValues.group) {
      setGroupBy(changedValues.group);
    }

    if (changedValues.departmentIds && !changedValues.departmentIds.length) {
      setEquipmentTotal(0);
      setEchartsData([[], []]);
    }

    loadChartsDataSource();
  } 

  const init = () => {
    searchForm.setFieldsValue(defaultSearchFormValues);
    loadChartsDataSource();
  }

  useMount(init);

  return (
    <PageContainer>
      <Card 
        title="设备分类统计图" 
        extra={<SearchForm onValuesChange={onFormValuesChange} form={searchForm} />} 
        style={{ width: '100%' }}
      >
         <div style={{ width: '50%', margin: '0 auto 25px' }}>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Statistic title={`设备数`} value={equipmentTotal} />
            </Col>
          </Row>
        </div>
        { isEmpty && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无图表数据" /> }
        <div>
          <ReactEChartsCore
            ref={(e) => { echartsRef.current = e }}
            echarts={echarts}
            option={echartsOptions}
            notMerge={true}
            lazyUpdate={true}
            theme={"theme_name"}
            style={{
              height: isEmpty ? 0 : 700,
            }}
          />
        </div>
      </Card>
    </PageContainer>
  )
};

export default EquipmentTypeChartPage;



