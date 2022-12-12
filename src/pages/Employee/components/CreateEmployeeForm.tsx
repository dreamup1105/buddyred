import React, { useState, useEffect, useCallback } from 'react';
import {
  message,
  Upload,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  phoneRegExp,
  emailRegExp,
  normalFile,
  getBase64,
  getSpaceValidator,
} from '@/utils/utils';
import Preview from '@/components/Preview';
import { GenderEnum, AttachmentCategory } from '@/utils/constants';
import { UploadHost } from '@/services/qiniu';
import { ResourcePath } from '@/utils/constants';
import { fetchAttachments, saveAttachments } from '@/services/global';
import useUploadHook from '@/hooks/useUploadHook';
import usePreview from '@/hooks/usePreview';
import useUserInfo from '@/hooks/useUserInfo';
import DepartmentSelector from '@/components/DepartmentSelector';
import type { UploadFile } from 'antd/es/upload/interface';
import type { DepartmentTreeNode, SaveEmployeeParams } from '../type';
import { OperationType } from '../type';
import { saveEmployee } from '../service';

interface IComponentProps {
  loading: boolean;
  visible: boolean;
  operation: OperationType;
  initialValues: SaveEmployeeParams | undefined;
  departmentTreeData: DepartmentTreeNode[];
  onSubmit: () => void;
  onCancel: () => void;
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const CreateEmployeeForm: React.FC<IComponentProps> = ({
  loading,
  visible,
  operation,
  initialValues,
  departmentTreeData,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const { currentUser } = useUserInfo();
  const userId = currentUser?.user.id;
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const { token, loadToken } = useUploadHook();
  const [
    previewImages,
    previewModalVisible,
    defaultPhotoIndex,
    updatePreviewImages,
    showPreviewModal,
    onClosePreview,
  ] = usePreview();
  const orgId = currentUser?.org.id;

  console.log(departmentTreeData);

  const beforeUpload = async (file: File): Promise<any> => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能大于5M');
      return Upload.LIST_IGNORE;
    }
    await loadToken();
    return true;
  };

  const getExtraData = useCallback(
    (file: UploadFile) => {
      return {
        token,
        key: `${Date.now()}-${file.uid}-${userId}`,
      };
    },
    [token],
  );

  const onFileChange = ({ file }: any) => {
    if (file.status === 'error') {
      message.error('图片上传失败');
    }
  };

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = (await getBase64(file.originFileObj as File)) as string;
    }

    const currentFileList = form.getFieldValue('avator');
    if (currentFileList?.length) {
      updatePreviewImages(currentFileList, file);
    }
    showPreviewModal();
  };

  const init = async () => {
    const { data: attachments = [] } = await fetchAttachments(
      initialValues!.id!,
    );
    const avator = attachments.length
      ? [
          {
            url: `${ResourcePath}${attachments[0].res}`,
            type: attachments[0].contentType,
            size: attachments[0].contentLength,
            status: 'done',
            name: attachments[0].fileName,
            uid: attachments[0].res,
          },
        ]
      : undefined;
    form.setFieldsValue({
      ...initialValues,
      avator,
    });
  };

  const onModalOk = async () => {
    if (confirmLoading) {
      return;
    }
    try {
      const formValues = await form.validateFields();
      const { avator } = formValues;
      setConfirmLoading(true);
      const formData: SaveEmployeeParams = {
        ...initialValues,
        ...(formValues as any),
        name: formValues.name.trim(),
        orgId,
      };
      const { data } = await saveEmployee(formData);
      if (avator?.length) {
        const attachment = avator[0];
        await saveAttachments(data.id, [
          {
            contentLength: attachment.size,
            contentType: attachment.type,
            fileName: attachment.name,
            res: attachment.response?.data?.key || attachment.uid,
            category: AttachmentCategory.EMPLOYEE_AVATAR,
          },
        ]);
      } else {
        await saveAttachments(data.id, []);
      }
      form.resetFields();
      onSubmit();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const onModalCancel = () => {
    onCancel();
    form.resetFields();
  };

  useEffect(() => {
    if (initialValues) {
      init();
    }
  }, [initialValues]);

  return (
    <Modal
      title={
        operation === OperationType.CREATE ? '人力资源-新增' : '人力资源-修改'
      }
      centered
      visible={visible}
      okText="保存"
      cancelText="取消"
      confirmLoading={confirmLoading}
      maskClosable={false}
      width={750}
      bodyStyle={{ maxHeight: 800, overflow: 'auto' }}
      onOk={onModalOk}
      onCancel={onModalCancel}
      forceRender
    >
      <Spin spinning={loading}>
        <Form form={form} {...formItemLayout}>
          <Row>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[
                  {
                    required: true,
                    message: '请填写姓名',
                  },
                  {
                    validator: getSpaceValidator,
                  },
                ]}
              >
                <Input placeholder="请填写" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="primaryDepartmentId"
                label="所属部门"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <DepartmentSelector
                  treeSelectProps={{
                    treeData: departmentTreeData,
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  {
                    required: true,
                    message: '请填写手机号',
                  },
                  {
                    pattern: phoneRegExp,
                    message: '请填写格式正确的手机号',
                  },
                ]}
              >
                <Input placeholder="请填写" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="employeeNo" label="员工编号">
                <Input placeholder="请填写" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="certificateNo" label="证件号">
                <Input placeholder="请填写" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  {
                    pattern: emailRegExp,
                    message: '请填写格式正确的邮箱',
                  },
                ]}
              >
                <Input placeholder="请填写" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="sex" label="性别">
                <Select placeholder="请填写">
                  <Select.Option value={GenderEnum.MALE}>男</Select.Option>
                  <Select.Option value={GenderEnum.FEMALE}>女</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="position" label="职位">
                <Input placeholder="请填写" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="description" label="备注" labelCol={{ span: 3 }}>
                <Input.TextArea autoSize placeholder="请填写" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="avator"
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
                  onPreview={onPreview}
                  maxCount={1}
                >
                  <PlusOutlined />
                  <div>上传照片</div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/* <Form.Item name="isAdmin" label="是否登录" valuePropName="checked">
            <Checkbox onChange={onCreateAccountChange} />
          </Form.Item>
          {isLogin && (
            <>
              <Form.Item name="username" label="用户名">
                <Input placeholder="请填写" />
              </Form.Item>
              <Form.Item
                name="accountPhone"
                label="手机号"
                rules={[{ required: isLogin, message: '请填写手机号' }]}
              >
                <Input placeholder="请填写" />
              </Form.Item>
              {!initialValues?.employee.accountId && (
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[{ required: isLogin, message: '请填写密码' }]}
                >
                  <Input.Password placeholder="请填写" />
                </Form.Item>
              )}
            </>
          )} */}
        </Form>
      </Spin>
      <Preview
        defaultIndex={defaultPhotoIndex}
        images={previewImages}
        visible={previewModalVisible}
        onClose={onClosePreview}
      />
    </Modal>
  );
};

export default CreateEmployeeForm;
