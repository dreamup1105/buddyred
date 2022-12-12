import React, { useRef, useState } from 'react';
import { Divider, message, Popconfirm } from 'antd';
import ProTable from '@/components/ProTable';
import type { ActionType, ProTableColumn } from '@/components/ProTable';
import type { ITableListItem } from './type';
import {
  getDectionListAPI,
  getDectionDetailAPI,
  deleteOrderAPI,
  getDectionItemTypeAPI,
} from './service';
import { tableHeight } from '@/utils/utils';
import DetailDodal from './components/detail';

const DefaultQuery = {
  current: 1,
  pageSize: 30,
  keyword: '',
};

// 设备检测页面
const EquipmentCheckPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [detail, setDetail] = useState<ITableListItem>();
  const [detailVisible, setDetailVisible] = useState(false);
  const [itemType, setItemType] = useState();

  // 获取检测项列表
  const getItemType = async () => {
    try {
      const { data } = await getDectionItemTypeAPI();
      setItemType(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 查看报告
  const onReport = async (record: ITableListItem) => {
    try {
      getItemType();
      const { data } = await getDectionDetailAPI(record.id);
      setDetailVisible(true);
      setDetail(data);
    } catch (err) {
      console.log(err);
    }
  };
  // 删除
  const onViewDelete = async (record: ITableListItem) => {
    console.log(record);
    try {
      await deleteOrderAPI(record.id);
      message.success('删除成功！');
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
      title: '设备名称',
      dataIndex: 'eqName',
      key: 'eqName',
      hideInSearch: true,
      render(_, record) {
        return <span>{record.eqName}</span>;
      },
    },
    {
      title: '受检单位',
      dataIndex: 'hospital',
      key: 'hospital',
      hideInSearch: true,
      render(_, record) {
        return <span>{record.hospital}</span>;
      },
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
            <a onClick={() => onReport(record)}>报告</a>
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
        title="设备检测列表"
        defaultQuery={DefaultQuery}
        actionRef={actionRef}
        columns={columns}
        isSyncToUrl={false}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        request={async (query) => {
          const { current, pageSize, keyword } = query;
          return getDectionListAPI({
            current: Number(current) || 1,
            pageSize: Number(pageSize) || 30,
            keyword,
            isReport: 1, //是否生成报告 0-未生成 1-已生成 PC端只查询已生成报告的数据
          });
        }}
      />
      <DetailDodal
        visible={detailVisible}
        detail={detail}
        itemType={itemType}
        onCancel={() => setDetailVisible(false)}
      />
    </>
  );
};

export default EquipmentCheckPage;
