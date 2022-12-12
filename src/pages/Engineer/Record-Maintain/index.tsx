import React from 'react';
import type { ProTableColumn } from '@/components/ProTable';
import ProTableList from '../components/ProTableList';
import { taskType } from '../type';
import type { IFetchMaintenanceRecord } from '../type';

// 保养记录
const EngineerRecordMaintainPage: React.FC = () => {
  const columns: ProTableColumn<IFetchMaintenanceRecord>[] = [
    {
      title: '单号',
      dataIndex: 'taskNo',
      key: 'taskNo',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '所属医院',
      dataIndex: 'orgName',
      key: 'orgName',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '所属科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '工程师',
      dataIndex: 'engineerName',
      key: 'engineerName',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '配件名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '配件费用',
      dataIndex: 'partCost',
      key: 'partCost',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '总金额',
      dataIndex: 'totalCost',
      key: 'totalCost',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '发起时间',
      dataIndex: 'initTime',
      key: 'initTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '转单发起时间',
      dataIndex: 'transferTime',
      key: 'transferTime',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '开始操作时间',
      dataIndex: 'beginTime',
      key: 'beginTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '配件添加时间',
      dataIndex: 'partTime',
      key: 'partTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '提交验收时间',
      dataIndex: 'commitAuditTime',
      key: 'commitAuditTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '验收时间',
      dataIndex: 'checkedTime',
      key: 'checkedTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '响应耗时(分钟)',
      dataIndex: 'consumeTime',
      key: 'consumeTime',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '总耗时(分钟)',
      dataIndex: 'wholeTime',
      key: 'wholeTime',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '评分',
      dataIndex: 'taskScore',
      key: 'taskScore',
      width: 120,
      hideInSearch: true,
    },
  ];

  return (
    <ProTableList
      taskType={taskType.MAINTAIN}
      column={columns}
      title="保养记录列表"
    />
  );
};

export default EngineerRecordMaintainPage;
