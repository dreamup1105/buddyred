import React, { useState } from 'react';
import { Form, Select, Radio, DatePicker } from 'antd';
import type { FormInstance } from 'antd/es/form';
import useUserInfo from '@/hooks/useUserInfo';
import useDepartments from '@/hooks/useDepartments';
import useGlobalAuthorities from '@/hooks/useGlobalAuthorities';

interface IComponentProps {
  onValuesChange: ((changedValues: any, values: any) => void) | undefined;
  form: FormInstance<any>;
}

const EquipmentDistributionTable: React.FC<IComponentProps> = ({
  onValuesChange,
  form,
}) => {
  const { currentUser } = useUserInfo();
  const globalAuthorities = useGlobalAuthorities();
  const isIncludeGlobalAuthorities = globalAuthorities.includes('ALL');
  const { departmentOptions } = useDepartments({ employeeId: currentUser?.employee.id }, true, true); // 跨科授权部门
  const primaryDepartment = currentUser?.primaryDepartment;
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const currentUserDepartment = primaryDepartment ? [{
    label: primaryDepartment?.name,
    value: primaryDepartment?.id,
    key: primaryDepartment?.id,
  }] : []; // 自己所在部门

  const onFormValuesChange = (changedValues: any, values: any) => {
    if (changedValues.dimension) {
      setMonthPickerVisible(changedValues.dimension === '3');
    }
    onValuesChange?.(changedValues, values);
  }

  return (
    <Form
      form={form} 
      layout="inline" 
      onValuesChange={onFormValuesChange}
    >
      <Form.Item name="departmentIds">
        <Select
          showSearch
          mode="multiple"
          optionFilterProp="label"
          style={{ width: 200 }} 
          placeholder="请选择科室"
          options={isIncludeGlobalAuthorities
            ? [...departmentOptions] 
            : [...currentUserDepartment, ...departmentOptions]
          }
        />
      </Form.Item>
      {
        monthPickerVisible && (
          <Form.Item name="month">
            <DatePicker.RangePicker picker="month" />
          </Form.Item>
        )
      }
      <Form.Item name="dimension">
        <Radio.Group>
          <Radio.Button value="1">年度</Radio.Button>
          <Radio.Button value="2">季度</Radio.Button>
          <Radio.Button value="3">月份</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
}

export default EquipmentDistributionTable;