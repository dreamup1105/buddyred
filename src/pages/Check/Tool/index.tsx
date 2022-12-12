import React, { useRef, useState } from 'react';
import { Divider, message, Popconfirm, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { ITableListItem } from './type';
import { listByPageAPI, toolDeleteAPI, addOrUpdateAPI } from './service';
import { tableHeight } from '@/utils/utils';
import DetailDodal from './components/detail';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  keyword: '',
};

// 检测工具页面
const CheckToolPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [detail, setDetail] = useState<ITableListItem>();
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailDodalTitle, setDetailDodalTitle] = useState<string>('新增');

  // 新建
  const onAdd = () => {
    setDetailDodalTitle('新增');
    setDetail({});
    setDetailVisible(true);
  };

  // 编辑
  const onEditView = async (record: ITableListItem) => {
    try {
      setDetailDodalTitle('编辑');
      setDetailVisible(true);
      setDetail(record);
    } catch (err) {
      console.log(err);
    }
  };

  // 删除
  const onViewDelete = async (record: ITableListItem) => {
    try {
      await toolDeleteAPI(record.id);
      message.success('删除成功！');
      actionRef.current?.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // 保存
  const onDetailConfirm = async (formValue: any) => {
    try {
      await addOrUpdateAPI(formValue);
      setDetailVisible(false);
      if (formValue.id) {
        message.success('编辑成功');
      } else {
        message.success('新增成功');
      }
      actionRef.current?.reload();
    } catch (err) {
      console.log(err);
      return;
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
      renderFormItem: () => <Input placeholder="名称/编号/型号/产地" />,
    },
    {
      title: '仪器名称',
      dataIndex: 'name',
      key: 'name',
      hideInSearch: true,
    },
    {
      title: '仪器编号',
      dataIndex: 'number',
      key: 'number',
      hideInSearch: true,
      render: (_, record) => record.number ?? '/',
    },
    {
      title: '型号',
      dataIndex: 'version',
      key: 'version',
      hideInSearch: true,
      render: (_, record) => record.version ?? '/',
    },
    {
      title: '产地',
      dataIndex: 'address',
      key: 'address',
      hideInSearch: true,
      render: (_, record) => record.address ?? '/',
    },
    {
      title: '设备校准日期',
      dataIndex: 'calibrationDate',
      key: 'calibrationDate',
      hideInSearch: true,
      render: (_, record) => record.calibrationDate ?? '/',
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
            <a onClick={() => onEditView(record)}>编辑</a>
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
    <>
      <ProTable<ITableListItem, typeof DefaultQuery>
        rowKey="id"
        title="检测工具列表"
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
            新建
          </Button>,
        ]}
        request={async (query) => {
          const { current, pageSize, keyword } = query;
          return listByPageAPI({
            current: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
            keyword,
          });
        }}
      />
      <DetailDodal
        visible={detailVisible}
        title={detailDodalTitle}
        detail={detail}
        onCancel={() => setDetailVisible(false)}
        onComfirm={onDetailConfirm}
      />
    </>
  );
};

export default CheckToolPage;
