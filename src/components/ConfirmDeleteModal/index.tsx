import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Modal, Form, Input, Space, Button } from 'antd';

type IComponentProps = {
  visible: boolean;
  content: string;
  title?: string | ReactNode;
  tip?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const defaultTip = '请在文本框中输入红色的内容';

const DraggableModal: React.FC<IComponentProps> = ({
  visible,
  title = '删除',
  tip = defaultTip,
  content,
  onConfirm,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const onModalOk = async () => {
    if (confirmLoading) {
      return;
    }
    setConfirmLoading(true);
    try {
      await form.validateFields();
      form.resetFields();
      await Promise.resolve(onConfirm());
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

  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onModalCancel}
      className="delete-modal"
      closable={false}
      centered
      footer={
        <Space>
          <Button onClick={onModalCancel} key="cancel">
            取消
          </Button>
          <Button
            onClick={onModalOk}
            loading={confirmLoading}
            type="primary"
            danger
            key="delete"
          >
            确认删除
          </Button>
        </Space>
      }
    >
      <p>
        <span key="tip">{tip}</span>（&nbsp;
        <span
          key="content"
          style={{
            color: '#ff4d4f',
            fontWeight: 700,
            userSelect: 'none',
            fontSize: 20,
          }}
        >
          {content}
        </span>
        &nbsp;）
      </p>
      <Form form={form}>
        <Form.Item
          label=""
          name="content"
          rules={[
            {
              required: true,
              message: '内容不能为空',
            },
            {
              validator(rule: any, value: any) {
                if (value !== content) {
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject(`输入内容与原内容不一致`);
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input style={{ width: '100%' }} placeholder={content} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DraggableModal;
