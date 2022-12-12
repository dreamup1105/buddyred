import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Row, Col, Form, Radio, TreeSelect, Button, Input, DatePicker, InputNumber } from 'antd';
import { stringToMoment, momentToString, accMul } from '@/utils/utils';
import { 
  EquipmentStatusEnum,
  EquipmentWarrantyStatusEnum,
  OperationType
} from '../type';
import type {
  EquipmentTypeItem,
  DepartmentItem,
  EquipmentDetail
} from '../type';
import useRemoteSelectStatus from '../hooks/useRemoteSelectOptions';
import { fetchModelView, createEquipmentNo } from '../service';
import RemoteSelect from './RemoteSelect';
import { dateRuleValidator } from './EquipmentInputForm';

interface IComponentProps {
  equipmentTypes: EquipmentTypeItem[];
  departments: DepartmentItem[];
  operationType: string
}

interface IInitialValues {
  operation: OperationType;
  values?: EquipmentDetail | undefined; 
}

export interface ActionType {
  setFieldsValue?: (values: any) => void;
  resetFields?: () => void;
  getFieldsValue?: () => any;
  validateFields?: () => Promise<any>;
  init?: (values?: any) => Promise<any> | undefined;
}

// 设备详细信息组件
export default forwardRef(({
  equipmentTypes,
  departments,
  operationType
}: IComponentProps, ref) => {
  const [form] = Form.useForm();
  const [remoteSelectParams, setRemoteSelectParams] = useState<{
    manufacturerId?: number;
    productId?: number;
  }>();
  const [systemCreating, setSystemCreating] = useState<boolean>(false);
  const [isWarranthyEndDateRequired, setIsWarranthyEndDateRequired] = useState(true);
  const [
    productDisabled, 
    modelDisabled,
    setProductDisabled,
    setModelDisabled,
    updateRemoteSelectStatus
  ] = useRemoteSelectStatus();

  // 根据型号id（modelId）向上查找对应产品和厂商
  const loadModelView = async (modelId: number) => {
    try {
      const { data } = await fetchModelView(modelId);
      return {
        manufacturerId: data.manufacturerId,
        productId: data.productId,
      }
    } catch (error) {
      console.error(error);
      return {
        manufacturerId: undefined,
        productId: undefined,
      }
    }
  }

  // 设置表单值
  const setFormValue = (field: string, value: any) => {
    form.setFieldsValue({
      [field]: value,
    });
  };

  // 设备厂商change
  const onManufacturerNameChange = (option: any) => {
    form.resetFields(['name', 'modelName', 'modelId']);
    updateRemoteSelectStatus('equipment-manufacturer', option);
    setModelDisabled(true);
    setRemoteSelectParams((prevParams) => ({
      ...prevParams,
      manufacturerId: option.value,
    }));
  };

  // 设备名称change
  const onNameChange = (option: any) => {
    form.resetFields(['modelName', 'modelId']);
    updateRemoteSelectStatus('equipment-product', option);
    setRemoteSelectParams((prevParams) => ({
      ...prevParams,
      productId: option.value,
    }));
  };

  // 设备型号change
  const onModelChange = ({ value }: any) => {
    setFormValue('modelId', value);
  };

  // 系统生成设备编号
  const onCreateEquipmentNo = async () => {
    if (systemCreating) {
      return;
    }
    setSystemCreating(true);
    try {
      const { data } = await createEquipmentNo();
      form.setFieldsValue({
        equipmentNo: data,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSystemCreating(false);
    }
  }

  const onFormValuesChange = (changedValues: any) => {
    if (changedValues?.warranthyStatus) {
      setIsWarranthyEndDateRequired(changedValues?.warranthyStatus === EquipmentWarrantyStatusEnum.MANUFACTURER)
    }
  }

  useImperativeHandle(ref, () => ({
    init: async ({ values, operation }: IInitialValues) => {
      if (operation === OperationType.INPUT) {
        form.setFieldsValue({
          status: EquipmentStatusEnum.READY,
          warranthyStatus: EquipmentWarrantyStatusEnum.MANUFACTURER,
        });
        setIsWarranthyEndDateRequired(true);
        setProductDisabled(true);
        setModelDisabled(true);
        return;
      }
      const { equipment, tags = [] } = values!;
      const {
        name,
        modelId,
        modelName,
        createdTime,
        initialUseDate,
        productionDate,
        warranthyStatus,
        depreciationRate,
        statusChangedTime,
        warranthyEndDate,
        manufacturerName,
      } = equipment;
      const { manufacturerId, productId } = await loadModelView(modelId!);

      setRemoteSelectParams({
        manufacturerId: manufacturerId!,
        productId: productId!,
      });

      setProductDisabled(false);
      setModelDisabled(false);    
      
      if (warranthyStatus) {
        setIsWarranthyEndDateRequired(warranthyStatus === EquipmentWarrantyStatusEnum.MANUFACTURER);
      }

      form.setFieldsValue({
        ...equipment,
        createdTime: stringToMoment(createdTime),
        initialUseDate: stringToMoment(initialUseDate),
        productionDate: stringToMoment(productionDate),
        statusChangedTime: stringToMoment(statusChangedTime),
        depreciationRate: depreciationRate ? accMul(depreciationRate, 100) : undefined,
        warranthyEndDate: stringToMoment(warranthyEndDate),
        manufacturerName: { label: manufacturerName, value: manufacturerId },
        name: { label: name, value: productId }, 
        modelName: { label: modelName, value: modelId },
        tags,
      });
    },
    setFieldsValue: (values: any) => {
      form.setFieldsValue({ ...values });
    },
    resetFields: () => {
      form.resetFields();
    },
    validateFields: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const formValues = await form.validateFields();
        const {
          createdTime,
          initialUseDate,
          productionDate,
          statusChangedTime,
          warranthyEndDate,
          depreciationRate,
          manufacturerName,
          modelName,
          name,
        } = formValues;

        return {
          ...formValues,
          depreciationRate: depreciationRate ? accMul(depreciationRate, 0.01) : undefined,
          createdTime: momentToString(createdTime),
          initialUseDate: momentToString(initialUseDate),
          productionDate: momentToString(productionDate),
          statusChangedTime: momentToString(statusChangedTime),
          warranthyEndDate: momentToString(warranthyEndDate),
          manufacturerName: manufacturerName.label,
          modelName: modelName.label,
          name: name.label,
        }
      } catch (error) {
        (error as any).from = 'basic';
        throw error;
      }
    },
  }), [form]);

  return (
    <Form 
      form={form} 
      labelAlign="right" 
      labelCol={{ span: 6 }} 
      wrapperCol={{ span: 18 }}
      onValuesChange={onFormValuesChange}
    >
      <Row>
        <Col span={12}>
          <Row gutter={16}>
            <Col span={18}>
              <Form.Item
                name="equipmentNo"
                label="设备编号"
                labelCol={{ span: 8 }}
              >
                <Input placeholder="请填写或系统生成" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <div style={{ paddingTop: 3 }}>
                <Button 
                  type="primary" 
                  size="small" 
                  loading={systemCreating} 
                  onClick={onCreateEquipmentNo}
                >系统生成</Button>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Form.Item
            name="manufacturerName"
            label="设备厂商"
            rules={[{ required: true, message: '请选择设备厂商' }]}
          >
            <RemoteSelect
              type="equipment-manufacturer"
              placeholder="请选择"
              onChange={onManufacturerNameChange}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name="name"
            label="设备名称"
            rules={[{ required: true, message: '请选择设备名称' }]}
          >
            <RemoteSelect
              type="equipment-product"
              disabled={productDisabled}
              placeholder="请选择"
              onChange={onNameChange}
              params={remoteSelectParams}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="modelName"
            label="设备型号"
            rules={[{ required: true, message: '请选择设备型号' }]}
          >
            <RemoteSelect
              type="equipment-model"
              placeholder="请选择"
              disabled={modelDisabled}
              onChange={onModelChange}
              params={remoteSelectParams}
            />
          </Form.Item>
          <Form.Item name="modelId" label="设备型号" hidden>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name="alias"
            label="设备别名"
            labelCol={{ span: 6 }}
          >
            <Input placeholder="请填写" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="brandName"
            label="设备品牌"
          >
            <Input placeholder="请填写" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            name="tags"
            label="标签"
            labelCol={{ span: 3 }}
          >
            <RemoteSelect
              type="equipment-tag"
              placeholder="请选择"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name="typeId"
            label="设备类型"
            rules={[{ required: true, message: '设备类型不能为空' }]}
          >
            <TreeSelect
              placeholder="请选择"
              treeData={equipmentTypes}
              treeDefaultExpandAll
              virtual={false}
              onChange={(_, options) =>
                setFormValue('typeName', options[0])
              }
            />
          </Form.Item>
          <Form.Item name="typeName" label="设备类型" hidden>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="sn"
            label="设备序列号"
            rules={[{ required: true, message: '设备序列号不能为空' }]}
          >
            <Input placeholder="请选择" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name="departmentId"
            label="归属科室"
            rules={[{ required: true, message: '请选择归属科室' }]}
          >
            <TreeSelect
              placeholder="请选择"
              treeData={departments}
              treeDefaultExpandAll
              virtual={false}
              disabled={operationType == OperationType.EDIT}
              onChange={(_, options) =>
                setFormValue('departmentName', options[0])
              }
            />
          </Form.Item>
          <Form.Item
            name="departmentName"
            label="归属科室"
            hidden
            rules={[{ required: true, message: '请选择归属科室' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="roomNo" 
            label="所在房间"
          >
            <Input placeholder="请填写" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name="usefulAge"
            label="使用年限(年)"
            rules={[
              {
                required: true,
                message: '使用年限不能为空'
              }
            ]}
          >
            <InputNumber
              placeholder="请填写"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="productionDate"
            label="生产日期"
          >
            <DatePicker
              placeholder="请选择"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name="status"
            label="设备状态"
            rules={[{ required: true, message: '请选择设备状态' }]}
          >
            <Radio.Group>
              <Radio
                value={EquipmentStatusEnum.READY}
                key={EquipmentStatusEnum.READY}
              >
                启用
              </Radio>
              <Radio
                value={EquipmentStatusEnum.UNUSED}
                key={EquipmentStatusEnum.UNUSED}
              >
                停用
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="createdTime" label="录入时间" hidden>
            <DatePicker placeholder="请选择" />
          </Form.Item>
          <Form.Item
            name="initialUseDate"
            label="首次启用日期"
            rules={[
              dateRuleValidator('启用日期'),
            ]}
          >
            <DatePicker
              placeholder="请选择"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name="depreciationRate"
            label="年折旧率(%)"
          >
            <InputNumber
              placeholder="请填写"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="warranthyStatus"
            label="是否在保"
            rules={[{ required: true, message: '保修状态不能为空' }]}
          >
            <Radio.Group>
              <Radio value={EquipmentWarrantyStatusEnum.MANUFACTURER}>
                在保
              </Radio>
              <Radio value={EquipmentWarrantyStatusEnum.NONE}>
                未在保
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name="maintainPeriod"
            label="保养周期(天)"
          >
            <InputNumber
              placeholder="请填写"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="warranthyEndDate"
            label="保修截止日期"
            rules={[
              {
                required: isWarranthyEndDateRequired,
                message: '保修截止日期不能为空'
              },
              dateRuleValidator('保修截止日期')
            ]}
          >
            <DatePicker
              placeholder="请选择"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="registrationNumber"
            label="注册证号"
          >
            <Input placeholder="请填写" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
});

