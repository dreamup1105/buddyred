import React from 'react';
import { Form, Input } from 'antd';
import { isValidLoginPassword } from '@/utils/utils';
import type { FormInstance } from 'antd/es/form';

const getLabel = (type: 'password' | 'newPassword' | 'reNewPassword') => {
  switch (type) {
    case 'newPassword':
      return '新密码';
    case 'reNewPassword':
      return '重复新密码';
    default:
      return '旧密码';
  }
};

// 获取密码校验器函数
export const getPasswordValidator = (
  form: FormInstance,
  type: 'newPassword' | 'reNewPassword',
) => {
  const passwordLabel = getLabel(type);

  return (rule: any, value: any) => {
    if (!value || !value.trim()) {
      return Promise.reject(new Error(`${passwordLabel}不能为空或全空格`));
    }

    if (type === 'reNewPassword') {
      const newPassword = form.getFieldValue('newPassword');
      if (value.trim() !== newPassword?.trim()) {
        return Promise.reject(new Error('两次新密码输入不一致，请重新输入'));
      }
    }

    if (!isValidLoginPassword(value.trim())) {
      return Promise.reject(
        new Error('密码为8-16位字符，需同时包含字母和数字'),
      );
    }

    return Promise.resolve();
  };
};

interface IComponentProps {
  type: 'password' | 'newPassword' | 'reNewPassword';
  form: FormInstance;
}

const PasswordFormItem: React.FC<IComponentProps> = ({ type, form }) => {
  return (
    <Form.Item
      label={getLabel(type)}
      name={type}
      rules={
        type === 'password'
          ? [
              {
                required: true,
                message: '密码不能为空',
              },
            ]
          : [
              {
                required: true,
                message: '密码不能为空',
              },
              {
                validator: getPasswordValidator(form, type),
              },
            ]
      }
    >
      {type === 'password' ? (
        <Input.Password placeholder="请输入" />
      ) : (
        <Input.Password placeholder="请输入" minLength={8} maxLength={16} />
      )}
    </Form.Item>
  );
};

export default PasswordFormItem;
