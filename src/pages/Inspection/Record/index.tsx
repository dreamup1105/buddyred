import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { DatePicker, Button, message, Tag, Badge } from 'antd';
import omit from 'omit.js';
import {
  download,
  momentToString,
  stringToMoment,
  WithoutTimeFormat,
} from '@/utils/utils';
import ProTable from '@/components/ProTable';
import useACL from '@/hooks/useACL';
import useUserInfo from '@/hooks/useUserInfo';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import { EquipmentStatusMap } from '../type';
import type { IInspectionRecordItem } from '../type';
import { fetchInspectionRecords, exportInspectionRecords } from '../service';
import { tableHeight } from '@/utils/utils';
import { ScrapStatusMap } from '@/utils/constants';
// import { ConsoleSqlOutlined } from '@ant-design/icons';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  endTime: undefined,
  startTime: undefined,
};

// 巡检记录页面
const InspectionRecordPage: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const { isACL } = useACL();
  const { currentUser } = useUserInfo();
  const actionRef = useRef<ActionType>();
  const orgId = currentUser?.org.id;
  const isMaintainer = !!currentUser?.isMaintainer; // 是否为工程师

  const columns: ProTableColumn<IInspectionRecordItem>[] = [
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '设备名称',
      dataIndex: 'equipNameNew',
      key: 'equipNameNew',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '报废状态',
      dataIndex: 'isScrap',
      key: 'isScrap',
      width: 100,
      hideInSearch: true,
      render: (status) => {
        const itemConfig = ScrapStatusMap.get(status);
        return (
          <Badge color={itemConfig?.color ?? 'default'}>
            {itemConfig?.label}
          </Badge>
        );
      },
    },
    {
      title: '巡检状态',
      dataIndex: 'equipmentStatus',
      key: 'equipmentStatus',
      width: 100,
      hideInSearch: true,
      render: (status) => {
        const itemConfig = EquipmentStatusMap.get(status);
        return (
          <Tag color={itemConfig?.color ?? 'default'}>{itemConfig?.label}</Tag>
        );
      },
    },
    {
      title: '巡检人员',
      dataIndex: 'commitEmployeeName',
      key: 'commitEmployeeName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '巡检日期',
      dataIndex: 'commitAuditTime',
      key: 'commitAuditTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '验收人员',
      dataIndex: 'auditEmployeeName',
      key: 'auditEmployeeName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '验收日期',
      dataIndex: 'auditTime',
      key: 'auditTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '巡检日期',
      dataIndex: 'date',
      key: 'date',
      hideInTable: true,
      renderFormItem: () => {
        return <DatePicker.RangePicker style={{ width: '100%' }} />;
      },
    },
  ];

  const onExportInspectionRecords = async () => {
    if (exporting || currentUser?.isCustomersEmpty) {
      return;
    }
    setExporting(true);
    try {
      const formValues = actionRef.current?.getSearchFormValues();
      const { date } = formValues;
      const [startDateMoment, endDateMoment] = date ?? [undefined, undefined];
      const formData = {
        ...omit(formValues, ['current', 'pageSize', 'date']),
        startDate: startDateMoment
          ? momentToString(startDateMoment, WithoutTimeFormat)
          : undefined,
        endDate: endDateMoment
          ? momentToString(endDateMoment, WithoutTimeFormat)
          : undefined,
      };
      if (currentUser?.isMaintainer) {
        formData.crId = [currentUser?.currentCustomer?.id];
      } else {
        formData.orgId = [orgId!];
      }
      const { data, response } = await exportInspectionRecords(formData, isACL);
      download(data, response);
      message.success('导出成功');
    } catch (error) {
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageContainer>
      <ProTable<IInspectionRecordItem, typeof DefaultQuery>
        rowKey="id"
        title="巡检记录"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        toolBarRender={() => {
          return [
            <Button
              key="import"
              type="primary"
              loading={exporting}
              onClick={onExportInspectionRecords}
            >
              导出巡检记录(excel)
            </Button>,
          ];
        }}
        request={async (query) => {
          const { startTime, endTime, pageSize, current } = query;
          const formData: any = {
            startTime,
            endTime,
            pageSize,
            pageNum: current,
          };

          if (isMaintainer) {
            formData.crId = currentUser?.currentCustomer?.id;
          } else {
            formData.orgId = [orgId!];
          }

          return fetchInspectionRecords(formData, isACL);
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
            const [startTimeMoment, endTimeMoment] = date ?? [
              undefined,
              undefined,
            ];

            return {
              ...omit(formValues, ['date']),
              startTime: startTimeMoment
                ? momentToString(startTimeMoment, WithoutTimeFormat)
                : undefined,
              endTime: endTimeMoment
                ? momentToString(endTimeMoment, WithoutTimeFormat)
                : undefined,
            };
          },
        }}
      />
    </PageContainer>
  );
};

export default InspectionRecordPage;
