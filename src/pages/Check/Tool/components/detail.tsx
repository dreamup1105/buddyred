import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import type { ITableListItem } from '../type';

interface IModalProps {
  visible: boolean;
  title?: string;
  detail?: ITableListItem;
  onCancel: () => void;
  onComfirm: (formValue: any) => void;
}

const DetailDodal: React.FC<IModalProps> = ({
  visible = false,
  title = '新增',
  detail = {},
  onCancel,
  onComfirm,
}) => {
  const [form] = Form.useForm();
  const [btnAuditLoading, setBtnAuditLoading] = useState<boolean>(false);

  // 取消
  const onModalCancel = () => {
    onCancel();
    form.resetFields();
  };

  // 保存
  const onConfirm = async () => {
    const formValue = await form.validateFields();
    setBtnAuditLoading(true);
    const params = {
      ...detail,
      ...formValue,
    };
    onComfirm(params);
    setBtnAuditLoading(false);
  };

  useEffect(() => {
    form.resetFields();
    if (detail?.id != null) {
      form.setFieldsValue(detail);
    }
  }, [visible]);

  return (
    <>
      <Modal
        title={`${title}`}
        visible={visible}
        width="500px"
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onModalCancel}
        footer={
          <>
            <Button
              type="primary"
              loading={btnAuditLoading}
              onClick={() => onConfirm()}
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
          <Form.Item
            label="仪器名称"
            name="name"
            rules={[
              { required: true, message: '请输入仪器名称' },
              { whitespace: true, message: '名称不能只包含空格' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="仪器编号" name="number">
            <Input />
          </Form.Item>
          <Form.Item label="型号" name="version">
            <Input />
          </Form.Item>
          <Form.Item label="产地" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="设备校准日期" name="calibrationDate">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DetailDodal;
