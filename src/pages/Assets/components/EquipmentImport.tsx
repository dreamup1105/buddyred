import type {
  MutableRefObject
} from 'react';
import React, {
  useRef,
  useState,
  useEffect,
  useReducer
} from 'react';
import {
  Modal,
  Table,
  Upload,
  Row,
  Col,
  Button,
  Pagination,
  Divider,
  Popconfirm,
  Progress,
  Badge,
  message,
} from 'antd';
import { useModel } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table/Table';
import type { DraggerProps } from 'antd/es/upload/Dragger';
import IconFont from '@/components/IconFont';
import { asyncNoop as noop } from '@/utils/utils';
import { ExcelAccept } from '@/utils/constants';
import useUnmount from '@/hooks/useUnmount';
import {
  fetchImportTasks,
  fetchImportTaskById,
  deleteImportTask,
  TemplateForV3,
  TemplateForV1,
  ImportEquipmentActionForV3,
  ImportEquipmentActionForV1,
} from '../service';
import type { IImportTaskItem, ImportVersion} from '../type';
import { ImportStatusEnum } from '../type';
import ImportTaskDetail from './ImportTaskDetail';
import ImportResult from './ImportResult';
import styles from '../index.less';

interface IComponentProps {
  visible: boolean;
  version: ImportVersion;
  onImportDone: () => void;
  onCancel: () => void;
}

type VisibleActionType = {
  type:
    | 'showDetailModal'
    | 'showResultModal'
    | 'hideDetailModal'
    | 'hideResultModal';
};

const { Dragger } = Upload;
const PollingDelay = 3000; // 轮询间隔毫秒数
const defaultPagination: TablePaginationConfig = {
  current: 1,
  total: 0,
  pageSize: 30,
};
const initialVisibleState = {
  detailModalVisible: false,
  resultModalVisible: false,
};

const visibleReducer = (
  state: typeof initialVisibleState,
  action: VisibleActionType,
) => {
  switch (action.type) {
    case 'showDetailModal':
      return { ...state, detailModalVisible: true };
    case 'showResultModal':
      return { ...state, resultModalVisible: true };
    case 'hideDetailModal':
      return { ...state, detailModalVisible: false };
    case 'hideResultModal':
      return { ...state, resultModalVisible: false };
    default:
      throw new Error('Unexpected action');
  }
};

const EquipmentImport: React.FC<IComponentProps> = ({
  visible,
  version,
  onCancel,
  onImportDone,
}) => {
  const { initialState } = useModel('@@initialState');
  const [importTasks, setImportTasks] = useState<IImportTaskItem[]>([]);
  const [importResult, setImportResult] = useState<IImportTaskItem>();
  const [visibleState, dispatch] = useReducer(
    visibleReducer,
    initialVisibleState,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<IImportTaskItem | undefined>();
  const [pagination, setPagination] = useState<TablePaginationConfig>(
    defaultPagination,
  );
  const orgId = initialState?.currentUser?.org.id;
  const timer: MutableRefObject<NodeJS.Timeout | null> = useRef(null);

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  };

  // 轮询
  const progressPoll = async (data: IImportTaskItem[], checkQuickDone?: boolean) => {
    const pendingTaskData = data.filter(
      (d) => (d.status === ImportStatusEnum.RUNNING && (d.failedNumber + d.okNumber !== d.total)),
    );

    if (!pendingTaskData.length) {
      clear();
      setImporting(false);
      if (checkQuickDone) {
        // 设备导入同时只支持运行一个，暂不支持并行上传，所以这里取第一项
        setImportResult(data[0]);
        dispatch({ type: 'showResultModal' });
        onImportDone();
      }
      return;
    }

    const taskQueues = data.map((p) =>
      p.status === ImportStatusEnum.RUNNING
        ? fetchImportTaskById.bind(null, p.id)
        : noop,
    );
    const taskResults = await Promise.all([...taskQueues.map((p) => p())]);
    setImportTasks((prevTasks) => {
      const newTasks = prevTasks.map((task, i) => {
        const progressInfo = taskResults[i];
        if (progressInfo) {
          const { okNumber, failedNumber, total } = progressInfo.data;
          const isFinished = okNumber + failedNumber === total;
          if (isFinished) {
            setImportResult(progressInfo.data);
            dispatch({ type: 'showResultModal' });
            onImportDone();
          }
          return {
            ...task,
            okNumber,
            status: isFinished
              ? ImportStatusEnum.FINISHED
              : ImportStatusEnum.RUNNING,
            percent: Math.ceil(((okNumber + failedNumber) / total) * 100),
          };
        }
        return { ...task };
      });
      timer.current = setTimeout(() => {
        progressPoll(newTasks);
      }, PollingDelay);
      return newTasks;
    });
  };

  /**
   * @param checkQuickDone 检测文件导入是否瞬时就完成
   */
  const loadImportTasks = async (checkQuickDone?: boolean) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { data, total } = await fetchImportTasks(
        pagination.current!,
        pagination.pageSize!,
        {
          orgId,
        },
      );
      setPagination((prevPagination) => ({ ...prevPagination, total }));
      setImportTasks(data);
      progressPoll(data, checkQuickDone);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelImportTask = async (record: IImportTaskItem) => {
    await deleteImportTask(record.id);
    message.success('删除成功');
    loadImportTasks();
  };

  const onViewDetail = (record: IImportTaskItem) => {
    setCurrentTask(record);
    dispatch({ type: 'showDetailModal' });
  };

  const onModalCancel = () => {
    clear();
    onCancel();
  };

  const onPageChange = (page: number) => {
    clear();
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: page,
    }));
  };

  const onShowSizeChange = (_: number, pageSize: number) => {
    clear();
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageSize,
    }));
  }

  const columns: any = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 250,
    },
    {
      title: '文件包含数量',
      dataIndex: 'total',
      key: 'total',
      width: 100,
    },
    {
      title: '成功导入数量',
      dataIndex: 'okNumber',
      key: 'okNumber',
      width: 100,
    },
    {
      title: '操作人',
      dataIndex: 'creatorName',
      key: 'creatorName',
      width: 100,
    },
    {
      title: '导入状态',
      dataIndex: 'status',
      width: 100,
      render: (status: ImportStatusEnum, record: IImportTaskItem) => {
        switch (status) {
          case ImportStatusEnum.FINISHED:
            return <Badge status="success" text="完成" />;
          case ImportStatusEnum.ABORTED:
            return <Badge status="default" text="终止" />;
          default:
            return <Progress percent={record.percent} />;
        }
      },
    },
    {
      title: '导入时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 120,
      fixed: 'right',
      render: (_: unknown, record: IImportTaskItem) => {
        return (
          <>
            {record.status !== ImportStatusEnum.RUNNING && (
              <>
                <Popconfirm
                  title="确定要删除该条记录吗？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => onDelImportTask(record)}
                >
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a onClick={() => onViewDetail(record)}>详情</a>
              </>
            )}
          </>
        );
      },
    },
  ];

  const uploadProps: DraggerProps = {
    accept: ExcelAccept,
    /**
     * 目前导入文件，只支持同一时间导入一份文件，导入过程中，禁用上传组件
     */
    disabled: importing,
    action:
      version === 'V3'
        ? `${ImportEquipmentActionForV3}${orgId}`
        : `${ImportEquipmentActionForV1}${orgId}`,
    showUploadList: false,
    beforeUpload: async (file: File): Promise<any> => {
      const isLt2M = file.size / 1024 / 1024 < 2.1;
      if (!isLt2M) {
        message.error('文件大小不能大于2M');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: ({ file }: any) => {
      if (file.status === 'done') {
        if (file.response?.code !== 0) {
          message.error(file.response?.msg);
        } else {
          message.info('文件上传成功，开始导入...');
          setImporting(true);
          loadImportTasks(true);
        }
        clear();
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  useEffect(() => {
    if (visible) {
      loadImportTasks();
    }
  }, [pagination.current, pagination.pageSize, visible]);

  useUnmount(clear);

  return (
    <Modal
      title="设备导入"
      visible={visible}
      onCancel={onModalCancel}
      width={1200}
      maskClosable={false}
      bodyStyle={{ height: 700, overflow: 'auto' }}
      className={styles.euqipmentImportModalWrapper}
      footer={[
        <Button key="close" onClick={onModalCancel}>
          关闭
        </Button>,
      ]}
    >
      <Row gutter={24} style={{ paddingBottom: 30 }}>
        <Col span={18}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">请从电脑上传文件或拖拽文件到这里</p>
          </Dragger>
        </Col>
        <Col
          span={6}
          className={styles.excelWrapper}
        >
          <a href={version === 'V3' ? TemplateForV3 : TemplateForV1}>
            <div className={styles.excelIconWrapper}>
              <IconFont type="iconexcel" className={styles.excelIcon}/>
            </div>
            模板下载{`（${version === 'V3' ? '新' : '旧'}）`}
          </a>
          <p>文件模板，请严格按模板填写数据，否则可能导入失败</p>
        </Col>
      </Row>
      <Table
        rowKey="id"
        columns={columns}
        loading={loading}
        dataSource={importTasks}
        style={{ marginTop: 24 }}
        pagination={false}
        scroll={{
          y: 340
        }}
      />
      <Pagination
        current={pagination?.current}
        pageSize={pagination?.pageSize}
        total={pagination?.total}
        showQuickJumper
        showTotal={(total) => `共${total}条记录`}
        onChange={onPageChange}
        onShowSizeChange={onShowSizeChange}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        style={{ textAlign: 'right', marginTop: 16 }}
      />
      <ImportTaskDetail
        taskDetail={currentTask}
        visible={visibleState.detailModalVisible}
        onCancel={() => dispatch({ type: 'hideDetailModal' })}
      />
      <ImportResult
        visible={visibleState.resultModalVisible}
        result={importResult}
        onCancel={() => dispatch({ type: 'hideResultModal' })}
        onView={(record: IImportTaskItem) => onViewDetail(record)}
      />
    </Modal>
  );
};

export default EquipmentImport;
