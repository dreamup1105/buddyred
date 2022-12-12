import React from 'react';
import { Form, DatePicker } from 'antd';
import type { FormInstance } from 'antd/es/form';
interface IComponentProps {
  onValuesChange: ((changedValues: any, values: any) => void) | undefined;
  form: FormInstance<any>;
}

const SearchForm: React.FC<IComponentProps> = ({ onValuesChange, form }) => {
  return (
    <Form form={form} layout="inline" onValuesChange={onValuesChange}>
      <Form.Item name="inspectionDate">
        <DatePicker style={{ width: 200 }} />
      </Form.Item>
    </Form>
  );
};

export default SearchForm;
