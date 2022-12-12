import React, { useState, useRef, Fragment } from 'react';
import {
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  PrinterOutlined,
  SelectOutlined
} from '@ant-design/icons';
import {
  Spin,
  Space,
  Badge,
  Input,
  Button,
  message,
  Divider,
  DatePicker,
  Modal
} from 'antd';
import omit from 'omit.js';
import { PageContainer } from '@ant-design/pro-layout';
import useCurrentRoute from '@/hooks/useCurrentRoute';
import useUserInfo from '@/hooks/useUserInfo';
import useSubAuthorities from '@/hooks/useSubAuthorities';
import useACL from '@/hooks/useACL';
import usePrint from '@/hooks/usePrint';
import useDepartments from '@/hooks/useDepartments';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import Footerbar from '@/components/Footerbar';
import InputNumberRange from '@/components/InputNumberRange';
import PrintContainer from '@/components/PrintContainer';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import DepartmentSelector from '@/components/DepartmentSelector';
import { download, momentToString, stringToMoment, WithoutTimeFormat, tableHeight } from '@/utils/utils';
import type { TableProps } from 'antd/es/table';
import type { FormInstance } from 'antd/es/form';
import useInitialData from './hooks/useInitialData';
import useVisible from './hooks/useVisible';
import useEquipmentDetail from './hooks/useEquipmentDetail';
import useExclude from './hooks/useExclude';
import useEquipmentsPriceTotal from './hooks/useEquipmentsPriceTotal';
import { getBizConfig, getParsedTag, normalizeDepartmentId, getSubmitEquipmentInputMsg } from './helper';
import type {
  ImportVersion,
  ITableListItem,
  EquipmentDetailEx,
} from './type';
import {
  OperationType,
  EquipmentStatusEnum,
  BizType,
} from './type';
import {
  deleteEquipment,
  exportEquipment,
  exportFullEquipment,
  fetchFullEquipmentInfo,
  batchFetchEquipmentInfo,
  fetchMergeEquipment
} from './service';
import EquipmentInputForm from './components/EquipmentInputForm';
import EquipmentImport from './components/EquipmentImport';
import EquipmentTag from './components/EquipmentTag';
import VersionSelector from './components/VersionSelector';
import RemoteSelect from './components/RemoteSelect';
import Detail from './components/Detail';
import EquipmentInfo from './components/EquipmentInfo';
import TimelineDrawer from './components/TimelineDrawer';
import EquipmentTableTitle from './components/EquipmentTableTitle';
import { fetchAttachments } from '@/services/global';
import { labelSelect } from '@/pages/Account/Settings/type'
import { labelPrintSelectAPI } from './service';
import EquipmentSelect from '@/components/Equipment/EquipmentSelect';
const { confirm } = Modal;

interface IQuery {
  q: string;
  current: number;
  pageSize: number;
  equipmentNo: string;
  departmentId: number[];
  tag: string | undefined;
  minOriginWorth: number | undefined;
  maxOriginWorth: number | undefined;
  startInitialUseDate: string | undefined;
  endInitialUseDate: string | undefined;
}

const DefaultQuery: IQuery = {
  q: '',
  current: 1,
  pageSize: 30,
  equipmentNo: '',
  departmentId: [],
  tag: '',
  minOriginWorth: undefined,
  maxOriginWorth: undefined,
  startInitialUseDate: undefined,
  endInitialUseDate: undefined,
};
const BatchPrintLimit = 20;

const AssetsPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const { currentUser } = useUserInfo();
  const currentRoute = useCurrentRoute();
  const subAuthorities = useSubAuthorities();
  const { isACL } = useACL();
  const orgId = currentUser?.org.id;
  const bizConfig = getBizConfig(currentRoute, isACL);
  const [hispitalLogo, setHispitalLogo] = useState<string>();
  const { componentRef: tagPrintComponentRef, onPrint: onBatchPrintTags } = usePrint();
  const { componentRef: detailPrintComponentRef, onPrint: onBatchPrintDetails } = usePrint();
  const { manufacturers, equipmentTypes, attachmentCategorys, loadEquipmentTypes } = useInitialData();
  const { departments, departmentsTreeData, loadDepartments } = useDepartments({ orgId: orgId! }, true);
  const { visibleState, dispatch } = useVisible();
  const {
    loading: detailModalLoading,
    equipmentDetail,
    timelineItems,
    timelineLoading,
    loadTimeline,
    loadEquipmentDetail,
    clearEquipmentDetail,
  } = useEquipmentDetail();
  const { loadEquipmentsPriceTotal, priceTotal } = useEquipmentsPriceTotal(orgId);
  const [equipmentDetailsForPrint, setEquipmentDetailsForPrint] = useState<EquipmentDetailEx[]>(
    [],
  );
  const [batchLoading, setBatchLoading] = useState<boolean>(false);
  const operationRef = useRef<OperationType>(OperationType.NOOP);
  const [importVersion, setImportVersion] = useState<ImportVersion>('V3');
  const [selectedEquipKeys, setSelectedEquipKeys] = useState<number[]>([]);
  const [batchLoadingTip, setBatchLoadingTip] = useState<string>('');
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [confirmDeleteContent, setConfirmDeleteContent] = useState('');
  const [currentRecord, setCurrentRecord] = useState<ITableListItem | undefined>();
  const [enableFullSelect, setEnableFullSelect] = useState(false);
  const [
    fullSelectTotal, // 全选数量
    currentPageCache, // 当前页表格数据缓存
    excludeEquipmentKeys, // 排除的设备Id集合
    updatePageCache, // 更新当前页表格数据缓存
  ] = useExclude(enableFullSelect, selectedEquipKeys);
  const [initLabelOption, setInitLabelOption] = useState<any>();
  const [equipmentSelectVisible, setEquipmentSelectVisible] = useState<boolean>(false);

  const onShowTimeline = async (record: ITableListItem) => {
    setCurrentRecord(record);
    dispatch({ type: 'showTimeline' });
    await loadTimeline(record.id);
  }

  const columns: ProTableColumn<ITableListItem>[] = [
    {
      title: '关键字',
      dataIndex: 'q',
      key: 'q',
      hideInTable: true,
      renderFormItem: () => (
        <Input placeholder="名称/别名/品牌/型号/序列号" />
      )
    },
    {
      title: '设备自编号',
      dataIndex: 'equipmentNo',
      key: 'equipmentNo',
      align: 'center',
      width: 160,
    },
    {
      title: '首次启用日期',
      dataIndex: 'initialUseDate',
      key: 'initialUseDate',
      hideInTable: true,
      renderFormItem: () => (
        <DatePicker.RangePicker allowEmpty={[true, true]} style={{ width: '100%' }} />
      )
    },
    {
      title: '设备价格',
      dataIndex: 'originWorth',
      key: 'originWorth',
      hideInTable: true,
      renderFormItem: () => (
        <InputNumberRange />
      )
    },
    {
      title: '科室',
      dataIndex: 'departmentId',
      key: 'departmentId',
      align: 'center',
      renderFormItem: () => (
        <DepartmentSelector 
          treeSelectProps={{
            multiple: true,
            treeData: departmentsTreeData,
            virtual: false,
          }}
        />
      ),
      render: (_, record) => record.departmentName,
    },    
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
      hideInTable: true,
      renderFormItem: () => (
        <RemoteSelect
          onlySelect
          type='equipment-tag'
          placeholder="请选择"
        />
      )
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'equipNameNew',
      hideInSearch: true,
      width: 220,
      align: 'center',
      render: (equipNameNew, record) => <a onClick={() => onShowTimeline(record)}>{ equipNameNew }</a>
    },
    {
      title: '设备别名',
      dataIndex: 'alias',
      key: 'alias',
      hideInSearch: true,
      width: 180,
      align: 'center',
    },
    {
      title: '设备型号',
      dataIndex: 'modelName',
      key: 'modelName',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '设备厂商',
      dataIndex: 'manufacturerName',
      key: 'manufacturerName',
      hideInSearch: true,
      width: 250,
    },
    {
      title: '签约状态',
      dataIndex: 'isSigned',
      key: 'isSigned',
      hideInSearch: true,
      render: (status: boolean) => {
        switch (status) {
          case true:
            return <span style={{color: '#52c41a'}}>签约</span>;
            break;
          case false:
            return <span style={{color: 'red'}}>未签约</span>;
            break;
          default:
            return '';
        }
      }
    },
    {
      title: '设备序列号',
      dataIndex: 'sn',
      key: 'sn',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      key: 'status',
      hideInSearch: true,
      align: 'center',
      render: (status: EquipmentStatusEnum) => {
        switch (status) {
          case EquipmentStatusEnum.UNUSED:
            return <Badge status="default" text="停用" />;
          case EquipmentStatusEnum.READY:
            return <Badge status="success" text="启用中" />;
          default:
            return '';
        }
      },
    },
    {
      title: '设备类型',
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '购买金额',
      dataIndex: 'originWorth',
      key: 'originWorth',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '购买时间',
      dataIndex: 'obtainedDate',
      key: 'obtainedDate',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '生产时间',
      dataIndex: 'productionDate',
      key: 'productionDate',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '录入时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      align: 'center',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '使用年限',
      dataIndex: 'usefulAge',
      key: 'usefulAge',
      align: 'center',
      hideInSearch: true,
    },
  ];

  const clearRowSelections = () => {
    setEnableFullSelect(false);
    setSelectedEquipKeys([]);
  }

  // 获取医院的logo
  const getFetchAttachments = async () => {
    const { code, data } = await fetchAttachments(orgId);
    if (code == 0) {
      setHispitalLogo(data[0]?.res);
    }
  }

  const onClickOperation = async (
    record: ITableListItem,
    action: OperationType,
  ) => {
    operationRef.current = action;
    setCurrentRecord(record);
    switch (action) {
      case OperationType.EDIT: // 编辑
      case OperationType.COPY: // 复制
        loadEquipmentDetail(record.id);
        dispatch({ type: 'showEquipmentInputModal' });
        break;
      case OperationType.DELETE: // 删除
        setConfirmDeleteContent(`${record.name}`);
        setConfirmDeleteModalVisible(true);
        break;
      case OperationType.DETAIL: // 详情
        await getFetchAttachments();
        loadEquipmentDetail(record.id);
        loadTimeline(record.id);
        dispatch({ type: 'showDetailModal' });
        break;
      case OperationType.MERGE: // 合并信息
        setCurrentRecord(record);
        setEquipmentSelectVisible(true);
        break;
      default:
        break;
    }
  };


  const onInputEquipment = () => {
    clearRowSelections();
    operationRef.current = OperationType.INPUT;
    dispatch({ type: 'showEquipmentInputModal' });
  };

  const onImportEquipment = () => {
    dispatch({ type: 'showVersionSelectorModal' });
  };

  // 批量/全量导出
  const onBatchExportEquipment = async () => {
    setBatchLoading(true);
    setBatchLoadingTip(`${enableFullSelect ? '全量导出中...' : '批量导出中...'}`);
    try {
      const formValues = formRef.current?.getFieldsValue();
      const service = enableFullSelect ? exportFullEquipment : exportEquipment;
      const equipmentIds = enableFullSelect ? [...excludeEquipmentKeys] : selectedEquipKeys;
      const { initialUseDate, originWorth } = formValues;
      let formData: any = {
        equipmentId: equipmentIds,
        orgId: orgId!,
      }
      
      if (enableFullSelect) {
        formData = {
          ...formData,
          ...formValues,
          originWorth: {
            minValue: originWorth[0],
            maxValue: originWorth[1],
          },
          initialUseDate: {
            minValue: initialUseDate && initialUseDate[0] && momentToString(initialUseDate[0], WithoutTimeFormat),
            maxValue: initialUseDate && initialUseDate[1] && momentToString(initialUseDate[1], WithoutTimeFormat),
          },
        }
      }

      const { data, response } = await service(
        formData,
        true,
        isACL,
      );
      download(data, response);
      message.success('导出成功');
    } catch (error) {
      console.error(error);
    } finally {
      setBatchLoading(false);
      setBatchLoadingTip('');
    }
  };

  const filterSearchFormValues = (formValues: any) => {
    const { 
      q,
      tag,
      equipmentNo,
      departmentId,
      initialUseDate,
      originWorth,
    } = formValues;
    const parsedTag = getParsedTag(tag);
    return {
      q, 
      tag: parsedTag,
      orgId: orgId!, 
      equipmentNo,
      departmentId: normalizeDepartmentId(departmentId),
      originWorth: {
        minValue: originWorth[0],
        maxValue: originWorth[1],
      },
      initialUseDate: {
        minValue: initialUseDate[0],
        maxValue: initialUseDate[1],
      },
    }
  }

  // 获取设备标签列表
  const getLabelData = async () => {
    try {
      const { data } = await labelPrintSelectAPI(currentUser?.org.id);
      const labelTextArr = data.id == null ? labelSelect : data.contentText;
      setInitLabelOption(labelTextArr);
    } catch(err: any) {
      console.log(err);;
    }
  }

  // 批量｜全量打印标签/设备详情
  const onBatchPrint = async (type: 'tag' | 'detail') => {
    if (type === 'detail' && ((enableFullSelect && fullSelectTotal > BatchPrintLimit) || selectedEquipKeys.length > BatchPrintLimit)) {
      message.warning(`批量打印设备详情单次不能超过${BatchPrintLimit}个，请重新进行选择`);
      return;
    }

    setBatchLoading(true);
    setBatchLoadingTip(`${enableFullSelect ? '全量打印中...' : '批量打印中...'}`);

    try {
      const service = enableFullSelect ? fetchFullEquipmentInfo : batchFetchEquipmentInfo;
      const equipmentIds = enableFullSelect ? [...excludeEquipmentKeys] : selectedEquipKeys;
      const params = {
        ...filterSearchFormValues(actionRef.current?.getSearchFormValues()),
        ids: equipmentIds
      };
      const { data = [] } = await service(params);
      setEquipmentDetailsForPrint(data);
      if (type === 'detail') {
        onBatchPrintDetails!();
      } else {
        await getFetchAttachments();
        await getLabelData();
        onBatchPrintTags!();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBatchLoading(false);
      setBatchLoadingTip('');
    }
  }

  // 设备录入提交(编辑，新增，复制)之后
  const onSubmitEquipmentInput = (operation: OperationType) => {
    message.success(getSubmitEquipmentInputMsg(operation));
    dispatch({ type: 'hideEquipmentInputModal' });
    clearEquipmentDetail();
    operationRef.current = OperationType.NOOP;
    actionRef.current?.reload();
  };

  // 导入完成之后
  const onImportEquipmentDone = () => {
    loadDepartments();
    loadEquipmentTypes();
    actionRef.current?.reload();
  }

  const onCancelEquipmentInput = () => {
    dispatch({ type: 'hideEquipmentInputModal' });
    operationRef.current = OperationType.NOOP;
    clearEquipmentDetail();
  };

  const onCancelDetailModal = () => {
    dispatch({ type: 'hideDetailModal' });
    operationRef.current = OperationType.NOOP;
    clearEquipmentDetail();
  };

  const onCancelEquipmentImport = () => {
    dispatch({ type: 'hideEquipmentImportModal' });
    operationRef.current = OperationType.NOOP;
  };

  const onSelectVersionDone = (version: ImportVersion) => {
    setImportVersion(version);
    dispatch({ type: 'hideVersionSelectorModal' });
    dispatch({ type: 'showEquipmentImportModal' });
  };

  // 删除设备
  const onConfirmDelete = async () => {
    try {
      const { code } = await deleteEquipment(currentRecord!.id);
      if (code === 0) {
        clearRowSelections();
        message.success('删除成功');
        actionRef.current?.reload();
        operationRef.current = OperationType.NOOP;
        setCurrentRecord(undefined);
        setConfirmDeleteModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 全量选择
  const onFullSelect = () => {
    setEnableFullSelect(!enableFullSelect);
    setSelectedEquipKeys(enableFullSelect ? [] : currentPageCache.map(item => item.id));
  }

  // 合并信息弹框确认
  const onSelectEquipment = (data: any) => {
    confirm({
      title: '重要提示',
      content: '选择的设备信息将会覆盖当前需要合并的设备信息，并且该操作不可逆，是否继续？',
      okText: '确认合并',
      cancelText: '取消',
      async onOk() {
        if (currentRecord?.id == data.selectedRows[0].id) {
          message.error('不能合并自己，请选择其他设备');
          return;
        }
        try {
          await fetchMergeEquipment(currentRecord?.id, data.selectedRows[0].id); 
          message.success('合并设备成功');
          setEquipmentSelectVisible(false);
          actionRef.current?.reload();
        } catch (err) {
          console.log(err);
        }
      },
      onCancel() {}
    });
  }

  const operationColumn: ProTableColumn<ITableListItem> = {
    title: '操作',
    dataIndex: 'Operation',
    key: 'Operation',
    hideInSearch: true,
    align: 'center',
    width: 280,
    fixed: 'right',
    render: (_: any, record: ITableListItem) => {
      const hasDelAuthority = subAuthorities?.includes('DEL') && record.status !== EquipmentStatusEnum.READY;
      return (
        <>
          {
            subAuthorities?.includes('EDIT') && (<>
              <a onClick={() => onClickOperation(record, OperationType.EDIT)}>
                编辑
              </a>
              <Divider type="vertical"/>
            </>)
          }
          {
            subAuthorities?.includes('NEW') && (<>
                <a onClick={() => onClickOperation(record, OperationType.COPY)}>
                  复制
                </a>
                <Divider type="vertical"/>
              </>
            )
          }
          <a onClick={() => onClickOperation(record, OperationType.DETAIL)}>
            详情
          </a>
          <Divider type="vertical" />
          <a onClick={() => onClickOperation(record, OperationType.MERGE)}>合并信息</a>
          <Divider type="vertical" style={{ visibility: hasDelAuthority ? 'visible' : 'hidden' }}/>
          <a 
            style={{ visibility: hasDelAuthority ? 'visible' : 'hidden' }} 
            onClick={() => onClickOperation(record, OperationType.DELETE)}>删除</a>
        </>
      );
    },
  };

  const rowSelection: TableProps<ITableListItem>['rowSelection'] = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectedEquipKeys,
    onChange: (selectedRowKeys) => {      
      setSelectedEquipKeys(selectedRowKeys as number[]);
    },
  };

  const footerbarLeftContent = (
    <Space>
      已选择<span>{enableFullSelect ? fullSelectTotal : selectedEquipKeys.length}</span>项
    </Space>
  );

  const footerbarRightContent = (
    <Space>
      <Button ghost type="primary" onClick={clearRowSelections} disabled={batchLoading}>
        取消选择
      </Button>
      {
        subAuthorities?.includes('EXPORT') && (
          <Button ghost type="primary" onClick={onBatchExportEquipment} disabled={batchLoading}>
            <ExportOutlined />
            导出
          </Button>
        )
      }
      <Button ghost type="primary" onClick={() => onBatchPrint('tag')} disabled={batchLoading}>
        <PrinterOutlined />
        打印标签
      </Button>
      <Button ghost type="primary" onClick={() => onBatchPrint('detail')} disabled={batchLoading}>
        <PrinterOutlined />
        打印详情
      </Button>
    </Space>
  );

  return (
    <PageContainer>
      <Spin spinning={batchLoading} tip={batchLoadingTip}>
        <ProTable<ITableListItem, typeof DefaultQuery>
          rowKey="id"
          title={<EquipmentTableTitle priceTotal={priceTotal} total={actionRef.current?.getTotal()} />}
          defaultQuery={DefaultQuery}
          columns={bizConfig?.bizType === BizType.ASSETS ? [...columns, operationColumn] : [...columns.filter(column => column.title !== '科室'), operationColumn]}
          actionRef={actionRef}
          formRef={formRef}
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
              x: 2500,
              y: tableHeight
            }
          }}
          toolBarRender={() => {
            if (bizConfig?.bizType === BizType.EQUIPMENT) {
              return false;
            }
            return [<Fragment key="toolbar">
              <Button type="primary" onClick={() => onFullSelect()}><SelectOutlined />{ enableFullSelect ? '取消全量选择' : '全量选择' }</Button>
              {
                subAuthorities?.includes('NEW') && (
                  <Button key="create" onClick={onInputEquipment} type="primary">
                    <PlusOutlined />
                    新增
                  </Button>
                )
              }
              {
                subAuthorities?.includes('IMPORT') && (
                  <Button key="import" onClick={onImportEquipment}>
                    <ImportOutlined />
                    导入
                  </Button>
                )
              }
            </Fragment>]
          }}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                if (subAuthorities?.includes('EDIT')) {
                  onClickOperation(record, OperationType.EDIT);
                }
              },
            };
          }}
          request={async (query) => {
            const { 
              q,
              tag,
              current,
              pageSize,
              equipmentNo,
              departmentId,
              minOriginWorth,
              maxOriginWorth,
              startInitialUseDate,
              endInitialUseDate,
            } = query;
            const parsedTag = getParsedTag(tag);
            return bizConfig?.service(
              {
                q, 
                tag: parsedTag,
                orgId: orgId!, 
                equipmentNo,
                departmentId: normalizeDepartmentId(departmentId),
                originWorth: {
                  minValue: minOriginWorth,
                  maxValue: maxOriginWorth,
                },
                initialUseDate: {
                  minValue: startInitialUseDate,
                  maxValue: endInitialUseDate,
                },
              },
              Number(current) || 1,
              Number(pageSize) || 30,
            )
          }}
          hooks={{
            beforeInit: (query) => {
              const {
                tag,
                departmentId = [],
                minOriginWorth, 
                maxOriginWorth,
                endInitialUseDate, 
                startInitialUseDate, 
              } = query;
              const parsedTag = getParsedTag(tag);

              return { 
                ...DefaultQuery,
                ...query,
                tag: parsedTag,
                departmentId: normalizeDepartmentId(departmentId),
                initialUseDate: [stringToMoment(startInitialUseDate), stringToMoment(endInitialUseDate)],
                originWorth: [minOriginWorth && Number(minOriginWorth), maxOriginWorth && Number(maxOriginWorth)],
                collapsed: !(
                  parsedTag?.length || 
                  departmentId?.length || 
                  minOriginWorth !== undefined ||
                  maxOriginWorth !== undefined ||
                  startInitialUseDate || 
                  endInitialUseDate
                ),
              };
            },
            beforeSubmit: (formValues) => {
              const { initialUseDate, originWorth = [], tag = [] } = formValues;
              return {
                ...omit(formValues, ['originWorth', 'initialUseDate']),
                tag: tag.length ? JSON.stringify(tag) : undefined,
                current: 1,
                minOriginWorth: originWorth[0],
                maxOriginWorth: originWorth[1],
                startInitialUseDate: (initialUseDate?.[0] && momentToString(initialUseDate[0], WithoutTimeFormat)) || undefined,
                endInitialUseDate: (initialUseDate?.[1] && momentToString(initialUseDate[1], WithoutTimeFormat)) || undefined,
              };
            },
            onLoad: (equipments, total) => {
              updatePageCache(equipments, total);
              if (enableFullSelect) {
                setSelectedEquipKeys(equipments.map(item => item.id).filter(id => !excludeEquipmentKeys.has(id)));
              }
              loadEquipmentsPriceTotal(actionRef.current?.getQuery());
            },
            onSearch: clearRowSelections,
            onReset: clearRowSelections,
            onReload: clearRowSelections,
          }}
          rowSelection={rowSelection}
        />
      </Spin>
      <EquipmentInputForm
        loading={detailModalLoading}
        visible={visibleState.equipmentInputModalVisible}
        operation={operationRef.current}
        initialValues={equipmentDetail}
        manufacturers={manufacturers}
        attachmentCategorys={attachmentCategorys}
        equipmentTypes={equipmentTypes}
        departments={departments}
        onSubmit={onSubmitEquipmentInput}
        onCancel={onCancelEquipmentInput}
      />
      <Detail
        loading={detailModalLoading}
        visible={visibleState.detailModalVisible}
        operation={operationRef.current}
        initialDetail={equipmentDetail}
        timelineData={timelineItems}
        hispitalLogo={hispitalLogo}
        attachmentCategorys={attachmentCategorys}
        onCancel={onCancelDetailModal}
      />
      <EquipmentImport
        visible={visibleState.equipmentImportModalVisible}
        version={importVersion}
        onImportDone={onImportEquipmentDone}
        onCancel={onCancelEquipmentImport}
      />
      <VersionSelector
        visible={visibleState.versionSelectorModalVisible}
        onCancel={() => dispatch({ type: 'hideVersionSelectorModal' })}
        onDone={onSelectVersionDone}
      />
      <Footerbar
        visible={!!selectedEquipKeys.length || enableFullSelect}
        leftContent={footerbarLeftContent}
        rightContent={footerbarRightContent}
      />
      <ConfirmDeleteModal 
        content={confirmDeleteContent}
        visible={confirmDeleteModalVisible}
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmDeleteModalVisible(false)}
      />
      <TimelineDrawer 
        initialData={timelineItems}
        params={{
          currentEquipment: currentRecord
        }}
        loading={timelineLoading}
        visible={visibleState.timelineDrawerVisible}
        onClose={() => dispatch({ type: 'hideTimeline'})}
      />
      <PrintContainer>
        <div ref={tagPrintComponentRef}>
          {equipmentDetailsForPrint.map((e) => (
            <EquipmentTag initialDetail={e} key={e.equipment.id} initLabelOption={initLabelOption} logo={hispitalLogo} />
          ))}
        </div>
      </PrintContainer>
      <EquipmentSelect
        isACL={isACL}
        multiple={false}
        bizType="SIMPLE_REPAIR"
        currentRecord={currentRecord}
        visible={equipmentSelectVisible}
        onSelect={onSelectEquipment}
        onCancel={() => setEquipmentSelectVisible(false)}
      />
      <PrintContainer>
        <div ref={detailPrintComponentRef}>
          {equipmentDetailsForPrint.map((e) => (
            <EquipmentInfo
              key={e.equipment.id}
              isPrint
              detail={e}
            />
          ))}
        </div>
      </PrintContainer>
    </PageContainer>
  );
};

export default AssetsPage;
