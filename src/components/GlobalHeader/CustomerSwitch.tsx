import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import useUserInfo from '@/hooks/useUserInfo';
import { Menu, Dropdown, Space } from 'antd';
import styles from './index.less';

const CustomerSwitch: React.FC = () => {
  const { currentUser, setInitialState, initialState } = useUserInfo();

  const onClickMenu = ({ key }: any) => {
    const selectedCustomer = currentUser?.customers.find(
      (item) => item.id.toString() === key,
    );

    if (selectedCustomer) {
      localStorage.setItem('currentCustomer', JSON.stringify(selectedCustomer));
      setInitialState({
        ...initialState,
        currentUser: {
          ...(initialState?.currentUser as CurrentUserInfo &
            CurrentUserExtInfo),
          currentCustomer: selectedCustomer,
        },
      });
      window.location.reload();
    }
  };

  const menus = (
    <Menu
      onClick={onClickMenu}
      selectedKeys={
        currentUser?.currentCustomer
          ? [currentUser?.currentCustomer.id.toString()]
          : []
      }
    >
      {currentUser?.customers &&
        currentUser.customers.map((customer) => (
          <Menu.Item key={customer.id}>{customer.siteOrgName}</Menu.Item>
        ))}
    </Menu>
  );

  if (!currentUser?.currentCustomer || currentUser.isCustomersEmpty) {
    return null;
  }

  return (
    <div style={{ marginLeft: 10, marginRight: 10 }}>
      <Dropdown overlay={menus}>
        <a onClick={(e) => e.preventDefault()} className={styles.action}>
          <span className={styles.team}>
            <Space>
              {currentUser?.currentCustomer?.siteOrgName}
              <DownOutlined />
            </Space>
          </span>
        </a>
      </Dropdown>
    </div>
  );
};

export default CustomerSwitch;
