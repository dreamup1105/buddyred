import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@/components/ProTable';
import { PlusOutlined, ExportOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Popconfirm,
  message,
  Input,
  Space,
  Tooltip,
  DatePicker,
} from 'antd';
import useUserInfo from '@/hooks/useUserInfo';
import useMount from '@/hooks/useMount';
import useACL from '@/hooks/useACL';
import useAdverseEventParams from './hooks/useAdverseEventParams';
import Footerbar from '@/components/Footerbar';
import omit from 'omit.js';
import {
  momentToString,
  stringToMoment,
  tableHeight,
  WithoutTimeFormat,
} from '@/utils/utils';
import type { TableProps } from 'antd/es/table';
import type { ProTableColumn, ActionType } from '@/components/ProTable';
import type { IAdverseEventItem, IAdverseEventDetailItem } from './type';
import { OperationType } from './type';
import {
  fetchAdverseEvents,
  fetchAdverseEventDetail,
  deleteAdverseEvent,
  exportAdverseEvent,
  batchExportAdverseEvent,
  exportAdverseEventReportRecords,
} from './service';
import CreateEventFormModal from './components/CreateEventForm';
import EventDetailModal from './components/EventDetail';
import styles from './index.less';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  q: '',
  startHappenDate: undefined,
  endHappenDate: undefined,
  startReportDate: undefined,
  endReportDate: undefined,
};

const AdverseEventPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const [operation, setOperation] = useState<OperationType>(OperationType.NOOP);
  const [
    createEventFormModalVisible,
    setCreateEventFormModalVisible,
  ] = useState(false);
  const [selectedEquipKeys, setSelectedEquipKeys] = useState<number[]>([]);
  const [eventDetailModalVisible, setEventDetailModalVisible] = useState(false);
  const actionRef = useRef<ActionType>();
  const [detail, setDetail] = useState<IAdverseEventDetailItem>();
  const { params, loadAdverseEventParams } = useAdverseEventParams();

  const loadAdverseEventDetail = async (eventId: number) => {
    try {
      const { code, data } = await fetchAdverseEventDetail(eventId);
      if (code === 0) {
        setDetail(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickOperation = async (
    record: IAdverseEventItem,
    action: OperationType,
  ) => {
    setOperation(action);
    switch (action) {
      case OperationType.DELETE:
        try {
          const { code } = await deleteAdverseEvent(record.id);
          if (code === 0) {
            message.success('删除成功');
            actionRef.current?.reload();
          }
        } catch (error) {
          console.error(error);
        }
        break;
      case OperationType.VIEW:
        await loadAdverseEventDetail(record.id);
        setEventDetailModalVisible(true);
        break;
      default:
        break;
    }
  };

  const columns: ProTableColumn<IAdverseEventItem>[] = [
    {
      title: '关键字',
      dataIndex: 'q',
      hideInTable: true,
      renderFormItem: () => {
        return <Input placeholder="设备名称/报告人姓名" />;
      },
    },
    {
      title: '报告日期',
      dataIndex: 'reportDate',
      key: 'reportDate',
      hideInTable: true,
      renderFormItem: () => (
        <DatePicker.RangePicker
          allowEmpty={[true, true]}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '事件发生日期',
      dataIndex: 'happenDate',
      key: 'happenDate',
      hideInTable: true,
      renderFormItem: () => (
        <DatePicker.RangePicker
          allowEmpty={[true, true]}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '报告编号',
      dataIndex: 'reportNo',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '报告日期',
      dataIndex: 'reportTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '事件发生日期',
      dataIndex: 'happenTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '事件等级',
      dataIndex: 'eventLevel',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '事件类别',
      dataIndex: 'eventType',
      width: 200,
      hideInSearch: true,
      render: (eventType) => {
        return (
          <Tooltip title={eventType}>
            <div className={styles.eventTypeCell}>{eventType}</div>
          </Tooltip>
        );
      },
    },
    {
      title: '报告人',
      dataIndex: 'employeeName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '设备名称',
      dataIndex: 'equipNameNew',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 180,
      fixed: 'right',
      render: (_, record) => {
        return [
          <a
            key="detail"
            onClick={() => onClickOperation(record, OperationType.VIEW)}
          >
            详情
          </a>,
          <Divider key="divider1" type="vertical" />,
          <a key="export" href={exportAdverseEvent(record.id)}>
            导出
          </a>,
          <Divider key="divider2" type="vertical" />,
          <Popconfirm
            key="delete"
            title="确定要删除该项目吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => onClickOperation(record, OperationType.DELETE)}
          >
            <a>删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];

  const footerbarLeftContent = (
    <Space>
      已选择<a>{selectedEquipKeys.length}</a>项
    </Space>
  );

  const footerbarRightContent = (
    <Space>
      <Button ghost type="primary" onClick={() => setSelectedEquipKeys([])}>
        取消选择
      </Button>
      <Button
        ghost
        type="primary"
        href={batchExportAdverseEvent(selectedEquipKeys)}
      >
        <ExportOutlined />
        导出
      </Button>
    </Space>
  );

  const onAddItem = () => {
    setOperation(OperationType.CREATE);
    setCreateEventFormModalVisible(true);
  };

  useMount(() => {
    loadAdverseEventParams();
  });

  const rowSelection: TableProps<IAdverseEventItem>['rowSelection'] = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectedEquipKeys,
    onChange: (selectedRowKeys) => {
      setSelectedEquipKeys(selectedRowKeys as number[]);
    },
  };

  return (
    <PageContainer>
      <ProTable<IAdverseEventItem, typeof DefaultQuery>
        columns={columns}
        rowKey="id"
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        request={async (query) => {
          if (!currentUser?.org.id) {
            return {
              success: false,
              data: [],
            };
          }
          const {
            q,
            current,
            pageSize,
            startHappenDate,
            endHappenDate,
            startReportDate,
            endReportDate,
          } = query;

          const isEmptyHappenDate = !startHappenDate && !endHappenDate;
          const isEmptyReportDate = !startReportDate && !endReportDate;

          console.log(startHappenDate);

          try {
            const res = await fetchAdverseEvents(isACL, {
              orgId: currentUser.org.id,
              pageNum: current,
              pageSize,
              searchText: q,
              happenDate: isEmptyHappenDate
                ? undefined
                : {
                    minValue: startHappenDate + ' 00:00:00',
                    maxValue: endHappenDate,
                  },
              reportDate: isEmptyReportDate
                ? undefined
                : {
                    minValue: startReportDate + ' 00:00:00',
                    maxValue: endReportDate,
                  },
            });
            // eslint-disable-next-line consistent-return
            return {
              ...res,
              success: true,
            } as any;
          } catch (error) {
            console.error(error);
            return {
              success: true,
              data: [],
              total: 0,
            };
          }
        }}
        hooks={{
          beforeInit: (query) => {
            const {
              startHappenDate,
              endHappenDate,
              startReportDate,
              endReportDate,
            } = query;
            return {
              ...DefaultQuery,
              ...query,
              happenDate: [
                stringToMoment(startHappenDate),
                stringToMoment(endHappenDate),
              ],
              reportDate: [
                stringToMoment(startReportDate),
                stringToMoment(endReportDate),
              ],
              collapsed: !(startHappenDate || endHappenDate),
            };
          },
          beforeSubmit: (formValues) => {
            const { happenDate, reportDate } = formValues;

            return {
              ...omit(formValues, ['happenDate', 'reportDate']),
              startHappenDate:
                (happenDate?.[0] &&
                  momentToString(happenDate[0], WithoutTimeFormat)) ||
                undefined,
              endHappenDate:
                (happenDate?.[1] && momentToString(happenDate[1])) || undefined,
              startReportDate:
                (reportDate?.[0] &&
                  momentToString(reportDate[0], WithoutTimeFormat)) ||
                undefined,
              endReportDate:
                (reportDate?.[1] && momentToString(reportDate[1])) || undefined,
            };
          },
        }}
        defaultQuery={DefaultQuery}
        actionRef={actionRef}
        title="不良事件列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={onAddItem}
          >
            新建
          </Button>,
          <Button
            key="export"
            icon={<ExportOutlined />}
            href={exportAdverseEventReportRecords(currentUser!.org.id, true)}
          >
            导出上报记录
          </Button>,
        ]}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              console.log(record);
            },
          };
        }}
        rowSelection={rowSelection}
      />
      <CreateEventFormModal
        visible={createEventFormModalVisible}
        params={params}
        onAfterSubmit={() => {
          actionRef.current?.reload(true);
          setCreateEventFormModalVisible(false);
        }}
        onAfterCancel={() => {
          setCreateEventFormModalVisible(false);
        }}
      />
      <EventDetailModal
        visible={eventDetailModalVisible}
        onAfterCancel={() => {
          setEventDetailModalVisible(false);
          setDetail(undefined);
        }}
        initialValues={detail}
        operation={operation}
      />
      <Footerbar
        visible={!!selectedEquipKeys.length}
        leftContent={footerbarLeftContent}
        rightContent={footerbarRightContent}
      />
    </PageContainer>
  );
};

export default AdverseEventPage;
