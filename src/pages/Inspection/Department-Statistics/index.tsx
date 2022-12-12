import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tag, DatePicker, Button, message, Badge } from 'antd';
import {
  WithoutTimeFormat,
  momentToString,
  tableHeight,
  stringToMoment,
  download,
} from '@/utils/utils';
import useUserInfo from '@/hooks/useUserInfo';
import useACL from '@/hooks/useACL';
import {
  fetchDepartmentInspectionStat,
  fetchInspectionEquipments,
  queryInspectionSituationAPI,
  exportStatistic,
} from '../service';
import ProTable from '@/components/ProTable';
import type { ActionType } from '@/components/ProTable';
import useMount from '@/hooks/useMount';
import type { ProTableColumn } from '@/components/ProTable';
import moment from 'moment';
import omit from 'omit.js';
import { EquipmentStatusEnum } from '../type';
import type { IDepartmentDetailItem, IEquipmentStatItem } from '../type';
import InspectionRecordTable from './components/InspectionRecordTable';
import styles from './index.less';

// 默认开始时间（昨天） 结束时间（今天）
const startTimeDefault = moment(new Date())
  .subtract(0, 'days')
  .format('YYYY-MM-DD');
const endTimeDefault = moment().format('YYYY-MM-DD');

const defaultQuery = {
  startTime: startTimeDefault,
  endTime: endTimeDefault,
  current: 1,
  pageSize: 30,
  departmentName: '',
};

const InspectionDailyPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const isMaintainer = !!currentUser?.isMaintainer; // 是否为工程师
  const actionRef = useRef<ActionType>();
  // const [departmentStats, setDepartmentStats] = useState<
  //   IDepartmentDetailItem[]
  // >([]); // 部门级别统计列表数据
  const orgId = currentUser?.org.id;
  const [selectedDate, setSelectedDate] = useState<string | null | undefined>(
    moment().format('YYYY-MM-DD'),
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [recordTableVisible, setRecordTableVisible] = useState(false);
  const [equipmentStats, setEquipmentStats] = useState<IEquipmentStatItem[]>(
    [],
  );
  const [currentRecord, setCurrentRecord] = useState<
    IDepartmentDetailItem | undefined
  >();
  const [defaultDate, setdefaultDate] = useState<any>();
  const [exporting, setExporting] = useState(false);

  // 导出巡检记录EXCEL
  const onExportInspectionRecords = async () => {
    // if (exporting || currentUser?.isCustomersEmpty) {
    //   return;
    // }
    setExporting(true);
    const formValues = actionRef.current?.getSearchFormValues();
    const { date } = formValues;
    const [startDateMoment, endDateMoment] = date ?? [undefined, undefined];
    const formData = {
      ...omit(formValues, ['date']),
      startTime: startDateMoment
        ? momentToString(startDateMoment, WithoutTimeFormat)
        : undefined,
      endTime: endDateMoment
        ? momentToString(endDateMoment, WithoutTimeFormat)
        : undefined,
    };
    // formData.crId = currentUser?.currentCustomer?.id;
    if (currentUser?.isMaintainer) {
      formData.crId = currentUser?.currentCustomer?.id;
    } else {
      formData.orgId = [orgId!];
    }

    try {
      const { data, response } = await exportStatistic(formData, isACL);
      download(data, response);
      message.success('导出成功');
    } catch (error: any) {
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  // 日历面板数据
  const getPickerDate = async (startTime?: string, endTime?: string) => {
    try {
      const { data, code } = await queryInspectionSituationAPI(isACL, {
        crId: currentUser?.currentCustomer?.id,
        startTime: startTime || startTimeDefault.slice(0, 8) + '01',
        endTime: endTime || endTimeDefault,
      });
      if (code == 0) {
        setdefaultDate(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // console.log('请求成功');
    }
  };

  // 日历面板切换回调
  const onPanelChange = (current: any) => {
    const startTimeSr = momentToString(current[0], WithoutTimeFormat);
    const startTimeOne: any = startTimeSr?.slice(0, 8) + '01';
    const endTimeSr: any = momentToString(current[1], WithoutTimeFormat);
    getPickerDate(startTimeOne, endTimeSr);
  };

  // 查看详情
  const onViewDetail = async (record: IDepartmentDetailItem) => {
    setDetailLoading(true);
    setRecordTableVisible(true);
    setCurrentRecord(record);
    try {
      const formData: any = {
        departmentId: record.departmentId,
        startTime: record.updDate,
        endTime: record.updDate,
        queryDataFlag: true,
        inspectionFlag: 1,
      };

      if (isACL && isMaintainer) {
        formData.crId = currentUser!.currentCustomer?.id;
      }

      const { data } = await fetchInspectionEquipments(formData);
      setEquipmentStats(data.equipmentDetails);
      setSelectedDate(data.timeQuantum);
    } catch (error) {
      console.error(error);
    } finally {
      setDetailLoading(false);
    }
  };

  useMount(() => {
    // searchForm.setFieldsValue({
    //   inspectionDate: [moment(startTimeDefault), moment(endTimeDefault)],
    // });
    // loadDailyInspectionStat();
    getPickerDate();
  });

  const columns: ProTableColumn<IDepartmentDetailItem>[] = [
    {
      title: '起止日期',
      dataIndex: 'date',
      key: 'date',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <DatePicker.RangePicker
            style={{ width: '100%' }}
            onPanelChange={onPanelChange}
            renderExtraFooter={() => (
              <>
                <Badge
                  status="processing"
                  text="全部巡检正常"
                  style={{ marginRight: '20px' }}
                />
                <Badge status="warning" text="巡检有异常" />
              </>
            )}
            dateRender={(current) => {
              const currentDate: string = `${current.year()}-${
                current.month() < 10
                  ? '0' + (current.month() + 1)
                  : current.month() + 1
              }-${current.date() < 10 ? '0' + current.date() : current.date()}`;
              if (defaultDate.normalCountTimeList.indexOf(currentDate) > -1) {
                return (
                  <div className={styles['date-picker-green']}>
                    {current.date()}
                  </div>
                );
              } else if (
                defaultDate.abnormalCountTimeList.indexOf(currentDate) > -1
              ) {
                return (
                  <div className={styles['date-picker-orange']}>
                    {current.date()}
                  </div>
                );
              } else {
                return (
                  <div className={styles['date-picker-row']}>
                    {current.date()}
                  </div>
                );
              }
            }}
          />
        );
      },
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: '设备数量',
      dataIndex: 'equipmentCount',
      key: 'equipmentCount',
      hideInSearch: true,
    },
    {
      title: '正常数量',
      dataIndex: 'normalCount',
      key: 'normalCount',
      hideInSearch: true,
    },
    {
      title: '异常数量',
      dataIndex: 'abnormalCount',
      key: 'abnormalCount',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const itemConfig = EquipmentStatusEnum.get(status);
        return (
          <Tag color={itemConfig?.color ?? 'default'}>{itemConfig?.label}</Tag>
        );
      },
      hideInSearch: true,
    },
    {
      title: '巡检时间',
      dataIndex: 'updDate',
      key: 'updDate',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      hideInSearch: true,
      render: (_, record) =>
        record.updDate ? <a onClick={() => onViewDetail(record)}>详情</a> : '',
    },
  ];

  return (
    <PageContainer>
      <ProTable<IDepartmentDetailItem, typeof defaultQuery>
        rowKey="bindingId"
        title="科室巡检统计列表"
        defaultQuery={defaultQuery}
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
          const {
            current,
            pageSize,
            startTime,
            endTime,
            departmentName,
          } = query;
          return fetchDepartmentInspectionStat(
            {
              startTime: startTime,
              endTime: endTime,
              departmentName,
              crId: currentUser!.currentCustomer?.id,
              pageNum: Number(current) || 1,
              pageSize: Number(pageSize) || 30,
            },
            isACL,
          );
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
          beforeReset: (query) => {
            return {
              ...query,
              startTime: '',
              endTime: '',
            };
          },
          beforeSubmit: (formValues) => {
            const { date } = formValues;
            return {
              ...omit(formValues, ['date']),
              startTime: date
                ? momentToString(date[0], WithoutTimeFormat)
                : undefined,
              endTime: date
                ? momentToString(date[1], WithoutTimeFormat)
                : undefined,
            };
          },
        }}
      />
      <InspectionRecordTable
        type="Daily"
        date={selectedDate}
        loading={detailLoading}
        visible={recordTableVisible}
        dataSource={equipmentStats}
        currentRecord={currentRecord}
        onCancel={() => {
          setCurrentRecord(undefined);
          setRecordTableVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default InspectionDailyPage;
