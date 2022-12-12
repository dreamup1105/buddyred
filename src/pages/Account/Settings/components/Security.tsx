import React, { useState } from 'react';
import { List } from 'antd';
import PasswordModal from './Password';
import styles from '../index.less';

const SecurityConfig: React.FC = () => {
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  return (
    <>
      <h6 className={styles.configTitle}>安全设置</h6>
      <List
        itemLayout="horizontal"
        dataSource={[{}]}
        renderItem={() => (
          <List.Item
            actions={[
              <a key="modify" onClick={() => setPasswordModalVisible(true)}>
                修改
              </a>,
            ]}
          >
            <List.Item.Meta
              title="登录密码"
              description="用于登录医修库网站及APP"
            />
          </List.Item>
        )}
      />
      <PasswordModal
        visible={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        onSubmit={() => setPasswordModalVisible(false)}
      />
    </>
  );
};

export default SecurityConfig;
