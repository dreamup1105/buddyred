import type { PaginationConfig } from '@/components/ListPage';

export interface ListQueryConditions {
  name: string;
  employeeNo?: string;
  orgId?: number;
  phone?: string;
  primaryDepartmentId?: number;
}

export interface SearchParams {
  name?: string;
}

export interface QueryObject extends PaginationConfig, SearchParams {}

export interface OtherLoaderParams {
  orgId: number;
}

export interface Employee {
  name: string;
  id: number;
  primaryDepartmentId: number;
  employeeNo: string;
  position: string;
  [key: string]: any;
}

export interface Department {
  id: number;
  name: string;
  [key: string]: any;
}

export interface AuthorizedDpt {
  key: number;
  value: string;
}

export interface PageResponse<D> {
  total: number;
  data: D[];
}
