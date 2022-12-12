import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { FormInstance } from 'antd/es/form';
import ProTable from '@/components/ProTable';
import { tableHeight } from '@/utils/utils';
import { OrderStatusEnum, OrderStatus } from './type';
import type { ITableItem } from './type';
import { Select, Button, Badge, message, Input, Popconfirm } from 'antd';
import useSubAuthorities from '@/hooks/useSubAuthorities';
import useACL from '@/hooks/useACL';
import SubscriptionModal from './components/detail';
import {
  savePurchaseOrUpdate,
  purchaseList,
  getOrderInfo,
  enableOrder,
} from './service';
import useUserInfo from '@/hooks/useUserInfo';
const { Option } = Select;

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  orgId: undefined,
  isAcl: false,
  keyword: '', // 关键字，申购单号、申购科室
  orderStatus: null, //INIT,APPROVAL,PASS,ENABLE,CANCEL
};

// 设备申购
const SubscriptionEquipment: React.FC = () => {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const employeeId = currentUser?.employee.id;
  const orgId = currentUser?.org.id;
  const subAuthorities = useSubAuthorities();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [scarpDetailVisible, setScarpDetailVisible] = useState(false);
  const [equipmentDetail, setEquipmentDetail] = useState({});
  const [scarpDetailType, setScarpDetailType] = useState<string>();
  const [scarpDetailTitle, setScarpDetailTitle] = useState<string>();

  // 查看详情
  const onTableDetailClick = async (record: ITableItem) => {
    try {
      const { data } = await getOrderInfo(record.id);
      setScarpDetailVisible(true);
      setScarpDetailType(record.orderStatus);
      const itemConfig = OrderStatusEnum.get(data.orderStatus);
      setScarpDetailTitle(itemConfig.label);
      setEquipmentDetail(data);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // 审核
  const onAuditClick = async (record: ITableItem) => {
    onTableDetailClick(record);
  };

  // 启用
  const onEnableClick = async (record: any) => {
    try {
      await enableOrder(record.id);
      message.success('启用成功，请务必前往固定资产完善信息');
      actionRef.current?.reset();
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // 新增
  const onAddOrderClick = () => {
    setScarpDetailVisible(true);
    setScarpDetailType(OrderStatus.ADD);
  };

  // 申购详情弹框确认
  const onScarpDetailSubmit = async (type = '', detail = { id: '' }) => {
    try {
      if (type == OrderStatus.ENABLE) {
        //启用
        await enableOrder(detail.id);
      } else {
        await savePurchaseOrUpdate(detail);
      }
      setScarpDetailVisible(false);
      setEquipmentDetail({});
      actionRef.current?.reset();
      switch (type) {
        case OrderStatus.INIT: //存草稿
          message.success('保存草稿成功');
          break;
        case OrderStatus.APPROVAL: //保存
          message.success('保存成功');
          break;
        case OrderStatus.PASS: //通过
          message.success('审批通过成功');
          break;
        case OrderStatus.REJECT: //驳回
          message.success('审批驳回成功');
          break;
        case OrderStatus.ENABLE: //启用
          message.success('启用成功，请务必前往固定资产完善信息');
          break;
      }
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // 报废详情单关闭
  const onScarpDetailCancel = () => {
    setScarpDetailVisible(false);
    setEquipmentDetail({});
  };

  // 撤单 先查询详情，通过详情传撤单状态 撤单之后单据就不在了
  const onRevokeClick = async (record: ITableItem) => {
    try {
      const { data } = await getOrderInfo(record.id);
      data.orderStatus = OrderStatus.CANCEL;
      await savePurchaseOrUpdate(data);
      actionRef.current?.reset();
      message.success('撤销成功');
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const orderStatusOptions = [
    {
      label: '草稿',
      value: OrderStatus.INIT,
    },
    {
      label: '申请中',
      value: OrderStatus.APPROVAL,
    },
    {
      label: '通过',
      value: OrderStatus.PASS,
    },
    {
      label: '驳回',
      value: OrderStatus.REJECT,
    },
    {
      label: '启用',
      value: OrderStatus.ENABLE,
    },
    {
      label: '撤单',
      value: OrderStatus.CANCEL,
    },
  ];

  const columns: ProTableColumn<ITableItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      hideInTable: true,
      renderFormItem: () => <Input placeholder="单号/申购科室" />,
    },
    {
      title: '单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '申购科室',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 120,
      render: (val) => {
        const itemConfig = OrderStatusEnum.get(val);
        return <Badge status={itemConfig?.color} text={itemConfig?.label} />;
      },
      renderFormItem: () => {
        return (
          <Select>
            {orderStatusOptions.map((item) => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '申购人',
      dataIndex: 'personName',
      key: 'personName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '采购日期',
      dataIndex: 'purchaseTime',
      key: 'purchaseTime',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '审批人',
      dataIndex: 'approvalPersonName',
      key: 'approvalPersonName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '审批时间',
      dataIndex: 'approvalTime',
      key: 'approvalTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      width: 150,
      hideInSearch: true,
      fixed: 'right',
      render: (_, record) => {
        return (
          <div>
            <a onClick={() => onTableDetailClick(record)}>
              {record.orderStatus == OrderStatus.INIT ||
              record.orderStatus == OrderStatus.REJECT
                ? '编辑'
                : '详情'}
            </a>
            {employeeId == record.personId &&
              (record.orderStatus == OrderStatus.INIT ||
                record.orderStatus == OrderStatus.APPROVAL) && (
                <Popconfirm
                  title="撤单之后单据将消失，确定撤单吗?"
                  onConfirm={() => onRevokeClick(record)}
                >
                  <a style={{ marginLeft: '10px', color: 'red' }}>撤单</a>
                </Popconfirm>
              )}
            {/* 有审核权限的用户 并且单据处于申请中 才显示审核按钮 */}
            {subAuthorities?.includes('AUDIT') &&
              record.orderStatus == OrderStatus.APPROVAL && (
                <a
                  style={{ marginLeft: '10px' }}
                  onClick={() => onAuditClick(record)}
                >
                  审核
                </a>
              )}
            {record.orderStatus == OrderStatus.PASS && (
              <a
                style={{ marginLeft: '10px' }}
                onClick={() => onEnableClick(record)}
              >
                启用
              </a>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<ITableItem, typeof DefaultQuery>
        rowKey="id"
        title="设备申购列表"
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
            icon={<PlusOutlined />}
            type="primary"
            onClick={onAddOrderClick}
          >
            新建
          </Button>,
        ]}
        request={async (query) => {
          const { current, pageSize, keyword, orderStatus } = query;
          return await purchaseList({
            orgId,
            isAcl: isACL,
            current: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
            keyword,
            orderStatus: orderStatus == '' ? null : orderStatus,
          });
        }}
      />

      {/* 申购详情 */}
      <SubscriptionModal
        title={scarpDetailTitle}
        detail={equipmentDetail}
        visible={scarpDetailVisible}
        type={scarpDetailType}
        onSubmit={onScarpDetailSubmit}
        onCancel={onScarpDetailCancel}
      />
    </PageContainer>
  );
};

export default SubscriptionEquipment;
