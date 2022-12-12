import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Table, Row, Col, Tag } from 'antd';
import type { ProTableColumn } from '@/components/ProTable';
import { SelectEquipmentColumn, enableEnum, weekOptions } from '../type';
import type { CustomTable } from '../type';
import { customGetObjByIdAPI } from '../service';
interface IModalProps {
  visible: boolean;
  id?: string;
  onCancel: () => void;
}

const InfoModal: React.FC<IModalProps> = ({
  visible = false,
  id,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [detail, setDetail] = useState<any>();
  const columns: ProTableColumn<CustomTable>[] = [
    ...SelectEquipmentColumn,
    {
      title: '报废状态',
      dataIndex: 'isScrap',
      key: 'isScrap',
      hideInSearch: true,
      render: (_, record) => {
        return <span>{record.isScrap == 'COMMON' ? '正常' : '报废'}</span>;
      },
    },
  ];

  // 通过 id  获取详情信息
  const getInfo = async () => {
    try {
      const { data } = await customGetObjByIdAPI(id);
      setDetail(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (visible) {
      getInfo();
    } else {
      setDetail({});
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
              <Form.Item label="自建组名称">{detail?.groupName}</Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="设备所在科室">{detail?.deptName}</Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="启用状态">
                {enableEnum.get(detail?.isEnable)?.label}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="超时提醒时间(上午)">
                {detail?.timeDayAm}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="超时提醒时间(下午)">
                {detail?.timeDayPm}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="国家法定节假日自动排休">
                {detail?.isHoliday === 1 ? '是' : '否'}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="主要负责人">{detail?.headName}</Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="自检时间">
                {detail?.dayWeek?.map((item: any) => {
                  for (let i = 0; i < weekOptions.length; i++) {
                    if (item == weekOptions[i].value) {
                      return (
                        <Tag color="green" key={item}>
                          {weekOptions[i].label}
                        </Tag>
                      );
                    }
                  }
                })}
              </Form.Item>
            </Col>

            <Col span={24} style={{ marginBottom: '20px' }}>
              <Table
                sticky
                style={{
                  marginTop: '10px',
                  maxHeight: '300px',
                  overflow: 'auto',
                }}
                rowKey="id"
                columns={columns}
                dataSource={detail?.eqList}
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
