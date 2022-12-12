import React, { useState } from 'react';
import {
  Modal,
  Form,
  Select,
  Input,
  InputNumber,
  Row,
  Col,
  DatePicker,
  message,
} from 'antd';
import EquipmentSelect from '@/components/Equipment/EquipmentSelect';
import useACL from '@/hooks/useACL';
import type { SelectFunc } from '@/components/Equipment/EquipmentSelect';
import { momentToString } from '@/utils/utils';
import type { FormInstance } from 'antd/es/form';
import type { IAdverseEventParams } from '../type';
import { saveAdverseEvent } from '../service';
import styles from '../index.less';

interface IComponentProps {
  visible: boolean;
  params: IAdverseEventParams | undefined;
  mode?: 'Modal' | 'Form';
  parentForm?: FormInstance<any>;
  onAfterSubmit?: () => void;
  onAfterCancel?: () => void;
}

const { TextArea } = Input;

const genOptions = (
  params: IAdverseEventParams | undefined,
  key: keyof IAdverseEventParams,
) => {
  return params?.[key].map((i) => ({ label: i, value: i })) ?? [];
};

const getOptions = (params: IAdverseEventParams | undefined) => {
  return [
    genOptions(params, 'eventLevel'),
    genOptions(params, 'eventType'),
    genOptions(params, 'happenPlace'),
    genOptions(params, 'personTitle'),
    genOptions(params, 'personType'),
  ];
};

const CreateEventFormModal: React.FC<IComponentProps> = ({
  visible,
  params,
  mode = 'Modal',
  parentForm,
  onAfterCancel,
  onAfterSubmit,
}) => {
  const { isACL } = useACL();
  const [form] = Form.useForm();
  const formInstance = parentForm || form;
  const [equipmentSelectVisible, setEquipmentSelectVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [selectedEquipment, setSelectedEquipment] = useState<{
    equipmentId: number;
    equipNameNew: string;
  }>();
  const [
    eventLevelOptions,
    eventTypeOptions,
    happenPlaceOptions,
    personTitleOptions,
    personTypeOptions,
  ] = getOptions(params);

  const onModalOk = async () => {
    try {
      if (!selectedEquipment) {
        message.error('请选择设备');
        return;
      }
      const values = await formInstance.validateFields();
      setConfirmLoading(true);
      const { code } = await saveAdverseEvent({
        ...values,
        happenTime: momentToString(values.happenTime),
        reportTime: momentToString(values.reportTime),
        equipmentId: selectedEquipment?.equipmentId,
        equipmentName: selectedEquipment?.equipNameNew,
      });
      if (code === 0) {
        message.success('新建成功');
        formInstance.resetFields();
        setSelectedEquipment(undefined);
        onAfterSubmit?.();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const onModalCancel = () => {
    setSelectedEquipment(undefined);
    formInstance.resetFields();
    onAfterCancel?.();
  };

  const onSelectEquipments: SelectFunc = async ({ selectedRows = [] }) => {
    setEquipmentSelectVisible(false);
    try {
      if (selectedRows.length) {
        setSelectedEquipment({
          equipmentId: selectedRows[0].id,
          equipNameNew: selectedRows[0].equipNameNew,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const FormComponent = (
    <Form form={formInstance}>
      {mode === 'Modal' && (
        <Row style={{ marginBottom: '24px' }}>
          <Col span={7} style={{ textAlign: 'right' }}>
            <span className={styles.required}>设备：</span>
          </Col>
          <Col span={15}>
            <a type="primary" onClick={() => setEquipmentSelectVisible(true)}>
              {selectedEquipment?.equipNameNew
                ? selectedEquipment?.equipNameNew
                : '选择设备'}
            </a>
          </Col>
        </Row>
      )}
      <Form.Item
        labelAlign="right"
        label="事件发生场所"
        name="happenPlace"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        rules={[{ required: true, message: '请选择事件发生场所' }]}
      >
        <Select options={happenPlaceOptions} placeholder="请选择" />
      </Form.Item>
      <Form.Item
        labelAlign="right"
        label="事件发生日期"
        name="happenTime"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        rules={[{ required: true, message: '请选择事件发生日期' }]}
      >
        <DatePicker
          showTime={{ format: 'HH:mm:ss' }}
          format="YYYY-MM-DD HH:mm:ss"
        />
      </Form.Item>
      <Form.Item
        labelAlign="right"
        label="报告日期"
        name="reportTime"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        rules={[{ required: true, message: '请选择报告日期' }]}
      >
        <DatePicker
          showTime={{ format: 'HH:mm:ss' }}
          format="YYYY-MM-DD HH:mm:ss"
        />
      </Form.Item>
      <Form.Item
        labelAlign="right"
        label="不良事件类别"
        name="eventTypeList"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        rules={[{ required: true, message: '请选择不良事件类别' }]}
      >
        <Select
          options={eventTypeOptions}
          mode="multiple"
          placeholder="请选择"
        />
      </Form.Item>
      <Form.Item
        labelAlign="right"
        label="不良事件等级"
        name="eventLevel"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        rules={[{ required: true, message: '请选择不良事件等级' }]}
      >
        <Select options={eventLevelOptions} placeholder="请选择" />
      </Form.Item>
      <Form.Item
        labelAlign="right"
        label="不良后果"
        name="adverseResult"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
      >
        <TextArea showCount maxLength={200} placeholder="请输入" />
      </Form.Item>
      <Form.Item
        labelAlign="right"
        label="当事人类别"
        name="personType"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
      >
        <Select options={personTypeOptions} placeholder="请选择" />
      </Form.Item>
      <Form.Item
        labelAlign="right"
        label="当事人职称"
        name="personTitle"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
      >
        <Select options={personTitleOptions} placeholder="请选择" />
      </Form.Item>
      <Form.Item
        labelAlign="right"
        label="当事人工作年限"
        name="personWorkYears"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
      >
        <InputNumber min={0} placeholder="请输入" />
      </Form.Item>
      <Form.Item
        labelAlign="right"
        label="在场人员或相关科室"
        name="siteSituation"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
      >
        <Input placeholder="请输入" />
      </Form.Item>
    </Form>
  );

  if (mode === 'Form') {
    return FormComponent;
  }

  return (
    <Modal
      title="新建不良事件"
      visible={visible}
      okText="保存"
      cancelText="取消"
      onOk={onModalOk}
      onCancel={onModalCancel}
      confirmLoading={confirmLoading}
      maskClosable={false}
      width={650}
    >
      {FormComponent}
      <EquipmentSelect
        isACL={isACL}
        multiple={false}
        visible={equipmentSelectVisible}
        onSelect={onSelectEquipments}
        onCancel={() => setEquipmentSelectVisible(false)}
      />
    </Modal>
  );
};

export default CreateEventFormModal;
