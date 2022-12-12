import React, { useState, useEffect } from 'react';
import { Modal, Table, Space, Button, Row, Col, message, Popover } from 'antd';
import useUserInfo from '@/hooks/useUserInfo';
import type { ColumnType } from 'antd/es/table';
import PrintContainer from '@/components/PrintContainer';
import usePrint from '@/hooks/usePrint';
import type {
  IEquipmentStatItem,
  ICheckAcceptanceOrderItem,
  InspectionRecordTableType,
  ICheckAcceptanceOrderDetailItem,
  IDepartmentDetailItem,
  ActionRef,
  ActionType,
} from '../../type';
import { OperationType } from '../../type';
import {
  checkInspectionDone,
  revokeInspectionApplication,
} from '../../service';
import styles from '../index.less';

interface IComponentProps {
  loading: boolean;
  date: string | null | undefined;
  actionRef?: ActionRef;
  type: InspectionRecordTableType;
  visible: boolean;
  currentRecord: IDepartmentDetailItem | ICheckAcceptanceOrderItem | undefined;
  onCancel: () => void;
  onSubmit?: () => void;
  dataSource: IEquipmentStatItem[] | ICheckAcceptanceOrderDetailItem[];
}

const baseColumns: ColumnType<IEquipmentStatItem>[] = [
  {
    title: '设备名称',
    dataIndex: 'equipNameNew',
    key: 'equipNameNew',
  },
  {
    title: '设备型号',
    dataIndex: 'modelName',
    key: 'modelName',
  },
  {
    title: '序列号',
    dataIndex: 'sn',
    key: 'sn',
  },
  {
    title: '编号',
    dataIndex: 'equipmentNo',
    key: 'equipmentNo',
  },
  {
    title: '巡检时间',
    dataIndex: 'lastUpdTime',
    key: 'lastUpdTime',
  },
  {
    title: '巡检人',
    dataIndex: 'inspectionEmployeeName',
    key: 'inspectionEmployeeName',
    width: 80,
    render: (name) => (!name || name === 'system' ? '' : name),
  },
];

const getStandardDataItem = (
  dataSource: IEquipmentStatItem[] | ICheckAcceptanceOrderDetailItem[],
) => {
  let standardDataItem: IEquipmentStatItem | ICheckAcceptanceOrderDetailItem =
    dataSource[0];

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < dataSource.length; i++) {
    const item = dataSource[i];
    if (item.data?.length) {
      if (standardDataItem.data?.length) {
        if (item.data?.length > standardDataItem.data?.length) {
          standardDataItem = item;
        }
      } else {
        standardDataItem = item;
      }
    } else {
      // eslint-disable-next-line no-continue
      continue;
    }
  }

  return standardDataItem;
};

const InspectionRecordTable: React.FC<IComponentProps> = ({
  type,
  date,
  visible,
  loading,
  actionRef,
  dataSource = [],
  currentRecord,
  onSubmit,
  onCancel,
}) => {
  const { currentUser } = useUserInfo();
  const isHospital = !!currentUser?.isHospital;
  const isMaintainer = !!currentUser?.isMaintainer;
  const { componentRef, onPrint } = usePrint();
  const [dynamicColumns, setDynamicColumns] = useState<
    ColumnType<IEquipmentStatItem>[]
  >([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [operation, setOperation] = useState<OperationType>(OperationType.NOOP);

  const onPrintClcik = () => {
    console.log('打印');
    onPrint();
  };

  const RecordTable = (
    <div style={{ width: '100%' }}>
      <h2 style={{ textAlign: 'center' }}>巡检记录表</h2>
      <Row style={{ margin: '0 10px 10px 10px' }}>
        <Col span={12} style={{ textAlign: 'left' }}>
          科室：<b>{currentRecord?.departmentName}</b>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          巡检日期: {date}
        </Col>
        {/* <Col span={12} style={{ textAlign: 'right' }}>
          <DatePicker.RangePicker
            style={{ width: 350 }}
          />
        </Col> */}
      </Row>
      <Table
        rowKey="id"
        columns={[
          ...baseColumns.slice(0, 4),
          ...dynamicColumns,
          ...baseColumns.slice(4, 6),
        ]}
        dataSource={dataSource}
        loading={loading}
        pagination={false}
      />
      <p style={{ textAlign: 'right', marginTop: 30, paddingRight: 150 }}>
        科室签字:{' '}
      </p>
    </div>
  );

  useEffect(() => {
    if (dataSource?.length) {
      const standardDataItem = getStandardDataItem(dataSource);
      const bizColumns = standardDataItem?.data
        ? standardDataItem.data.map(
            (item) =>
              ({
                title: item.label,
                dataIndex: item.code,
                key: item.code,
                render: (_, record) =>
                  record?.data?.find((i) => i.id === item.id)?.val,
              } as ColumnType<IEquipmentStatItem>),
          )
        : [];
      const desciptionColumn: ColumnType<IEquipmentStatItem> = {
        title: '备注',
        key: 'description',
        dataIndex: 'description',
        width: 100,
        render: (_, record) => {
          if (record?.data?.length) {
            return (
              <Popover
                content={
                  <p style={{ width: '250px' }}>{record.data[0].xval}</p>
                }
                title="备注"
                trigger="hover"
              >
                <span className={styles.descrptionColumn}>
                  {record.data[0].xval}
                </span>
              </Popover>
            );
          }
          return '-';
        },
      };

      setDynamicColumns([...bizColumns, desciptionColumn]);
    }
  }, [dataSource]);

  const renderFooter = () => {
    switch (type) {
      case 'Daily':
        return (
          <Space>
            <Button type="primary" onClick={onPrintClcik}>
              打印
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        );
      case 'Pending':
        // eslint-disable-next-line no-case-declarations
        const isSelf =
          (currentRecord as ICheckAcceptanceOrderItem)?.commitEmployeeId ===
          currentUser?.employee.id;

        return (
          <Space>
            {isSelf && (
              <Button
                type="primary"
                ghost
                loading={confirmLoading && operation === OperationType.CANCEL}
                onClick={async () => {
                  if (confirmLoading) {
                    return;
                  }
                  setConfirmLoading(true);
                  setOperation(OperationType.CANCEL);
                  try {
                    const formData: any = {
                      departmentId: (currentRecord as ICheckAcceptanceOrderItem)
                        .departmentId,
                      inspectionAuditId: (currentRecord as ICheckAcceptanceOrderItem)
                        .id,
                    };
                    if (isMaintainer) {
                      formData.crId = currentUser?.currentCustomer?.id;
                    }
                    const { code } = await revokeInspectionApplication(
                      formData,
                    );
                    if (code === 0) {
                      message.success('操作成功');
                      onSubmit?.();
                    }
                  } catch (error: any) {
                    message.error(error.message);
                  } finally {
                    setConfirmLoading(false);
                    setOperation(OperationType.NOOP);
                  }
                }}
              >
                撤回申请
              </Button>
            )}
            {isHospital && !isSelf && (
              <Button
                type="primary"
                ghost
                onClick={() => {
                  (actionRef?.current as ActionType)?.onContinueInspection(
                    currentRecord as ICheckAcceptanceOrderItem,
                  );
                }}
              >
                继续巡检
              </Button>
            )}
            {isHospital && (
              <Button
                type="primary"
                loading={confirmLoading && operation === OperationType.ACCEPT}
                onClick={async () => {
                  if (confirmLoading) {
                    return;
                  }
                  setOperation(OperationType.ACCEPT);
                  setConfirmLoading(true);
                  try {
                    const { code } = await checkInspectionDone({
                      auditResult: true,
                      inspectionAuditId: (currentRecord as ICheckAcceptanceOrderItem)
                        .id,
                    });
                    if (code === 0) {
                      message.success('操作成功');
                      onSubmit?.();
                    }
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setConfirmLoading(false);
                    setOperation(OperationType.NOOP);
                  }
                }}
              >
                验收通过
              </Button>
            )}
            <Button onClick={onCancel}>取消</Button>
          </Space>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        title="巡检记录表"
        width={1200}
        visible={visible}
        onCancel={onCancel}
        footer={renderFooter()}
      >
        <div style={{ height: '600px', overflow: 'auto' }}>{RecordTable}</div>
      </Modal>
      <PrintContainer>
        <div ref={componentRef} style={{ width: 1000 }}>
          {RecordTable}
        </div>
      </PrintContainer>
    </>
  );
};

export default InspectionRecordTable;
