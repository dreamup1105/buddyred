import React from 'react';
import ProTable from '../components/ProTable';
import type { IComponentProps } from '../components/ProTable/Table';

export default {
  title: 'Example/ProTable',
  component: ProTable,
};

const Template = <T, Q>(args: IComponentProps<T, Q>) => (
  <ProTable<T, Q> {...args} />
);

export const ProTableDemo = Template.bind({});
