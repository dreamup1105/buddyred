import React, { useEffect, useState } from 'react';
import { Modal, Form, TreeSelect, message } from 'antd';
import useUserInfo from '@/hooks/useUserInfo';
import styles from '../index.less';
import type { ITaskItem } from '../type';
import { queryEngineerListAPI } from '@/pages/Maintenance/service';

interface IComponentProps {
  visible: boolean;
  detail?: ITaskItem;
  onCancel: () => void;
  onConfirm: (data: any) => void;
}

const StaffSelect: React.FC<IComponentProps> = ({
  visible,
  detail,
  onCancel,
  onConfirm,
}) => {
  const { currentUser } = useUserInfo();
  const isMaintainer = currentUser?.isMaintainer; // 是否为工程师
  const isHospital = currentUser?.isHospital; // 是否为医生
  const crId = currentUser?.currentCustomer?.id;
  const orgId = currentUser?.org?.id;
  const [form] = Form.useForm();
  const [transferOptions, setTransferOptions] = useState<any>([]);
  const [paramsData, setParamsData] = useState<any>();

  const onModalConfirm = async () => {
    const { transferOrderPersonId } = await form.getFieldsValue();
    if (!transferOrderPersonId) {
      message.error('请选择接单人');
      return;
    }
    try {
      onConfirm({
        taskId: detail?.id,
        ...paramsData,
      });
    } catch (err: any) {
      console.log(err.message);
    } finally {
      form.resetFields();
    }
  };

  const onModalCancel = () => {
    form.resetFields();
    onCancel();
  };

  const onTransferChange = (value: any, node: any) => {
    console.log(value);
    console.log(node);
    let selectData = {
      orgId: undefined,
      orgName: undefined,
      value: undefined,
      title: undefined,
    };
    // 选中如果有子集，则默认选中子集的第一项
    if (node.children) {
      selectData = node.children[0];
      form.setFieldsValue({
        transferOrderPersonId: node.children[0].value,
      });
    } else {
      selectData = node;
    }
    setParamsData({
      newOrgId: selectData?.orgId,
      newOrgName: selectData?.orgName,
      newEngineerId: selectData.value,
      newEngineerName: selectData.title,
    });
  };

  // 获取可以接单的接单人
  const getTransferOptions = async () => {
    try {
      const { data } = await queryEngineerListAPI({
        orgId: isHospital ? orgId : undefined,
        crId: isMaintainer ? crId : undefined,
        equipmentId: detail?.equipmentId,
      });
      setTransferOptions(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (visible) {
      getTransferOptions();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title="转单"
      width={500}
      onCancel={onModalCancel}
      onOk={onModalConfirm}
      className={styles.staffSelectModal}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        autoComplete="off"
      >
        <Form.Item label="单号" name="taskNo">
          <span>{detail?.taskNo}</span>
        </Form.Item>
        <Form.Item label="设备名称" name="equipNameNew">
          <span>{detail?.equipNameNew}</span>
        </Form.Item>
        <Form.Item label="科室" name="departmentName">
          <span>{detail?.departmentName}</span>
        </Form.Item>
        <Form.Item label="计划结束时间" name="planEndTime">
          <span>{detail?.planEndTime}</span>
        </Form.Item>
        <Form.Item label="发起人" name="initPersonName">
          <span>{detail?.initPersonName}</span>
        </Form.Item>
        <Form.Item label="保养人" name="engineerName">
          <span>{detail?.engineerName}</span>
        </Form.Item>
        <Form.Item
          label="接单人"
          name="transferOrderPersonId"
          rules={[{ required: true }]}
        >
          <TreeSelect
            showSearch
            treeData={transferOptions}
            placeholder="请选择接单人"
            virtual={false}
            treeDefaultExpandAll
            treeNodeFilterProp="title"
            onSelect={onTransferChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StaffSelect;
