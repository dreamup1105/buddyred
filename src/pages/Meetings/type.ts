export interface IFetchMeetingItem {
  id: number;
  userId?: number;
  title?: string;
  code: string;
  createdAt?: string;
}

export interface IFetchHistoryItem {
  id: number;
  userId?: number;
  code: string;
  nickName?: string;
  joinedAt?: string;
  username?: string;
  title?: string;
  createdAt?: string;
}

export interface IMsgSendRequest {
  uid?: string;
  metaKey?: string;
  params: object;
}

export enum OperationType {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  CREATE = 'CREATE',
  SCHEDULE = 'SCHEDULE',
  NOOP = 'NOOP',
}
