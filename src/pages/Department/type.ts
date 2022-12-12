export interface ITableListItem {
  childrenNumber: number;
  departmentNo: string;
  description: string;
  id: number;
  leaderId: number;
  leaderName: string;
  name: string;
  orgId: number;
  parentDepartmentId: number;
  phone: string;
  children?: ITableListItem[] | null;
}

export interface FetchDepartmentsParams {
  departmentNo?: string;
  description?: string;
  id?: number;
  leaderId?: number;
  leaderName?: string;
  name?: string;
  orgId: number;
  parentDepartmentId: number;
  phone?: string;
  childrenNumber?: number;
}

export type SaveDepartmentParams = FetchDepartmentsParams;

/**
 * 部门详情
 */
export type DepartmentDetail = Omit<ITableListItem, 'children'>;

export enum OperationType {
  CREATE_SUB = 'CREATE_SUB', // 新增下级部门
  CREATE_SIBLING = 'CREATE_SIBLING', // 新增同级部门
  DELETE = 'DELETE', // 删除
  EDIT = 'EDIT', // 编辑
  EXPAND = 'EXPAND', // 点按table中的 + 展开
  NOOP = 'NOOP', // 无操作
}

export interface CreateDeptFormValues {
  name: string;
  departmentNo?: string;
  leaderId?: number;
  phone?: string;
  description?: string;
}
