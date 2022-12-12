import React, { useRef, useEffect } from 'react';
import { Modal, Button } from 'antd';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import useUserInfo from '@/hooks/useUserInfo';
import { DatePicker } from 'antd';
import omit from 'omit.js';
import moment from 'moment';
import {
  stringToMoment,
  momentToString,
  WithoutTimeFormat,
} from '@/utils/utils';
// import styles from '../index.less';
import type { HistoryItems } from '../type';
import { consumPtionTimeIntervalAPI } from '../service';

interface IComponentProps {
  visible: boolean;
  id?: number;
  onCancel: () => void;
}
const DefaultQuery = {
  startTime: undefined,
  endTime: undefined,
  orgId: 0,
  current: 1,
  pageSize: 30,
};

// 默认开始时间（昨天） 结束时间（今天）
const startTimeDefault = moment(new Date())
  .subtract(1, 'days')
  .format('YYYY-MM-DD');
const endTimeDefault = moment().format('YYYY-MM-DD');

const HistoryDetail: React.FC<IComponentProps> = ({
  visible,
  id,
  onCancel,
}) => {
  const actionRef = useRef<ActionType>();
  const { currentUser } = useUserInfo();
  const orgId = currentUser?.org.id;

  const columns: ProTableColumn<HistoryItems>[] = [
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
      title: '瞬时时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '瞬时电压(V)',
      dataIndex: 'timingVoltage',
      key: 'timingVoltage',
      hideInSearch: true,
    },
    {
      title: '瞬时电流(A)',
      dataIndex: 'timingCurrent',
      key: 'timingCurrent',
      hideInSearch: true,
    },
    {
      title: '温度(℃)',
      dataIndex: 'temperature',
      key: 'temperature',
      hideInSearch: true,
    },
    {
      title: '',
      dataIndex: 'date',
      key: 'date',
      width: 600,
      hideInTable: true,
      renderFormItem: () => {
        return (
          <DatePicker.RangePicker
            allowClear={false}
            style={{ width: '100%' }}
          />
        );
      },
    },
  ];

  useEffect(() => {
    actionRef.current?.reload();
  }, [id]);

  return (
    <Modal
      title="耗电明细"
      visible={visible}
      width="1200px"
      bodyStyle={{
        height: 600,
        overflow: 'scroll',
      }}
      onCancel={onCancel}
      footer={<Button onClick={onCancel}>关闭</Button>}
    >
      <ProTable<HistoryItems, typeof DefaultQuery>
        rowKey="id"
        title="设备耗电历史(默认查询昨天到今天)"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        formProps={{
          labelCol: {
            span: 7,
          },
          style: {
            marginBottom: '20px',
          },
        }}
        tableProps={{
          scroll: {
            y: 350,
          },
        }}
        request={async (query) => {
          const { startTime, endTime, current, pageSize } = query;
          return consumPtionTimeIntervalAPI({
            startTime: (startTime || startTimeDefault) + ' 00:00:00',
            endTime: (endTime || endTimeDefault) + ' 23:59:59',
            equipmentId: id,
            orgId,
            pageNum: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
          });
        }}
        hooks={{
          beforeInit: (query) => {
            return {
              ...query,
              date: [
                stringToMoment(startTimeDefault),
                stringToMoment(endTimeDefault),
              ],
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
        }}
      />
    </Modal>
  );
};

export default HistoryDetail;
