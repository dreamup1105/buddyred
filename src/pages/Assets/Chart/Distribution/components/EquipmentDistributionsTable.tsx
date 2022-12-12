import React from 'react';
import { Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { EquipmentDistributionTableItem } from '../../type';
import { tableHeight } from '@/utils/utils';

interface IComponentProps {
  dataSource: EquipmentDistributionTableItem[];
  loading: boolean;
}

const EquipmentDistributionTable: React.FC<IComponentProps> = ({
  dataSource,
  loading,
}) => {
  const columns: { title: string; children: ColumnType<EquipmentDistributionTableItem>[] }[] = [
    { 
      title: '科室',
      children: [{
        title: '名称',
        dataIndex: 'departmentName',
        key: 'departmentName',
        render: (text, row) => ({
          children: text,
          props: { rowSpan: row.departmentRowSpan },
        }),
      }, {
        title: '数量',
        dataIndex: 'departmentEquipmentCount',
        key: 'departmentEquipmentCount',
        render: (text, row) => ({
          children: text,
          props: { rowSpan: row.departmentRowSpan },
        }),
      }]
    },
    {
      title: '类型', 
      children: [{
        title: '名称',
        dataIndex: 'typeName',
        key: 'typeName',
        render: (text, row) => ({
          children: text,
          props: { rowSpan: row.typeRowSpan },
        }),
      }, {
        title: '数量',
        dataIndex: 'typeCount',
        key: 'typeCount',
        render: (text, row) => ({
          children: text,
          props: { rowSpan: row.typeRowSpan },
        }),
      }]
    },
    { 
      title: '子类型', 
      children: [{
        title: '名称',
        dataIndex: 'subTypeName',
        key: 'subTypeName',
      }, {
        title: '数量',
        dataIndex: 'subTypeCount',
        key: 'subTypeCount',
      }]
    }
  ];

  return (<>
    <Table<EquipmentDistributionTableItem>
      rowKey={(record) => `${record.departmentName}/${record.typeName}/${record.subTypeName}`}
      style={{ width: '100%' }}
      size={"small"}
      dataSource={dataSource}
      columns={columns}
      bordered
      pagination={false}
      loading={loading}
      scroll={{
        y: tableHeight + 70,
      }}
    />
  </>);
}

export default EquipmentDistributionTable;