import React, { useState, useEffect } from 'react';
import { message, Modal, Transfer, Spin } from 'antd';
import type { DepartmentItem } from '@/pages/Assets/type';
import type { Employee } from '../type';
import { fetchAuthorizedDepartments, postAuthorizing } from '../service';

interface ModalProps {
  visible: boolean;
  target: Employee | undefined;
  fullDepartments: DepartmentItem[]; // 全量部门数据
  afterSubmit?: () => void;
  onCancel: () => void;
}
const AuthModal: React.FC<ModalProps> = ({
  visible,
  target,
  fullDepartments,
  onCancel,
  afterSubmit,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>([]);

  const init = async () => {
    try {
      if (!target) return;
      setLoading(true);
      // 加载第一页部门数据和已授权部门数据
      const { data: authDepts = [] } = await fetchAuthorizedDepartments(
        target.id,
      );
      const selectedIds: string[] = authDepts.map(({ key }) => String(key));
      setSelectedDeptIds(selectedIds);
    } catch (err) {
      message.error(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* 授权初始化 */
  useEffect(() => {
    init();
  }, [target]);

  /* 保存授权 */
  const handleSubmitAuth = async () => {
    try {
      setLoading(true);
      await postAuthorizing(
        target!.id,
        selectedDeptIds.map((_) => Number(_)),
      );
      setSelectedDeptIds([]);
      afterSubmit?.();
      message.success('授权成功');
    } catch (err) {
      message.error(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeList = (ids: string[]) => {
    // 将当前人员的自属部门id从已选中剔除，因为其默认（已授权）不可操作
    setSelectedDeptIds(
      ids.filter((id) => id !== String(target!.primaryDepartmentId)),
    );
  };

  return (
    <Modal
      title="资源授权"
      visible={visible}
      width={600}
      onCancel={onCancel}
      confirmLoading={loading}
      cancelText="关闭"
      okText="保存"
      onOk={handleSubmitAuth}
      maskClosable={false}
      centered
    >
      <Spin spinning={loading}>
        <Transfer
          oneWay
          showSearch
          listStyle={{ width: 300, height: 400 }}
          titles={['待选', '已授权']}
          locale={{
            itemUnit: '个',
            itemsUnit: '个',
            notFoundContent: '没有匹配项',
            searchPlaceholder: '输入关键词搜索',
          }}
          disabled={loading}
          dataSource={fullDepartments.map(({ id, name }) => ({
            key: String(id),
            title: name,
            description: name,
            // 当前人员的自属部门不可操作
            disabled: target?.primaryDepartmentId === id,
          }))}
          render={({ title = '' }) => title}
          // 当前人员的自属部门默认已授权
          targetKeys={[
            target ? String(target.primaryDepartmentId) : '',
            ...selectedDeptIds,
          ]}
          onChange={handleChangeList}
        />
      </Spin>
    </Modal>
  );
};

export default AuthModal;
