import React, { useRef, useState } from 'react';
import { Card, Form, Empty, Row, Col, Statistic } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import useMount from '@/hooks/useMount';
import useUserInfo from '@/hooks/useUserInfo';
import useDepartments from '@/hooks/useDepartments';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import SearchForm from './components/SearchForm';
import { fetchEquipmentTypesByDepartmentsStat } from '../service';
import useEcharts from './hooks/useEcharts';
import { DataTransformers } from '../helper';
import type { ChartGroupBy } from '../type';
import { useEffect } from 'react';

echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, PieChart, CanvasRenderer]);

const defaultSearchFormValues = {
  group: 'name',
  departmentIds: [1333127363920128],
}

// 设备分类统计图
const EquipmentTypeChartPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const orgId = currentUser?.org.id;
  const { departmentOptions, departmentsMap } = useDepartments({ orgId: orgId! }, true);
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [equipmentTotal, setEquipmentTotal] = useState(0);
  const [departmentName, setDepartmentName] = useState<string | undefined>('保健科门诊');
  const [groupBy, setGroupBy] = useState<ChartGroupBy>('name');
  const echartsRef = useRef<ReactEChartsCore | null>(null);
  const { echartsOptions, setEchartsData, isEmpty } = useEcharts(echartsRef, loading, groupBy);

  const loadChartsDataSource = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { departmentIds = [], group } = searchForm.getFieldsValue();
      const { data = [] } = await fetchEquipmentTypesByDepartmentsStat(group, departmentIds);
      const transformedData = DataTransformers.transformDataToPIEChart(data);
      setEchartsData(transformedData);
      setEquipmentTotal(data.reduce((acc, cur) => { return acc + cur.count }, 0));
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
    loadChartsDataSource();
  } 

  const init = () => {
    searchForm.setFieldsValue(defaultSearchFormValues);
    loadChartsDataSource();
  }

  useMount(init);

  useEffect(() => {
    if (!departmentOptions || !departmentOptions?.length || !departmentsMap || !departmentsMap.size) {
      return () => {};
    }
    const interval = setInterval(() => {
      const ids = departmentOptions.map(item => item.value);
      const index = Math.floor((Math.random() * ids.length))
      setDepartmentName(departmentsMap?.get(ids[index])?.name);
      searchForm.setFieldsValue({
        departmentIds: [ids[index]],
      });
      loadChartsDataSource();
    }, 5000);
    return () => {
      clearInterval(interval);
    }
  }, [departmentOptions, departmentsMap]);

  return (
    <PageContainer>
      <Card 
        title="设备分类统计图" 
        extra={<SearchForm onValuesChange={onFormValuesChange} form={searchForm} />} 
        style={{ width: '100%' }}
      >
        <div style={{ width: '50%', margin: '0 auto 25px' }}>
          <Row>
            <Col span={12}>
              <Statistic title="全院设备总数" value={5536} />
            </Col>
            <Col span={12}>
              <Statistic title={`${departmentName}设备数`} value={equipmentTotal} />
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
