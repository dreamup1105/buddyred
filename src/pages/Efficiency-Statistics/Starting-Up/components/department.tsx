import React, { useRef } from 'react';
import { DatePicker, Input } from 'antd';
import ProTable from '@/components/ProTable';
import useUserInfo from '@/hooks/useUserInfo';
import useDepartments from '@/hooks/useDepartments';
import DepartmentSelector from '@/components/DepartmentSelector';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { ITableListItem } from '../type';
import { getQueryEquipmentStartingAPI } from '../service';
import { tableHeight } from '@/utils/utils';
import { momentToString, WithoutTimeFormat } from '@/utils/utils';
const { RangePicker } = DatePicker;

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  date: undefined,
  departmentId: undefined,
  keyword: undefined,
};

// 科室开机率
const StartingUpDepartmentPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const actionRef = useRef<ActionType>();
  const orgId = currentUser?.org.id;
  const { departmentsTreeData } = useDepartments({ orgId: orgId! }, true);

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '序号',
      key: 'index',
      width: 65,
      render: (t: any, r: any, index: number) => index + 1,
      hideInSearch: true,
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      hideInTable: true,
      renderFormItem: () => {
        return <Input placeholder="名称/别名/品牌/设备自编号/序列号" />;
      },
    },
    {
      title: '科室',
      dataIndex: 'departmentId',
      key: 'departmentId',
      width: 140,
      hideInTable: true,
      renderFormItem: () => (
        <DepartmentSelector
          treeSelectProps={{
            treeData: departmentsTreeData,
            virtual: false,
          }}
        />
      ),
    },
    {
      title: '起止时间',
      dataIndex: 'date',
      key: 'date',
      hideInTable: true,
      renderFormItem: () => <RangePicker />,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '设备序列号',
      dataIndex: 'sn',
      key: 'sn',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '设备自编号',
      dataIndex: 'equipmentNo',
      key: 'equipmentNo',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '录入时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '报废状态',
      dataIndex: 'isScrap',
      key: 'isScrap',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '应开机时长(h)',
      dataIndex: 'shouldDuration',
      key: 'shouldDuration',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '停机时长(h)',
      dataIndex: 'stopDuration',
      key: 'stopDuration',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '实际开机时长(h)',
      dataIndex: 'practicalDuration',
      key: 'practicalDuration',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '开机率(%)',
      dataIndex: 'ratio',
      key: 'ratio',
      width: 100,
      hideInSearch: true,
    },
  ];

  return (
    <ProTable<ITableListItem, typeof DefaultQuery>
      rowKey="equipmentId"
      title="科室开机率列表"
      defaultQuery={DefaultQuery}
      actionRef={actionRef}
      columns={columns}
      isSyncToUrl={false}
      tableProps={{
        scroll: {
          y: tableHeight,
        },
      }}
      request={async (query) => {
        const { current, pageSize, departmentId, date, keyword } = query;
        return getQueryEquipmentStartingAPI({
          current: Number(current) || 1,
          pageSize: Number(pageSize) || 30,
          keyword,
          startTime:
            (date?.[0] &&
              momentToString(date[0], WithoutTimeFormat) + ' 00:00:00') ||
            undefined,
          endTime:
            (date?.[1] &&
              momentToString(date[1], WithoutTimeFormat) + ' 23:59:59') ||
            undefined,
          departmentId,
        });
      }}
      hooks={{
        beforeInit: (query) => {
          console.log(query);
          return {
            ...query,
          };
        },
      }}
    />
  );
};

export default StartingUpDepartmentPage;
