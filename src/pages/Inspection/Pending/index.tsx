import React, { useState, useRef } from 'react';
import { Divider, Popconfirm, message, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import useUserInfo from '@/hooks/useUserInfo';
import useACL from '@/hooks/useACL';
import { PageContainer } from '@ant-design/pro-layout';
import useMount from '@/hooks/useMount';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import TaskCancelModal from './components/TaskCancelModal';
import InspectionRecordTable from '../Department-Statistics/components/InspectionRecordTable';
import {
  fetchPendingInspectionOrders,
  fetchACLPendingInspectionOrders,
  fetchPendingInspectionOrderDetails,
  revokeInspectionApplication,
  checkInspectionDone,
  queryAllPass,
} from '../service';
import type {
  ICheckAcceptanceOrderItem,
  ICheckAcceptanceOrderDetailItem,
} from '../type';
import { OperationType } from '../type';
import type { ActionType as RecordTableActionType } from '../type';

const escapeTime = (dateStr: string | undefined) => {
  if (!dateStr) {
    return '';
  }
  return dateStr.split(' ')[0];
};

const InspectionPendingPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const actionRef = useRef<ActionType>();
  const recordTableRef = useRef<RecordTableActionType>();
  const [, setOperation] = useState<OperationType>(OperationType.NOOP);
  const [detailLoading, setDetailLoading] = useState(false);
  const [taskCancelModalVisible, setTaskCancelModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<
    ICheckAcceptanceOrderItem | undefined
  >();
  const [orderDetails, setOrderDetails] = useState<
    ICheckAcceptanceOrderDetailItem[]
  >([]);
  const [orderDetailsTableVisible, setOrderDetailsTableVisible] = useState(
    false,
  );
  const isHospital = !!currentUser?.isHospital;
  const isMaintainer = !!currentUser?.isMaintainer;

  const onViewDetail = async (record: ICheckAcceptanceOrderItem) => {
    setOrderDetailsTableVisible(true);
    setCurrentOrder(record);
    setOperation(OperationType.VIEW);
    setDetailLoading(true);
    try {
      const { data = [] } = await fetchPendingInspectionOrderDetails(
        record.id,
        1,
      );
      setOrderDetails(data);
    } catch (error) {
      console.error(error);
    } finally {
      setDetailLoading(false);
    }
  };

  const onContinueInspection = async (record: ICheckAcceptanceOrderItem) => {
    setTaskCancelModalVisible(true);
    setCurrentOrder(record);
    setOperation(OperationType.REJECT);
  };

  const renderActions = (record: ICheckAcceptanceOrderItem) => {
    const isSelf = currentUser?.employee.id === record.commitEmployeeId;
    return (
      <>
        {isSelf && (
          <>
            <Popconfirm
              title="确定要撤回申请吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                try {
                  const formData: any = {
                    departmentId: record.departmentId,
                    inspectionAuditId: record.id,
                  };
                  if (isMaintainer) {
                    formData.crId = currentUser?.currentCustomer?.id;
                  }
                  const { code } = await revokeInspectionApplication(formData);
                  if (code === 0) {
                    message.success('操作成功');
                    actionRef.current?.reload();
                  }
                } catch (error: any) {
                  message.error(error.message);
                }
              }}
            >
              <a>撤回申请</a>
            </Popconfirm>
            <Divider type="vertical" />
          </>
        )}
        {isHospital && !isSelf && (
          <>
            <a onClick={() => onContinueInspection(record)}>继续巡检</a>
            <Divider type="vertical" />
          </>
        )}
        {isHospital && (
          <>
            <Popconfirm
              title="确定要验收通过吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                try {
                  const { code } = await checkInspectionDone({
                    auditResult: true,
                    inspectionAuditId: record.id,
                  });
                  if (code === 0) {
                    message.success('操作成功');
                    actionRef.current?.reload();
                  }
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              <a>验收通过</a>
            </Popconfirm>
            <Divider type="vertical" />
          </>
        )}
        <a onClick={() => onViewDetail(record)}>详情</a>
      </>
    );
  };

  // 一键验收
  const onAcceptAll = async () => {
    try {
      await queryAllPass({
        isAcl: isACL,
      });
      actionRef.current?.reload();
      message.success('全部验收成功');
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const columns: ProTableColumn<ICheckAcceptanceOrderItem>[] = [
    {
      title: '巡检单',
      dataIndex: 'auditNo',
      key: 'auditNo',
      hideInSearch: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      hideInSearch: true,
    },
    {
      title: '巡检数量',
      dataIndex: 'actualInspectionCount',
      key: 'actualInspectionCount',
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
      title: '巡检人',
      dataIndex: 'commitEmployeeName',
      key: 'commitEmployeeName',
      hideInSearch: true,
      render: (name) => (!name || name === 'system' ? '' : name),
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      hideInSearch: true,
      render: (_, record) => renderActions(record),
    },
  ];

  useMount(() => {
    recordTableRef.current = {
      onContinueInspection,
    };
    // loadDataSource();
  });

  return (
    <PageContainer>
      <ProTable<ICheckAcceptanceOrderItem, any>
        title="待验收巡检单"
        rowKey="id"
        columns={columns}
        isSyncToUrl={false}
        actionRef={actionRef}
        tableProps={{
          pagination: false,
        }}
        toolBarRender={() => [
          //只有医院才可以一键验收
          currentUser?.isHospital && (
            <Button
              key="button"
              icon={<CheckOutlined />}
              type="primary"
              onClick={onAcceptAll}
            >
              一键验收
            </Button>
          ),
        ]}
        request={async () => {
          if (currentUser?.isCustomersEmpty) {
            return {
              data: [],
              success: true,
            };
          }
          let res;
          if (isACL) {
            let crId: number | undefined;
            if (currentUser?.isMaintainer) {
              crId = currentUser.currentCustomer?.id;
            }
            res = await fetchACLPendingInspectionOrders(
              crId,
              !!currentUser?.isMaintainer,
            );
          } else {
            res = await fetchPendingInspectionOrders();
          }

          return {
            data: res.data,
            success: true,
            total: res.data.length,
          };
        }}
      />
      <InspectionRecordTable
        type="Pending"
        date={escapeTime(currentOrder?.commitTime)}
        visible={orderDetailsTableVisible}
        dataSource={orderDetails}
        currentRecord={currentOrder}
        loading={detailLoading}
        actionRef={recordTableRef}
        onCancel={() => {
          setCurrentOrder(undefined);
          setOrderDetailsTableVisible(false);
        }}
        onSubmit={() => {
          setCurrentOrder(undefined);
          setOrderDetailsTableVisible(false);
          actionRef.current?.reload();
        }}
      />
      <TaskCancelModal
        visible={taskCancelModalVisible}
        currentRecord={currentOrder}
        onCancel={() => {
          setCurrentOrder(undefined);
          setTaskCancelModalVisible(false);
        }}
        onSubmit={() => {
          if (orderDetailsTableVisible) {
            setOrderDetailsTableVisible(false);
          }
          setCurrentOrder(undefined);
          setTaskCancelModalVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default InspectionPendingPage;
