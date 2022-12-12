import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@/components/ProTable';
import { history } from 'umi';
import {
  DatePicker,
  Select,
  Button,
  Divider,
  Popconfirm,
  message,
  Badge,
  Tag,
} from 'antd';
import { tableHeight } from '@/utils/utils';
import type { ProTableColumn, ActionType } from '@/components/ProTable';
import { PlusOutlined } from '@ant-design/icons';
import useUserInfo from '@/hooks/useUserInfo';
import {
  stringToMoment,
  momentToString,
  WithoutTimeFormat,
} from '@/utils/utils';
import SignDetailModal from './components/Detail';
import {
  fetchSignList,
  deleteDraftSign,
  terminateSign,
  fetchCompanyList,
} from './service';
import type { ISignContent, SignProjects } from './type';
import { SignStatusOptions, SignProjectsMap } from './type';
import { SignStatus, SignStatusMap } from '../Customer/type';

const DefaultQuery = {
  orgName: '',
  current: 1,
  pageSize: 30,
  agreeStatus: undefined,
  beginDate: undefined,
  endDate: undefined,
  agreeId: undefined,
};

const CrmSignPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [signDetailModalVisible, setSignDetailModalVisible] = useState(false);
  const { currentUser } = useUserInfo();
  const [currentRecord, setCurrentRecord] = useState<ISignContent>();

  // 点击编辑或复制
  const onCopyOrEdit = async (
    action: 'edit' | 'copy',
    record: ISignContent,
  ) => {
    try {
      const { data } = await fetchCompanyList();
      const crIds = data.filter((item) => item.crId == record.crId);
      if (crIds.length == 0) {
        message.error('与该公司已解除签约关系，不能进行编辑和复制');
      } else {
        history.push(`/crm/sign/${action}?id=${record.id}`);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  // 详情
  const onViewDetail = (record: ISignContent) => {
    setCurrentRecord(record);
    setSignDetailModalVisible(true);
  };

  // 删除签约
  const onDeleteSign = async (record: ISignContent) => {
    try {
      const { code } = await deleteDraftSign(record.id);
      if (code === 0) {
        actionRef.current?.reload();
        message.success('删除成功');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onTerminateSign = async (record: ISignContent) => {
    try {
      const { code } = await terminateSign(record.id);
      if (code === 0) {
        actionRef.current?.reload();
        message.success('终止签约成功');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderAction = (record: ISignContent) => {
    if (currentUser?.isMaintainer) {
      return <a onClick={() => onViewDetail(record)}>详情</a>;
    }
    const copyButton = (
      <Popconfirm
        title="复制当前签约内容，新建签约？"
        okText="确定"
        cancelText="取消"
        onConfirm={() => onCopyOrEdit('copy', record)}
      >
        <a>复制</a>
      </Popconfirm>
    );
    switch (record.agreeStatus) {
      case SignStatus.DRAFT: // 草稿
        return (
          <>
            {copyButton}
            <Divider type="vertical" />
            <a onClick={() => onCopyOrEdit('edit', record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => onViewDetail(record)}>详情</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => onDeleteSign(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      case SignStatus.TO_BE_EFFECTIVE: // 待生效
      case SignStatus.EXECUTION: // 执行中
        return (
          <>
            {copyButton}
            <Divider type="vertical" />
            <a onClick={() => onViewDetail(record)}>详情</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定终止正在执行的签约？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => onTerminateSign(record)}
            >
              <a>终止</a>
            </Popconfirm>
          </>
        );
      case SignStatus.EXPIRED: // 已过期
      case SignStatus.TERMINATED: // 已终止
        return (
          <>
            {copyButton}
            <Divider type="vertical" />
            <a onClick={() => onViewDetail(record)}>详情</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => onDeleteSign(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      default:
        return null;
    }
  };

  const columns: ProTableColumn<ISignContent>[] = [
    {
      title: currentUser?.isHospital ? '维保公司名称' : '医院名称',
      dataIndex: 'orgName',
      key: 'orgName',
      hideInTable: true,
    },
    {
      title: currentUser?.isHospital ? '维保公司' : '医院',
      dataIndex: 'orgName',
      key: 'orgName',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '类型',
      dataIndex: 'agreeTypes',
      key: 'agreeTypes',
      width: 230,
      hideInSearch: true,
      render: (projects) =>
        projects.map((i: SignProjects) => (
          <Tag key={i}>{SignProjectsMap.get(i)}</Tag>
        )),
    },
    {
      title: '生效时间',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 140,
      renderFormItem: () => <DatePicker style={{ width: '100%' }} />,
    },
    {
      title: '到期时间',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 140,
      renderFormItem: () => <DatePicker style={{ width: '100%' }} />,
    },
    {
      title: '状态',
      dataIndex: 'agreeStatus',
      key: 'agreeStatus',
      width: 140,
      renderFormItem: () => (
        <Select placeholder="请选择" options={SignStatusOptions} />
      ),
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
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 200,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => renderAction(record),
    },
  ];
  return (
    <PageContainer>
      <ProTable<ISignContent, typeof DefaultQuery>
        title="签约管理列表"
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        defaultQuery={DefaultQuery}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        toolBarRender={
          currentUser?.isHospital
            ? () => {
                return [
                  <Button
                    type="primary"
                    key="create"
                    onClick={() => history.push('/crm/sign/create')}
                  >
                    <PlusOutlined />
                    新建签约
                  </Button>,
                ];
              }
            : false
        }
        request={async (query) => {
          const {
            current,
            pageSize,
            orgName,
            beginDate,
            endDate,
            agreeStatus,
          } = query;

          return fetchSignList({
            agreeStatus,
            orgId: currentUser?.org.id,
            orgName,
            beginDate,
            endDate,
            pageSize,
            pageNum: Number(current) || 1,
          });
        }}
        hooks={{
          beforeInit: async (query) => {
            // 从消息通知传过来的id，通过id查询详情，并显示弹框详情
            if (query.agreeId) {
              const { data } = await fetchSignList({
                agreeId: query.agreeId,
                departmentId: currentUser?.org.id,
              });
              if (data.length == 1) {
                setCurrentRecord(data[0]);
                setSignDetailModalVisible(true);
              }
              console.log(data);
            }
            return {
              ...DefaultQuery,
              ...query,
              beginDate: stringToMoment(query.beginDate),
              endDate: stringToMoment(query.endDate),
            };
          },
          beforeSubmit: (formValues) => {
            return {
              ...formValues,
              beginDate: momentToString(
                formValues.beginDate,
                WithoutTimeFormat,
              ),
              endDate: momentToString(formValues.endDate, WithoutTimeFormat),
            };
          },
        }}
        onRow={(record) => ({
          onDoubleClick: () => onViewDetail(record),
        })}
      />
      <SignDetailModal
        visible={signDetailModalVisible}
        currentRecord={currentRecord}
        onCancel={() => setSignDetailModalVisible(false)}
        initialData={undefined}
      />
    </PageContainer>
  );
};

export default CrmSignPage;
