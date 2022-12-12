import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { DatePicker, Radio } from 'antd';
import ProTable from '@/components/ProTable';
import useUserInfo from '@/hooks/useUserInfo';
import useACL from '@/hooks/useACL';
import omit from 'omit.js';
import {
  stringToMoment,
  momentToString,
  DefaultDateFormat,
} from '@/utils/utils';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { FormInstance } from 'antd/es/form';
import type { ITableListItem } from './type';
import { fetchEquipmentPowerConsumption } from './service';
import moment from 'moment';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  equipmentName: undefined,
  startTime: undefined,
  endTime: undefined,
};

const EnergyEquipmentPage: React.FC = () => {
  const { isACL } = useACL();
  const { currentUser } = useUserInfo();
  const orgId = currentUser?.org.id;
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      hideInSearch: true,
    },
    {
      title: '设备名称',
      dataIndex: 'equipNameNew',
      key: 'equipNameNew',
      hideInSearch: true,
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      hideInTable: true,
    },
    {
      title: '设备型号',
      dataIndex: 'modelName',
      key: 'modelName',
      hideInSearch: true,
    },
    {
      title: '设备厂商',
      dataIndex: 'manufacturerName',
      key: 'manufacturerName',
      hideInSearch: true,
    },
    {
      title: '设备序列号',
      dataIndex: 'sn',
      key: 'sn',
      hideInSearch: true,
    },
    {
      title: '设备类型',
      dataIndex: 'typeName',
      key: 'typeName',
      hideInSearch: true,
    },
    {
      title: '总耗电(kw/h)',
      dataIndex: 'powerConsumption',
      key: 'powerConsumption',
      hideInSearch: true,
    },
    {
      title: '总检测人数',
      dataIndex: 'detectNum',
      key: 'detectNum',
      hideInSearch: true,
    },
    {
      title: '起止日期',
      dataIndex: 'date',
      key: 'date',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <DatePicker.RangePicker
            showTime={{ format: 'HH:mm' }}
            format={DefaultDateFormat}
            style={{ width: '100%' }}
          />
        );
      },
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
        rowKey="equipmentId"
        title="设备耗电"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        request={async (query) => {
          const {
            current,
            pageSize,
            equipmentName,
            startTime,
            endTime,
          } = query;
          return fetchEquipmentPowerConsumption(isACL, {
            orgId: orgId!,
            equipmentName,
            pageNum: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
            startTime,
            endTime,
          });
        }}
        hooks={{
          beforeInit: (query) => {
            const { startTime, endTime } = query;
            return {
              ...query,
              date: [stringToMoment(startTime), stringToMoment(endTime)],
            };
          },
          beforeSubmit: (formValues) => {
            const { date } = formValues;

            return {
              ...omit(formValues, ['date']),
              current: 1,
              startTime:
                (date?.[0] && momentToString(date[0], DefaultDateFormat)) ||
                undefined,
              endTime:
                (date?.[1] && momentToString(date[1], DefaultDateFormat)) ||
                undefined,
            };
          },
          onFormValuesChange: (changedValues) => {
            if (changedValues.date) {
              formRef.current?.setFieldsValue({ dimension: undefined });
            } else if (changedValues.dimension) {
              const days = Number(changedValues.dimension);
              const today = moment();
              const dimensionDays =
                moment().subtract(days, 'days').format('YYYY-MM-DD') +
                ' 00:00:00';
              formRef.current?.setFieldsValue({
                date: [moment(dimensionDays, DefaultDateFormat), today],
              });
            }
          },
        }}
      />
    </PageContainer>
  );
};

export default EnergyEquipmentPage;
