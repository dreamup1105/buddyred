import { useState } from 'react';
import { createContainer } from 'unstated-next';
import type { ICustomerItem } from '../type';

function useCustomer() {
  const [hospitalListModalVisible, setHospitalListModalVisible] =
    useState(false);
  const [dataSource, setDataSource] = useState<ICustomerItem[]>([]); // 客户列表数据

  const showHospitalListModal = () => setHospitalListModalVisible(true);
  const hideHospitalListModal = () => setHospitalListModalVisible(false);

  return {
    dataSource,
    setDataSource,
    hospitalListModalVisible,
    showHospitalListModal,
    hideHospitalListModal,
  };
}

const CustomerContainer = createContainer(useCustomer);

export default CustomerContainer;
