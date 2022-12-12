import React, { useRef, useState } from 'react';
import { DatePicker, Divider, Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { ITableListItem } from './type';
import {
  securityListByPageAPI,
  securitySaveOrUpdateAPI,
  securityGetBySecurityCodeAPI,
  securityInvalidSecurityByIdAPI,
} from './service';
import { tableHeight } from '@/utils/utils';
import { momentToString, WithoutTimeFormat } from '@/utils/utils';
const { RangePicker } = DatePicker;
import BaseFormModal from './components/baseForm';
import DetailModal from './components/detail';
import { PageContainer } from '@ant-design/pro-layout';
import useUserInfo from '@/hooks/useUserInfo';
import useACL from '@/hooks/useACL';
import { ResourcePath } from '@/utils/constants';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  date: undefined,
  keyword: '',
};

// 防伪信息页面
const CheckAntiFakePage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const orgId = currentUser?.org.id;
  const { isACL } = useACL();
  const actionRef = useRef<ActionType>();
  const [baseFormVisible, setBaseFormVisible] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [recordView, setRecordView] = useState<ITableListItem>();

  // 新建
  const onAdd = () => {
    console.log('新建');
    setBaseFormVisible(true);
  };

  // 详情
  const onViewDetail = async (record: ITableListItem) => {
    const { data } = await securityGetBySecurityCodeAPI(record.securityCode);
    const resObj = data.resObj;
    const params = {
      ...resObj,
      simpleAttachmentInfoList: resObj.simpleAttachmentInfoList.map(
        (item: any) => {
          return {
            url: `${ResourcePath}${item.res}`,
            type: item.contentType,
            size: item.contentLength,
            status: 'done',
            name: item.fileName,
            uid: item.res,
          };
        },
      ),
    };
    setRecordView(params);
    setDetailVisible(true);
  };

  // 删除
  const onViewDelete = async (record: ITableListItem) => {
    try {
      await securityInvalidSecurityByIdAPI(record.id);
      message.success('删除成功');
      actionRef.current?.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // 新增确认
  const baseFormConfirm = async (data: any) => {
    console.log(data);
    try {
      await securitySaveOrUpdateAPI(data);
      message.success('新增成功');
      setBaseFormVisible(false);
      actionRef.current?.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const columns: ProTableColumn<ITableListItem>[] = [
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
    },
    {
      title: '上传时间',
      dataIndex: 'date',
      key: 'date',
      hideInTable: true,
      renderFormItem: () => <RangePicker />,
    },
    {
      title: '名称',
      dataIndex: 'reportTitle',
      key: 'reportTitle',
      hideInSearch: true,
      width: 160,
    },
    {
      title: '检测人',
      dataIndex: 'detectPerson',
      key: 'detectPerson',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '检测工具',
      dataIndex: 'detectTool',
      key: 'detectTool',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '检测时间',
      dataIndex: 'detectTime',
      key: 'detectTime',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '送检医院',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '送检设备',
      dataIndex: 'detectEquipment',
      key: 'detectEquipment',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '报告上传时间',
      dataIndex: 'importReportTime',
      key: 'importReportTime',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <>
            <a onClick={() => onViewDetail(record)}>详情</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => onViewDelete(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<ITableListItem, typeof DefaultQuery>
        rowKey="id"
        title="防伪信息列表"
        defaultQuery={DefaultQuery}
        actionRef={actionRef}
        columns={columns}
        isSyncToUrl={false}
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
            onClick={onAdd}
          >
            新建防伪信息
          </Button>,
        ]}
        request={async (query) => {
          const { current, pageSize, keyword, date } = query;
          return securityListByPageAPI({
            current: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
            orgId,
            isAcl: isACL,
            keyword,
            startTime:
              (date?.[0] &&
                momentToString(date[0], WithoutTimeFormat) + ' 00:00:00') ||
              undefined,
            endTime:
              (date?.[1] &&
                momentToString(date[1], WithoutTimeFormat) + ' 23:59:59') ||
              undefined,
          });
        }}
      />
      <BaseFormModal
        visible={baseFormVisible}
        onCancel={() => setBaseFormVisible(false)}
        onConfirm={baseFormConfirm}
      />
      <DetailModal
        visible={detailVisible}
        detail={recordView}
        onCancel={() => setDetailVisible(false)}
      />
    </PageContainer>
  );
};

export default CheckAntiFakePage;
