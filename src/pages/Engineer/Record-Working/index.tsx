import React, { useEffect, useRef, useState } from 'react';
import { Button, message, DatePicker, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { WalletOutlined } from '@ant-design/icons';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { ITableListItem } from './type';
import { getWorkingRecordAPI, workingRecordExportAPI } from './service';
import type { FormInstance } from 'antd/es/form';
import useENG from '@/hooks/useENG';
import useHOST from '@/hooks/useHOST';
import omit from 'omit.js';
import { history } from 'umi';
import {
  download,
  tableHeight,
  momentToString,
  stringToMoment,
  WithoutTimeFormat,
} from '@/utils/utils';
import styles from './index.less';
import { taskType } from '../type';
import { getSummationCostAPI, getHospitalClientListAPI } from '../service';

interface DefaultQueryItem {
  current: number;
  pageSize: number;
  employeeName?: string | undefined;
  startTime?: string | undefined;
  endTime?: string | undefined;
  hospitalId?: any;
}

const DefaultQuery: DefaultQueryItem = {
  current: 1,
  pageSize: 30,
  employeeName: undefined,
  startTime: undefined,
  endTime: undefined,
  hospitalId: undefined,
};

// 工程师工作记录
const RecordWorkingPage: React.FC = () => {
  const { isEng } = useENG();
  const { isHost } = useHOST();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [sumCount, setSumCount] = useState(0);
  const [hospitalOptions, setHospitalOptions] = useState([]);

  const onRecordClick = (type: string, record: ITableListItem) => {
    switch (type) {
      case taskType.REPAIR:
        history.push(`/engineer/record-repair?empIds=${record.employeeId}`);
        break;
      case taskType.MAINTAIN:
        history.push(`/engineer/record-maintain?empIds=${record.employeeId}`);
        break;
      case taskType.INSPECTION:
        history.push(`/engineer/record-inspection?empIds=${record.employeeId}`);
        break;
    }
  };

  // 获取查询金额/导出参数
  const getParams = () => {
    const formValues = formRef.current?.getFieldsValue();
    const [startTimeMoment, endTimeMoment] = formValues?.date ?? [
      undefined,
      undefined,
    ];
    const params = {
      hospitalIds: formValues?.hospitalId ? [formValues.hospitalId] : undefined,
      startTime: startTimeMoment
        ? momentToString(startTimeMoment, WithoutTimeFormat)
        : undefined,
      endTime: endTimeMoment
        ? momentToString(endTimeMoment, WithoutTimeFormat)
        : undefined,
      employeeName: formValues?.employeeName,
      isEng,
      isHost,
    };
    return params;
  };

  // 导出excel
  const onExport = async () => {
    setExportLoading(true);
    try {
      const { data, response } = await workingRecordExportAPI(getParams());
      download(data, response);
      message.success('导出成功');
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setExportLoading(false);
    }
  };

  // 获取医院列表
  const getHospitalData = async () => {
    try {
      const { data } = await getHospitalClientListAPI({
        isEng,
        isHost,
      });
      const options = data.map((item: any) => {
        return {
          label: item.orgName,
          value: item.orgId,
        };
      });
      setHospitalOptions(options);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // 查询总金额
  const getSummationCostData = async () => {
    try {
      const { data } = await getSummationCostAPI(getParams());
      setSumCount(data.summationCost);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '序号',
      key: 'index',
      width: 65,
      render: (t: any, r: any, index: number) => index + 1,
      hideInSearch: true,
    },
    {
      title: '工程师姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 140,
    },
    {
      title: '医院',
      dataIndex: 'hospitalId',
      key: 'hospitalId',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择签约医院"
            options={hospitalOptions}
          />
        );
      },
    },
    {
      title: '起止日期',
      dataIndex: 'date',
      key: 'date',
      width: 140,
      hideInTable: true,
      renderFormItem: () => {
        return <DatePicker.RangePicker style={{ width: '100%' }} />;
      },
    },
    {
      title: '员工编号',
      dataIndex: 'employeeNo',
      key: 'employeeNo',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '订单总量',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '维修数量',
      dataIndex: 'repairCount',
      key: 'repairCount',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '维修费用',
      dataIndex: 'repairCost',
      key: 'repairCost',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '维修配件费',
      dataIndex: 'accessoriesCost',
      key: 'accessoriesCost',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '配件总费用',
      dataIndex: 'partCost',
      key: 'partCost',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '保养数量',
      dataIndex: 'maintainCount',
      key: 'maintainCount',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '保养配件费用',
      dataIndex: 'mountingsCost',
      key: 'mountingsCost',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '巡检数量',
      dataIndex: 'inspectionCount',
      key: 'inspectionCount',
      width: 140,
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
      title: '响应平均耗时(分钟)',
      dataIndex: 'avgResponseTime',
      key: 'avgResponseTime',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '订单平均耗时(分钟)',
      dataIndex: 'avgWholeTime',
      key: 'avgWholeTime',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '评分',
      dataIndex: 'avgScore',
      key: 'avgScore',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'operation',
      key: 'operation',
      width: 230,
      hideInSearch: true,
      render: (_, record) => {
        return (
          <>
            <a
              className={styles.link}
              onClick={() => onRecordClick(taskType.REPAIR, record)}
            >
              维修记录
            </a>
            <a
              className={styles.link}
              onClick={() => onRecordClick(taskType.MAINTAIN, record)}
            >
              保养记录
            </a>
            <a onClick={() => onRecordClick(taskType.INSPECTION, record)}>
              巡检记录
            </a>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getHospitalData();
  }, []);

  return (
    <PageContainer>
      <ProTable<ITableListItem, typeof DefaultQuery>
        rowKey="bindingId"
        title={`工程师工作记录列表 总金额:${sumCount}元`}
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            icon={<WalletOutlined />}
            loading={exportLoading}
            onClick={onExport}
          >
            导出Excel
          </Button>,
        ]}
        request={async (query) => {
          const {
            current,
            pageSize,
            employeeName,
            startTime,
            endTime,
            hospitalId,
          } = query;
          getSummationCostData();
          return getWorkingRecordAPI({
            current: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
            employeeName,
            startTime,
            endTime,
            isEng,
            isHost,
            hospitalIds: hospitalId ? [hospitalId] : undefined,
          });
        }}
        hooks={{
          beforeInit: (query) => {
            const { startTime, endTime, hospitalId } = query;
            return {
              ...query,
              collapsed: false,
              date: [stringToMoment(startTime), stringToMoment(endTime)],
              hospitalId: hospitalId ? parseInt(hospitalId) : undefined,
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

export default RecordWorkingPage;
