import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Table,
  Divider,
  Row,
  Col,
  Form,
  DatePicker,
  message,
} from 'antd';
import { history } from 'umi';
import EquipmentSelect, {
  BizType,
} from '@/components/Equipment/EquipmentSelect';
import type { SelectFunc } from '@/components/Equipment/EquipmentSelect';
import Footerbar from '@/components/Footerbar';
import { checkEquipments } from '@/pages/Crm/Customer/service';
import useMount from '@/hooks/useMount';
import useUserInfo from '@/hooks/useUserInfo';
import useACL from '@/hooks/useACL';
import useOperator from '../hooks/useOperator';
import EquipmentDetailModal from '@/components/Equipment/Detail';
import Operator, { OperatorType } from './Operator';
import ResultModal from './Result';
import type { OperatorValue } from './Operator';
import type { ITableListItem as EquipmentItem } from '@/pages/Assets/type';
import {
  initMaintenance,
  fetchLastTaskTimeline,
  equipmentUnfinished,
} from '../service';
import type { InitMaintenanceItemData } from '../type';
import { PageType, EventTypeOfInt } from '../type';
import styles from '../index.less';

// 发起保养
const InitMaintenance: React.FC = () => {
  const { currentUser } = useUserInfo();
  const { isACL } = useACL();
  const [form] = Form.useForm();
  const { options: operatorOptions, customerMap } = useOperator();
  const [equipmentSelectVisible, setEquipmentSelectVisible] = useState(false);
  const [equipments, setEquipments] = useState<EquipmentItem[]>([]);
  const [invalidEquipmentIds, setInvalidEquipmentIds] = useState<number[]>([]);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [
    equipmentDetailModalVisible,
    setEquipmentDetailModalVisible,
  ] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<EquipmentItem>();

  const loadTemplates = async () => {
    try {
      const formData: any = {
        applyType: 'MAINTAIN',
      };
      if (currentUser?.isMaintainer && currentUser.currentCustomer) {
        formData.crId = currentUser.currentCustomer.id;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDelEquipment = (record: EquipmentItem) => {
    setEquipments((prevEquipments) =>
      prevEquipments.filter((p) => p.id !== record.id),
    );
    setInvalidEquipmentIds((prevIds) =>
      prevIds.filter((id) => id !== record.id),
    );
  };

  const onViewEquipment = (record: EquipmentItem) => {
    setCurrentRecord(record);
    setEquipmentDetailModalVisible(true);
  };

  const onSelectEquipments: SelectFunc = async ({ selectedRows = [] }) => {
    try {
      // 获取选中设备当前保养的状态
      let selectUnfinished: any = [];
      const selectEquipment: any = [];
      const params = {
        equipmentList: selectedRows.map((r) => r.id),
        taskType: 'MAINTAIN',
      };
      const res = await equipmentUnfinished(params);
      if (res.code == 0) {
        selectUnfinished = res.data;
      } else {
        message.error(res.msg);
        return;
      }

      // 过滤正在进行保养的设备
      selectedRows.forEach((item: any) => {
        if (!selectUnfinished.includes(item.id)) {
          selectEquipment.push(item);
        }
      });

      if (selectEquipment.length == 0) {
        message.error('已选择的设备全部有未完成的保养任务，请重新选择设备');
        return;
      }
      if (selectEquipment.length > 0) {
        message.success('已过滤有未完成保养任务的设备');
      }

      setEquipmentSelectVisible(false);

      // 获取上次保养时间
      const { data = [] } = await fetchLastTaskTimeline(
        EventTypeOfInt.MAINTAIN,
        selectEquipment.map((r: any) => r.id),
      );
      const timelineMap = new Map(
        data.map((item) => [item.equipmentId, item.eventTime]),
      );
      const rowsWithTimeline = selectEquipment.map((row: any) => ({
        ...row,
        lastMpTime: timelineMap.get(row.id),
      }));

      setEquipments((prevEquipments) => {
        const prevEquipmentIds = prevEquipments.map((e) => e.id);

        return rowsWithTimeline
          .filter((row: any) => !prevEquipmentIds.includes(row.id))
          .concat(prevEquipments as any);
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 保养执行人的选择和模板列表存在联动关系
  const onOperatorChange = async (operator: OperatorValue) => {
    // 选择的是维修公司或者工程师
    const isMaintainerOrEngineer =
      operator.type === OperatorType.engineer ||
      operator.type === OperatorType.maintainer ||
      (operator.type === OperatorType.self && currentUser?.isMaintainer);

    try {
      if (isMaintainerOrEngineer) {
        if (equipments.length) {
          const { data } = await checkEquipments(
            operator.crId!,
            equipments.map((e) => e.id),
          );
          setInvalidEquipmentIds(data);
        }
      } else {
        setInvalidEquipmentIds([]);
      }
      form.setFieldsValue({
        initPerson: operator,
        template: undefined,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 继续发起保养
  const onContinueInit = () => {
    form.resetFields();
    setEquipments([]);
    setInvalidEquipmentIds([]);
    setResultModalVisible(false);
  };

  const onCancelEquipmentDetail = () => {
    setCurrentRecord(undefined);
    setEquipmentDetailModalVisible(false);
  };

  const onInitMaintenance = async () => {
    if (!equipments.length) {
      message.error('请选择设备');
      return;
    }
    if (invalidEquipmentIds.length) {
      message.error('存在未签约设备，无法发起保养');
      return;
    }
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      const formValues = await form.validateFields();
      const { initPerson } = formValues;
      console.log(equipments);
      const formData = equipments.map((item) => ({
        taskInfo: {
          engineerId: initPerson.engineerId,
          engineerName: initPerson.engineerName,
          departmentId: item.departmentId,
          departmentName: item.departmentName,
          equipmentId: item.id,
          equipmentName: item.name,
          initPersonId: initPerson.initPersonId,
          initPersonName: initPerson.initPersonName,
          initPersonTel: initPerson.initPersonTel,
          initReason: undefined,
          deadline: undefined,
          orgId: item.orgId,
          orgName: item.orgName,
          planBeginTime: formValues.planBeginTime?.format(
            'YYYY-MM-DD HH:mm:ss',
          ),
          planEndTime: formValues.planEndTime?.format('YYYY-MM-DD'),
          crId: initPerson.crId,
        },
      })) as InitMaintenanceItemData[];
      await initMaintenance(formData);
      setResultModalVisible(true);
    } catch (error: any) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: '序号',
      width: 65,
      render: (text: any, record: EquipmentItem, index: number) => index + 1,
    },
    {
      title: '设备编号',
      dataIndex: 'equipmentNo',
      key: 'equipmentNo',
    },
    {
      title: '设备名称',
      dataIndex: 'equipNameNew',
      key: 'equipNameNew',
    },
    {
      title: '型号',
      dataIndex: 'modelName',
      key: 'modelName',
    },
    {
      title: '序列号',
      dataIndex: 'sn',
      key: 'sn',
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: '上次保养时间',
      dataIndex: 'lastMpTime',
      key: 'lastMpTime',
    },
    {
      title: '操作',
      key: 'operation',
      render: (_: any, record: EquipmentItem) => (
        <>
          <a onClick={() => onViewEquipment(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => onDelEquipment(record)}>删除</a>
        </>
      ),
    },
  ];

  useMount(() => {
    loadTemplates();
  });

  return (
    <div className={styles.initMaintenanceWrapper}>
      <Card title="保养设备信息列表">
        <Table
          rowKey="id"
          className={styles.maintainTable}
          dataSource={equipments}
          columns={columns}
          pagination={false}
          rowClassName={(record) =>
            invalidEquipmentIds.includes(record.id) ? styles.errorLine : ''
          }
          bordered
          scroll={{
            y: 264,
          }}
        />
        <Row style={{ marginTop: 24 }}>
          <Col span={12}>
            <Space size={15}>
              <span>
                发起人：
                <span style={{ fontWeight: 'bold' }}>
                  {currentUser?.employee?.name}
                </span>
              </span>
              <span>
                计划保养设备数量：
                <span style={{ fontWeight: 'bold' }}>{equipments.length}</span>
              </span>
            </Space>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              onClick={() => setEquipmentSelectVisible(true)}
              disabled={currentUser?.isCustomersEmpty}
            >
              添加设备
            </Button>
          </Col>
        </Row>
      </Card>
      <Card title="保养设备信息选项" style={{ marginTop: 18 }}>
        <Form form={form} wrapperCol={{ span: 16 }} labelCol={{ span: 8 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="保养执行人"
                name="initPerson"
                rules={[
                  {
                    required: true,
                    message: `请选择保养执行人`,
                  },
                ]}
              >
                <Operator
                  options={operatorOptions}
                  customerMap={customerMap}
                  onChange={onOperatorChange}
                  disabled={currentUser?.isCustomersEmpty}
                />
              </Form.Item>
            </Col>
            {/* <Col span={8}>
              <Form.Item
                label="保养方案"
                name="template"
                rules={[
                  {
                    required: true,
                    message: `请选择保养方案`,
                  },
                ]}
              >
                <Select
                  placeholder="请选择"
                  onChange={onTemplateChange}
                  disabled={currentUser?.isCustomersEmpty}
                >
                  {templates.map((template) => (
                    <Select.Option
                      value={`${template.id}-${template.verId}`}
                      key={template.id}
                    >
                      {template.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col> */}
            <Col span={8}>
              <Form.Item
                label="计划保养时间"
                name="planBeginTime"
                rules={[
                  {
                    required: true,
                    message: `请选择计划保养时间`,
                  },
                ]}
              >
                <DatePicker
                  showTime
                  disabled={currentUser?.isCustomersEmpty}
                  popupStyle={{ zIndex: 5100 }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="计划结束时间"
                name="planEndTime"
                rules={[{ required: true }]}
              >
                <DatePicker
                  disabled={currentUser?.isCustomersEmpty}
                  popupStyle={{ zIndex: 5100 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Footerbar
        visible
        style={{
          height: '60px',
          lineHeight: '60px',
        }}
        rightContent={
          <Space>
            <Button
              className={styles.btnCancel}
              onClick={() => history.goBack()}
            >
              取消
            </Button>
            <Button
              onClick={onInitMaintenance}
              className={styles.btnSubmit}
              loading={submitting}
              disabled={currentUser?.isCustomersEmpty || resultModalVisible}
              type="primary"
            >
              发起保养
            </Button>
          </Space>
        }
      />
      <EquipmentSelect
        isACL={isACL}
        bizType={BizType.MAINTAIN}
        visible={equipmentSelectVisible}
        onSelect={onSelectEquipments}
        onCancel={() => setEquipmentSelectVisible(false)}
      />
      <ResultModal
        pageType={PageType.MAINTENANCE}
        visible={resultModalVisible}
        onContinue={onContinueInit}
        onCancel={() => setResultModalVisible(false)}
      />
      <EquipmentDetailModal
        id={currentRecord?.id}
        visible={equipmentDetailModalVisible}
        onCancel={onCancelEquipmentDetail}
      />
    </div>
  );
};

export default InitMaintenance;
