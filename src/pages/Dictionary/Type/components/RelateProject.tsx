import type { ReactText } from 'react';
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Space } from 'antd';
import { fetchNameDictionarys } from '@/services/dictionary';
import { buildTree } from '@/utils/utils';
import { NameDictionarysEnum } from '@/utils/constants';
import type { Operation, ITableListItem, MaintainItem } from '../type';
import {
  fetchMaintainProjectsByEquipTypeId,
  saveMaintainProjectsOfEquipmentType,
} from '../service';

interface RelateProjectProps {
  visible: boolean;
  operation: Operation;
  currentRecord: ITableListItem | undefined;
  onSubmit: () => void;
  onCancel: () => void;
}

const getModalTitle = (operation: Operation) => {
  switch (operation) {
    case 'View':
      return '查看';
    case 'Relate':
      return '关联';
    default:
      return '';
  }
};

/**
 * 关联保养项目提交时，获取所有选中的叶子节点
 * @param maintainProjects
 * @param selectedProjKeys
 */
const getSelectedLeafIds = (
  maintainProjects: ITableListItem[],
  selectedProjKeys: number[] | ReactText[],
): number[] => {
  const filteredProjectKeys: number[] = [];
  const walkTrees = (projects: ITableListItem[]) => {
    projects.forEach((p) => {
      if (selectedProjKeys.includes(p.id) && !p.children) {
        filteredProjectKeys.push(p.id);
      }
      if (p.children) {
        walkTrees(p.children);
      }
    });
  };
  walkTrees(maintainProjects);
  return filteredProjectKeys;
};

/**
 * 将未选中的节点从树中清除
 * @param maintainProjects
 * @param selectedProjKeys
 */
const treeShaking = (
  maintainProjects: ITableListItem[],
  selectedProjKeys: number[] | ReactText[],
): ITableListItem[] => {
  const walkTrees = (nodes: ITableListItem[]) => {
    return nodes.filter((node) => {
      const newNode = node;
      if (node.childrenNumber === 0) {
        return selectedProjKeys.includes(node.id);
      }
      if (node.childrenNumber && node.children) {
        newNode.children = walkTrees(newNode.children as ITableListItem[]);
        if (newNode.children.length) {
          return true;
        }
      }
      return false;
    });
  };
  return walkTrees(maintainProjects);
};

const RelateProject: React.FC<RelateProjectProps> = ({
  visible,
  operation,
  currentRecord,
  onSubmit,
  onCancel,
}) => {
  const [maintainProjects, setMaintainProjects] = useState<ITableListItem[]>(
    [],
  );
  const [selectedProjKeys, setSelectedProjKeys] = useState<
    number[] | React.ReactText[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const columns = [
    {
      title: '保养项目',
      key: 'name',
      dataIndex: 'name',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: ReactText[]) => {
      setSelectedProjKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedProjKeys,
    checkStrictly: false,
  };

  const init = async () => {
    setLoading(true);
    try {
      const [maintainProjectsRes, selectedProjectsRes] = await Promise.all([
        fetchNameDictionarys(NameDictionarysEnum.MAINTAIN_ITEM),
        fetchMaintainProjectsByEquipTypeId(currentRecord!.id),
      ]);
      const selectedMaintainProjectIds = (
        selectedProjectsRes.data as MaintainItem[]
      ).map((i) => i.maintainItemId);
      const maintainProjectTrees = buildTree(maintainProjectsRes.data, 0);
      if (operation === 'Relate') {
        setMaintainProjects(maintainProjectTrees);
        setSelectedProjKeys(selectedMaintainProjectIds);
      } else {
        const filteredProjectTrees = treeShaking(
          maintainProjectTrees,
          selectedMaintainProjectIds,
        );
        setMaintainProjects(filteredProjectTrees);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onModalOk = async () => {
    try {
      setConfirmLoading(true);
      const selectedLeafIds = getSelectedLeafIds(
        maintainProjects,
        selectedProjKeys,
      );
      await saveMaintainProjectsOfEquipmentType(
        currentRecord!.id,
        selectedLeafIds,
      );
      onSubmit();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const onModalCancel = () => {
    onCancel();
  };

  useEffect(() => {
    if (visible && currentRecord) {
      init();
    }
  }, [visible, currentRecord]);

  return (
    <Modal
      title={getModalTitle(operation)}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={onModalOk}
      onCancel={onModalCancel}
      width={600}
      footer={[
        <Space key="space">
          <Button key="cancel" onClick={onModalCancel}>
            {operation === 'Relate' ? '取消' : '关闭'}
          </Button>
          {operation === 'Relate' && (
            <Button key="save" onClick={onModalOk} type="primary">
              保存
            </Button>
          )}
        </Space>,
      ]}
      forceRender
    >
      <Table
        title={() => <div>{`设备类型：${currentRecord?.name}`}</div>}
        rowKey="id"
        columns={columns}
        loading={loading}
        rowSelection={operation === 'Relate' ? { ...rowSelection } : undefined}
        pagination={false}
        dataSource={maintainProjects}
      />
    </Modal>
  );
};

export default RelateProject;
