import React from 'react';
import BasePage from '@/pages/Maintenance/index';
import { PageType } from '@/pages/Maintenance/type';

const RepairManagementPage: React.FC = () => {
  return <BasePage pageType={PageType.REPAIR} />;
};

export default RepairManagementPage;
