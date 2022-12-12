import React, { useCallback, useRef, useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Upload,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UploadHost } from '@/services/qiniu';
import useUploadHook from '@/hooks/useUploadHook';
import type { UploadFile } from 'antd/es/upload/interface';
import { getBase64, WithoutTimeFormat } from '@/utils/utils';
import usePreview from '@/hooks/usePreview';
import Preview from '@/components/Preview';
import { useModel } from 'umi';
import { momentToString } from '@/utils/utils';
interface IModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (data: any) => void;
}

const BaseFormModal: React.FC<IModalProps> = ({
  visible = false,
  onCancel,
  onConfirm,
}) => {
  const uploadRef = useRef();
  const [form] = Form.useForm();
  const [btnAuditLoading, setBtnAuditLoading] = useState<boolean>(false);
  const { token, loadToken } = useUploadHook();
  const { initialState } = useModel('@@initialState');
  const userId = initialState?.currentUser?.user.id;
  const [
    previewImages,
    previewModalVisible,
    defaultPhotoIndex,
    updatePreviewImages,
    showPreviewModal,
    onClosePreview,
  ] = usePreview();

  const beforeUpload = async (file: File): Promise<any> => {
    const isLt5M = file.size / 1024 / 1024 < 100;
    if (!isLt5M) {
      message.warning('附件大小不能大于100M');
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

  const onPreview = async (file: UploadFile) => {
    if (file.type?.indexOf('image') != -1) {
      if (!file.url && !file.preview) {
        // eslint-disable-next-line no-param-reassign
        file.preview = (await getBase64(file.originFileObj as File)) as string;
      }
      const uploadCurrent: any = uploadRef.current;
      const currentFileList = uploadCurrent.fileList.filter(
        (item: any) => item.type?.indexOf('image') != -1,
      );
      if (currentFileList?.length) {
        updatePreviewImages(currentFileList, file);
      }
      showPreviewModal();
    } else {
      window.open(file.url, '_blank');
    }
  };

  // 弹框确认
  const onModalConfirm = async () => {
    setBtnAuditLoading(true);
    const formValue = await form.validateFields();
    const params = {
      ...formValue,
      detectTime: momentToString(formValue.detectTime, WithoutTimeFormat),
      simpleAttachmentInfoList: formValue.simpleAttachmentInfoList?.fileList.map(
        (item: any) => {
          return {
            category: 'EQUIPMENT_DETECTION',
            contentLength: item.size,
            contentType: item.type,
            fileName: item.name,
            res: item.response?.data?.key || item.uid,
          };
        },
      ),
    };
    onConfirm(params);
    setTimeout(() => {
      setBtnAuditLoading(false);
      form.resetFields();
    }, 500);
  };

  // 取消
  const onModalCancel = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <>
      <Modal
        title={`新建防伪信息`}
        visible={visible}
        width="800px"
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onModalCancel}
        footer={
          <>
            <Button
              type="primary"
              loading={btnAuditLoading}
              onClick={() => onModalConfirm()}
            >
              保存
            </Button>

            <Button onClick={onModalCancel}>取消</Button>
          </>
        }
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 6,
          }}
        >
          <Row>
            <Col span={12}>
              <Form.Item label="名称" name="reportTitle">
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="检测人" name="detectPerson">
                <Input placeholder="请输入检测人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="检测工具" name="detectTool">
                <Input placeholder="请输入检测工具" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="检测时间" name="detectTime">
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="送检医院" name="hospitalName">
                <Input placeholder="请输入送检医院" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="送检设备" name="detectEquipment">
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="检测报告"
                name="simpleAttachmentInfoList"
                labelCol={{
                  span: 3,
                }}
              >
                <Upload
                  ref={uploadRef}
                  action={UploadHost}
                  beforeUpload={beforeUpload}
                  listType="picture-card"
                  data={getExtraData}
                  onPreview={onPreview}
                >
                  <PlusOutlined />
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Preview
        defaultIndex={defaultPhotoIndex}
        images={previewImages}
        visible={previewModalVisible}
        onClose={onClosePreview}
      />
    </>
  );
};

export default BaseFormModal;
