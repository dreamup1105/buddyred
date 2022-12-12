import React, { useRef } from 'react';
import { Input, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@/components/ProTable';
import { tableHeight } from '@/utils/utils';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { FormInstance } from 'antd/es/form';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  keyword: '',
  startDate: undefined,
  type: 'dept'
};

const AssetsFalutStatisticsPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();

  const columns: ProTableColumn<any>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      hideInTable: true,
      renderFormItem: () => (
        <Input placeholder="设备名称/设备编号" />
      ),
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '设备编号',
      dataIndex: 'equipmentNo',
      key: 'equipmentNo',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '设备型号',
      dataIndex: 'sn',
      key: 'sn',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '科室名称',
      dataIndex: 'deptName',
      key: 'orderNo',
      width: 160,
      renderFormItem: () => (
        <Select>
          <Select.Option value='0'>五官科</Select.Option>
          <Select.Option value='1'>公共卫生科</Select.Option>
          <Select.Option value='1'>内科</Select.Option>
          <Select.Option value='1'>外科</Select.Option>
          <Select.Option value='1'>妇产科</Select.Option>
          <Select.Option value='1'>放射科</Select.Option>
          <Select.Option value='1'>消毒供应中心</Select.Option>
          <Select.Option value='1'>精神心理科</Select.Option>
          <Select.Option value='1'>设备科</Select.Option>
        </Select>
      ),
    },
    {
      title: '购买成本(元)',
      dataIndex: 'purchaseCost',
      key: 'purchaseCost',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '维保成本(元)',
      dataIndex: 'maintananceCost',
      key: 'maintananceCost',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '能效成本(元)',
      dataIndex: 'efficiencyCost',
      key: 'efficiencyCost',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '总收益(元)',
      dataIndex: 'sumCost',
      key: 'sumCost',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '净收益(元)',
      dataIndex: 'netCost',
      key: 'netCost',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '每天平均收益(元)',
      dataIndex: 'dayAverageCost',
      key: 'dayAverageCost',
      hideInSearch: true,
      width: 150,
    }
  ];

  const dataSource: any = [
    {
      id: '0',
      equipmentName: '外科',
      equipmentNo: '202205300001',
      sn: '佳士比C6',
      deptName: '注微量注射泵',
      purchaseCost: '1000',
      maintananceCost: '500',
      efficiencyCost: '500',
      sumCost: '2000',
      netCost: '1000',
      dayAverageCost: '50',
    },
    {
      id: '1',
      equipmentName: '妇产科',
      equipmentNo: '202204060001',
      sn: 'Prodigy Advance',
      deptName: '高档数字化全身型双能X线骨密度仪',
      purchaseCost: '100',
      maintananceCost: '50',
      efficiencyCost: '20',
      sumCost: '170',
      netCost: '70',
      dayAverageCost: '10',
    },
    {
      id: '2',
      equipmentName: '中医内科',
      equipmentNo: '49981',
      sn: 'notfound',
      deptName: '全自动内窥镜洗消机',
      purchaseCost: '90',
      maintananceCost: '40',
      efficiencyCost: '30',
      sumCost: '160',
      netCost: '60',
      dayAverageCost: '10',
    },
    {
      id: '3',
      equipmentName: '五官科',
      equipmentNo: '32739',
      sn: 'PACE 101H',
      deptName: '临时超博器',
      purchaseCost: '2000',
      maintananceCost: '600',
      efficiencyCost: '400',
      sumCost: '3000',
      netCost: '1000',
      dayAverageCost: '60',
    },
    {
      id: '4',
      equipmentName: '五官科',
      equipmentNo: '21034',
      sn: 'PACE 101H',
      deptName: '临时超博器',
      purchaseCost: '2000',
      maintananceCost: '2000',
      efficiencyCost: '1000',
      sumCost: '4000',
      netCost: '2000',
      dayAverageCost: '100',
    },
    {
      id: '5',
      equipmentName: '五官科',
      equipmentNo: '21033',
      sn: 'PACE 101H',
      deptName: '临时超博器',
      purchaseCost: '2000',
      maintananceCost: '2000',
      efficiencyCost: '1000',
      sumCost: '4000',
      netCost: '2000',
      dayAverageCost: '60',
    },
    {
      id: '6',
      equipmentName: '五官科',
      equipmentNo: '21032',
      sn: 'RXG-I',
      deptName: '医用内窥镜氙灯冷光源',
      purchaseCost: '6000',
      maintananceCost: '2000',
      efficiencyCost: '1000',
      sumCost: '9000',
      netCost: '3000',
      dayAverageCost: '100',
    },
    {
      id: '7',
      equipmentName: '设备科',
      equipmentNo: '21031',
      sn: '4000s',
      deptName: '血透',
      purchaseCost: '8000',
      maintananceCost: '2000',
      efficiencyCost: '1000',
      sumCost: '11000',
      netCost: '3000',
      dayAverageCost: '30',
    },
    {
      id: '8',
      equipmentName: '设备科',
      equipmentNo: '21030',
      sn: 'FJ-007A',
      deptName: '超声波臭氧雾化妇科治疗仪	',
      purchaseCost: '60000',
      maintananceCost: '2000',
      efficiencyCost: '1000',
      sumCost: '63000',
      netCost: '3000',
      dayAverageCost: '100',
    },
  ]

  return (
    <>
    <PageContainer>
      <ProTable<any, typeof DefaultQuery>
        rowKey="id"
        title="效益分析列表"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        request={() => {
          return {
            data: dataSource,
            success: true
          }
        }}
      />
    </PageContainer>

    </>
  );
};

export default AssetsFalutStatisticsPage;
