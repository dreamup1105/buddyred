import React from 'react';
import { Select, Tag } from 'antd';
import ProTable from '@/components/ProTable';
import useUserInfo from '@/hooks/useUserInfo';
import type { ProTableColumn, ActionRef } from '@/components/ProTable';
import { fetchTeams } from '../service';
import type { SearchParams, QueryObject, TeamDetail } from '../type';
import { SigStatus, AuthStatus, StatusMap, StatusColorMap } from '../type';

const defaultSearch: SearchParams = {
  sigStatus: SigStatus.ALL,
  authStatus: AuthStatus.ALL,
};

const defaultQuery: QueryObject = {
  ...defaultSearch,
  current: 1,
  pageSize: 10,
};

const authStatuOptions = Object.keys(AuthStatus).map((key) => ({
  label: StatusMap.get(key),
  value: key,
  key,
}));

const sigStatuOptions = Object.keys(SigStatus).map((key) => ({
  label: StatusMap.get(key),
  value: key,
  key,
}));

/**
 * TeamList
 */
interface IComponentProps {
  title?: string;
  actionRef?: ActionRef;
  listRefreshMark?: number;
  operationContent?: React.ReactNode;
  operationColumn?: ProTableColumn<TeamDetail>;
  isSiteOrg?: boolean;
}
const TeamList: React.FC<IComponentProps> = ({
  title = '工程师组列表',
  operationContent,
  operationColumn,
  isSiteOrg = false,
  actionRef,
}) => {
  const { currentUser } = useUserInfo();
  const columns: ProTableColumn<TeamDetail>[] = [
    {
      title: '组名',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '机构名',
      dataIndex: 'orgName',
      hideInSearch: true,
    },
    {
      title: '驻点名',
      dataIndex: 'siteOrgName',
      hideInSearch: true,
    },
    {
      title: '授权状态',
      key: 'authStatus',
      dataIndex: 'authStatus',
      render: (_: string, record: TeamDetail) => (
        <Tag color={StatusColorMap.get(record.authStatus)}>
          {StatusMap.get(record.authStatus)}
        </Tag>
      ),
      renderFormItem: () => <Select options={authStatuOptions} />,
    },
    {
      title: '签约状态',
      key: 'sigStatus',
      dataIndex: 'sigStatus',
      render: (_: string, record: TeamDetail) => (
        <Tag color={StatusColorMap.get(record.sigStatus)}>
          {StatusMap.get(record.sigStatus)}
        </Tag>
      ),
      renderFormItem: () => <Select options={sigStatuOptions} />,
    },
  ];

  if (operationColumn) {
    columns.push(operationColumn);
  }

  return (
    <ProTable<TeamDetail, typeof defaultQuery>
      rowKey="id"
      columns={columns}
      title={title}
      actionRef={actionRef}
      defaultQuery={defaultQuery}
      toolBarRender={() => {
        return [operationContent];
      }}
      request={async (query) => {
        const { sigStatus, authStatus, current, pageSize } = query;

        const params: any = {
          sigStatus,
          authStatus,
          [isSiteOrg ? 'siteOrgId' : 'orgId']: currentUser?.user.orgId,
        };

        if (params.authStatus === AuthStatus.ALL) {
          delete params.authStatus;
        }
        if (params.sigStatus === SigStatus.ALL) {
          delete params.sigStatus;
        }

        return fetchTeams(params, Number(current) || 1, Number(pageSize) || 10);
      }}
    />
  );
};

export default TeamList;
