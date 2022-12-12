export interface ITableListItem {
  name: string;
  id: number;
}

export enum OperationType {
  CREATE_ROLE = 'CREATE_ROLE', // 添加角色
  SAVE_EDIT = 'SAVE_EDIT', // 保存修改
  REVERT_EDIT = 'REVERT_EDIT', // 撤销修改
  RENAME = 'RENAME', // 重命名
  CONFIG_MENU = 'CONFIG_MENU', // 配置菜单
  DELETE = 'DELETE', // 删除角色
  NOOP = 'NOOP', // 无操作
}

export interface IGroupRoleItem {
  belong: number;
  id: number;
  internal: boolean;
  name: string;
  type: number;
}

export interface ISetUserRoleData {
  roleId: number;
  userId: number;
}

export interface IUpdateGroupRoleData {
  id: number;
  name: string;
}

export interface IGroupTree {
  id: number;
  name: string;
  note: string;
  root: number;
  rootNode: IGroupTreeNode;
  terminal: string;
  terminalName: string;
  nodes?: number[];
}
export interface IGroupTreeNode {
  apis: any;
  children: IGroupTreeNode[] | undefined;
  childrenIDs: number[];
  content: string;
  flag: string;
  free: boolean;
  id: number;
  level: number;
  name: string;
  note: string;
  parentID: number;
  path: string;
  sort: number;
  state: number;
  type: 1 | 2; // 菜单｜子权限
  updated: string;
}

export interface IRolePermissions {
  role: number;
  permissions: IPermission[];
}

export interface IPermission {
  nodes: number[];
  terminal: string;
  tree: number;
  node?: number;
  role?: number;
}

export type ISetRolePermissionsData = IRolePermissions;
