import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Row, Col, Form, TreeSelect, Input } from 'antd';
import {
  EquipmentStatusEnum,
  EquipmentWarrantyStatusEnum,
  OperationType,
} from '../type';
import type { EquipmentTypeItem, ISaveEquipmentData } from '../type';
import useRemoteSelectStatus from '@/pages/Assets/hooks/useRemoteSelectOptions';
import { fetchModelView } from '@/pages/Assets/service';
import RemoteSelect from '@/pages/Assets/components/RemoteSelect';

interface IComponentProps {
  equipmentTypes: EquipmentTypeItem[];
}

interface IInitialValues {
  operation: OperationType;
  values?: ISaveEquipmentData | undefined;
}

export interface ActionType {
  setFieldsValue?: (values: any) => void;
  resetFields?: () => void;
  getFieldsValue?: () => any;
  validateFields?: () => Promise<any>;
  init?: (values?: any) => Promise<any> | undefined;
}

// 设备详细信息组件
export default forwardRef(({ equipmentTypes }: IComponentProps, ref) => {
  const [form] = Form.useForm();
  const [remoteSelectParams, setRemoteSelectParams] = useState<{
    manufacturerId?: number;
    productId?: number;
  }>();
  const [
    productDisabled,
    modelDisabled,
    setProductDisabled,
    setModelDisabled,
    updateRemoteSelectStatus,
  ] = useRemoteSelectStatus();

  // 根据型号id（modelId）向上查找对应产品和厂商
  const loadModelView = async (modelId: number) => {
    try {
      const { data } = await fetchModelView(modelId);
      return {
        manufacturerId: data.manufacturerId,
        productId: data.productId,
      };
    } catch (error) {
      console.error(error);
      return {
        manufacturerId: undefined,
        productId: undefined,
      };
    }
  };

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

  const onFormValuesChange = async (changedValues: any, allValues: any) => {
    // 表单输入数量和单价时，自动计算总价
    setFormValue(
      'totalPrice',
      parseFloat(allValues.purchaseCount) * parseFloat(allValues.singlePrice),
    );
  };

  useImperativeHandle(
    ref,
    () => ({
      init: async ({ operation, values }: IInitialValues) => {
        if (operation === OperationType.INPUT) {
          form.setFieldsValue({
            status: EquipmentStatusEnum.READY,
            warranthyStatus: EquipmentWarrantyStatusEnum.MANUFACTURER,
          });
          setProductDisabled(true);
          setModelDisabled(true);
          return;
        }
        const { name, modelId, modelName, manufacturerName } = values!;
        const { manufacturerId, productId } = await loadModelView(modelId!);

        setRemoteSelectParams({
          manufacturerId: manufacturerId!,
          productId: productId!,
        });

        setProductDisabled(false);
        setModelDisabled(false);

        form.setFieldsValue({
          ...values,
          manufacturerName: { label: manufacturerName, value: manufacturerId },
          name: { label: name, value: productId },
          modelName: { label: modelName, value: modelId },
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
          const { manufacturerName, modelName, name } = formValues;

          return {
            ...formValues,
            manufacturerName: manufacturerName.label,
            modelName: modelName.label,
            name: name.label,
          };
        } catch (error) {
          (error as any).from = 'basic';
          throw error;
        }
      },
    }),
    [form],
  );

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
        <Col span={12}>
          <Form.Item name="alias" label="设备别名" labelCol={{ span: 6 }}>
            <Input placeholder="请填写" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="brandName" label="设备品牌">
            <Input placeholder="请填写" />
          </Form.Item>
        </Col>
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
              onChange={(_, options) => setFormValue('typeName', options[0])}
            />
          </Form.Item>
          <Form.Item name="typeName" label="设备类型" hidden>
            <Input />
          </Form.Item>
        </Col>
        {/* <Col span={12}>
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
        </Col> */}
        <Col span={12}>
          <Form.Item
            name="singlePrice"
            label="单价"
            rules={[{ required: true }]}
          >
            <Input placeholder="请填写" type="number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="purchaseCount"
            label="数量"
            rules={[{ required: true }]}
          >
            <Input placeholder="请填写" type="number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="totalPrice" label="总计">
            <Input disabled placeholder="请填写" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});
