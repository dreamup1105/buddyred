import React from 'react';
import { Table } from 'antd';
import type { IRepairSummary } from '../../type';

interface IComponentProps {
  dataSource: IRepairSummary['abnormalList'] | undefined;
  loading: boolean;
}

const Top20Table: React.FC<IComponentProps> = ({
  dataSource = [],
  loading = false
}) => {
  const columns = [
    {
      title: '编号',
      dataIndex: 'equipmentNo',
      key: 'equipmentNo',
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: '设备名称',
      dataIndex: 'equipNameNew',
      key: 'equipNameNew',
    },
    {
      title: '设备厂商',
      dataIndex: 'manufacturerName',
      key: 'manufacturerName',
    },
    {
      title: '型号',
      dataIndex: 'modelName',
      key: 'modelName',
    },
    {
      title: '维修次数',
      dataIndex: 'repairCount',
      key: 'repairCount',
    },
  ];
  return (
    <Table rowKey="id" columns={columns} dataSource={dataSource} pagination={false} loading={loading}/>
  )
}

export default Top20Table;
