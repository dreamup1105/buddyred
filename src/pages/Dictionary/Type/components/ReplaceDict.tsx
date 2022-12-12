import React, { useState, useEffect } from 'react';
import { Modal, Select, Form, Spin } from 'antd';
import useClearFormModal from '@/hooks/useClearFormModal';
import { fetchNameDictionarys, replaceDictionary } from '@/services/dictionary';
import type { ITableListItem, IBizConfig } from '../type';

interface IComponentProps {
  visible: boolean;
  currentRecord: ITableListItem | undefined;
  bizConfig: IBizConfig | undefined;
  onCancel: () => void;
  onSubmit: (srcNode: ITableListItem, targetId: number) => void;
}

const ReplaceProject: React.FC<IComponentProps> = ({
  visible,
  currentRecord,
  bizConfig,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<NameDictItem[]>([]);

  useClearFormModal(visible, form);

  const init = async () => {
    setLoading(true);
    try {
      const { data } = await fetchNameDictionarys(bizConfig!.dictType, {
        parentId: currentRecord!.parentId,
      });
      setOptions(data.filter((d) => d.id !== currentRecord!.id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onModalOk = async () => {
    try {
      const { targetId } = await form.validateFields();
      setConfirmLoading(true);
      await replaceDictionary(
        bizConfig!.dictType,
        currentRecord!.id,
        targetId,
        true,
      );
      onSubmit(currentRecord!, targetId);
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    if (currentRecord && visible) {
      init();
    }
  }, [visible, currentRecord, currentRecord?.parentId]);

  return (
    <Modal
      title="替换"
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      onOk={onModalOk}
      okText="保存"
      confirmLoading={confirmLoading}
    >
      <Spin spinning={loading}>
        <Form form={form}>
          <Form.Item name="targetId" label={`${currentRecord?.name}替换为`}>
            <Select placeholder={bizConfig?.replaceProjectModal.placeholder}>
              {options.map((o) => (
                <Select.Option key={o.id} value={o.id}>
                  {o.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ReplaceProject;
