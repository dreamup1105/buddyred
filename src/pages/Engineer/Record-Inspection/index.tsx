import React from 'react';
import type { ProTableColumn } from '@/components/ProTable';
import ProTableList from '../components/ProTableList';
import { taskType } from '../type';
import type { IFetchMaintenanceRecord } from '../type';

// 巡检记录
const EngineerRecordInspectionPage: React.FC = () => {
  const columns: ProTableColumn<IFetchMaintenanceRecord>[] = [
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
  ];

  return (
    <ProTableList
      taskType={taskType.INSPECTION}
      column={columns}
      title="巡检记录列表"
    />
  );
};

export default EngineerRecordInspectionPage;
