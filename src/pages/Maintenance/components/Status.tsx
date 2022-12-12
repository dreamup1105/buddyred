import React, { useRef, useState, useEffect } from 'react';
import {
  Divider,
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
import usePrint from '@/hooks/usePrint';
import useParts from '@/pages/Repair/hooks/useParts';
import useUserInfo from '@/hooks/useUserInfo';
import useACL from '@/hooks/useACL';
import useDepartments from '@/hooks/useDepartments';
import {
  download,
  momentToString,
  stringToMoment,
  WithoutTimeFormat,
  batchExportToPDF,
  tableHeight,
} from '@/utils/utils';
import DepartmentSelector from '@/components/DepartmentSelector';
import PrintContainer from '@/components/PrintContainer';
import Footerbar from '@/components/Footerbar';
import { WaterMark } from '@ant-design/pro-layout';
import Editor from '@/pages/Dictionary/Maintenance/Editor/Editor';
import type { TableProps } from 'antd/es/table';
import Parts from '@/pages/Repair/Management/components/Parts';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import omit from 'omit.js';
import MaintenanceReports from './MaintenanceReports';
import useTemplate from '../hooks/useTemplate';
import DetailModal from './Detail';
import TaskCancelModal from './TackCancelModal';
import {
  fetchTasks,
  acceptTask,
  batchFetchTaskDetails,
  exportMaintenanceRecords,
  initiateTransferAPI,
  revocationOrRefuseAPI,
} from '../service';
import type { ITaskItem, ITaskDetailsWithTemplateItem } from '../type';
import { MenuType, BizConfig, OrderStatusConfig } from '../type';
import { OperationType } from '../type';
import { ScrapStatusMap, ScrapStatus } from '@/utils/constants';
import { fetchAuthorizedDepartments } from '@/pages/Internal-Authority/service';
import SuggestionModal from '@/components/suggestion';
import TransferOrderModal from './TransferOrderModal';
import styles from '../index.less';
import { fetchTaskTimelineDetail } from '@/pages/Repair/Management/service';
import type { ITaskTimelineItem } from '@/pages/Repair/Management/type';
import TimelineDrawer from '@/pages/Assets/components/TimelineDrawer';
interface IComponentProps {
  menuType: MenuType;
}

const Status: React.FC<IComponentProps> = ({ menuType }) => {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const isMaintainer = !!currentUser?.isMaintainer; // 是否为工程师
  const actionRef = useRef<ActionType>();
  const [selectedTaskKeys, setSelectedTaskKeys] = useState<number[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [batchLoading, setBatchLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false); // 保养记录导出中
  const [printing, setPrinting] = useState(false);
  const [currentTask, setCurrentTask] = useState<ITaskItem | undefined>();
  const [reports, setReports] = useState<ITaskDetailsWithTemplateItem[]>([]);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const operationRef = useRef<OperationType>(OperationType.NOOP);
  const {
    componentData,
    fetching: templateLoading,
    hasError: hasLoadTempError,
  } = useTemplate(currentTask?.id, operationRef.current);
  const { componentRef, onPrint: emitPrint } = usePrint({
    onAfterPrint: () => {
      operationRef.current = OperationType.NOOP;
      setCurrentTask(undefined);
    },
  });
  const orgId = currentUser?.org.id;
  const crId = currentUser!.currentCustomer?.siteOrgId;
  const employeeId = currentUser?.employee.id;
  const { departmentsTreeData } = useDepartments(
    {
      orgId: crId ?? orgId!,
    },
    true,
  );
  const { parts, loadParts } = useParts();
  const [taskCancelModalVisible, setTaskCancelModalVisible] = useState(false);
  const [principalList, setPrincipalList] = useState<any>([]);
  const [suggestionVisible, setSuggestionVisible] = useState<boolean>(false);
  const [recordId, setRecordId] = useState<number>(0);
  const [transferOrderVisible, setTransferOrderVisible] = useState<boolean>(
    false,
  );
  const [timelineDrawerVisible, setTimelineDrawerVisible] = useState(false);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineItems, setTimelineItems] = useState<ITaskTimelineItem[]>([]);
  const [currentRecord, setCurrentRecord] = useState<ITaskItem>();
  const [recordMenuType, setrecordMenuType] = useState<string>();
  const DefaultQuery = {
    menu: MenuType[menuType],
    current: 1,
    pageSize: 30,
    equipmentName: '',
    manufacturerName: '',
    modelName: '',
    sn: '',
    equipmentNo: '',
    engineerName: '',
    startDate: undefined,
    endDate: undefined,
    departmentId: [],
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

  const BaseColumns: ProTableColumn<ITaskItem>[] = [
    {
      title: '单号',
      dataIndex: 'taskNo',
      key: 'taskNo',
      width: 160,
      hideInSearch: true,
      render: (name: string, record: ITaskItem) => (
        <a onClick={() => onShowTimeline(record)}>{name}</a>
      ),
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
      hideInTable: true,
    },
    {
      title: '生产厂商',
      dataIndex: 'manufacturerName',
      key: 'manufacturerName',
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
      title: '保养执行人',
      dataIndex: 'engineerName',
      key: 'engineerName',
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
      title: '计划结束时间',
      dataIndex: 'planEndTime',
      key: 'planEndTime',
      width: 140,
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
      title: '发起人',
      dataIndex: 'initPersonName',
      key: 'initPersonName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '预计保养时间',
      dataIndex: 'planBeginTime',
      key: 'planBeginTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      hideInSearch: true,
      render: (status) =>
        status ? (
          <Badge
            color={OrderStatusConfig.get(status)?.badge}
            text={OrderStatusConfig.get(status)?.label}
          />
        ) : (
          ''
        ),
    },
    {
      title: '保养单位',
      dataIndex: 'undertakerName',
      key: 'undertakerName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '保养人',
      dataIndex: 'engineerName',
      key: 'engineerName',
      width: 120,
      hideInSearch: true,
    },
  ];

  // 查看详情  单据选择了保养模板之后才能查看详情
  const onViewDetail = (record: ITaskItem) => {
    if (record.bindTem) {
      setCurrentTask(record);
      loadParts(record.id);
      operationRef.current = OperationType.VIEW;
      setDetailModalVisible(true);
    } else {
      message.warning('该保养单没有选择模板，无法查看详情');
    }
  };

  const onDetailModalCancel = () => {
    setDetailModalVisible(false);
    setCurrentTask(undefined);
  };

  // 发起转单
  const onTransferOrder = (record: ITaskItem) => {
    setCurrentTask(record);
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

  // 点击通过按钮
  const onAccept = async (record: ITaskItem) => {
    setSuggestionVisible(true);
    setRecordId(record.id);
  };

  // 通过弹框确定按钮
  const onSuggestionSubmit = async (formValue: any) => {
    try {
      await acceptTask(recordId, {
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

  const onPrint = async (record: ITaskItem) => {
    if (printing) {
      return;
    }
    setPrinting(true);
    await loadParts(record.id);
    operationRef.current = OperationType.PRINT;
    setCurrentTask(record);
  };

  const onCancelTaskCancelModal = () => {
    setTaskCancelModalVisible(false);
    operationRef.current = OperationType.NOOP;
  };

  // 判断是设备是否有跨科授权权限
  const isPrincipalChange = (record: any) => {
    let isPrincipal = false;
    principalList.forEach((item: any) => {
      if (item.key == record.departmentId) {
        isPrincipal = true;
      }
    });
    return isPrincipal;
  };

  const operationColumn: ProTableColumn<ITaskItem> = {
    title: '操作',
    key: 'operation',
    width: 170,
    fixed: 'right',
    hideInSearch: true,
    render: (_, record) => {
      switch (menuType) {
        case MenuType.To_Be_Responded: //待响应
          return (
            <>
              {record.isScrap == ScrapStatus.COMMON &&
                (record.initPersonId === currentUser?.employee.id ||
                  isPrincipalChange(record)) && (
                  <>
                    <a
                      onClick={() => {
                        operationRef.current = OperationType.CANCEL;
                        setCurrentTask(record);
                        setTaskCancelModalVisible(true);
                      }}
                    >
                      撤销
                    </a>
                    <Divider type="vertical" />
                  </>
                )}
              {/* 有保养模板才可以查看详情 */}
              {record.bindTem && (
                <a onClick={() => onViewDetail(record)}>详情</a>
              )}
            </>
          );
        case MenuType.To_Be_Maintained: //待保养
          return (
            <>
              {record.isScrap == ScrapStatus.COMMON &&
                (record.initPersonId === currentUser?.employee.id ||
                  isPrincipalChange(record)) && (
                  <>
                    <a
                      onClick={() => {
                        operationRef.current = OperationType.CANCEL;
                        setCurrentTask(record);
                        setTaskCancelModalVisible(true);
                      }}
                    >
                      撤销
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
              {/* 有保养模板才可以查看详情 */}
              {record.bindTem && (
                <a onClick={() => onViewDetail(record)}>详情</a>
              )}
            </>
          );
        case MenuType.In_The_Maintenance: //保养中
          return (
            <>
              {record.isScrap == ScrapStatus.COMMON &&
                (record.initPersonId === currentUser?.employee.id ||
                  isPrincipalChange(record)) && (
                  <>
                    <a
                      onClick={() => {
                        operationRef.current = OperationType.CANCEL;
                        setCurrentTask(record);
                        setTaskCancelModalVisible(true);
                      }}
                    >
                      撤销
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
              <a onClick={() => onViewDetail(record)}>详情</a>
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
                  </>
                )}
              <a onClick={() => onViewDetail(record)}>详情</a>
            </>
          );
        case MenuType.Waiting_For_Acceptance: //待验收
          if (currentUser?.isMaintainer) {
            return <a onClick={() => onViewDetail(record)}>详情</a>;
          }
          return (
            <>
              {record.isScrap == ScrapStatus.COMMON && (
                <>
                  <a onClick={() => onAccept(record)}>通过</a>
                  <Divider type="vertical" />
                  <a
                    onClick={() => {
                      operationRef.current = OperationType.REJECT;
                      setCurrentTask(record);
                      setTaskCancelModalVisible(true);
                    }}
                  >
                    不通过
                  </a>
                </>
              )}
              <Divider type="vertical" />
              <a onClick={() => onViewDetail(record)}>详情</a>
            </>
          );
        case MenuType.Acceptance_Completed: //已验收
          return (
            <>
              <a key="detail" onClick={() => onViewDetail(record)}>
                详情
              </a>
              <Divider key="divider" type="vertical" />
              <a key="print" onClick={() => onPrint(record)}>
                打印
              </a>
            </>
          );
        default:
          return null;
      }
    },
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
        maintainTaskIds: selectedTaskKeys,
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
        const { data, code } = await batchFetchTaskDetails(formData);
        if (code === 0) {
          setReports(data);
          const timer = setTimeout(async () => {
            const doms = Array.from(
              document.querySelectorAll(
                '.maintainReportsWrapper .maintenanceReport',
              ),
            );
            doms.forEach((dom, i) =>
              dom.setAttribute('data-name', data[i].maintainTask.taskNo),
            );
            await batchExportToPDF(doms as HTMLElement[], '保养报告');
            setBatchLoading(false);
            setExportLoading(false);
            clearTimeout(timer);
          }, 0);
        }
      } catch (error) {
        console.error(error);
        message.error('未知错误，请联系管理员');
        setBatchLoading(false);
        setExportLoading(false);
      }
    }
  };

  // 导出保养记录
  const onExportMaintenanceRecords = async () => {
    try {
      if (currentUser?.isCustomersEmpty) {
        return;
      }
      setExporting(true);
      const formValues = actionRef.current?.getSearchFormValues();
      const bizConfig = BizConfig.get(menuType);
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
        } else {
          formData.orgId = [orgId!];
        }

        const { data, response } = await exportMaintenanceRecords(
          formData,
          isACL,
        );
        download(data, response);
        message.success('导出成功');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  // 医生获取跨科授权科室 只有医生登录时才请求
  const getPrincipalData = async () => {
    try {
      if (currentUser?.isHospital) {
        const { data } = await fetchAuthorizedDepartments(employeeId);
        const principalArr = [
          ...data,
          {
            key: currentUser.primaryDepartment.id,
            value: currentUser.primaryDepartment.name,
          },
        ];
        setPrincipalList(principalArr);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (componentData && operationRef.current === OperationType.PRINT) {
      setTimeout(() => {
        emitPrint?.();
        setPrinting(false);
      }, 0);
    }
    getPrincipalData();
    // 主要用在消息跳转 当路由地址的menu参数值改变时更新表格
    if (menuType != recordMenuType) {
      actionRef.current?.reset();
    }
  }, [componentData, menuType]);

  useEffect(() => {
    let hide: any;
    if (templateLoading && operationRef.current === OperationType.PRINT) {
      hide = message.loading('准备打印中...');
    } else {
      hide?.();
    }
  }, [templateLoading]);

  const getColumns = (): ProTableColumn<ITaskItem>[] => {
    if (menuType !== MenuType.To_Be_Responded) {
      return [...BaseColumns, operationColumn];
    }
    return [...BaseColumns.slice(0, 12), operationColumn];
  };

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
          title="保养工单列表"
          defaultQuery={DefaultQuery}
          columns={getColumns()}
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
              y: tableHeight,
            },
          }}
          rowSelection={rowSelection}
          options={{
            seqColumn: true,
          }}
          toolBarRender={() => {
            return [
              <Button
                key="import"
                type="primary"
                loading={exporting}
                onClick={onExportMaintenanceRecords}
              >
                导出保养记录(excel)
              </Button>,
            ];
          }}
          onRow={(record) => {
            return {
              onDoubleClick: () => onViewDetail(record),
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
                collapsed: !(
                  startDate ||
                  endDate ||
                  query.departmentId?.length
                ),
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
        detail={currentTask}
        onCancel={onTransferOrderCancel}
        onConfirm={onTransferOrderConfirm}
      />

      <DetailModal
        menuType={menuType}
        loading={templateLoading}
        taskId={currentTask?.id}
        currentRecord={currentTask}
        visible={detailModalVisible}
        componentData={componentData}
        hasError={hasLoadTempError}
        parts={parts}
        onPrint={emitPrint as any}
        onCancel={onDetailModalCancel}
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
      <TaskCancelModal
        visible={taskCancelModalVisible}
        currentRecord={currentTask}
        operation={operationRef.current}
        onCancel={onCancelTaskCancelModal}
        onSubmit={() => {
          onCancelTaskCancelModal();
          actionRef.current?.reload(true);
        }}
      />
      <SuggestionModal
        visible={suggestionVisible}
        onCancel={() => setSuggestionVisible(false)}
        onSubmit={onSuggestionSubmit}
      />
      <PrintContainer>
        <div ref={componentRef}>
          <WaterMark content="医修库">
            <Editor mode="DETAIL" componentData={componentData} />
            {currentTask?.reason2 != '' && (
              <div style={{ padding: '0 20px' }}>
                <span className={styles.resonLable}>审核意见：</span>
                <span className={styles.resonValue}>
                  {currentTask?.reason2}
                </span>
              </div>
            )}
            {parts?.length ? (
              <div style={{ padding: '20px' }}>
                <Parts parts={parts} theme="maintenance" />
              </div>
            ) : null}
          </WaterMark>
        </div>
      </PrintContainer>
      <MaintenanceReports reports={reports} />
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
    </>
  );
};

export default Status;
