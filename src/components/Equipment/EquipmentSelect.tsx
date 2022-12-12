import React, { useRef, useState } from 'react';
import { Modal, Button, Space, message, Spin } from 'antd';
import type { ITableListItem as EquipmentItem } from '@/pages/Assets/type';
import type { ActionType } from './index';
import Equipment from './index';

export type SelectFunc = (params: SelectFuncParams) => void;

export type SelectFuncParams = {
  selectedRows?: EquipmentItem[];
  currentRecord?: EquipmentItem;
  selectedRowsKeys?: number[];
  excludeRowsKeys?: number[];
  fullSelectTotal?: number;
  isFullSelectMode?: boolean;
};

export enum BizType {
  'MAINTAIN' = 'MAINTAIN',
  'REPAIR' = 'REPAIR',
  'EMPTY' = 'EMPTY',
  'SIMPLE_REPAIR' = 'SIMPLE_REPAIR',
}

interface IComponentProps {
  visible: boolean;
  multiple?: boolean;
  isACL?: boolean;
  enableFullSelect?: boolean; // 开启全选
  bizType?: BizType | any;
  currentRecord?: EquipmentItem;
  onSelect: SelectFunc;
  onCancel: () => void;
}

const EquipmentSelect: React.FC<IComponentProps> = ({
  visible,
  bizType = BizType.EMPTY,
  onSelect,
  onCancel,
  isACL = true,
  multiple = true,
  enableFullSelect = false,
  currentRecord,
}) => {
  const actionRef = useRef<ActionType>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [equipmentSipLoading, setEquipmentSipLoading] = useState<boolean>(
    false,
  );
  const onSelectDone = async () => {
    setEquipmentSipLoading(true);
    const selectedRows = actionRef.current?.getSelectedRows!();
    const selectedRowsKeys = actionRef.current?.getSelectedRowKeys();
    const fullSelectTotal = actionRef.current?.getSelectedRowsCount();
    const isFullSelectMode = actionRef.current?.getFullSelectStatus();
    // 开启了全选进行的选择提交
    if (isFullSelectMode) {
      if (fullSelectTotal === 0) {
        message.warning('请选择设备');
        setEquipmentSipLoading(false);
        return;
      }
      const excludeRowsKeys = selectedRowsKeys;
      await onSelect({
        selectedRows: [],
        selectedRowsKeys: [],
        excludeRowsKeys: excludeRowsKeys as number[],
        fullSelectTotal,
        isFullSelectMode,
      });
    } else {
      // 正常多选
      if (
        !selectedRows ||
        (Array.isArray(selectedRows) && !selectedRows.length)
      ) {
        message.warning('请选择设备');
        setEquipmentSipLoading(false);
        return;
      }
      await onSelect({
        selectedRows,
        selectedRowsKeys: selectedRowsKeys as number[],
        excludeRowsKeys: [],
        fullSelectTotal,
        isFullSelectMode,
      });
    }
    setEquipmentSipLoading(false);
    // actionRef.current?.reload();
  };

  const onModalCancel = () => {
    onCancel();
    actionRef.current?.reload();
  };

  const renderFooter = () => {
    return (
      <>
        {multiple ? (
          <Space>
            <span>
              已选择设备（
              <span style={{ margin: '0 5px', fontWeight: 600, fontSize: 20 }}>
                {selectedCount}
              </span>
              台）
            </span>
            <Button disabled={equipmentSipLoading} onClick={onModalCancel}>
              取消
            </Button>
            <Button
              disabled={equipmentSipLoading}
              onClick={onSelectDone}
              type="primary"
            >
              选择
            </Button>
          </Space>
        ) : (
          <Button onClick={onModalCancel}>关闭</Button>
        )}
      </>
    );
  };

  return (
    <Modal
      width={1260}
      bodyStyle={{
        height: 650,
        overflow: 'scroll',
      }}
      closable={!equipmentSipLoading}
      maskClosable={false}
      onCancel={onModalCancel}
      visible={visible}
      title="选择设备"
      footer={renderFooter()}
    >
      <Spin
        spinning={equipmentSipLoading}
        delay={100}
        tip="正在添加，请稍等..."
      >
        <Equipment
          ref={actionRef}
          multiple={multiple}
          isACL={isACL}
          bizType={bizType}
          currentRecord={currentRecord}
          enableFullSelect={enableFullSelect}
          onSelect={async (record) => {
            try {
              onSelect({
                selectedRows: [record],
              });
              actionRef.current?.reload();
            } catch (error) {
              console.error(error);
            }
          }}
          onRowSelectionChange={(count) => setSelectedCount(count)}
        />
      </Spin>
    </Modal>
  );
};

export default EquipmentSelect;
