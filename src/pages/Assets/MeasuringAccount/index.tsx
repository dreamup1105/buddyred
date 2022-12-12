import React, { useRef } from 'react';
import { Input, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@/components/ProTable';
import { tableHeight } from '@/utils/utils';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { FormInstance } from 'antd/es/form';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  keyword: '',
  startDate: undefined,
  type: 'dept'
};

const AssetsMeasuringAccountPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();

  const columns: ProTableColumn<any>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      hideInTable: true,
      renderFormItem: () => (
        <Input placeholder="器具名称/规格型号/赋码" />
      ),
    },
    {
      title: '器具名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '器具类型',
      dataIndex: 'type',
      key: 'type',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '规格型号',
      dataIndex: 'sn',
      key: 'sn',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '出厂编号',
      dataIndex: 'code',
      key: 'code',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '赋码',
      dataIndex: 'coding',
      key: 'coding',
      width: 220,
      hideInSearch: true,
    },
    {
      title: '使用状态',
      dataIndex: 'usingStatus',
      key: 'usingStatus',
      width: 120,
      renderFormItem: () => (
        <Select>
          <Select.Option value='0'>在用</Select.Option>
          <Select.Option value='1'>停用</Select.Option>
        </Select>
      ),
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      width: 120,
      renderFormItem: () => (
        <Select>
          <Select.Option value='0'>草稿</Select.Option>
          <Select.Option value='1'>审核中</Select.Option>
          <Select.Option value='1'>已审核</Select.Option>
        </Select>
      ),
    },
    {
      title: '审核机构',
      dataIndex: 'auditOrganization',
      key: 'auditOrganization',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '鉴定机构',
      dataIndex: 'checkupOrganization',
      key: 'checkupOrganization',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '鉴定状态',
      dataIndex: 'checkupStatus',
      key: 'checkupStatus',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      key: 'auditTime',
      hideInSearch: true,
      width: 140,
    },
    {
      title: '有效期至',
      dataIndex: 'validUntil',
      key: 'validUntil',
      hideInSearch: true,
      width: 120,
    },
  ];

  const dataSource: any = [
    {
      id: '0',
      name: '氧压力表',
      type: '强检工作计量器具',
      sn: '(0~1.6)MPa',
      code: 'B190210168',
      coding: '431935369532326160486',
      usingStatus: '在用',
      auditStatus: '已审核',
      auditOrganization: '大姚县市场监督管理局',
      checkupOrganization: '大姚县市场监督管理局',
      checkupStatus: '已完成',
      auditTime: '2021-08-20',
      validUntil: '2022-02-28',
    },
    {
      id: '1',
      name: '氧压力表',
      type: '强检工作计量器具',
      sn: '(0~2.5)MPa',
      code: 'HC65511223935',
      coding: '431935369532326160487',
      usingStatus: '在用',
      auditStatus: '已审核',
      auditOrganization: '大姚县市场监督管理局',
      checkupOrganization: '大姚县市场监督管理局',
      checkupStatus: '已完成',
      auditTime: '2021-08-20',
      validUntil: '2022-02-28',
    },
    {
      id: '2',
      name: '氧压力表',
      type: '强检工作计量器具',
      sn: '(0~1.6)MPa',
      code: 'HC65511224926',
      coding: '431935369532326160488',
      usingStatus: '在用',
      auditStatus: '已审核',
      auditOrganization: '大姚县市场监督管理局',
      checkupOrganization: '大姚县市场监督管理局',
      checkupStatus: '已完成',
      auditTime: '2021-08-20',
      validUntil: '2022-02-28',
    },
    {
      id: '3',
      name: '压力表',
      type: '强检工作计量器具',
      sn: '（0~0.6）MPa',
      code: '01',
      coding: '431935369532326160479',
      usingStatus: '在用',
      auditStatus: '已审核',
      auditOrganization: '大姚县市场监督管理局',
      checkupOrganization: '大姚县市场监督管理局',
      checkupStatus: '未报检',
      auditTime: '2021-08-20',
      validUntil: '',
    },
    {
      id: '4',
      name: '氧压力表',
      type: '强检工作计量器具',
      sn: '(0~1.6)MPa',
      code: 'HC65511225008',
      coding: '431935369532326160489',
      usingStatus: '在用',
      auditStatus: '已审核',
      auditOrganization: '大姚县市场监督管理局',
      checkupOrganization: '大姚县市场监督管理局',
      checkupStatus: '已完成',
      auditTime: '2021-08-20',
      validUntil: '2022-02-28',
    },
    {
      id: '5',
      name: '氧压力表',
      type: '强检工作计量器具',
      sn: '(0~1.6)MPa',
      code: '17031649',
      coding: '431935369532326160490',
      usingStatus: '在用',
      auditStatus: '已审核',
      auditOrganization: '大姚县市场监督管理局',
      checkupOrganization: '大姚县市场监督管理局',
      checkupStatus: '未报检',
      auditTime: '2021-08-20',
      validUntil: '',
    },
    {
      id: '6',
      name: '压力表',
      type: '强检工作计量器具',
      sn: '(0~0.6)MPa',
      code: 'A191001373',
      coding: '431935369532326160480',
      usingStatus: '在用',
      auditStatus: '已审核',
      auditOrganization: '大姚县市场监督管理局',
      checkupOrganization: '大姚县市场监督管理局',
      checkupStatus: '已完成',
      auditTime: '2021-08-20',
      validUntil: '2022-02-28',
    },
    {
      id: '7',
      name: '压力表',
      type: '强检工作计量器具',
      sn: '（0~1.6）MPa',
      code: 'HC65511224249',
      coding: '431935369532326160481',
      usingStatus: '在用',
      auditStatus: '已审核',
      auditOrganization: '大姚县市场监督管理局',
      checkupOrganization: '大姚县市场监督管理局',
      checkupStatus: '未报检',
      auditTime: '2021-08-20',
      validUntil: '',
    },
    {
      id: '8',
      name: '压力表',
      type: '强检工作计量器具',
      sn: '（0~0.6）MPa',
      code: 'B190210169',
      coding: '431935369532326160482',
      usingStatus: '在用',
      auditStatus: '已审核',
      auditOrganization: '大姚县市场监督管理局',
      checkupOrganization: '大姚县市场监督管理局',
      checkupStatus: '未报检',
      auditTime: '2021-08-20',
      validUntil: '',
    },
    {
      id: '9',
      name: '氧气压力表',
      type: '强检工作计量器具',
      sn: '(0~1.6)MPa',
      code: '1703160',
      coding: '431935369532326160491',
      usingStatus: '在用',
      auditStatus: '已审核',
      auditOrganization: '大姚县市场监督管理局',
      checkupOrganization: '大姚县市场监督管理局',
      checkupStatus: '未报检',
      auditTime: '2021-08-20',
      validUntil: '2022-02-28',
    },
    {
      id: '10',
      name: '压力表',
      type: '强检工作计量器具',
      sn: '（0~0.6）MPa',
      code: 'A191080701',
      coding: '431935369532326160483',
      usingStatus: '在用',
      auditStatus: '已审核',
      auditOrganization: '大姚县市场监督管理局',
      checkupOrganization: '大姚县市场监督管理局',
      checkupStatus: '未报检',
      auditTime: '2021-08-20',
      validUntil: '2022-02-28',
    },
  ]

  return (
    <>
    <PageContainer>
      <ProTable<any, typeof DefaultQuery>
        rowKey="id"
        title="计量器具台帐列表"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        request={() => {
          return {
            data: dataSource,
            success: true
          }
        }}
      />
    </PageContainer>

    </>
  );
};

export default AssetsMeasuringAccountPage;
