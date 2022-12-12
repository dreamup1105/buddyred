import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { history, Link } from 'umi';
import { Space, Button, message, Modal, Breadcrumb } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useMount from '@/hooks/useMount';
import Footerbar from '@/components/Footerbar';
import CustomerInfo from './components/CustomerInfo';
import { TemplateTab, EmployeeTab, ParamsTab } from './components/Tabs';
import type { CustomerDetail } from '../type';
import { deleteCustomer, fetchCustomerDetail } from '../service';
import styles from './index.less';

const { confirm } = Modal;

const CrmCustomerDetailPage: React.FC = () => {
  const [detail, setDetail] = useState<CustomerDetail>();
  const {
    location: { query },
  } = history;

  const onDelete = async () => {
    if (!query?.id) {
      return;
    }
    confirm({
      title: '确定要删除该客户吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const { code } = await deleteCustomer(Number(query.id));
          if (code === 0) {
            message.success('删除成功');
            history.goBack();
            return true;
          }
          return false;
        } catch (error) {
          console.error(error);
          return false;
        }
      },
    });
  };

  const renderBreadcrumb = () => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/">首页</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>客户管理</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/crm/customer">医院客户</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{detail?.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  const init = async () => {
    document.title = '客户详情';

    if (!query?.id) {
      return;
    }

    try {
      const { code, data } = await fetchCustomerDetail(Number(query.id));
      if (code === 0) {
        setDetail(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useMount(init);

  return (
    <PageContainer
      header={{
        breadcrumbRender: () => renderBreadcrumb(),
      }}
    >
      <ProCard title={detail?.name} split={'vertical'} headerBordered>
        <ProCard key="1" title="" colSpan="35%" bordered={false}>
          <CustomerInfo initialData={detail} />
        </ProCard>
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
            <TemplateTab
              initialData={detail?.templates}
              hospitalName={detail?.name}
            />
          </ProCard.TabPane>
          <ProCard.TabPane
            key="employee"
            tab="人员"
            cardProps={{ bodyStyle: { paddingTop: 0 } }}
          >
            <EmployeeTab initialData={detail?.engineers} />
          </ProCard.TabPane>
          <ProCard.TabPane key="params" tab="参数">
            <ParamsTab initialData={detail?.params} />
          </ProCard.TabPane>
        </ProCard>
      </ProCard>
      <Footerbar
        visible
        style={{
          height: '60px',
          lineHeight: '60px',
        }}
        rightContent={
          <Space>
            <Button
              className={styles.btnCancel}
              onClick={() => history.goBack()}
            >
              返回
            </Button>
            <Button
              onClick={onDelete}
              className={styles.btnDelete}
              type="primary"
              danger
            >
              删除
            </Button>
          </Space>
        }
      />
    </PageContainer>
  );
};

export default CrmCustomerDetailPage;
