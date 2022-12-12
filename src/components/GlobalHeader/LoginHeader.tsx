import React from 'react';
import { Row, Col } from 'antd';
import { Link } from 'umi';
import Logo from '@/assets/logo-left.png';
import styles from './index.less';

const LoginHeader: React.FC = () => {
  return (
    <div className={`${styles.loginHeaderWrapper}`}>
      <Row>
        <Col span={12}>
          <img src={Logo} className={styles.logo} />
          <h2 className={styles.title}>医修库管理系统</h2>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Link to="/login" style={{ marginRight: '20px' }}>
            登录
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default LoginHeader;
