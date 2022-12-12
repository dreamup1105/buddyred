import React, { useState, useEffect, useCallback } from 'react';
import { Table, Pagination, Row, Col, message, Typography } from 'antd';
import type { TeamDetail } from '@/pages/Team/type';
import { fetchAuthEquipments, fetchSigEquipments } from '../service';
import type { PaginationConfig, Equipment } from '../type';

const defaultPagination: PaginationConfig = {
  current: 1,
  pageSize: 10,
  total: 0,
};

/**
 * 此模块为签约设备时使用的列表模块
 * 维修机构申请签约时（isSig = false），列表将列出所有已经授权的设备
 * 医院（驻点机构）审批签约时（isSig = true），列表将列出申请签约时所选的设备
 */
interface EquipmentListProps {
  value?: (number | string)[];
  isSig?: boolean;
  selectAble?: boolean;
  team: TeamDetail;
  onChange?: (value: (number | string)[]) => void;
}
const EquipmentList: React.FC<EquipmentListProps> = ({
  value = [],
  isSig = false,
  selectAble = true,
  team,
  onChange,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] =
    useState<PaginationConfig>(defaultPagination);
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  /* 获取设备列表 */
  const loadEquipments = useCallback(
    async (p: PaginationConfig) => {
      if (!team) return;
      setLoading(true);
      try {
        if (isSig) {
          // 获取签约所申请的设备
          const { data, total } = await fetchSigEquipments(
            p.current,
            p.pageSize,
            team.id,
          );
          setEquipments(data);
          setPagination({ ...p, total });
        } else {
          // 获取已授权的设备
          const { data, total } = await fetchAuthEquipments(
            p.current,
            p.pageSize,
            team.id,
            team.siteOrgId,
          );
          setEquipments(data);
          setPagination({ ...p, total });
        }
      } catch (err) {
        message.error(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [team, isSig],
  );

  const columns = [
    {
      title: '设备名',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Equipment) => {
        if (record.isSigned) {
          return <Typography.Text delete>{_}</Typography.Text>;
        }
        return _;
      },
    },
    {
      title: '生产厂商',
      dataIndex: 'manufacturerName',
    },
    {
      title: '型号',
      dataIndex: 'modelName',
    },
    {
      title: '序列号',
      dataIndex: 'sn',
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
    },
  ];

  const rowSelection = {
    selectedRowKeys: value,
    preserveSelectedRowKeys: true,
    onChange,
    getCheckboxProps: (record: Equipment) => ({
      disabled: record.isSigned,
    }),
  };

  const handleChangePagination = (page: number, pageSize?: number) => {
    if (pageSize === undefined) {
      loadEquipments({ ...pagination, current: page });
    } else {
      loadEquipments({ ...pagination, current: page, pageSize });
    }
  };

  useEffect(() => {
    loadEquipments(defaultPagination);
  }, [loadEquipments]);

  return (
    <Row>
      <Col span={24}>
        <Table<Equipment>
          loading={loading}
          size="small"
          style={{ marginBottom: 16 }}
          rowKey="id"
          columns={columns}
          pagination={false}
          dataSource={equipments}
          rowSelection={selectAble ? rowSelection : undefined}
        />
      </Col>
      <Col span={24}>
        <Pagination
          {...pagination}
          onChange={handleChangePagination}
          size="small"
          style={{ textAlign: 'right' }}
          hideOnSinglePage
        />
      </Col>
    </Row>
  );
};

export default EquipmentList;
