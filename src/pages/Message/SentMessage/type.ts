export type IApplicationName = 'YRT' | 'YXK';

export interface IQueryCondition {
  applicationName?: IApplicationName;
  metaKey?: string;
  title?: string;
  isReaded?: boolean;
  since?: string;
  uid?: any;
}

export interface IMessageTarget {
  departments: {
    departmentId: number;
    orgId: number;
    systemType: number;
  }[];
  employees: {
    employeeId: number;
    orgId: number;
    systemType: number;
  }[];
  excludeEmployees: {
    employeeId: number;
    orgId: number;
    systemType: number;
  }[];
  orgs: {
    orgId: number;
    systemType: number;
  }[];
  users: {
    userId: number;
  }[];
}

export interface ISentListData {
  id: string;
  createdTime: string;
  metaKey: string;
  applicationName: string;
  sound: string;
  permissions: any;
  title: string;
  content: string;
  uri: string;
  status: string;
  errMsg: string;
  params: any;
  targets: IMessageTarget;
  states: ISentListDataStates[];
  createdBy: string;
}

export interface ISentListDataStates {
  uid: number;
  isReaded: boolean;
  readedTime: string;
  username: string;
  orgName: string;
  departmentName: string;
}

export interface IUserInfoSimple {
  username: string;
  orgName: string;
  departmentName: string;
  employeeId: number;
}

export interface IMessageItem {
  applicationName: string;
  content: string;
  createdBy: string;
  createdTime: string;
  errMsg: string;
  id: string;
  metaKey: string;
  params: Record<string, any>;
  permissions: number[];
  sound: string;
  states: {
    additionalProperties1: {
      isReaded: boolean;
      readedTime: string;
    };
  };
  targets: IMessageTarget;
  title: string;
  uri: string;
}
