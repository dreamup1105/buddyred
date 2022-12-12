import React, { useRef, useEffect, useState } from 'react';
import { Modal, Descriptions, TreeSelect, Button, Checkbox, Tag } from 'antd';
import ProTable from '@/components/ProTable';
import useUserInfo from '@/hooks/useUserInfo';
import type { ProTableColumn, ActionType } from '@/components/ProTable';
import type { ISignContent, ISignEquipmentItem } from '../type';
import { SignProjectsOptions } from '../type';
import { fetchSignEquipments, listAgreementHosDeptAPI } from '../service';
import { ScrapStatusMap } from '@/utils/constants';

interface IComponentProps {
  visible: boolean;
  currentRecord: ISignContent | undefined;
  onCancel: () => void;
  initialData: any;
}

const SignDetailModal: React.FC<IComponentProps> = ({
  visible,
  currentRecord,
  onCancel,
}) => {
  const actionRef = useRef<ActionType>();
  const { currentUser } = useUserInfo();
  const [departmentsTreeData, setDepartmentsTreeData] = useState([]);

  const columns: ProTableColumn<ISignEquipmentItem>[] = [
    {
      title: '设备编号',
      dataIndex: 'equipmentNo',
      key: 'equipmentNo',
      hideInSearch: true,
    },
    {
      title: '设备名称',
      dataIndex: 'equipNameNew',
      key: 'equipNameNew',
      hideInSearch: true,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      hideInTable: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentId',
      key: 'departmentId',
      hideInTable: true,
      renderFormItem: () => (
        <TreeSelect
          placeholder="请选择"
          treeData={departmentsTreeData}
          treeDefaultExpandAll
        />
      ),
    },
    {
      title: '生产厂商',
      dataIndex: 'manufacturerName',
      key: 'manufacturerName',
      hideInSearch: true,
    },
    {
      title: '型号',
      dataIndex: 'modelName',
      key: 'modelName',
      hideInSearch: true,
    },
    {
      title: '序列号',
      dataIndex: 'sn',
      key: 'sn',
      hideInSearch: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      hideInSearch: true,
    },
    {
      title: '报废状态',
      dataIndex: 'isScrap',
      key: 'isScrap',
      hideInSearch: true,
      render: (status) => {
        const itemConfig = ScrapStatusMap.get(status);
        return (
          <Tag color={itemConfig?.color ?? 'default'}>{itemConfig?.label}</Tag>
        );
      },
    },
  ];

  const onModalCancel = () => {
    actionRef?.current?.resetSearchForm();
    onCancel();
  };

  const listAgreementHosDept = async () => {
    try {
      const { data } = await listAgreementHosDeptAPI(currentRecord?.id);
      setDepartmentsTreeData(
        data.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
            children: item.childrenNumber,
          };
        }),
      );
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (visible && currentRecord?.id) {
      actionRef.current?.reload(true);
      listAgreementHosDept();
    }
  }, [visible, currentRecord?.id]);

  return (
    <Modal
      title="签约详情"
      visible={visible}
      width={1200}
      onCancel={onModalCancel}
      footer={
        <>
          <Button onClick={onModalCancel}>关闭</Button>
        </>
      }
    >
      <Descriptions style={{ padding: '0 32px' }}>
        <Descriptions.Item
          label={currentUser?.isHospital ? '签约公司' : '签约医院'}
          span={2}
          contentStyle={{ fontWeight: 500 }}
        >
          {currentRecord?.orgName}
        </Descriptions.Item>
        <Descriptions.Item label="签约时间" contentStyle={{ fontWeight: 500 }}>
          {currentRecord?.beginDate} 至 {currentRecord?.endDate}
        </Descriptions.Item>
        <Descriptions.Item label="签约项目" span={2}>
          <Checkbox.Group
            options={SignProjectsOptions}
            value={currentRecord?.agreeTypes}
            disabled
          />
        </Descriptions.Item>
        <Descriptions.Item label="签约设备" contentStyle={{ fontWeight: 500 }}>
          {currentRecord?.agreeCount}
        </Descriptions.Item>
      </Descriptions>
      <ProTable
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        isSyncToUrl={false}
        options={{
          seqColumn: true,
        }}
        tableProps={{
          scroll: {
            y: 350,
          },
        }}
        params={{
          id: currentRecord?.id,
        }}
        toolBarRender={false}
        request={async (formValues: any) => {
          if (!currentRecord?.id) {
            return {
              success: true,
              data: [],
            };
          }
          const { current, pageSize, departmentId, name } = formValues;
          return fetchSignEquipments({
            aid: currentRecord.id,
            departmentId,
            name,
            pageNum: current,
            pageSize,
          });
        }}
      />
    </Modal>
  );
};

export default SignDetailModal;
