import React, { useState } from 'react';
import { Row, Col, Menu } from 'antd';
import useUserInfo from '@/hooks/useUserInfo';
import { OrgTypeEnum } from '@/utils/constants';
import useMount from '@/hooks/useMount';
import BaseConfig from './components/Base';
import SecurityConfig from './components/Security';
import WechatConfig from './components/Wechat';
import EquipmnentLabelConfig from './components/EquipmentLbale';

const SettingPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const isAdmin = currentUser?.user.isAdmin;
  const isHospital = currentUser?.org.orgType === OrgTypeEnum.HOSPITAL;
  const [menuKey, setMenuKey] = useState('base');
  const [hospitalId, setHospitalId] = useState<number>();
  const onClickMenu = ({ key }: any) => {
    setMenuKey(key);
    if (key == 'equipmentLabel') {
      setHospitalId(currentUser?.org.id);
    }
  };

  useMount(() => {
    document.title = '个人设置';
  });

  return (
    <div style={{ background: '#fff', padding: 20 }}>
      <Row gutter={32}>
        <Col span={3}>
          <Menu
            style={{ height: '100%' }}
            defaultSelectedKeys={['base']}
            onClick={onClickMenu}
          >
            <Menu.Item key="base">基本设置</Menu.Item>
            <Menu.Item key="security">安全设置</Menu.Item>
            <Menu.Item key="wechat">微信设置</Menu.Item>
            {/* 医院并且是管理员才能查看设备标签 */}
            {isAdmin && isHospital && (
              <Menu.Item key="equipmentLabel">设备标签</Menu.Item>
            )}
          </Menu>
        </Col>
        <Col span={21}>
          {menuKey === 'base' && <BaseConfig />}
          {menuKey === 'security' && <SecurityConfig />}
          {menuKey === 'wechat' && <WechatConfig />}
          {menuKey === 'equipmentLabel' && (
            <EquipmnentLabelConfig id={hospitalId} />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SettingPage;
