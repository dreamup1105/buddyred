import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import type { IGroupRoleItem } from '@/pages/User/Role/type';
import type { ITableListItem as IOrgTableListItem } from '@/pages/Organization/type';
import {
  createAdminAccount,
  updateAdminAccount,
} from '@/pages/Organization/service';
import type { ITableListItem } from '../type';
import { saveAccount } from '../service';
import { intOrLetterRegExp } from '@/utils/utils';

interface IComponentProps {
  visible: boolean;
  currentRecord: ITableListItem | IOrgTableListItem | undefined;
  roles?: IGroupRoleItem[];
  accountType: 'Org' | 'Employee';
  onSubmit: (message: string) => void;
  onCancel: () => void;
}

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const getMessage = (
  currentRecord: ITableListItem | IOrgTableListItem | undefined,
) => {
  if (currentRecord?.accountId) {
    return '账号更新成功';
  }
  return '账号新建成功';
};

const getUsernameLabel = (accountType: 'Org' | 'Employee') => {
  switch (accountType) {
    case 'Employee':
      return '用户名/手机号码';
    case 'Org':
      return '用户名';
    default:
      return '手机号码';
  }
};

const Account: React.FC<IComponentProps> = ({
  visible,
  currentRecord,
  roles = [],
  accountType,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const onModalOk = async () => {
    setConfirmLoading(true);
    try {
      const { username, roleId, password } = await form.validateFields();
      switch (accountType) {
        case 'Employee':
          await saveAccount(currentRecord!.id, {
            accountId: currentRecord?.accountId,
            roleId,
            username,
          });
          break;
        case 'Org':
          if (currentRecord?.accountId) {
            await updateAdminAccount(currentRecord.accountId, {
              phone: undefined,
              username,
            });
          } else {
            await createAdminAccount(currentRecord!.id, {
              phone: username,
              username,
              password,
            });
          }
          break;
        default:
          break;
      }
      onSubmit(getMessage(currentRecord));
      form.resetFields();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const onModalCancel = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    form.setFieldsValue({
      username:
        (currentRecord as ITableListItem)?.username ||
        (currentRecord as ITableListItem)?.phone,
      isLogin: !!currentRecord?.accountId,
    });
    if (accountType === 'Employee') {
      form.setFieldsValue({
        roleId: (currentRecord as ITableListItem)?.roleId || undefined,
      });
    }
  }, [currentRecord]);

  return (
    <Modal
      title="账号"
      visible={visible}
      confirmLoading={confirmLoading}
      maskClosable={false}
      onOk={onModalOk}
      onCancel={onModalCancel}
      forceRender
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item
          name="username"
          label={getUsernameLabel(accountType)}
          rules={[
            {
              required: true,
              message: `请填写${getUsernameLabel(accountType)}`,
            },
          ]}
        >
          <Input placeholder="请填写" />
        </Form.Item>
        {accountType == 'Org' && !currentRecord?.accountId && (
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true },
              {
                pattern: intOrLetterRegExp,
                message: '密码只能由数字或字母组合',
              },
              { max: 16, message: '密码最多不超过16位' },
              { min: 8, message: '密码最少为8位' },
            ]}
          >
            <Input placeholder="密码只能由数字或字母组合" />
          </Form.Item>
        )}
        {accountType === 'Employee' && (
          <Form.Item
            name="roleId"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择">
              {roles.map((r) => (
                <Select.Option key={r.id} value={r.id}>
                  {r.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {/* <Form.Item name="isLogin" label="允许登录系统" valuePropName="checked">
          <Checkbox />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default Account;
