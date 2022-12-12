import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Table, Row, Col } from 'antd';
import type { ProTableColumn } from '@/components/ProTable';
import { SelectEquipmentColumn, equipmentStatusMap } from '../type';
import type { CustomEquipmentTable, customRecordTable } from '../type';
import { selectEquipmentListAPI } from '../service';

interface IModalProps {
  visible: boolean;
  record?: customRecordTable;
  onCancel: () => void;
}

const InfoModal: React.FC<IModalProps> = ({
  visible = false,
  record,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [detail, setDetail] = useState<any>();

  const equipmentCheckStatusColumn = [
    {
      title: '自检状态',
      dataIndex: 'equipmentStatus',
      key: 'equipmentStatus',
      hideInSearch: true,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      render: (_: any, record: any) => {
        return (
          <>
            <span>{equipmentStatusMap.get(record.equipmentStatus)}</span>
          </>
        );
      },
    },
    {
      title: '自检人',
      dataIndex: 'employeeName',
      key: 'employeeName',
      hideInSearch: true,
    },
    {
      title: '自检时间',
      dataIndex: 'dataTime',
      key: 'dataTime',
      width: 180,
      hideInSearch: true,
    },
  ];
  const columns: ProTableColumn<CustomEquipmentTable>[] = [
    ...SelectEquipmentColumn,
    ...equipmentCheckStatusColumn,
  ];

  // 通过 id  获取详情信息
  const getInfo = async () => {
    try {
      const params = {
        startTime: record?.updDate + ' 00:00:00',
        endTime: record?.updDate + ' 23:59:59',
        groupId: record?.groupId,
        inspectionType: record?.inspectionType,
      };
      const { data } = await selectEquipmentListAPI(params);
      setDetail(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (visible) {
      getInfo();
    }
  }, [visible]);

  return (
    <>
      <Modal
        title={`定制巡检-详情`}
        visible={visible}
        width="1000px"
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onCancel}
        footer={
          <>
            <Button onClick={onCancel}>取消</Button>
          </>
        }
      >
        <Form form={form} name="infoForm" autoComplete="off" preserve={false}>
          <Row>
            <Col span={8}>
              <Form.Item label="自检组名称">{detail?.groupName}</Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="设备所在科室">
                {detail?.departmentName}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="主要负责人">{detail?.headName}</Form.Item>
            </Col>
            <Col span={24} style={{ marginBottom: '20px' }}>
              <Table
                sticky
                style={{
                  marginTop: '10px',
                  maxHeight: '300px',
                  overflow: 'auto',
                }}
                rowKey="inspectionId"
                columns={columns}
                dataSource={detail?.equipmentDetail}
                pagination={false}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default InfoModal;
