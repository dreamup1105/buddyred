import React, { useState } from 'react';
import { Button, message, Result, Space, Steps, Form } from 'antd';
import { history } from 'umi';
import { ProFormText, ProFormCaptcha } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import LoginHeader from '@/components/GlobalHeader/LoginHeader';
import useMount from '@/hooks/useMount';
import useVerifyCode from '@/hooks/useVerifyCode';
import { phoneRegExp } from '@/utils/utils';
import { modifyPasswordByVerifyCode } from '@/services/account';
import { getPasswordValidator } from '@/pages/Account/Settings/components/PasswordFormItem';

const { Step } = Steps;

const FindPasswordPage: React.FC = () => {
  const [phone, setPhone] = useState<string | undefined>();
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const { sendCode } = useVerifyCode();

  const onSubmit = async () => {
    try {
      if (!phone) {
        message.warning('手机号不能为空');
        return;
      }

      const formValues = await form.validateFields();
      const { code } = await modifyPasswordByVerifyCode({
        phone: phone!.trim(),
        newPwd: formValues!.newPassword.trim(),
        secondPwd: formValues!.reNewPassword.trim(),
        code: formValues!.code.trim(),
      });

      if (code === 0) {
        setCurrent(2);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useMount(() => {
    document.title = '找回密码';
  });

  return (
    <div>
      <LoginHeader />
      <ProCard
        bordered
        style={{
          width: '800px',
          height: '60vh',
          margin: '80px auto',
          borderRadius: '4px',
        }}
      >
        <Steps current={current} style={{ marginBottom: '70px' }}>
          <Step title="确认账号" />
          <Step title="重置密码" />
          <Step title="重置成功" />
        </Steps>
        <Form
          form={form}
          labelCol={{ span: 5 }}
          onValuesChange={(changedValues) => {
            if (changedValues.phone) {
              setPhone(changedValues.phone);
            }
          }}
          style={{ width: '500px', margin: '20px auto' }}
        >
          <div style={{ display: current === 0 ? 'block' : 'none' }}>
            <ProFormText
              name="phone"
              label="手机号"
              width="md"
              placeholder="请输入手机号"
              rules={[
                { required: true },
                { pattern: phoneRegExp, message: '请输入有效的手机号' },
              ]}
            />
            <Button
              type="primary"
              style={{ width: '100%' }}
              onClick={async () => {
                await form.validateFields(['phone']);
                setCurrent(1);
              }}
            >
              确认
            </Button>
          </div>
          <div style={{ display: current === 1 ? 'block' : 'none' }}>
            <ProFormText.Password
              label="新密码"
              name="newPassword"
              rules={[
                {
                  required: true,
                },
                {
                  validator: getPasswordValidator(form, 'newPassword'),
                },
              ]}
            />
            <ProFormText.Password
              label="确认密码"
              name="reNewPassword"
              rules={[
                {
                  required: true,
                },
                {
                  validator: getPasswordValidator(form, 'reNewPassword'),
                },
              ]}
            />
            <ProFormText
              label="手机号"
              fieldProps={{
                value: phone,
              }}
              readonly
            />
            <ProFormCaptcha
              label="验证码"
              fieldProps={{
                size: 'large',
              }}
              captchaProps={{
                size: 'large',
              }}
              // 手机号的 name，onGetCaptcha 会注入这个值
              phoneName="phone"
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入验证码',
                },
              ]}
              placeholder="请输入验证码"
              // 如果需要失败可以 throw 一个错误出来，onGetCaptcha 会自动停止
              // throw new Error("获取验证码错误")
              onGetCaptcha={async () => {
                if (!phone) {
                  message.warning('手机号不能为空');
                  return;
                }
                await sendCode(phone);
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <Space>
                <Button onClick={() => setCurrent(0)}>上一步</Button>
                <Button type="primary" onClick={onSubmit}>
                  确定修改
                </Button>
              </Space>
            </div>
          </div>
          <div style={{ display: current === 2 ? 'block' : 'none' }}>
            <Result
              status="success"
              title="重置密码成功"
              extra={[
                <Button
                  type="primary"
                  key="console"
                  onClick={() => history.replace('/login')}
                >
                  前往登录页
                </Button>,
              ]}
            />
          </div>
        </Form>
      </ProCard>
    </div>
  );
};

export default FindPasswordPage;
