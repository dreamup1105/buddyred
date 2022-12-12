import type { IGroupTree, IPermission, IGroupTreeNode } from './type';

/**
 * 从全量权限实体数据中过滤出该角色对应的菜单树
 * @param groupTrees
 * @param rolePermissions
 */
export const getFilteredTrees = (
  groupTrees: IGroupTree[],
  rolePermissions: IPermission[],
) => {
  return groupTrees.map((tree) => ({
    ...tree,
    nodes: rolePermissions.find((item) => item.tree === tree.id)?.nodes,
  }));
};

/**
 * 树形table如果children为空数组[],还是会显示展开图标，所以如果该节点为叶子节点，就应该把对应的children属性置为undefined
 * @param treeNode
 * @returns
 */
export const removeEmptyChild = (treeNode: IGroupTreeNode): IGroupTreeNode => {
  if (treeNode.children && treeNode.children.length) {
    return {
      ...treeNode,
      children: treeNode.children.map(removeEmptyChild),
    };
  }
  return {
    ...treeNode,
    children: undefined,
  };
};
