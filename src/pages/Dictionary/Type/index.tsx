import React, { useState } from 'react';
import { Table, Space, message, Button, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import TableToolbar from '@/components/TableToolbar';
import { fetchNameDictionarys } from '@/services/dictionary';
import { NameDictionarysEnum } from '@/utils/constants';
import { buildTree, highlightRowClassName } from '@/utils/utils';
import useMount from '@/hooks/useMount';
import type { ITableListItem, Operation, IBizConfig } from './type';
import { BizType } from './type';
import CreateDictForm from './components/CreateDictForm';
import RelateProject from './components/RelateProject';
import ReplaceDict from './components/ReplaceDict';
import styles from './index.less';

/**
 *
 * @param trees
 * @param id
 * @param currentOperation
 * @param newDict
 * @param subDicts
 */
const walkDictTree = (
  trees: ITableListItem[],
  id: number,
  currentOperation: Operation,
  newDict: ITableListItem,
): ITableListItem[] =>
  trees.map((node) => {
    if (node.id === id) {
      if (currentOperation === 'Edit') {
        return {
          ...node,
          ...newDict,
        };
      }
      return {
        ...node,
        children: node.children ? [...node.children, newDict] : [newDict],
      };
    }
    if (node.children) {
      return {
        ...node,
        children: walkDictTree(node.children, id, currentOperation, newDict),
      };
    }
    return node;
  });

const replaceDictItem = (
  trees: ITableListItem[],
  srcNode: ITableListItem,
  targetId: number,
): ITableListItem[] => {
  return trees.map((node) => {
    if (node.id === srcNode.parentId) {
      const children = node
        .children!.filter((n) => n.id !== srcNode.id)
        .map((n) => {
          if (n.id === targetId) {
            return {
              ...n,
              children: [...(n.children || []), ...(srcNode.children || [])],
            };
          }
          return n;
        });
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: replaceDictItem(node.children, srcNode, targetId),
      };
    }
    return node;
  });
};

const getBizConfig = (): IBizConfig | undefined => {
  return {
    bizType: BizType.TYPE,
    tableTitle: '设备类型字典列表',
    dictType: NameDictionarysEnum.EQUIPMENT_TYPE,
    toolbarBtns: {
      sub: '新增子级设备类型',
      sibling: '新增同级设备类型',
    },
    createDictFormModal: {
      sub: '新增同级设备',
      sibling: '新增子级设备',
      parentLabel: '父级设备',
      label: '设备类型名称',
      message: '请填写设备类型名称',
    },
    replaceProjectModal: {
      placeholder: '请选择需要替换的类型',
    },
  };
};

const DictionaryTypePage: React.FC = () => {
  const bizConfig = getBizConfig();
  const [loading, setLoading] = useState<boolean>(false);
  const [
    createEquipFormModalVisible,
    setCreateEquipFormModalVisible,
  ] = useState<boolean>(false);
  const [relateItemModalVisible, setRelateItemModalVisible] = useState<boolean>(
    false,
  );
  const [replaceModalVisible, setReplaceModalVisible] = useState<boolean>(
    false,
  );
  const [dicts, setDicts] = useState<ITableListItem[]>([]);
  const [currentRecord, setCurrentRecord] = useState<ITableListItem>();
  const [operation, setOperation] = useState<Operation>('Noop');

  const onClickOperation = (
    record: ITableListItem | undefined,
    action: Operation,
  ) => {
    setOperation(action);
    switch (action) {
      case 'Create-Sibling': // 新增同级
        setCreateEquipFormModalVisible(true);
        break;
      case 'Create-Sub': // 新增子级
        if (!record) {
          message.warning('请选择相应父级项目');
          return;
        }
        setCreateEquipFormModalVisible(true);
        break;
      case 'Edit': // 编辑
        setCreateEquipFormModalVisible(true);
        break;
      case 'Relate': // 关联
        setRelateItemModalVisible(true);
        break;
      case 'View': // 查看
        setRelateItemModalVisible(true);
        break;
      case 'Replace': // 替换
        setReplaceModalVisible(true);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: '设备分类',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      render: (_: any, record: ITableListItem) => {
        return (
          <>
            <a onClick={() => onClickOperation(record, 'Edit')}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => onClickOperation(record, 'Replace')}>替换</a>
          </>
        );
      },
    },
  ];

  /**
   * 获取字典树
   */
  const loadDictTrees = async () => {
    setLoading(true);
    try {
      const { data } = await fetchNameDictionarys(bizConfig!.dictType);
      setDicts(buildTree(data, 0));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 新建字典项（同级 ｜ 子级）
   * @param newDictItem
   */
  const onSubmitCreateDict = (newDictItem: ITableListItem) => {
    setDicts((prevDicts) => {
      if (operation === 'Create-Sibling') {
        if (newDictItem.parentId === 0) {
          return [...prevDicts, newDictItem];
        }
        return walkDictTree(
          prevDicts,
          currentRecord!.parentId,
          operation,
          newDictItem,
        );
      }
      return walkDictTree(prevDicts, currentRecord!.id, operation, newDictItem);
    });
    setCreateEquipFormModalVisible(false);
    message.success('新增成功');
  };

  const onSubmitRelateProjects = () => {
    message.success('关联成功');
    setRelateItemModalVisible(false);
  };

  /**
   * 字典项替换
   * @param srcNode
   * @param targetId
   */
  const onSubmitReplaceDict = (srcNode: ITableListItem, targetId: number) => {
    setDicts((prevDicts) => replaceDictItem(prevDicts, srcNode, targetId));
    setCurrentRecord(undefined);
    message.success('替换成功');
    setReplaceModalVisible(false);
  };

  const onCancelCreateDict = () => {
    setCreateEquipFormModalVisible(false);
  };

  const onCancelRelateItemModal = () => {
    setRelateItemModalVisible(false);
  };

  const onCancelReplaceDict = () => {
    setReplaceModalVisible(false);
  };

  useMount(() => {
    loadDictTrees();
  });

  const operContent = (
    <Space>
      <Button
        type="primary"
        onClick={() => onClickOperation(currentRecord, 'Create-Sibling')}
      >
        <PlusOutlined />
        {bizConfig?.toolbarBtns.sibling}
      </Button>
      <Button
        type="primary"
        disabled={Boolean(!currentRecord)}
        onClick={() => onClickOperation(currentRecord, 'Create-Sub')}
      >
        <PlusOutlined />
        {bizConfig?.toolbarBtns.sub}
      </Button>
    </Space>
  );

  return (
    <PageContainer className={styles.wrapper}>
      <TableToolbar
        isAffix
        offsetTop={0}
        title={bizConfig?.tableTitle}
        columns={columns}
        operContent={operContent}
      />
      <Table<ITableListItem>
        rowKey="id"
        columns={columns}
        dataSource={dicts}
        loading={loading}
        pagination={false}
        onRow={(record) => {
          return {
            onClick: () => {
              setCurrentRecord(record);
            },
            onDoubleClick: () => {
              onClickOperation(record, 'Edit');
            },
          };
        }}
        rowClassName={(record) =>
          highlightRowClassName(record.id, currentRecord?.id)
        }
      />
      <CreateDictForm
        operation={operation}
        visible={createEquipFormModalVisible}
        currentRecord={currentRecord}
        bizConfig={bizConfig}
        onSubmit={onSubmitCreateDict}
        onCancel={onCancelCreateDict}
      />
      <RelateProject
        operation={operation}
        visible={relateItemModalVisible}
        onSubmit={onSubmitRelateProjects}
        onCancel={onCancelRelateItemModal}
        currentRecord={currentRecord}
      />
      <ReplaceDict
        visible={replaceModalVisible}
        currentRecord={currentRecord}
        bizConfig={bizConfig}
        onCancel={onCancelReplaceDict}
        onSubmit={onSubmitReplaceDict}
      />
    </PageContainer>
  );
};
export default DictionaryTypePage;
