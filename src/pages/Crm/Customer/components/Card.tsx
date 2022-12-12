import React from 'react';
import { history } from 'umi';
import { Card, Typography, Skeleton, Space, Modal, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import IconFont from '@/components/IconFont';
import { ResourcePath } from '@/utils/constants';
import CustomerContainer from '../hooks/useCustomer';
import { deleteCustomer } from '../service';
import type { ICustomerItem } from '../type';
import styles from '../index.less';

const { confirm } = Modal;
const { Paragraph } = Typography;

interface IComponentProps {
  customerItem: ICustomerItem;
  loading: boolean;
}

const CustomerCard: React.FC<IComponentProps> = ({ customerItem, loading }) => {
  const customerContainer = CustomerContainer.useContainer();

  // 编辑
  const onEdit = () => {
    history.push(`/crm/customer/detail?id=${customerItem.id}`);
  };

  // 删除
  const onDelete = () => {
    confirm({
      title: '确定要删除该客户吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const { code } = await deleteCustomer(customerItem.id);
          if (code === 0) {
            message.success('删除成功');
            customerContainer.setDataSource((prevData) =>
              prevData.filter((item) => item.id !== customerItem.id),
            );
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

  // 卡片封面
  const renderCover = () => {
    if (loading) {
      return <Skeleton.Avatar active shape="square" size={300} />;
    }

    if (customerItem.siteOrgLogo) {
      return (
        <img
          src={`${ResourcePath}${customerItem.siteOrgLogo}`}
          style={{ width: '100%' }}
        />
      );
    }

    return (
      <IconFont type="iconyiyuan" className={styles.defaultHospitalIcon} />
    );
  };

  const actions = [
    <a key="edit" onClick={onEdit}>
      <Space>
        <EditOutlined />
        编辑
      </Space>
    </a>,
    <a key="delete" onClick={onDelete}>
      <Space>
        <DeleteOutlined />
        删除
      </Space>
    </a>,
  ];
  return (
    <Card
      hoverable
      loading={loading}
      actions={actions}
      cover={<div className={styles.coverWrapper}>{renderCover()}</div>}
    >
      <Card.Meta
        title={<a>{customerItem.siteOrgName}</a>}
        description={
          <Paragraph className={styles.item} ellipsis={{ rows: 2 }}>
            签约设备：{customerItem.agreementTotalCount}
          </Paragraph>
        }
      />
    </Card>
  );
};

export default CustomerCard;
