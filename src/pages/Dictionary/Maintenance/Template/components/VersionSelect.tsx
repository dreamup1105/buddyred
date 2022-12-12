import React from 'react';
import { Form } from 'antd';
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';

interface IComponentProps {
  visible: boolean;
  options: {
    value: number;
    label: string;
  }[];
  onSubmit: (specId: number) => void;
  onCancel: () => void;
}

const VersionSelect: React.FC<IComponentProps> = ({
  visible,
  options,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      visible={visible}
      title="选择版本"
      form={form}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          form.resetFields();
          onCancel();
        },
      }}
      onFinish={async (values) => {
        onSubmit(values.version);
        form.resetFields();
        return true;
      }}
    >
      <ProFormSelect
        name="version"
        label="版本"
        options={options}
        rules={[
          {
            required: true,
            message: '请选择版本',
          },
        ]}
      />
    </ModalForm>
  );
};

export default VersionSelect;
