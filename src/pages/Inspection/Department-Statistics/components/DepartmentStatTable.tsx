import React, { useState } from 'react';
import { Tag } from 'antd';
import ProTable from '@/components/ProTable';
import useMount from '@/hooks/useMount';
import type { ProTableColumn } from '@/components/ProTable';
import useUserInfo from '@/hooks/useUserInfo';
import InspectionRecordTable from './InspectionRecordTable';
import { fetchInspectionEquipments } from '../../service';
import type { IEquipmentStatItem, IDepartmentDetailItem } from '../../type';
// import { EquipmentStatusMap } from '../../type';

interface IComponentProps {
  startTime?: string | null;
  endTime?: string | null;
  dataSource: IDepartmentDetailItem[];
  loading: boolean;
  isACL: boolean;
  isMaintainer: boolean; // 是否是工程师
  date: string;
}

const DepartmentStatTable: React.FC<IComponentProps> = ({
  startTime,
  endTime,
  dataSource,
  isACL,
  isMaintainer,
  date,
}) => {
  const { currentUser } = useUserInfo();
  const [detailLoading, setDetailLoading] = useState(false);
  const [equipmentStats, setEquipmentStats] = useState<IEquipmentStatItem[]>(
    [],
  );
  const [currentRecord, setCurrentRecord] = useState<
    IDepartmentDetailItem | undefined
  >();
  const [recordTableVisible, setRecordTableVisible] = useState(false);
  const onViewDetail = async (record: IDepartmentDetailItem) => {
    setRecordTableVisible(true);
    setCurrentRecord(record);
    setDetailLoading(true);
    try {
      const formData: any = {
        departmentId: record.departmentId,
        date,
        queryDataFlag: true,
        inspectionFlag: 1,
      };

      if (isACL && isMaintainer) {
        formData.crId = currentUser!.currentCustomer?.id;
      }

      const { data } = await fetchInspectionEquipments(formData);
      setEquipmentStats(data.equipmentDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setDetailLoading(false);
    }
  };

  useMount(() => {
    console.log(startTime);
    console.log(endTime);
  });

  const columns: ProTableColumn<IDepartmentDetailItem>[] = [
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      hideInSearch: true,
    },
    {
      title: '正常数量',
      dataIndex: 'normalCount',
      key: 'normalCount',
      hideInSearch: true,
    },
    {
      title: '异常数量',
      dataIndex: 'abnormalCount',
      key: 'abnormalCount',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: (auditStatus) => {
        // const itemConfig = EquipmentStatusMap.get(equipmentStatus);
        return (
          <Tag color={auditStatus ? 'green' : 'red'}>
            {auditStatus ? '已验收' : '未验收'}
          </Tag>
        );
      },
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <a onClick={() => onViewDetail(record)}>详情</a>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<IDepartmentDetailItem, any>
        title="科室统计表"
        rowKey="departmentId"
        columns={columns}
        dataSource={dataSource}
        isSyncToUrl={true}
        onRow={(record) => {
          return {
            onDoubleClick: () => onViewDetail(record),
          };
        }}
        request={async (query) => {
          console.log(query);
          return {
            data: [],
            success: false,
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
      <InspectionRecordTable
        type="Daily"
        date={date}
        loading={detailLoading}
        visible={recordTableVisible}
        dataSource={equipmentStats}
        currentRecord={currentRecord}
        onCancel={() => {
          setCurrentRecord(undefined);
          setRecordTableVisible(false);
        }}
      />
    </>
  );
};

export default DepartmentStatTable;
