import { useState } from 'react';
import { message } from 'antd';
import { sendVerifyCode } from '@/services/account';

export default function useVerifyCode() {
  const [result, setResult] = useState<'success' | 'failed' | undefined>();
  const sendCode = async (phone: string) => {
    const res = await sendVerifyCode(phone);
    if (res.code === 0) {
      message.success('验证码发送成功');
      setResult('success');
    } else {
      throw new Error('获取验证码错误');
    }
  };

  return {
    result,
    sendCode,
  };
}
