import React from 'react';
import { List, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CustomerContainer from '../hooks/useCustomer';
import CustomerCard from './Card';
import styles from '../index.less';

interface IComponentProps {
  dataSource: any;
  loading: boolean;
}

const CustomerCardList: React.FC<IComponentProps> = ({
  loading,
  dataSource,
}) => {
  const customerContainer = CustomerContainer.useContainer();
  const onAddCustomer = () => {
    customerContainer.showHospitalListModal();
  };
  return (
    <List
      rowKey="id"
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 5,
        xxl: 5,
      }}
      dataSource={[{}, ...dataSource]}
      renderItem={(item) => {
        if (item?.id) {
          return (
            <List.Item>
              <CustomerCard customerItem={item} loading={loading} />
            </List.Item>
          );
        }
        return (
          <List.Item>
            <Button
              type="dashed"
              className={styles.btnAddCustomer}
              onClick={onAddCustomer}
            >
              <PlusOutlined /> 添加客户
            </Button>
          </List.Item>
        );
      }}
    />
  );
};

export default CustomerCardList;
