import React from 'react';
import { Form, Select, Radio } from 'antd';
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
  const currentUserDepartment = primaryDepartment ? [{
    label: primaryDepartment?.name,
    value: primaryDepartment?.id,
    key: primaryDepartment?.id,
  }] : []; // 自己所在部门

  return (
    <Form
      form={form} 
      layout="inline" 
      onValuesChange={onValuesChange}
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