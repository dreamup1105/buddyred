import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { FormInstance } from 'antd/es/form';
import ProTable from '@/components/ProTable';
import { momentToString, tableHeight } from '@/utils/utils';
import { enableOptions, enableEnum } from './type';
import type { CustomTable } from './type';
import {
  Select,
  Button,
  message,
  Input,
  DatePicker,
  Tag,
  Divider,
  Popconfirm,
} from 'antd';
import useACL from '@/hooks/useACL';
import {
  customListByPageAPI,
  customSaveOrUpdateAPI,
  customDeleteByIdAPI,
} from './service';
import useUserInfo from '@/hooks/useUserInfo';
import DetailModal from './components/detail';
import InfoModal from './components/info';
const RangePicker: any = DatePicker.RangePicker;
import omit from 'omit.js';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  keyword: '', // 关键字-巡检组名称/主要负责人/所在科室
  startTime: undefined, //创建时间-开始时间
  endTime: undefined, //创建时间-结束时间
  isEnable: undefined, //启用状态
};

const AssetsLendingPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const orgId = currentUser?.org.id;
  const orgName = currentUser?.org.name;
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();

  const [detailModalTitle, setDetailModalTitle] = useState<string>('新增');
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string | undefined>();
  const [infoVisible, setInfoVisible] = useState<boolean>(false);

  // 删除巡检项
  const onDeleteView = async (id?: string) => {
    try {
      await customDeleteByIdAPI(id);
      actionRef.current?.reload();
      message.success('删除成功');
    } catch (err) {
      console.log(err);
    }
  };

  // 查看详情 编辑 删除
  const onViewDetail = async (record: CustomTable, type: string) => {
    switch (type) {
      case 'DETAIL':
        setOrderId(record.id);
        setInfoVisible(true);
        break;
      case 'EDIT':
        setDetailModalTitle('编辑');
        setOrderId(record.id);
        setDetailModalVisible(true);
        break;
      case 'DELETE':
        onDeleteView(record.id);
        break;
    }
  };

  // 新建巡检
  const onAddSCarpClick = () => {
    setOrderId(undefined);
    setDetailModalTitle('新增');
    setDetailModalVisible(true);
  };

  // 新增巡检弹框确认
  const onDetailModalConfirm = async (data: any) => {
    try {
      await customSaveOrUpdateAPI({
        ...data,
        orgId,
        orgName,
      });
      message.success('保存成功');
      setDetailModalVisible(false);
      actionRef.current?.reload();
    } catch (err: any) {
      console.log(err);
    }
  };

  const columns: ProTableColumn<CustomTable>[] = [
    {
      title: '序号',
      key: 'index',
      width: 65,
      render: (t: any, r: any, index: number) => index + 1,
      hideInSearch: true,
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      hideInTable: true,
      renderFormItem: () => (
        <Input placeholder="巡检组名称/主要负责人/所在科室" />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'date',
      key: 'date',
      hideInTable: true,
      renderFormItem: () => <RangePicker showTime />,
    },
    {
      title: '自检组名称',
      dataIndex: 'groupName',
      key: 'groupName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '设备数量',
      dataIndex: 'eqCnt',
      key: 'eqCnt',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '所在科室',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '主要负责人',
      dataIndex: 'headName',
      key: 'headName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '启用状态',
      dataIndex: 'isEnable',
      key: 'isEnable',
      width: 100,
      renderFormItem: () => (
        <Select>
          {enableOptions.map((item: any) => {
            return (
              <Select.Option value={item.value} key={item.value}>
                {item.label}
              </Select.Option>
            );
          })}
        </Select>
      ),
      render: (val, record: any) => {
        const itemConfig = enableEnum.get(record.isEnable);
        return <Tag color={itemConfig?.color}>{itemConfig?.label}</Tag>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'createPersonName',
      key: 'createPersonName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      width: 160,
      hideInSearch: true,
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <a onClick={() => onViewDetail(record, 'DETAIL')}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => onViewDetail(record, 'EDIT')}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="删除定制巡检时，对应的历史巡检记录也将被删除，确定要删除吗？"
              onConfirm={() => onViewDetail(record, 'DELETE')}
            >
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <>
      <PageContainer>
        <ProTable<CustomTable, typeof DefaultQuery>
          rowKey="id"
          title="定制巡检列表"
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
              onClick={onAddSCarpClick}
            >
              新建巡检
            </Button>,
          ]}
          request={(query) => {
            const {
              current,
              pageSize,
              keyword,
              startTime,
              endTime,
              isEnable,
            } = query;
            const params = {
              orgId,
              isAcl: isACL,
              current: Number(current) || 1,
              pageSize: Number(pageSize) || 30,
              keyword,
              startTime,
              endTime,
              isEnable,
            };
            return customListByPageAPI(params);
          }}
          hooks={{
            beforeSubmit: (query) => {
              const { date } = query;
              return {
                ...omit(query, ['date']),
                startTime: (date?.[0] && momentToString(date[0])) || undefined,
                endTime: (date?.[1] && momentToString(date[1])) || undefined,
              };
            },
          }}
        />
      </PageContainer>

      {/* 新增编辑弹框 */}
      <DetailModal
        title={detailModalTitle}
        orderId={orderId}
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        onConfirm={onDetailModalConfirm}
      />

      {/* 详情审核弹框 */}
      <InfoModal
        visible={infoVisible}
        id={orderId}
        onCancel={() => setInfoVisible(false)}
      />
    </>
  );
};

export default AssetsLendingPage;
