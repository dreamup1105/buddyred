import React, { useState, useEffect, useCallback } from 'react';
import {
  Form,
  Modal,
  Input,
  Select,
  DatePicker,
  Spin,
  Row,
  Col,
  Upload,
  message,
} from 'antd';
import Address from '@/components/Address';
import Preview from '@/components/Preview';
import { PlusOutlined } from '@ant-design/icons';
import { UploadHost } from '@/services/qiniu';
import { fetchAttachments, saveAttachments } from '@/services/global';
import {
  OrgStatus,
  OrgType,
  CodeDictionarysEnum,
  AttachmentCategory,
} from '@/utils/constants';
import {
  phoneRegExp,
  emailRegExp,
  momentToString,
  stringToMoment,
  normalFile,
  getBase64,
  getSpaceValidator,
} from '@/utils/utils';
import { useModel } from 'umi';
import useUploadHook from '@/hooks/useUploadHook';
import usePreview from '@/hooks/usePreview';
import { fetchAddressPathByRegionCode } from '@/services/dictionary';
import type { Moment } from 'moment';
import { ResourcePath } from '@/utils/constants';
import type { UploadFile } from 'antd/es/upload/interface';
import { saveOrganization } from '../service';
import type { OrgDetail, CreateOrgFormValues } from '../type';
import { OperationType } from '../type';

const { TextArea } = Input;
const { Option } = Select;

interface IComponentProps {
  loading: boolean;
  visible: boolean;
  provinces: AddressOption[];
  initialValues: OrgDetail | undefined;
  operation: OperationType;
  onSubmit: () => void;
  onCancel: () => void;
}

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const CreateOrgForm: React.FC<IComponentProps> = ({
  loading,
  visible,
  operation,
  provinces,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const { initialState } = useModel('@@initialState');
  const [
    previewImages,
    previewModalVisible,
    defaultPhotoIndex,
    updatePreviewImages,
    showPreviewModal,
    onClosePreview,
  ] = usePreview();
  const userId = initialState?.currentUser?.user.id;
  const [form] = Form.useForm();
  const { token, loadToken } = useUploadHook();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

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

  /**
   * 保存
   */
  const onModalOk = async () => {
    if (confirmLoading) {
      return;
    }
    try {
      const values = (await form.validateFields()) as CreateOrgFormValues;
      const {
        name,
        uscc,
        orgType,
        status,
        regionCode,
        phone,
        email,
        address,
        description,
        logo,
        alias,
      } = values;

      setConfirmLoading(true);
      const { data } = await saveOrganization({
        ...initialValues,
        name: name.trim(),
        alias: alias.trim(),
        uscc: uscc!,
        orgType,
        status,
        phone,
        email,
        address,
        description,
        regionCode: regionCode![regionCode!.length - 1],
        createdTime: momentToString(values.createdTime as Moment),
      });
      if (logo?.length) {
        const attachment = logo[0];
        await saveAttachments(data.id, [
          {
            contentLength: attachment.size,
            contentType: attachment.type,
            fileName: attachment.name,
            res: attachment.response?.data?.key || attachment.uid,
            category: AttachmentCategory.ORGANIZATION_LOGO,
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

  /**
   * 取消
   */
  const onModalCancel = () => {
    form.resetFields();
    onCancel();
  };

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

    const currentFileList = form.getFieldValue('logo');
    if (currentFileList?.length) {
      updatePreviewImages(currentFileList, file);
    }
    showPreviewModal();
  };

  const init = async () => {
    // 具体为什么会调用这个接口，可看该接口的注释说明
    const { data } = await fetchAddressPathByRegionCode(
      CodeDictionarysEnum.REGION_CODE,
      initialValues!.regionCode!,
    );
    const { data: attachments = [] } = await fetchAttachments(
      initialValues!.id!,
    );
    // regionCode形如：['XXX', 'XXX', 'XXX']
    const regionCode = data.map((i: CodePathItem) => i.code);
    const logo = attachments.length
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
      regionCode,
      createdTime: stringToMoment(initialValues?.createdTime),
      logo,
    });
  };

  useEffect(() => {
    if (!visible) {
      return;
    }
    // 修改时，进行表单回填
    if (initialValues?.id) {
      init();
    } else {
      form.resetFields();
    }
  }, [initialValues, visible]);

  return (
    <Modal
      title={operation === OperationType.CREATE ? '机构 - 新增' : '机构 - 编辑'}
      visible={visible}
      okText="保存"
      cancelText="取消"
      confirmLoading={confirmLoading}
      maskClosable={false}
      onOk={onModalOk}
      onCancel={onModalCancel}
      width={750}
      bodyStyle={{ height: 400, overflow: 'auto' }}
      forceRender
    >
      <Spin spinning={loading}>
        <Form form={form} {...formItemLayout}>
          <Row>
            <Col span={12}>
              <Form.Item
                name="name"
                label="名称"
                rules={[
                  {
                    required: true,
                    message: '请填写名称',
                  },
                  {
                    type: 'string',
                    max: 50,
                    message: '名称长度需要50位以内',
                  },
                  {
                    validator: getSpaceValidator,
                    message: '名称不能全为空格',
                  },
                ]}
              >
                <Input placeholder="请填写" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="orgType"
                label="机构类型"
                rules={[
                  {
                    required: true,
                    message: '请选择机构类型',
                  },
                ]}
              >
                <Select placeholder="请选择">
                  {OrgType.filter((item) => item.key !== 'PLATFORM').map(
                    (i) => (
                      <Option key={i.key} value={i.key}>
                        {i.value}
                      </Option>
                    ),
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="status"
                label="注册状态"
                rules={[
                  {
                    required: true,
                    message: '请选择注册状态',
                  },
                ]}
              >
                <Select placeholder="请选择">
                  {OrgStatus.map((i) => (
                    <Option key={i.key} value={i.key}>
                      {i.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="regionCode"
                label="行政区划"
                rules={[{ required: true, message: '请选择行政区划' }]}
              >
                <Address provinces={provinces} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="alias"
                label="机构简称"
                rules={[
                  {
                    required: true,
                    message: '请填写机构简称',
                  },
                  {
                    type: 'string',
                    max: 20,
                    message: '机构简称长度需要在20位以内',
                  },
                  {
                    validator: getSpaceValidator,
                    message: '机构简称不能全为空格',
                  },
                ]}
              >
                <Input placeholder="请填写" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="createdTime" label="成立日期">
                <DatePicker placeholder="请选择" showTime />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="电话"
                rules={[
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
              <Form.Item name="address" label="地址">
                <Input placeholder="请填写" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="uscc"
                label="统一社会信用代码"
                rules={[
                  {
                    type: 'string',
                    max: 18,
                    message: '统一社会信用代码长度需要在18位以内',
                  },
                ]}
              >
                <Input placeholder="请填写" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="description"
                label="备注"
                labelCol={{ span: 5 }}
                rules={[
                  {
                    type: 'string',
                    max: 300,
                    message: '备注长度需在300位以内',
                  },
                ]}
              >
                <TextArea autoSize placeholder="请填写" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="logo"
                label="Logo"
                labelCol={{ span: 5 }}
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

export default CreateOrgForm;
