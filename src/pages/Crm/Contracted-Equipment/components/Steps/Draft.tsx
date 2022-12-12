import React from 'react';
import {
  ProFormSelect,
  ProFormDateRangePicker,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-form';
import SignFormContainer from '../../hooks/useSignForm';
import { SignProjectsOptions } from '../../type';

const StepDraft: React.FC = () => {
  const signForm = SignFormContainer.useContainer();
  return (
    <>
      <ProFormSelect
        label="签约公司"
        width="md"
        name="company"
        rules={[{ required: true, message: '请选择签约公司' }]}
        options={signForm.values.companyOptions}
      />
      <ProFormText hidden label="" name="companyName" />
      <ProFormDateRangePicker
        label="签约时间"
        name="date"
        rules={[{ required: true, message: '请选择签约时间' }]}
      />
      <ProFormCheckbox.Group
        name="projects"
        label="签约项目"
        options={SignProjectsOptions}
        rules={[{ required: true, message: '请勾选签约项目' }]}
      />
    </>
  );
};

export default StepDraft;
