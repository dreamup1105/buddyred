import React, { useState, useRef, useEffect } from 'react';
import ProTable from '@/components/ProTable';
import { Button, message, TreeSelect } from 'antd';
import useUserInfo from '@/hooks/useUserInfo';
import useDepartments from '@/hooks/useDepartments';
import EquipmentSelectorModal from '@/components/Equipment/EquipmentSelect';
import type { SelectFunc } from '@/components/Equipment/EquipmentSelect';
import type { ProTableColumn, ActionType } from '@/components/ProTable';
import SignFormContainer from '../../hooks/useSignForm';
import type { ISignEquipmentItem } from '../../type';
import { tableHeight } from '@/utils/utils';
import {
  saveSignEquipments,
  fetchSignEquipments,
  deleteEquipment,
} from '../../service';

const StepEquipment: React.FC = () => {
  const { currentUser } = useUserInfo();
  const { departmentsTreeData } = useDepartments(
    {
      orgId: currentUser!.org.id!,
    },
    true,
  );
  const actionRef = useRef<ActionType>();
  const signForm = SignFormContainer.useContainer();
  const [
    equipmentSelectorModalVisible,
    setEquipmentSelectorModalVisible,
  ] = useState(false);

  const onSelectDone: SelectFunc = async ({
    selectedRowsKeys = [],
    excludeRowsKeys = [],
    isFullSelectMode = false,
    fullSelectTotal = 0,
  }) => {
    try {
      const { code } = await saveSignEquipments(
        signForm.values.id!,
        isFullSelectMode ? [...excludeRowsKeys] : selectedRowsKeys,
        isFullSelectMode,
      );
      if (code === 0) {
        actionRef.current?.reload(true);
        signForm.updateForm((prevValues) => ({
          ...prevValues,
          euqipmentCount: isFullSelectMode
            ? fullSelectTotal!
            : selectedRowsKeys.length,
        }));
      }
    } catch (error) {
      console.error(error);
    }
    setEquipmentSelectorModalVisible(false);
  };

  const onDelEquipment = async (record: ISignEquipmentItem) => {
    if (!signForm.values.id) {
      message.error('删除发生异常');
      return;
    }
    try {
      const { code } = await deleteEquipment({
        id: signForm.values.id,
        equipmentIds: [record.id],
      });
      if (code === 0) {
        actionRef.current?.reload(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ProTableColumn<ISignEquipmentItem>[] = [
    {
      title: '设备编号',
      dataIndex: 'equipmentNo',
      key: 'equipmentNo',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      hideInTable: true,
    },
    {
      title: '设备名称',
      dataIndex: 'equipNameNew',
      key: 'equipNameNew',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentId',
      key: 'departmentId',
      width: 160,
      hideInTable: true,
      renderFormItem: () => (
        <TreeSelect
          placeholder="请选择"
          treeData={departmentsTreeData}
          treeNodeFilterProp="title"
          treeDefaultExpandAll
          virtual={false}
        />
      ),
    },
    {
      title: '生产厂商',
      dataIndex: 'manufacturerName',
      key: 'manufacturerName',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '型号',
      dataIndex: 'modelName',
      key: 'modelName',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '序列号',
      dataIndex: 'sn',
      key: 'sn',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => <a onClick={() => onDelEquipment(record)}>删除</a>,
    },
  ];

  useEffect(() => {
    if (signForm.values.id) {
      actionRef.current?.reload();
    }
  }, [signForm.values.id]);

  return (
    <>
      <ProTable<ISignEquipmentItem, any>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        title={`签约设备（${signForm.values.euqipmentCount}台）`}
        isSyncToUrl={false}
        params={{
          id: signForm.values.id,
        }}
        options={{
          seqColumn: true,
        }}
        tableProps={{
          scroll: {
            y: tableHeight,
          },
        }}
        request={async (formValues: any) => {
          if (!signForm.values.id) {
            return {
              success: true,
              data: [],
            };
          }
          const { current, pageSize, departmentId, name } = formValues;
          return fetchSignEquipments({
            aid: signForm.values.id,
            departmentId,
            name,
            pageNum: current,
            pageSize,
          });
        }}
        hooks={{
          onLoad: (_, total) => {
            signForm.updateForm((prevValues) => ({
              ...prevValues,
              euqipmentCount: total,
            }));
          },
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => setEquipmentSelectorModalVisible(true)}
          >
            添加设备
          </Button>,
        ]}
      />
      <EquipmentSelectorModal
        isACL={false}
        enableFullSelect
        visible={equipmentSelectorModalVisible}
        onSelect={(...args) => onSelectDone(...args)}
        onCancel={() => setEquipmentSelectorModalVisible(false)}
      />
    </>
  );
};

export default StepEquipment;
