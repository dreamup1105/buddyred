import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Table,
  Divider,
  Button,
  Space,
  Popconfirm,
  message,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { highlightRowClassName } from '@/utils/utils';
import useMount from '@/hooks/useMount';
import TableToolbar from '@/components/TableToolbar';
import { PlusOutlined } from '@ant-design/icons';
import { getFilteredTrees, removeEmptyChild } from './helper';
import type { ITableListItem, IGroupTree, IGroupRoleItem } from './type';
import { OperationType } from './type';
import CreateRoleForm from './components/CreateRoleForm';
import MenuTrees from './components/MenuTrees';
import {
  fetchGroupTrees,
  fetchGroupRoles,
  fetchRolePermissions,
  deleteRole,
  setRolePermissions,
} from './service';
import styles from './index.less';

const RolePage: React.FC = () => {
  const [currentRecord, setCurrentRecord] = useState<ITableListItem>();
  const [operation, setOperation] = useState<OperationType>(OperationType.NOOP);
  const [createRoleFormVisible, setCreateRoleFormVisible] =
    useState<boolean>(false);
  const [roles, setRoles] = useState<IGroupRoleItem[]>([]);
  const [groupTrees, setGroupTrees] = useState<IGroupTree[]>([]);
  const [filteredGroupTrees, setFilteredGroupTrees] = useState<IGroupTree[]>(
    [],
  );
  // 初始状态的菜单数据，用于在撤销修改时的状态重置
  const [initialGroupTrees, setInitialGroupTrees] = useState<IGroupTree[]>([]);
  const [rolesTableLoading, setRolesTableLoading] = useState<boolean>(false);
  const [menusTableLoading, setMenusTableLoading] = useState<boolean>(false);
  const [activeTabKey, setActiveTabKey] = useState<string>();

  const configMenuHandler = async (record: ITableListItem) => {
    setMenusTableLoading(true);
    try {
      const { data } = await fetchRolePermissions(record.id);
      const trees = data ? getFilteredTrees(groupTrees, data) : groupTrees;
      setFilteredGroupTrees(trees);
      setInitialGroupTrees(trees);
      if (trees.length) {
        setActiveTabKey(`${trees[0].id}&&&${trees[0].terminal}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setMenusTableLoading(false);
    }
  };

  // 加载全量权限实体数据
  const loadGroupTrees = async () => {
    setMenusTableLoading(true);
    try {
      const { data } = await fetchGroupTrees();
      setGroupTrees(
        data.map((item) => ({
          ...item,
          rootNode: removeEmptyChild(item.rootNode),
        })),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setMenusTableLoading(false);
    }
  };

  // 加载角色列表
  const loadGroupRoles = async () => {
    setRolesTableLoading(true);
    try {
      const { data } = await fetchGroupRoles();
      setRoles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setRolesTableLoading(false);
    }
  };

  // 初始化
  const init = async () => {
    Promise.all([loadGroupTrees(), loadGroupRoles()]);
  };

  const onClickOperation = async (
    record: ITableListItem,
    action: OperationType,
  ) => {
    setCurrentRecord(record);
    try {
      setOperation(action);
      switch (action) {
        case OperationType.DELETE:
          await deleteRole(record.id);
          message.success('删除成功');
          loadGroupRoles();
          break;
        case OperationType.RENAME:
          setCreateRoleFormVisible(true);
          break;
        case OperationType.CONFIG_MENU:
          configMenuHandler(record);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setMenusTableLoading(false);
    }
  };

  const onCreateRole = () => {
    setOperation(OperationType.CREATE_ROLE);
    setCreateRoleFormVisible(true);
  };

  const onSubmitCreateRole = () => {
    setCreateRoleFormVisible(false);
    loadGroupRoles();
  };

  // 保存修改
  const onSavePermissions = async () => {
    setMenusTableLoading(true);

    const permissions = filteredGroupTrees.map((tree) => ({
      nodes: tree.nodes || [],
      terminal: tree.terminal,
      tree: tree.id,
    }));

    try {
      await setRolePermissions({
        role: currentRecord!.id,
        permissions,
      });
      // 保存修改之后，当前的filteredGroupTrees数据会作为初始initialGroupTrees的数据
      setInitialGroupTrees(filteredGroupTrees);
      message.success('保存成功');
    } catch (error) {
      console.error(error);
    } finally {
      setMenusTableLoading(false);
    }
  };

  // 撤销修改
  const onRedo = () => {
    setFilteredGroupTrees(initialGroupTrees);
  };

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const onMenuTreesChange = (tree: IGroupTree, selectedRowKeys: any) => {
    setFilteredGroupTrees((prevTrees) => {
      return prevTrees.map((treeNode) => {
        if (treeNode.id === tree.id) {
          return {
            ...treeNode,
            nodes: selectedRowKeys,
          };
        }
        return { ...treeNode };
      });
    });
  };

  const roleColumns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: ITableListItem) => {
        return (
          <>
            <a onClick={() => onClickOperation(record, OperationType.RENAME)}>
              重命名
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除该角色吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => onClickOperation(record, OperationType.DELETE)}
              onCancel={(e) => e?.stopPropagation()}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const roleOperContent = (
    <Button type="primary" onClick={onCreateRole}>
      <PlusOutlined />
      添加角色
    </Button>
  );

  const menuOperContent = (
    <Space>
      <Button type="primary" onClick={onSavePermissions}>
        保存修改
      </Button>
      <Button onClick={onRedo}>撤销修改</Button>
    </Space>
  );

  useMount(init);

  useEffect(() => {
    if (roles.length && groupTrees.length) {
      const defaultRole = roles[0];
      setCurrentRecord(defaultRole);
      configMenuHandler(defaultRole);
    }
  }, [roles, groupTrees]);

  return (
    <PageContainer>
      <Row
        gutter={16}
        className={styles.pageWrapper}
        // style={{ height: window.innerHeight - 100 }}
      >
        <Col span={8} className={styles.roleCol}>
          <TableToolbar
            title="角色列表"
            columns={[]}
            operContent={roleOperContent}
          />
          <Table<ITableListItem>
            rowKey="id"
            columns={roleColumns}
            dataSource={roles}
            pagination={false}
            loading={rolesTableLoading}
            onRow={(record) => {
              return {
                onClick: () => {
                  setCurrentRecord(record);
                  configMenuHandler(record);
                },
              };
            }}
            rowClassName={(record) =>
              highlightRowClassName(record.id, currentRecord?.id)
            }
          />
        </Col>
        <Col span={16} className={styles.treeCol}>
          <TableToolbar
            title="菜单树"
            columns={[]}
            operContent={menuOperContent}
          />
          <MenuTrees
            loading={menusTableLoading}
            trees={filteredGroupTrees}
            activeTabKey={activeTabKey}
            onTabChange={onTabChange}
            onChange={onMenuTreesChange}
          />
        </Col>
      </Row>
      <CreateRoleForm
        visible={createRoleFormVisible}
        operation={operation}
        currentRecord={currentRecord}
        onSubmit={onSubmitCreateRole}
        onCancel={() => setCreateRoleFormVisible(false)}
      />
    </PageContainer>
  );
};

export default RolePage;
