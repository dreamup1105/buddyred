import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import useMount from '@/hooks/useMount';
import useGlobalAuthorities from '@/hooks/useGlobalAuthorities';
import useAclDepartments from '@/hooks/useAclDepartments';
import useACL from '@/hooks/useACL';
import { Row, Col, Card, Form, Select } from 'antd';
import { history } from 'umi';
import { fetchEquipmentDistributionsStat } from '../Chart/service';
import type { EquipmentDistributionItem } from '../Chart/type';


const AssetsDepartmentPage: React.FC = () => {
  const [searchForm] = Form.useForm();
  const { isACL } = useACL();
  const globalAuthorities = useGlobalAuthorities();
  const isIncludeGlobalAuthorities = globalAuthorities.includes('ALL');
  const departmentSelectOptions = useAclDepartments();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<EquipmentDistributionItem[]>([]);
  const [dataSourceCache, setDataSourceCache] = useState<EquipmentDistributionItem[]>([]);

  const loadDepartmentStats = async () => {
    setLoading(true);
    try {
      const { code, data } = await fetchEquipmentDistributionsStat('name', '', isACL);
      if (code === 0) {
        const equipmentTotal = data.reduce((arr, cur) => arr + cur.count, 0);

        const newDataSource = isIncludeGlobalAuthorities ? [{ 
            count: equipmentTotal, 
            departmentName: <>全部<span style={{ fontWeight: 'normal', fontSize: 14 }}>（共{data.length}个科室）</span></>, 
            departmentId: undefined, 
            types: [] 
          }, 
          ...data
        ] : data;
        setDataSource(newDataSource);
        setDataSourceCache(newDataSource);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const onValuesChange = (changedValues: any) => {
    const departmentNames = changedValues?.departmentNames || [];
    if (!departmentNames.length) {
      setDataSource(dataSourceCache);
    } else {
      const filteredDepartments = dataSourceCache.filter(item => departmentNames.includes(item.departmentName));
      setDataSource(filteredDepartments);
    }
  }

  const onCardClick = (record: EquipmentDistributionItem) => {
    const query = record.departmentId ? `?departmentId=${record.departmentId}` : '';
    history.push(`/assets/assets${query}`);
  }

  useMount(loadDepartmentStats);

  return (
    <PageContainer>
      <Card 
        title="设备科室" 
        loading={loading}
        extra={          
          <Form
            form={searchForm} 
            layout="inline" 
            onValuesChange={onValuesChange}
          >
            <Form.Item name="departmentNames">
              <Select
                showSearch
                allowClear
                mode="multiple"
                optionFilterProp="label"
                style={{ width: 200 }} 
                placeholder="请选择科室"
                options={departmentSelectOptions}
              />
            </Form.Item>
          </Form>
        }
        style={{ width: '100%' }}
      >
        <Row gutter={16}>
          {
            dataSource.map(item => <Col key={item.departmentName?.toString()} span={4} style={{ marginBottom: 16 }}>
              <Card 
                hoverable
                bordered
                title={item.departmentName}
                bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
                onClick={() => onCardClick(item)}
              >
                <span style={{ color: 'red', fontSize: 20 }}>{ item.count }</span>（台）
              </Card>
            </Col>)
          }
        </Row>
      </Card>
    </PageContainer>
  )
}

export default AssetsDepartmentPage;
