import React, { useState, useEffect } from 'react';
import { Modal, message, Button, Space, Typography } from 'antd';
import { useModel } from 'umi';
import type { TeamDetail } from '@/pages/Team/type';
import { withItemSelect } from '@/pages/Team/components/ItemSelect';
import { putRejectAuth, fetchEquipments, putApproveAuth } from '../../service';
import type { Equipment, SearchCondition } from '../../type';
import EquipmentList from './EquipmentList';

const { Text } = Typography;

const EquipmentsSelecter = withItemSelect<
  Equipment,
  SearchCondition,
  { orgId: number | string }
>(
  EquipmentList,
  { current: 1, pageSize: 10, total: 0 },
  (page, pageSize, condition, config) => {
    if (!config) throw new Error('loaderConfig');
    return fetchEquipments(page, pageSize, config.orgId, condition);
  },
);

interface Props {
  visible?: boolean;
  currentTarget?: TeamDetail;
  onClose: () => void;
  afterSubmit?: (target: TeamDetail) => void;
}
const ModalAuthApprove: React.FC<Props> = ({
  visible = false,
  currentTarget,
  onClose,
  afterSubmit,
}) => {
  const { initialState } = useModel('@@initialState');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedE, setSelectedE] = useState<Equipment[]>([]);

  /* 提交授权 */
  const handleSubmit = async () => {
    if (!currentTarget) return;
    try {
      setLoading(true);
      await putApproveAuth(
        currentTarget.id,
        selectedE.map((_) => _.id),
      );
      setSelectedE([]);
      if (afterSubmit) {
        afterSubmit(currentTarget);
      }
      message.success('授权成功');
    } catch (err) {
      message.error(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* 拒绝授权 */
  const handleReject = () => {
    if (!currentTarget) return;
    Modal.confirm({
      title: '拒绝授权',
      content: `确定拒绝${currentTarget.name}的授权申请吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        try {
          await putRejectAuth(currentTarget.id);
          if (afterSubmit) {
            afterSubmit(currentTarget);
          }
          message.success('拒绝授权成功');
        } catch (err) {
          message.error(`操作失败：${err.message}`);
          console.log(err);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleChangeSelectedEquip = (es: Equipment[]) => {
    setSelectedE(es);
  };

  useEffect(() => {
    if (!visible) {
      setSelectedE([]);
    }
  }, [visible]);

  if (!initialState || !initialState.currentUser) {
    message.error('登录信息错误');
    return null;
  }

  return (
    <Modal
      title="授权可见设备"
      width={1000}
      visible={visible}
      maskClosable={false}
      onCancel={onClose}
      okButtonProps={{ loading }}
      footer={
        <Space>
          <Button onClick={onClose}>关闭</Button>
          <Button
            type="primary"
            danger
            onClick={handleReject}
            loading={loading}
          >
            拒绝
          </Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            授权
          </Button>
        </Space>
      }
    >
      <h3 style={{ marginBottom: '24px' }}>
        已选择 <Text type="warning">{selectedE.length}</Text> 个设备，授权后{' '}
        <Text type="warning">{currentTarget ? currentTarget.orgName : ''}</Text>{' '}
        将可以查看这些设备的信息
      </h3>
      {visible ? (
        <EquipmentsSelecter
          value={selectedE}
          valueKey="id"
          onChange={handleChangeSelectedEquip}
          loaderConfig={{ orgId: initialState.currentUser.user.orgId }}
        />
      ) : (
        ''
      )}
    </Modal>
  );
};

export default ModalAuthApprove;
