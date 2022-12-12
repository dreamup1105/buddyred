import React from 'react';
import ProCard from '@ant-design/pro-card';
import { ParamsTab, TemplateTab, EmployeeTab } from './Tabs';
import type { CustomerDetail } from '../../type';

interface IComponentProps {
  initialData: CustomerDetail | undefined;
}

const CustomerConfig: React.FC<IComponentProps> = ({ initialData }) => {
  return (
    <ProCard
      tabs={{
        type: 'card',
      }}
    >
      <ProCard.TabPane
        key="template"
        tab="模板"
        cardProps={{ bodyStyle: { paddingTop: 0 } }}
      >
        <TemplateTab initialData={initialData?.templates} />
      </ProCard.TabPane>
      <ProCard.TabPane
        key="employee"
        tab="人员"
        cardProps={{ bodyStyle: { paddingTop: 0 } }}
      >
        <EmployeeTab initialData={initialData?.engineers} />
      </ProCard.TabPane>
      <ProCard.TabPane key="params" tab="参数">
        <ParamsTab initialData={initialData?.params} />
      </ProCard.TabPane>
    </ProCard>
  );
};

export default CustomerConfig;
