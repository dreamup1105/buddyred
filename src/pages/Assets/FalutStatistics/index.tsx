import React, { useRef } from 'react';
import { Input, DatePicker, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@/components/ProTable';
const { RangePicker } = DatePicker; 
import { tableHeight } from '@/utils/utils';
import FalutEcharts from './echarts';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { FormInstance } from 'antd/es/form';
import type { LendingTable } from './type';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  keyword: '',
  startDate: null,
  type: 'dept'
};

const AssetsFalutStatisticsPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();

  const columns: ProTableColumn<LendingTable>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      hideInTable: true,
      renderFormItem: () => (
        <Input placeholder="科室名称/设备名称" />
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      hideInTable: true,
      renderFormItem: () => (
        <Select>
          <Select.Option value='Hospital'>医院</Select.Option>
          <Select.Option value='dept'>科室</Select.Option>
        </Select>
      ),
    },
    {
      title: '科室名称',
      dataIndex: 'deptName',
      key: 'orderNo',
      hideInSearch: true,
    },
    {
      title: '设备名称',
      dataIndex: 'eqipmentName',
      key: 'orderNo',
      hideInSearch: true,
    },
    {
      title: '故障率',
      dataIndex: 'falut',
      key: 'falut',
      hideInSearch: true,
    },
    {
      title: '启用时间',
      dataIndex: 'startDate',
      key: 'startDate',
      renderFormItem: () => (
        <RangePicker showTime />
      ),
    }
  ];

  const dataSource = [
    {
      id: '0',
      deptName: '外科',
      eqipmentName: '注微量注射泵',
      falut: '12%',
      startDate: '2020-12-30'
    },
    {
      id: '1',
      deptName: '妇产科',
      eqipmentName: '高档数字化全身型双能X线骨密度仪',
      falut: '10%',
      startDate: '2019-12-02'
    },
    {
      id: '2',
      deptName: '中医内科',
      eqipmentName: '全自动内窥镜洗消机',
      falut: '6%',
      startDate: '2021-06-10'
    },
    {
      id: '3',
      deptName: '五官科',
      eqipmentName: '临时超博器',
      falut: '1%',
      startDate: '2022-04-30'
    },
    {
      id: '4',
      deptName: '五官科',
      eqipmentName: '临时超博器',
      falut: '3%',
      startDate: '2022-02-22'
    },
    {
      id: '5',
      deptName: '五官科',
      eqipmentName: '临时超博器',
      falut: '0%',
      startDate: '2021-04-22'
    },
    {
      id: '6',
      deptName: '五官科',
      eqipmentName: '医用内窥镜氙灯冷光源',
      falut: '1%',
      startDate: '2020-05-20'
    },
    {
      id: '7',
      deptName: '设备科',
      eqipmentName: '超声波臭氧雾化妇科治疗仪',
      falut: '30%',
      startDate: '2020-10-01'
    },
    {
      id: '8',
      deptName: '设备科',
      eqipmentName: '血透',
      falut: '10%',
      startDate: '2022-04-05'
    },
    {
      id: '9',
      deptName: '设备科',
      eqipmentName: '超声波臭氧雾化妇科治疗仪',
      falut: '4%',
      startDate: '2020-01-01'
    },
    {
      id: '10',
      deptName: '消毒供应中心',
      eqipmentName: '细菌鉴定和药敏分析仪',
      falut: '11%',
      startDate: '2021-06-12'
    },
  ]

  return (
    <>
    <PageContainer>
      <FalutEcharts />
      <ProTable<LendingTable, typeof DefaultQuery>
        rowKey="id"
        title="设备故障率统计列表"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        request={(query) => {
          console.log(query);
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
