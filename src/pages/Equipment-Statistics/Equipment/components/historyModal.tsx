import React, { useEffect, useRef } from 'react';
import { Modal, Button, Tag, Badge } from 'antd';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { ITableListHistoryItem, SignProjects } from '../type';
import { SignProjectsMap, SignStatusMap } from '../type';
import { listAgreementByEqIdAPI } from '../service';
import type { FormInstance } from 'antd/es/form';

const DefaultQuery: any = {};

interface HistoryItem {
  eqId: number | undefined;
  visible: boolean;
  onModalCancel: () => void;
}

// 签约历史
const StatisticsHistoryModalPage: React.FC<HistoryItem> = ({
  eqId,
  visible,
  onModalCancel,
}) => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();

  const columns: ProTableColumn<ITableListHistoryItem>[] = [
    {
      title: '序号',
      key: 'index',
      width: 65,
      hideInSearch: true,
      render: (t: any, r: any, index: number) => index + 1,
    },
    {
      title: '签约类型',
      dataIndex: 'agreeTypes',
      key: 'agreeTypes',
      width: 200,
      hideInSearch: true,
      render: (projects) =>
        projects.map((i: SignProjects) => (
          <Tag key={i}>{SignProjectsMap.get(i)}</Tag>
        )),
    },
    {
      title: '签约状态',
      dataIndex: 'agreeStatus',
      key: 'agreeStatus',
      width: 160,
      hideInSearch: true,
      render: (status) => {
        if (status) {
          return (
            <Badge
              status={SignStatusMap.get(status)?.status as any}
              text={SignStatusMap.get(status)?.text}
            />
          );
        }
        return '-';
      },
    },
    {
      title: '生效时间',
      dataIndex: 'beginDate',
      key: 'beginDate',
      hideInSearch: true,
      width: 220,
    },
    {
      title: '到期时间',
      dataIndex: 'endDate',
      key: 'endDate',
      hideInSearch: true,
      width: 180,
    },
  ];

  useEffect(() => {
    actionRef.current?.reload();
  }, [eqId]);

  return (
    <Modal
      title="签约历史"
      visible={visible}
      maskClosable={true}
      closable={true}
      width={1200}
      zIndex={2000}
      onCancel={onModalCancel}
      footer={
        <>
          <Button onClick={onModalCancel}>关闭</Button>
        </>
      }
    >
      <ProTable<ITableListHistoryItem, typeof DefaultQuery>
        rowKey="id"
        title="签约历史"
        defaultQuery={DefaultQuery}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        tableProps={{
          scroll: {
            y: 360,
          },
        }}
        request={async () => {
          if (eqId) {
            return listAgreementByEqIdAPI(eqId);
          }
          return {
            data: [],
            success: true,
          };
        }}
        hooks={{
          beforeInit: (query) => {
            console.log(query);
            return {
              ...query,
            };
          },
        }}
      />
    </Modal>
  );
};

export default StatisticsHistoryModalPage;
