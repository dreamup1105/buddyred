import type { AccountOptionEnum } from '@/utils/constants';

export interface ITableListItem {
  id: number;
  accountId: number;
  certificateNo: string;
  createdTime: string;
  description: string;
  email: string;
  employeeNo: string;
  name: string;
  orgId: number;
  parentEmployeeId: number;
  parentEmployeeName: string;
  phone: string;
  position: string;
  primaryDepartmentId: number;
  primaryDepartmentName: string;
  sex: Gender;
  roleId?: number;
  roleName?: string;
  username?: string;
}

export interface FetchEmployeesParams {
  employeeNo: string;
  name: string;
  orgId: number;
  phone: string;
  primaryDepartmentId: number | null;
  accountId?: number;
  certificateNo?: string;
  createdTime?: string;
  description?: string;
  email?: string;
  id?: number;
  parentEmployeeId?: number;
  parentEmployeeName?: string;
  username?: string;
}

export interface SaveEmployeeParams {
  // 员工编号
  employeeNo: string;
  // 姓名
  name: string;
  // 部门所属机构id
  orgId: number;
  // 手机号
  phone: string;
  // 所属部门id
  primaryDepartmentId: number;
  // 所属部门name
  primaryDepartmentName?: string;
  // 登录账号id
  accountId?: number;
  // 证件号
  certificateNo?: string;
  // 创建时间
  createdTime?: string;
  // 描述
  description?: string;
  // 邮箱
  email?: string;
  id?: number;
  // 父级员工id
  parentEmployeeId?: number;
  // 父级员工姓名
  parentEmployeeName?: string;
  // 职位
  position?: string;
  // 性别
  sex?: Gender;
}

export interface EmployeeAdminParams {
  // 用户所处机构Id
  orgId: number;
  // 用户Id
  userId: number;
  // 用户名
  username: string;
  // 手机号码
  phone: string;
  // 机构名称
  orgName: string;
  // 邮箱
  email: string;
  // 机构简称
  orgAlias: string;
}

export type EmployeeDetail = SaveEmployeeParams;

export interface IAccountInfo {
  password: string;
  phone: string;
  username: string;
}

export interface SaveEmployeeAndAccountParams {
  accountInfo?: IAccountInfo;
  accountOption: AccountOptionEnum;
  employee: SaveEmployeeParams;
  relDepartments?: {
    key: number;
    value: string;
  }[];
}

export interface EmployeeItem {
  accountId: number;
  certificateNo: string;
  createdTime: string;
  description: string;
  email: string;
  employeeNo: string;
  id: number;
  name: string;
  orgId: number;
  parentEmployeeId: number;
  parentEmployeeName: string;
  phone: string;
  position: string;
  primaryDepartmentId: number;
  primaryDepartmentName: string;
  sex: Gender;
  username: string;
  roleId?: number;
  roleName?: string;
}

export interface DepartmentTreeNode {
  title: string;
  value: number;
  pId: number;
  children?: DepartmentTreeNode[];
}

export interface CreateHumanFormValues {
  // 员工编号
  employeeNo: string;
  // 姓名
  name: string;
  // 手机号
  phone: string;
  // 所属部门id
  primaryDepartmentId: number;
  // 证件号
  certificateNo?: string;
  // 描述
  description?: string;
  // 邮箱
  email?: string;
}

export interface ISaveAccountData {
  accountId?: number;
  roleId?: number;
  username: string;
}

export enum OperationType {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  NOOP = 'NOOP',
}
