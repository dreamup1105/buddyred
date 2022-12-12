import React, { useRef, useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import ProTable from '@/components/ProTable';
import DepartmentSelector from '@/components/DepartmentSelector';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { ITableListItem } from '../type';
import {
  getQueryCompanyStartingAPI,
  getQueryCustomerRelationAPI,
} from '../service';
import { tableHeight } from '@/utils/utils';
import { momentToString, WithoutTimeFormat } from '@/utils/utils';
const { RangePicker } = DatePicker;

interface IComponentProps {
  type: string;
}

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  companyId: undefined,
  date: undefined,
};

// 开机率
const StartingUpEngineerPage: React.FC<IComponentProps> = ({ type }) => {
  const actionRef = useRef<ActionType>();
  const [departmentsTreeData, setDepartmentsTreeData] = useState();

  const getCompanyData = async () => {
    try {
      let companyArr = [];
      const { data } = await getQueryCustomerRelationAPI();
      companyArr = data.map((item: any) => {
        return {
          label: item.orgName,
          value: item.orgId,
        };
      });
      setDepartmentsTreeData(companyArr);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (type == 'engineer') {
      getCompanyData();
    }
  }, [type]);

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '序号',
      key: 'index',
      width: 65,
      render: (t: any, r: any, index: number) => index + 1,
      hideInSearch: true,
    },
    {
      title: '医院',
      dataIndex: 'companyId',
      key: 'companyId',
      width: 140,
      hideInTable: true,
      renderFormItem: () => (
        <DepartmentSelector
          treeSelectProps={{
            treeData: departmentsTreeData,
            virtual: false,
            treeNodeFilterProp: 'label',
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
      title: '医院',
      dataIndex: 'orgName',
      key: 'orgName',
      hideInSearch: true,
      width: 160,
    },
    {
      title: '应开机时长(h)',
      dataIndex: 'shouldDuration',
      key: 'shouldDuration',
      width: 140,
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
      title: '实际开机时间(h)',
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
      rowKey="orgId"
      title="开机率列表"
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
        const { current, pageSize, companyId, date } = query;
        return getQueryCompanyStartingAPI({
          current: Number(current) || 1,
          pageSize: Number(pageSize) || 30,
          companyId,
          startTime:
            (date?.[0] &&
              momentToString(date[0], WithoutTimeFormat) + ' 00:00:00') ||
            undefined,
          endTime:
            (date?.[1] &&
              momentToString(date[1], WithoutTimeFormat) + ' 23:59:59') ||
            undefined,
        });
      }}
    />
  );
};

export default StartingUpEngineerPage;
