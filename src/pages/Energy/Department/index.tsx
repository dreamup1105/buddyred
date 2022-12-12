import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import useUserInfo from '@/hooks/useUserInfo';
import useMount from '@/hooks/useMount';
import useACL from '@/hooks/useACL';
import useAclDepartments from '@/hooks/useAclDepartments';
// import useGlobalAuthorities from '@/hooks/useGlobalAuthorities';
import { List, Card, Form, Select } from 'antd';
import CardItem from './components/CardItem';
import type { ICardItem } from './type';
import { fetchPowerConsumption } from './service';

// 科室耗电页面
const EnergyDepartmentPage: React.FC = () => {
  const { isACL } = useACL();
  const { currentUser } = useUserInfo();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const orgId = currentUser?.org.id;
  // const globalAuthorities = useGlobalAuthorities();
  // const isIncludeGlobalAuthorities = globalAuthorities.includes('ALL');
  const departmentSelectOptions = useAclDepartments();
  const [dataSource, setDataSource] = useState<ICardItem[]>([]);
  const [dataSourceCache, setDataSourceCache] = useState<ICardItem[]>([]);
  const [starupState, setStarupState] = useState<number>(0);
  const [equipmentFailure, setEquipmentFailure] = useState<number>(0);
  const onValuesChange = (changedValues: any) => {
    const departmentNames = changedValues?.departmentNames || [];
    if (!departmentNames.length) {
      setDataSource(dataSourceCache);
    } else {
      const filteredDepartments = dataSourceCache.filter((item) =>
        departmentNames.includes(item.deptName),
      );
      setDataSource(filteredDepartments);
    }
  };

  const loadDataSource = async () => {
    setLoading(true);
    try {
      const { data, code } = await fetchPowerConsumption(isACL, {
        orgId: orgId!,
      });
      if (code === 0) {
        // const newDataSource = isIncludeGlobalAuthorities
        //   ? [
        //       {
        //         deptName: '全部',
        //         departmentId: 0,
        //         deptFaultEquipment: data.totalFaultEquipmentNo,
        //         deptNoOpeEquipment: undefined,
        //         deptOpenEquipment: undefined,
        //         deptTotalEquipment: undefined,
        //         momentPowerConsumption: undefined,
        //         totalPowerConsumption: undefined,
        //         totalDeptRto: data.totalEquipmentRto,
        //       },
        //       ...data.deptEquipmentList,
        //     ]
        //   : data.deptEquipmentList;
        const newDataSource = data.deptEquipmentList;
        setDataSource(newDataSource);
        setStarupState(data.totalEquipmentRto ?? 0);
        setEquipmentFailure(data.totalFaultEquipmentNo ?? 0);
        setDataSourceCache(newDataSource);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useMount(loadDataSource);

  return (
    <PageContainer>
      <Card
        title={`全院耗电统计（开机率：${
          starupState * 100
        }%；设备故障数：${equipmentFailure}台）`}
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
                style={{ width: 300 }}
                placeholder="请选择科室"
                options={departmentSelectOptions}
              />
            </Form.Item>
          </Form>
        }
      >
        <List
          rowKey="departmentId"
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 5,
            xxl: 5,
          }}
          dataSource={dataSource}
          renderItem={(item) => {
            return (
              <List.Item>
                <CardItem data={item} />
              </List.Item>
            );
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default EnergyDepartmentPage;
