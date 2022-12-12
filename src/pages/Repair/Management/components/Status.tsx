import React, { useRef, useState, useEffect } from 'react';
import {
  Divider,
  Modal,
  message,
  Badge,
  Space,
  Button,
  DatePicker,
  Spin,
  Tag,
  Popconfirm,
} from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd/es/table';
import Footerbar from '@/components/Footerbar';
import usePrint from '@/hooks/usePrint';
import useUserInfo from '@/hooks/useUserInfo';
import useDepartments from '@/hooks/useDepartments';
import useACL from '@/hooks/useACL';
import PrintContainer from '@/components/PrintContainer';
import DepartmentSelector from '@/components/DepartmentSelector';
import { batchFetchRawImageUrl } from '@/services/qiniu';
import { AttachmentCategory } from '@/utils/constants';
import {
  download,
  momentToString,
  stringToMoment,
  WithoutTimeFormat,
  batchExportToPDF,
  tableHeight,
} from '@/utils/utils';
import {
  RepairBizConfig as BizConfig,
  ReportStatusText,
} from '@/pages/Maintenance/type';
import {
  OrderStatus,
  RepairOrderStatusConfig,
  RepairMenuType as MenuType,
} from '@/pages/Maintenance/type';
import ProTable from '@/components/ProTable';
import omit from 'omit.js';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { FormInstance } from 'antd/es/form';
import TimelineDrawer from '@/pages/Assets/components/TimelineDrawer';
import useRepairReport from '../hooks/useRepairReport';
import RejectModal from './RejectModal';
import DetailModal from './DetailModal';
import RepairReports from './RepairReports';
import RepairReport from './RepairReport';
import {
  fetchTasks,
  cancelTask,
  accept,
  takeOrder,
  fetchTaskTimelineDetail,
  batchFetchRepairReport,
  exportRepairRecords,
} from '../service';
import type {
  IBatchRepairReportItem,
  ITaskItem,
  ITaskTimelineItem,
} from '../type';
import { OperationType } from '../type';
import { ScrapStatusMap, ScrapStatus } from '@/utils/constants';
import SuggestionModal from '@/components/suggestion';
import TransferOrderModal from './TransferOrderModal';
import {
  initiateTransferAPI,
  revocationOrRefuseAPI,
} from '@/pages/Maintenance/service';

interface IComponentProps {
  menuType: MenuType;
}

const { confirm } = Modal;

// 维修工单列表页
const Status: React.FC<IComponentProps> = ({ menuType }) => {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const isMaintainer = !!currentUser?.isMaintainer; // 是否为工程师
  const [batchLoading, setBatchLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false); // 维修记录导出中
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const orgId = currentUser?.org.id;
  const crId = currentUser!.currentCustomer?.siteOrgId;
  const { departmentsTreeData } = useDepartments(
    {
      orgId: crId ?? orgId!,
    },
    true,
  );
  const [timelineDrawerVisible, setTimelineDrawerVisible] = useState(false);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineItems, setTimelineItems] = useState<ITaskTimelineItem[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTaskKeys, setSelectedTaskKeys] = useState<number[]>([]);
  const [currentRecord, setCurrentRecord] = useState<ITaskItem>();
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [repairReports, setRepairReports] = useState<IBatchRepairReportItem[]>(
    [],
  );
  const [repairReportsImages, setRepairReportsImages] = useState<string[][]>(
    [],
  );
  const operationRef = useRef<OperationType>(OperationType.NOOP);
  const { componentRef, onPrint: emitPrint } = usePrint({
    onAfterPrint: () => {
      operationRef.current = OperationType.NOOP;
      setCurrentRecord(undefined);
    },
  });
  const [recordMenuType, setrecordMenuType] = useState<string>();
  const {
    loading: detailLoading,
    repairReport,
    images: repairReportImages,
  } = useRepairReport(currentRecord);
  const [suggestionVisible, setSuggestionVisible] = useState<boolean>(false);
  const [recordId, setRecordId] = useState<number>(0);
  const [transferOrderVisible, setTransferOrderVisible] = useState<boolean>(
    false,
  );
  const DefaultQuery = {
    menu: MenuType[menuType],
    current: 1,
    pageSize: 30,
    equipmentName: '',
    startDate: undefined,
    endDate: undefined,
    departmentId: [],
  };

  // 发起转单
  const onTransferOrder = (record: ITaskItem) => {
    setCurrentRecord(record);
    setTransferOrderVisible(true);
  };

  // 转单取消按钮
  const onTransferOrderCancel = () => {
    setTransferOrderVisible(false);
  };

  //转单确认按钮
  const onTransferOrderConfirm = async (form: any) => {
    try {
      await initiateTransferAPI(form);
      setTransferOrderVisible(false);
      message.success('转单成功');
      actionRef.current?.reload();
    } catch (err: any) {
      console.log(err.message);
    }
  };

  // 转单 撤销和拒绝
  const onTransferOrderCancael = async (record: ITaskItem, status: string) => {
    try {
      await revocationOrRefuseAPI({
        taskId: record.id,
        status: status,
      });
      message.success(status == 'REVOCATION' ? '转单已撤销' : '转单已拒绝');
      actionRef.current?.reload();
    } catch (err) {
      console.log(err);
    }
  };

  //转单 同意
  const onTransferOrderOk = async (record: ITaskItem) => {
    try {
      const { code } = await takeOrder(record.id, {
        engineerId: currentUser?.employee?.id,
        engineerName: currentUser?.employee?.name,
        crId: isMaintainer ? record.crId : null,
      });
      if (code === 0) {
        message.success('操作成功');
        actionRef.current?.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const BaseColumns: ProTableColumn<ITaskItem>[] = [
    {
      title: '单号',
      dataIndex: 'taskNo',
      key: 'taskNo',
      width: 180,
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
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      width: 160,
      hideInTable: true,
    },
    {
      title: '生产厂商',
      dataIndex: 'manufacturerName',
      key: 'manufacturerName',
      width: 160,
      hideInTable: true,
    },
    {
      title: '报单时间',
      dataIndex: 'since',
      key: 'since',
      hideInTable: true,
      renderFormItem: () => {
        return <DatePicker.RangePicker style={{ width: '100%' }} />;
      },
    },
    {
      title: '设备型号',
      dataIndex: 'modelName',
      key: 'modelName',
      hideInTable: true,
    },
    {
      title: '设备序列号',
      dataIndex: 'sn',
      key: 'sn',
      hideInTable: true,
    },
    {
      title: '设备编号',
      dataIndex: 'equipmentNo',
      key: 'equipmentNo',
      hideInTable: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentId',
      key: 'departmentId',
      renderFormItem: () => (
        <DepartmentSelector
          treeSelectProps={{
            multiple: true,
            treeData: departmentsTreeData,
            virtual: false,
          }}
        />
      ),
      hideInTable: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '报修人',
      dataIndex: 'initPersonName',
      key: 'initPersonName',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '报修时间',
      dataIndex: 'initTime',
      key: 'initTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '计划结束时间',
      dataIndex: 'planEndTime',
      key: 'planEndTime',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '预计维修时间',
      dataIndex: 'planBeginTime',
      key: 'planBeginTime',
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
          <Tag color={itemConfig?.color ?? 'default'}>{itemConfig?.label}</Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      hideInSearch: true,
      render: (status) =>
        status ? (
          <Badge
            color={RepairOrderStatusConfig.get(status)?.badge}
            text={RepairOrderStatusConfig.get(status)?.label}
          />
        ) : (
          ''
        ),
    },
    {
      title: '维保公司',
      dataIndex: 'undertakerName',
      key: 'undertakerName',
      width: 200,
      hideInSearch: true,
    },
  ];

  const onClickOperation = async (
    record: ITaskItem,
    operation: OperationType,
  ) => {
    const { id, engineerId, engineerName } = record;
    operationRef.current = operation;
    setCurrentRecord(record);
    try {
      switch (operation) {
        case OperationType.VIEW: // 详情
          setDetailModalVisible(true);
          break;
        case OperationType.TAKE: // 接单
          confirm({
            title: '提示',
            content: '确定接单吗?',
            onOk: async () => {
              if (
                !currentUser?.employee.id ||
                !currentUser?.employee.name ||
                !currentUser?.currentCustomer?.id
              ) {
                message.error('员工ID｜员工姓名｜签约公司可能为空');
                return;
              }
              const { code } = await takeOrder(id, {
                engineerId: currentUser.employee.id,
                engineerName: currentUser.employee.name,
                crId: isMaintainer ? currentUser.currentCustomer.id : null,
              });
              if (code === 0) {
                message.success('操作成功');
                actionRef.current?.reload();
              }
            },
          });
          break;
        case OperationType.CANCEL: // 撤单
          confirm({
            title: '提示',
            content: '确定撤单吗?',
            onOk: async () => {
              const { code } = await cancelTask(id, {
                employeeId: engineerId,
                employeeName: engineerName,
              });
              if (code === 0) {
                message.success('操作成功');
                actionRef.current?.reload();
              }
            },
          });
          break;
        case OperationType.ACCEPT: // 通过
          setSuggestionVisible(true);
          setRecordId(record.id);

          break;
        case OperationType.REJECT: // 不通过
          setRejectModalVisible(true);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 通过弹框确定按钮
  const onSuggestionSubmit = async (formValue: any) => {
    try {
      // eslint-disable-next-line no-case-declarations
      await accept(recordId, {
        employeeId: currentUser!.employee.id,
        employeeName: currentUser!.employee.name,
        taskScore: formValue.rate,
        reason: formValue.reason,
      });
      message.success('操作成功');
      setSuggestionVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const onCancelDetailModal = () => {
    setDetailModalVisible(false);
    setCurrentRecord(undefined);
  };

  const loadTaskTimeline = async (taskId: number) => {
    try {
      setTimelineLoading(true);
      const { code, data } = await fetchTaskTimelineDetail(taskId);
      if (code === 0) {
        setTimelineItems(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimelineLoading(false);
    }
  };

  const onShowTimeline = async (record: ITaskItem) => {
    setCurrentRecord(record);
    setTimelineDrawerVisible(true);
    await loadTaskTimeline(record.id);
  };

  const onBatchExportReport = async () => {
    if (!currentUser?.org.id || batchLoading) {
      return;
    }
    if (selectedTaskKeys.length > 30) {
      message.warning('批量导出单次最多30条');
      return;
    }
    setExportLoading(true);
    const bizConfig = BizConfig.get(menuType);
    if (bizConfig) {
      const status = Array.isArray(bizConfig.status)
        ? [...bizConfig.status]
        : [bizConfig.status];
      const formData: any = {
        repairTaskIds: selectedTaskKeys,
        status,
      };
      if (isMaintainer) {
        formData.crId = [currentUser?.currentCustomer?.id];
      } else {
        formData.orgId = [orgId!];
      }
      setBatchLoading(true);
      operationRef.current = OperationType.EXPORT;
      try {
        const { data, code } = await batchFetchRepairReport(formData);
        const attachments = data
          .map((i) =>
            i.simpleAttachmentInfoList
              .filter(
                (e) => e.category === AttachmentCategory.MP_REPAIR_FAILURE,
              )
              .map((item) => item.res),
          )
          .flat();

        const { data: imageData } = await batchFetchRawImageUrl(attachments);
        const imgResults: string[][] = [];
        let startIndex = 0;
        data.forEach((item) => {
          const imgLen =
            item.simpleAttachmentInfoList.filter(
              (e) => e.category === AttachmentCategory.MP_REPAIR_FAILURE,
            ).length ?? 0;
          if (!imgLen) {
            imgResults.push([]);
          } else {
            imgResults.push(imageData.slice(startIndex, startIndex + imgLen));
            startIndex += imgLen;
          }
        });

        if (code === 0) {
          setRepairReports(data);
          setRepairReportsImages(imgResults);
          const timer = setTimeout(async () => {
            const doms = Array.from(
              document.querySelectorAll('.repairReportsWrapper .repairReport'),
            );
            doms.forEach((dom, i) =>
              dom.setAttribute('data-name', data[i].repairTask.taskNo),
            );
            await batchExportToPDF(doms as HTMLElement[], '维修报告');
            setBatchLoading(false);
            setExportLoading(false);
            clearTimeout(timer);
          }, 1000);
        }
      } catch (error) {
        console.error(error);
        message.error('未知错误，请联系管理员');
        setBatchLoading(false);
        setExportLoading(false);
      }
    }
  };

  // 导出维修记录（excel）
  // eslint-disable-next-line consistent-return
  const onExportRepairRecords = async () => {
    try {
      if (currentUser?.isCustomersEmpty) {
        return;
      }
      setExporting(true);
      const bizConfig = BizConfig.get(menuType);
      const formValues = formRef.current?.getFieldsValue();
      const { since } = formValues;
      if (bizConfig) {
        const status = Array.isArray(bizConfig.status)
          ? [...bizConfig.status]
          : [bizConfig.status];
        const [startDateMoment, endDateMoment] = since ?? [
          undefined,
          undefined,
        ];

        const formData: any = {
          ...omit(formValues, ['menu', 'current', 'pageSize', 'since']),
          status,
          startDate: startDateMoment
            ? momentToString(startDateMoment, WithoutTimeFormat)
            : undefined,
          endDate: endDateMoment
            ? momentToString(endDateMoment, WithoutTimeFormat)
            : undefined,
        };

        if (isMaintainer) {
          formData.crId = [currentUser?.currentCustomer?.id];
          if (menuType === MenuType.Repair_Report) {
            formData.reportStatus = bizConfig.reportStatus;
          }
        } else {
          formData.orgId = [orgId!];
        }
        const { data, response } = await exportRepairRecords(formData, isACL);
        download(data, response);
        message.success('导出成功');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const operationColumn: ProTableColumn<ITaskItem> = {
    title: '操作',
    key: 'operation',
    width: 180,
    hideInSearch: true,
    fixed: 'right',
    render: (_, record) => {
      switch (menuType) {
        case MenuType.To_Be_Responded: //待响应
          return (
            <>
              {record.isScrap == ScrapStatus.COMMON &&
                record.status === 'INIT' &&
                currentUser?.isMaintainer && (
                  <>
                    <a
                      onClick={() =>
                        onClickOperation(record, OperationType.TAKE)
                      }
                    >
                      接单
                    </a>
                    <Divider type="vertical" />
                  </>
                )}
              {record.engineerId === currentUser?.employee.id && (
                <>
                  <a onClick={() => onTransferOrder(record)}>转单</a>
                  <Divider type="vertical" />
                </>
              )}
              <a onClick={() => onClickOperation(record, OperationType.VIEW)}>
                详情
              </a>
            </>
          );
        case MenuType.Reported_For_Repair: //已报修
          return (
            <>
              {record.isScrap == ScrapStatus.COMMON &&
                record.status === OrderStatus.INIT && (
                  <>
                    <a
                      onClick={() =>
                        onClickOperation(record, OperationType.CANCEL)
                      }
                    >
                      撤单
                    </a>
                    <Divider type="vertical" />
                  </>
                )}
              {record.isScrap == ScrapStatus.COMMON &&
                record.status == OrderStatus.ASSIGNED &&
                record.engineerId === currentUser?.employee.id && (
                  <>
                    <a onClick={() => onTransferOrder(record)}>转单</a>
                    <Divider type="vertical" />
                  </>
                )}
              <a onClick={() => onClickOperation(record, OperationType.VIEW)}>
                详情
              </a>
            </>
          );
        case MenuType.Waiting_For_Acceptance: //待验收
          return (
            <>
              {record.isScrap == ScrapStatus.COMMON && currentUser?.isHospital && (
                <>
                  <a
                    onClick={() =>
                      onClickOperation(record, OperationType.ACCEPT)
                    }
                  >
                    通过
                  </a>
                  <Divider type="vertical" />
                  <a
                    onClick={() =>
                      onClickOperation(record, OperationType.REJECT)
                    }
                  >
                    不通过
                  </a>
                  <Divider type="vertical" />
                </>
              )}

              <a onClick={() => onClickOperation(record, OperationType.VIEW)}>
                详情
              </a>
            </>
          );
        case MenuType.Acceptance_Completed: //已验收
          return (
            <>
              <a onClick={() => onClickOperation(record, OperationType.PRINT)}>
                打印
              </a>
              <Divider type="vertical" />
              <a onClick={() => onClickOperation(record, OperationType.VIEW)}>
                详情
              </a>
            </>
          );
        case MenuType.In_The_Repair: //维修中
          return (
            <>
              {record.engineerId === currentUser?.employee.id && (
                <>
                  <a onClick={() => onTransferOrder(record)}>转单</a>
                  <Divider type="vertical" />
                </>
              )}
              <a onClick={() => onClickOperation(record, OperationType.VIEW)}>
                详情
              </a>
            </>
          );
        case MenuType.Repair_Report: //维修报告
          return (
            <>
              <a onClick={() => onClickOperation(record, OperationType.VIEW)}>
                详情
              </a>
            </>
          );
        case MenuType.Transfer_Order: //转单中
          return (
            <>
              {record.isScrap == ScrapStatus.COMMON &&
                record.engineerId === currentUser?.employee.id && (
                  <>
                    <Popconfirm
                      title="确定要撤销吗？"
                      onConfirm={() =>
                        onTransferOrderCancael(record, 'REVOCATION')
                      }
                    >
                      <a>撤销</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                  </>
                )}
              {record.isScrap == ScrapStatus.COMMON &&
                record.newEngineerId === currentUser?.employee.id && (
                  <>
                    <Popconfirm
                      title="确定要拒绝吗？"
                      onConfirm={() => onTransferOrderCancael(record, 'REFUSE')}
                    >
                      <a style={{ color: 'red' }}>拒绝</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Popconfirm
                      title="确定要接单吗？"
                      onConfirm={() => onTransferOrderOk(record)}
                    >
                      <a>接单</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                  </>
                )}
              <a onClick={() => onClickOperation(record, OperationType.VIEW)}>
                详情
              </a>
            </>
          );
        default:
          return null;
      }
    },
  };

  const getColumns = () => {
    return [
      ...BaseColumns.map((columnItem) => {
        if (columnItem.key === 'taskNo') {
          return {
            ...columnItem,
            render: (name: string, record: ITaskItem) => (
              <a onClick={() => onShowTimeline(record)}>{name}</a>
            ),
          };
        }
        if (
          columnItem.key === 'status' &&
          menuType === MenuType.Repair_Report
        ) {
          return {
            ...columnItem,
            dataIndex: 'reportStatus',
            key: 'reportStatus',
            render: (status) => (status ? ReportStatusText[status] : '-'),
          } as ProTableColumn<ITaskItem>;
        }

        if (columnItem.key === 'planBeginTime') {
          switch (menuType) {
            case MenuType.Waiting_For_Acceptance:
              return {
                ...columnItem,
                title: '维修完成时间',
                dataIndex: 'opEndTime',
                key: 'opEndTime',
                width: 180,
              } as ProTableColumn<ITaskItem>;
            case MenuType.Acceptance_Completed:
              return {
                ...columnItem,
                title: '验收完成时间',
                dataIndex: 'checkedTime',
                key: 'checkedTime',
                width: 180,
              } as ProTableColumn<ITaskItem>;
            case MenuType.In_The_Repair:
            case MenuType.Reported_For_Repair:
            case MenuType.To_Be_Responded:
            case MenuType.Repair_Report:
              return undefined;
            default:
              return columnItem;
          }
        }

        return columnItem;
      }),
      menuType === MenuType.Acceptance_Completed ||
      menuType === MenuType.Waiting_For_Acceptance ||
      menuType === MenuType.In_The_Repair
        ? {
            title: '维修工程师',
            dataIndex: 'engineerName',
            key: 'engineerName',
            width: 120,
          }
        : undefined,
      operationColumn,
    ].filter(Boolean) as ProTableColumn<ITaskItem>[];
  };

  useEffect(() => {
    if (
      currentRecord &&
      !detailLoading &&
      operationRef.current === OperationType.PRINT
    ) {
      emitPrint?.();
    }
    // 主要用在消息跳转 当路由地址的menu参数值改变时更新表格
    if (menuType != recordMenuType) {
      actionRef.current?.reset();
    }
  }, [currentRecord, detailLoading, menuType]);

  useEffect(() => {
    let hide: any;
    if (detailLoading && operationRef.current === OperationType.PRINT) {
      hide = message.loading('准备打印中...');
    } else {
      hide?.();
    }
  }, [detailLoading]);

  const rowSelection: TableProps<ITaskItem>['rowSelection'] = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectedTaskKeys,
    onChange: (selectedRowKeys) => {
      setSelectedTaskKeys(selectedRowKeys as number[]);
    },
  };

  const footerbarRightContent = (
    <Space>
      <Button
        ghost
        type="primary"
        onClick={() => setSelectedTaskKeys([])}
        disabled={batchLoading}
      >
        取消选择
      </Button>
      <Button
        ghost
        type="primary"
        onClick={onBatchExportReport}
        disabled={batchLoading}
        loading={batchLoading}
      >
        <ExportOutlined />
        导出至PDF
      </Button>
    </Space>
  );

  return (
    <>
      <Spin spinning={exportLoading} tip="导出资源太大，请耐心等待...">
        <ProTable<ITaskItem, typeof DefaultQuery>
          rowKey="id"
          title="维修工单列表"
          defaultQuery={DefaultQuery}
          columns={getColumns()}
          actionRef={actionRef}
          formRef={formRef}
          rowSelection={rowSelection}
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
              y: tableHeight,
            },
          }}
          options={{
            seqColumn: true,
          }}
          toolBarRender={() => {
            return [
              <Button
                key="import"
                type="primary"
                loading={exporting}
                onClick={onExportRepairRecords}
              >
                导出维修记录(excel)
              </Button>,
            ];
          }}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                onClickOperation(record, OperationType.VIEW);
              },
            };
          }}
          request={async (query) => {
            if (currentUser?.isCustomersEmpty) {
              return {
                success: false,
              };
            }
            const bizConfig = BizConfig.get(menuType);
            if (bizConfig) {
              const status = Array.isArray(bizConfig.status)
                ? [...bizConfig.status]
                : [bizConfig.status];

              const formData: any = {
                ...omit(query, ['menu', 'current', 'pageSize']),
                status,
              };

              if (isMaintainer) {
                formData.crId = [currentUser?.currentCustomer?.id];
                if (menuType === MenuType.Repair_Report) {
                  formData.reportStatus = bizConfig.reportStatus;
                }
              } else {
                formData.orgId = [orgId!];
              }
              return fetchTasks(
                formData,
                isACL,
                Number(query.current) || 1,
                Number(query.pageSize) || 30,
              );
            }
            return {
              success: false,
            };
          }}
          hooks={{
            beforeInit: (query) => {
              const { startDate, endDate } = query;
              setrecordMenuType(query.menu);
              return {
                ...query,
                since: [stringToMoment(startDate), stringToMoment(endDate)],
                departmentId: query.departmentId
                  ? query.departmentId.map(Number)
                  : undefined,
              };
            },
            beforeSubmit: (formValues) => {
              const { since } = formValues;
              const [startDateMoment, endDateMoment] = since ?? [
                undefined,
                undefined,
              ];

              return {
                ...omit(formValues, ['since']),
                startDate: startDateMoment
                  ? momentToString(startDateMoment, WithoutTimeFormat)
                  : undefined,
                endDate: endDateMoment
                  ? momentToString(endDateMoment, WithoutTimeFormat)
                  : undefined,
              };
            },
          }}
        />
      </Spin>
      {/* 转单详情 */}
      <TransferOrderModal
        visible={transferOrderVisible}
        detail={currentRecord}
        onCancel={onTransferOrderCancel}
        onConfirm={onTransferOrderConfirm}
      />
      <RejectModal
        visible={rejectModalVisible}
        record={currentRecord as ITaskItem}
        onCancel={() => {
          setRejectModalVisible(false);
          setCurrentRecord(undefined);
        }}
        onSubmit={() => {
          setRejectModalVisible(false);
          setCurrentRecord(undefined);
          actionRef.current?.reload();
        }}
      />
      <DetailModal
        visible={detailModalVisible}
        currentRecord={currentRecord}
        detail={repairReport}
        rawImages={repairReportImages}
        loading={detailLoading}
        onCancel={onCancelDetailModal}
      />
      <TimelineDrawer
        initialData={timelineItems}
        type="task"
        params={{
          currentTask: currentRecord,
        }}
        loading={timelineLoading}
        visible={timelineDrawerVisible}
        onClose={() => {
          setTimelineDrawerVisible(false);
          setTimeout(() => {
            setCurrentRecord(undefined);
          }, 200);
        }}
      />
      <Footerbar
        visible={!!selectedTaskKeys.length}
        leftContent={
          <Space>
            已选择<a>{selectedTaskKeys.length}</a>项
          </Space>
        }
        rightContent={footerbarRightContent}
      />
      <SuggestionModal
        visible={suggestionVisible}
        onCancel={() => setSuggestionVisible(false)}
        onSubmit={onSuggestionSubmit}
      />
      <PrintContainer>
        <div ref={componentRef}>
          <RepairReport
            task={currentRecord}
            detail={repairReport}
            rawImages={repairReportImages}
          />
        </div>
      </PrintContainer>
      <RepairReports reports={repairReports} rawImages={repairReportsImages} />
    </>
  );
};

export default Status;
