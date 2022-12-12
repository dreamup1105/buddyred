import { Alert } from 'antd';
import React, { useState } from 'react';
import type { Dispatch } from 'umi';
import { connect, history, Link } from 'umi';
import useMount from '@/hooks/useMount';
import type { StateType } from '@/models/login';
import type { LoginParamsType } from '@/services/login';
import { login } from '@/services/login';
import type { ConnectState } from '@/models/connect';
import ISOLogo from '@/assets/iso.png';
import { restartMessageTask } from '@/utils/ws';
import LoginForm from './components/Login';
import Title from './components/Login/Title';
import ForgetPwdModal from './components/Login/ForgetPwdModal';

import styles from './index.less';

const { UserName, Password, Submit } = LoginForm;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const goto = () => {
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    window.location.href = redirect ? decodeURIComponent(atob(redirect)) : '/';
  }, 10);
};

const getICP = () => {
  const { host } = window.location;
  return host.includes('btyxk') ? '京ICP备16056628号-2' : '京ICP备16056628号-1';
};

const Login: React.FC<LoginProps> = () => {
  // const { userLogin = {}, submitting } = props;
  // const { type: loginType } = userLogin;
  const [status, setStatus] = useState<'error' | 'success'>('success');
  const [submitting, setSubmitting] = useState<boolean>(false);
  // const [autoLogin, setAutoLogin] = useState(true);
  const [forgetPwdModalVisible, setForgetPwdModalVisible] = useState<boolean>(
    false,
  );
  const [type, setType] = useState<string>('account');

  const onSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      await login({
        username: values.username.trim(),
        password: values.password.trim(),
      });
      // 登录成功
      setStatus('success');
      restartMessageTask();
      goto();
    } catch (error) {
      setStatus('error');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitForgetPwd = () => {};

  useMount(() => {
    document.title = '登录';
    localStorage.clear();
  });

  return (
    <div className={styles.loginWrapper}>
      <div style={{ overflow: 'auto', height: '100%' }}>
        <Title />
        <div className={styles.main}>
          <LoginForm activeKey={type} onTabChange={setType} onSubmit={onSubmit}>
            {status === 'error' && !submitting ? (
              <LoginMessage content="账户或密码错误" />
            ) : (
              <></>
            )}
            <UserName
              name="username"
              placeholder="用户名/手机号码"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <Password
              name="password"
              placeholder="密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
            {/* </Tab> */}
            {/* <Tab key="mobile" tab="手机号登录">
              {status === 'error' && loginType === 'mobile' && !submitting && (
                <LoginMessage content="验证码错误" />
              )}
              <Mobile
                name="mobile"
                placeholder="手机号"
                rules={[
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ]}
              />
              <Captcha
                name="captcha"
                placeholder="验证码"
                countDown={120}
                getCaptchaButtonText=""
                getCaptchaSecondText="秒"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
              />
            </Tab> */}
            <div className="clearfix">
              {/* <Checkbox
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
              >
                记住密码
              </Checkbox> */}
              <Link
                to="/login/find-password"
                style={{
                  float: 'right',
                  color: '#fff',
                  textDecoration: 'underline',
                }}
              >
                不记得密码?
              </Link>
            </div>
            <Submit loading={submitting}>
              {submitting ? '登录中...' : '登录'}
            </Submit>
            {/* <div className={styles.other}>
              <Link
                className={styles.register}
                to="/user/register"
                style={{ color: '#fff' }}
              >
                注册账户
              </Link>
            </div> */}
          </LoginForm>
        </div>
        <div className={styles.isoWrapper}>
          <img src={ISOLogo} alt="iso" />
          本企业通过ISO27001国际信息安全体系认证
        </div>
        <div className={styles.copyrightWrapper}>
          <span>©2018-2021 医修技术服务有限公司 All rights reserved. </span>
          <span>{getICP()}</span>
        </div>
        <div className={styles.browserWrapper}>
          本站最佳浏览分辨率: 1920*1080 或以上 最佳浏览器：Chrome
        </div>
        <ForgetPwdModal
          visible={forgetPwdModalVisible}
          onSubmit={() => onSubmitForgetPwd()}
          onCancel={() => setForgetPwdModalVisible(false)}
        />
      </div>
    </div>
  );
};

export default connect(({ login: userLogin, loading }: ConnectState) => ({
  userLogin,
  submitting: loading.effects['login/login'],
}))(Login);
