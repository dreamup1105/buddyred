import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, message, Breadcrumb } from 'antd';
import type { ActionType } from '@/components/ProTable';
import useMount from '@/hooks/useMount';
import CustomerContainer from './hooks/useCustomer';
import CustomerCardList from './components/CardList';
import { fetchCustomers, saveCustomer } from './service';
import HospitalSelectorModal from '@/components/SelectorModal/Hospital';
import Searchbar from './components/Searchbar';
import styles from './index.less';

const getSignStatus = (status: string) => {
  switch (status) {
    case '1':
      return true;
    case '2':
      return false;
    default:
      return undefined;
  }
};

const CrmCustomerPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const customerContainer = CustomerContainer.useContainer();

  const loadCustomers = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { hospitalName, signStatus } = searchForm.getFieldsValue();
      const { data = [], code } = await fetchCustomers({
        hospitalName,
        isAgree: getSignStatus(signStatus),
      });
      if (code === 0) {
        customerContainer.setDataSource(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderBreadcrumb = () => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/">首页</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>客户管理</Breadcrumb.Item>
        <Breadcrumb.Item>医院客户</Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  useMount(() => {
    searchForm.setFieldsValue({ signStatus: '0' });
    loadCustomers();
  });

  // 每次添加客户前，先刷新医院列表，以获取最新数据状态
  useEffect(() => {
    if (customerContainer.hospitalListModalVisible) {
      actionRef.current?.reload();
    }
  }, [customerContainer.hospitalListModalVisible]);

  return (
    <PageContainer
      header={{
        breadcrumbRender: () => renderBreadcrumb(),
      }}
    >
      <div className={styles.searchbarWrapper}>
        <Searchbar form={searchForm} onSearch={loadCustomers} />
      </div>
      <div style={{ marginTop: 30 }}>
        <CustomerCardList
          dataSource={customerContainer.dataSource}
          loading={loading}
        />
      </div>
      <HospitalSelectorModal
        visible={customerContainer.hospitalListModalVisible}
        actionRef={actionRef}
        onSelect={async (selectedHospital) => {
          customerContainer.hideHospitalListModal();
          try {
            const { code, data } = await saveCustomer({
              siteOrgId: selectedHospital.id,
              siteOrgName: selectedHospital.name,
            });

            if (code === 0) {
              message.success('添加成功');
              customerContainer.setDataSource((prevData) => [
                data,
                ...prevData,
              ]);
            }
          } catch (error) {
            console.error(error);
          }
        }}
        onCancel={() => customerContainer.hideHospitalListModal()}
      />
    </PageContainer>
  );
};

const CrmCustomerPageWrap = () => (
  <CustomerContainer.Provider>
    <CrmCustomerPage />
  </CustomerContainer.Provider>
);

export default CrmCustomerPageWrap;
