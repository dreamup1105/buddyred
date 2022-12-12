/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useState } from 'react';
import { Row, Col, Form, Input, Upload, message, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { ResourcePath } from '@/utils/constants';
import useUploadHook from '@/hooks/useUploadHook';
import useUserInfo from '@/hooks/useUserInfo';
import useMount from '@/hooks/useMount';
import useEmployee from '@/hooks/useEmployee';
import { saveAttachments } from '@/services/global';
import type {
  SaveEmployeeParams,
  EmployeeAdminParams,
} from '@/pages/Employee/type';
import { normalFile, getSpaceValidator } from '@/utils/utils';
import { AttachmentCategory } from '@/utils/constants';
import { UploadHost } from '@/services/qiniu';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import styles from '../index.less';
import { uploadAdmin } from '@/pages/Employee/service';
import { logout } from '@/services/login';
import { stopMessageTask } from '@/utils/ws';

const BaseConfig: React.FC = () => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isAdminEditLoading, setIsAdminEditLoading] = useState(false);
  const [isAdminEdit, setIsAdminEdit] = useState(false); //是否可编辑管理员信息
  const { currentUser, setInitialState } = useUserInfo();
  const { token, loadToken } = useUploadHook();
  const [form] = Form.useForm();
  const isAdmin = !!currentUser?.user.isAdmin;
  const { employeeDetail, saveEmployee } = useEmployee(
    currentUser?.employee?.id,
  );
  const beforeUpload = async (file: File): Promise<any> => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能大于5M');
      return Upload.LIST_IGNORE;
    }
    await loadToken();
    return true;
  };

  const onFileChange = async ({ file }: any) => {
    if (file.status == 'done') {
      //上传成功
      // 头像上传成功之后立即保存 - 暂时不要
      // const formData = {
      //   name: '',
      //   avatar: ''
      // };
      // const name = form.getFieldValue('name');
      // const avatar = form.getFieldValue('avatar');
      // formData.name = name;
      // formData.avatar = avatar;
      // await submitAvatar(formData);
    }
    if (file.status === 'error') {
      message.error('图片上传失败');
    }
  };

  const getExtraData = useCallback(
    (file: UploadFile) => {
      return {
        token,
        key: `${Date.now()}-${file.uid}-${currentUser?.user.id}`,
      };
    },
    [token],
  );

  const onFormFinish = async (formValues: any) => {
    if (isAdminEdit) {
      setIsAdminEditLoading(true);
      try {
        const formData = {
          orgId: currentUser?.user?.orgId,
          userId: currentUser?.user?.id,
          username: formValues.username,
          phone: formValues.phone,
          orgName: formValues.name,
          email: formValues.email,
          orgAlias: formValues.alias,
        } as EmployeeAdminParams;
        const { code } = await uploadAdmin(formData);
        if (code == 0) {
          message.success('保存成功，请重新登陆');
          try {
            await logout();
          } catch (error) {
            console.error(error);
          } finally {
            stopMessageTask();
            window.location.replace('/login');
          }
        }
      } catch (error) {
        message.error(`${error}`);
      } finally {
        setIsAdminEditLoading(false);
      }
    } else {
      await submitAvatar(formValues);
    }
  };

  // 修改信息保存 - 姓名+头像
  const submitAvatar = async (formValues: any) => {
    setConfirmLoading(true);
    try {
      const formData = {
        ...employeeDetail,
        name: formValues.name?.trim(),
      } as SaveEmployeeParams;
      const { code, data } = await saveEmployee(formData);
      if (code === 0) {
        const attachment = formValues.avatar[0];
        const res = await saveAttachments(
          data.id,
          attachment
            ? [
                {
                  contentLength: attachment.size,
                  contentType: attachment.type,
                  fileName: attachment.name,
                  res: attachment.response?.data?.key || attachment.uid,
                  category: AttachmentCategory.EMPLOYEE_AVATAR,
                },
              ]
            : [],
        );
        if (res.code === 0) {
          setInitialState((prevState) => ({
            ...prevState,
            currentUser: {
              ...prevState?.currentUser,
              employee: {
                ...prevState?.currentUser?.employee,
                avatar: attachment
                  ? attachment.response?.data?.key || attachment.uid
                  : null,
              },
            } as CurrentUserInfo & CurrentUserExtInfo,
          }));
        }
      }
      message.success('保存成功');
    } catch (error) {
      message.error(`${error}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 编辑和取消编辑
  const editButtonClick = () => {
    setIsAdminEdit(!isAdminEdit);
    form.setFieldsValue({
      username: currentUser?.user?.username,
      phone: currentUser?.employee?.phone,
      email: currentUser?.employee?.email,
      name: currentUser?.org?.name,
      alias: currentUser?.org?.alias,
    });
  };

  useMount(() => {
    const avatar = currentUser?.employee?.avatar;
    form.setFieldsValue({
      name: currentUser?.employee?.name,
      avatar: avatar
        ? [
            {
              url: `${ResourcePath}${avatar}`,
              status: 'done',
              uid: avatar,
            },
          ]
        : undefined,
    });
  });

  return (
    <>
      <h6 className={styles.configTitle}>
        基本设置
        {isAdmin && (
          <Button onClick={editButtonClick} type="link" icon={<EditOutlined />}>
            编辑
          </Button>
        )}
      </h6>
      <Form form={form} layout="vertical" onFinish={onFormFinish}>
        <Row gutter={32}>
          <Col span={8}>
            {!isAdmin && (
              <>
                <Form.Item
                  label="姓名"
                  name="name"
                  rules={[
                    { required: true, message: '姓名不能为空' },
                    { validator: getSpaceValidator },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="所属部门">
                  {currentUser?.primaryDepartment?.name}
                </Form.Item>
              </>
            )}
            {isAdminEdit && (
              <Form.Item
                label="用户名(登陆账号)"
                name="username"
                rules={[{ required: true, message: '用户名不能为空' }]}
              >
                <Input
                  value={currentUser?.user?.username}
                  defaultValue={currentUser?.user?.username}
                />
              </Form.Item>
            )}
            {!isAdminEdit && (
              <Form.Item label="用户名">
                {currentUser?.user?.username}
              </Form.Item>
            )}

            {/* 暂时不要 */}
            {/* { isAdminEdit && (
                <Form.Item label="电话" name="phone" 
                  rules={[
                    { pattern: phoneRegExp, message: '请输入正确的手机号码' },
                  ]}>
                  <Input defaultValue={currentUser?.employee?.phone}/>
                </Form.Item>
            )}
            { !isAdminEdit && (
                <Form.Item label="电话">{currentUser?.employee?.phone}</Form.Item>
            )} */}

            {/* 暂时不要 */}
            {/* { isAdminEdit && (
                <Form.Item label="邮箱" name="email" 
                  rules={[
                    { pattern: emailRegExp, message: '请输入正确的邮箱' },
                  ]}>
                  <Input defaultValue={currentUser?.employee?.email}/>
                </Form.Item>
            )}
            { !isAdminEdit && (
                <Form.Item label="邮箱">{currentUser?.employee?.email}</Form.Item>
            )} */}

            <Form.Item label="电话">{currentUser?.employee?.phone}</Form.Item>
            <Form.Item label="邮箱">{currentUser?.employee?.email}</Form.Item>

            {!isAdmin && (
              <Form.Item label="职位">
                {currentUser?.employee?.position}
              </Form.Item>
            )}

            {isAdminEdit && (
              <Form.Item
                label="机构"
                name="name"
                rules={[
                  { required: true, message: '机构不能为空' },
                  { max: 40, message: '机构名称不能超过四十个字' },
                ]}
              >
                <Input defaultValue={currentUser?.org?.name} />
              </Form.Item>
            )}
            {!isAdminEdit && (
              <Form.Item label="机构">{currentUser?.org.name}</Form.Item>
            )}

            {isAdminEdit && (
              <Form.Item
                label="机构简称"
                name="alias"
                rules={[
                  { required: true, message: '机构简称不能为空' },
                  { max: 20, message: '机构简称不能超过20个字' },
                ]}
              >
                <Input defaultValue={currentUser?.org?.alias} />
              </Form.Item>
            )}
            {!isAdminEdit && (
              <Form.Item label="机构简称">{currentUser?.org.alias}</Form.Item>
            )}

            {!isAdmin && (
              <Form.Item label="员工编号">
                {currentUser?.employee?.employeeNo}
              </Form.Item>
            )}
            {!isAdmin && (
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={confirmLoading}
                >
                  提交
                </Button>
              </Form.Item>
            )}
            {isAdminEdit && (
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isAdminEditLoading}
                >
                  保存
                </Button>
              </Form.Item>
            )}
          </Col>
          <Col span={10}>
            {!isAdmin && (
              <Form.Item
                name="avatar"
                label="头像"
                labelCol={{ span: 3 }}
                valuePropName="fileList"
                getValueFromEvent={normalFile}
              >
                <Upload
                  action={UploadHost}
                  accept=".jpg, .jpeg, .png"
                  beforeUpload={beforeUpload}
                  listType="picture-card"
                  data={getExtraData}
                  onChange={onFileChange}
                  maxCount={1}
                >
                  <PlusOutlined />
                  <div>更换头像</div>
                </Upload>
              </Form.Item>
            )}
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default BaseConfig;
