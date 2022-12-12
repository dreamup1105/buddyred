import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@/components/ProTable';
import { DatePicker, Radio } from 'antd';
import useUserInfo from '@/hooks/useUserInfo';
import useDepartments from '@/hooks/useDepartments';
import DepartmentSelector from '@/components/DepartmentSelector';
import { normalizeDepartmentId } from '@/pages/Assets/helper';
import useACL from '@/hooks/useACL';
import {
  stringToMoment,
  momentToString,
  WithoutTimeFormat,
} from '@/utils/utils';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import omit from 'omit.js';
import type { ITableListItem } from './type';
import { fetchDepartmentPowerConsumption } from './service';
import type { FormInstance } from 'antd/es/form';
import moment from 'moment';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  departmentIds: [],
  startTime: undefined,
  endTime: undefined,
};

// 耗电页
const EnergyPowerConsumptionPage: React.FC = () => {
  const { isACL } = useACL();
  const actionRef = useRef<ActionType>();
  const { currentUser } = useUserInfo();
  const orgId = currentUser?.org.id;
  const { departmentsTreeData } = useDepartments({ orgId: orgId! }, true);
  const formRef = useRef<FormInstance>();

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '序号',
      key: 'index',
      width: 65,
      render: (t: any, r: any, index: number) => index + 1,
      hideInSearch: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      hideInSearch: true,
    },
    {
      title: '时间',
      dataIndex: 'statDimensionKey',
      key: 'statDimensionKey',
      hideInSearch: true,
    },
    {
      title: '耗电量（kw/h）',
      dataIndex: 'powerConsumption',
      key: 'powerConsumption',
      hideInSearch: true,
    },
    {
      title: '起止日期',
      dataIndex: 'date',
      key: 'date',
      hideInTable: true,
      renderFormItem: () => {
        return <DatePicker.RangePicker style={{ width: '100%' }} />;
      },
    },
    {
      title: '科室',
      dataIndex: 'departmentIds',
      key: 'departmentIds',
      align: 'center',
      hideInTable: true,
      renderFormItem: () => (
        <DepartmentSelector
          treeSelectProps={{
            multiple: true,
            treeData: departmentsTreeData,
            virtual: false,
          }}
        />
      ),
    },
    {
      title: '',
      dataIndex: 'dimension',
      key: 'dimension',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Radio.Group>
            <Radio.Button value="364">365天</Radio.Button>
            <Radio.Button value="89">90天</Radio.Button>
            <Radio.Button value="29">30天</Radio.Button>
            <Radio.Button value="0">今天</Radio.Button>
          </Radio.Group>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<ITableListItem, typeof DefaultQuery>
        rowKey="uuid"
        title="科室耗电明细"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        request={async (query) => {
          const {
            current,
            pageSize,
            departmentIds,
            startTime,
            endTime,
          } = query;
          return fetchDepartmentPowerConsumption(isACL, {
            pageNum: Number(current) || 1,
            pageSize: Number(pageSize) || 10,
            departmentIds: normalizeDepartmentId(departmentIds) ?? [],
            startTime,
            endTime,
            orgId,
          });
        }}
        hooks={{
          beforeInit: (query) => {
            const { startTime, endTime, departmentIds } = query;
            return {
              ...query,
              departmentIds: normalizeDepartmentId(departmentIds),
              date: [stringToMoment(startTime), stringToMoment(endTime)],
            };
          },
          beforeSubmit: (formValues) => {
            const { date } = formValues;

            return {
              ...omit(formValues, ['date']),
              current: 1,
              startTime:
                (date?.[0] && momentToString(date[0], WithoutTimeFormat)) ||
                undefined,
              endTime:
                (date?.[1] && momentToString(date[1], WithoutTimeFormat)) ||
                undefined,
            };
          },
          onFormValuesChange: (changedValues) => {
            if (changedValues.date) {
              formRef.current?.setFieldsValue({ dimension: undefined });
            } else if (changedValues.dimension) {
              const days = Number(changedValues.dimension);
              const today = moment();
              const dimensionDays = moment().subtract(days, 'days');
              formRef.current?.setFieldsValue({
                date: [dimensionDays, today],
              });
            }
          },
        }}
      />
    </PageContainer>
  );
};

export default EnergyPowerConsumptionPage;
