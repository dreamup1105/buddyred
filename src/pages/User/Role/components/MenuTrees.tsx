import React from 'react';
import { Spin, Tabs, Table } from 'antd';
import type { IGroupTree } from '../type';

const { TabPane } = Tabs;
const menuColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '备注',
    dataIndex: 'note',
    key: 'note',
  },
];

interface IComponentProps {
  loading: boolean;
  trees: IGroupTree[];
  onTabChange: (key: string) => void;
  activeTabKey: string | undefined;
  onChange: (tree: IGroupTree, selectedRowKeys: any) => void;
}

// 菜单树
const MenuTrees: React.FC<IComponentProps> = ({
  loading,
  trees,
  activeTabKey,
  onChange,
  onTabChange,
}) => {
  return (
    <Spin spinning={loading}>
      <Tabs onChange={onTabChange} activeKey={activeTabKey}>
        {trees.map((tree) => (
          <TabPane
            tab={tree.terminalName}
            key={`${tree.id}&&&${tree.terminal}`}
          >
            <Table
              rowKey="id"
              columns={menuColumns}
              expandable={{
                defaultExpandAllRows: true,
              }}
              rowSelection={{
                onChange: (selectedRowKeys) => onChange(tree, selectedRowKeys),
                checkStrictly: true,
                selectedRowKeys: tree.nodes || [],
              }}
              dataSource={tree.rootNode.children}
              pagination={false}
            />
          </TabPane>
        ))}
      </Tabs>
    </Spin>
  );
};

export default MenuTrees;
