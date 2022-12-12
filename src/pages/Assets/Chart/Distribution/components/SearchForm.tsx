import React from 'react';
import { Form, Select, Radio } from 'antd';
import type { FormInstance } from 'antd/es/form';
import useEquipmentTypes from '../hooks/useEquipmentTypes';

interface IComponentProps {
  onValuesChange: ((changedValues: any, values: any) => void) | undefined;
  form: FormInstance<any>;
}

const EquipmentDistributionTable: React.FC<IComponentProps> = ({
  onValuesChange,
  form,
}) => {
  const equipmentTypes = useEquipmentTypes();

  return (
    <Form
      form={form} 
      layout="inline" 
      onValuesChange={onValuesChange}
    >
      <Form.Item name="typeName">
        <Select
          showSearch
          optionFilterProp="label"
          style={{ width: 200 }} 
          placeholder="请选择设备类别"
          options={equipmentTypes}
        />
      </Form.Item>
      <Form.Item name="group">
        <Radio.Group>
          <Radio.Button value="name">设备名称</Radio.Button>
          {/* <Radio.Button value="alias">设备别名</Radio.Button> */}
        </Radio.Group>
      </Form.Item>
    </Form>
  );
}

export default EquipmentDistributionTable;