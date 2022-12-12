import type { UploadFile } from 'antd/es/upload/interface';
import type { OrgTypeTextEnum, AccountOptionEnum } from '@/utils/constants';
import type { Moment } from 'moment';

export interface FetchOrganizationsParams {
  name?: string;
  username?: string;
  orgType?: string;
  phone?: string;
  status?: string;
  accountId?: number;
  address?: string;
  createdTime?: string;
  description?: string;
  email?: string;
  alias?: string;
  id?: number;
  parentOrgId?: number;
  regionCode?: string;
  uscc?: string;
}

export interface SaveOrganizationParams {
  accountId?: number;
  name: string;
  orgType: string;
  status: string;
  alias: string;
  address?: string;
  createdTime?: string | null;
  description?: string;
  email?: string;
  id?: number;
  parentOrgId?: number;
  phone?: string;
  regionCode?: string;
  uscc?: string;
}

export interface SaveOrganizationAndAccountParams {
  accountInfo?: {
    isAdmin?: boolean;
    isDisabled?: boolean;
    password?: string;
    phone?: string;
    username?: string;
  };
  accountOption: AccountOptionEnum;
  organization: {
    name: string;
    orgType: string;
    regionCode: string;
    uscc: string;
    status: string;
    phone?: string;
    accountId?: number;
    address?: string;
    createdTime?: string;
    description?: string;
    email?: string;
    id?: number;
    parentOrgId?: number;
  };
}

export type OrgDetail = SaveOrganizationAndAccountParams['organization'];

export interface ITableListItem {
  accountId: number;
  address: string;
  createdTime: string | Moment;
  description: string;
  username: string;
  email: string;
  id: number;
  name: string;
  orgType: OrgTypeTextEnum;
  parentOrgId: number;
  phone: string;
  regionCode: string;
  status: string;
  uscc: string;
  alias: string;
  templateID: number;
  templateName: string;
}

export enum OperationType {
  CREATE = 'CREATE', // 新增
  EDIT = 'EDIT', // 编辑
  DELETE = 'DELETE', // 删除
  SET_TEMPLATE = 'SET_TEMPLATE', // 设备模板
  NOOP = 'NOOP', // 无操作
}

export interface AddressOption {
  childrenNumber: number;
  code: string;
  id: number;
  name: string;
  parentId: number;
  label?: string;
  value?: string;
  isLeaf?: boolean;
  children?: AddressOption[];
}

export interface CreateOrgFormValues {
  name: string;
  orgType: string;
  status: string;
  alias: string;
  address?: string;
  createdTime?: string | Moment;
  description?: string;
  email?: string;
  phone?: string;
  regionCode?: string[];
  uscc?: string;
  isAdmin: boolean;
  password: string;
  accountPhone: string;
  username: string;
  logo: UploadFile[];
}

export enum OrgStatusRecordEnum {
  DRAFT = 'DRAFT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface ICreateAdminAccountData {
  isDisabled?: boolean;
  password?: string;
  passwordCycle?: number;
  phone: string;
  roleId?: number;
  username: string;
}

export interface IUpdateAdminAccountData {
  passwordCycle?: number;
  phone?: string;
  roleId?: number;
  username: string;
}
