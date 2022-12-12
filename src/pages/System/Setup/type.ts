export interface ITableListItem {
  acceptTimeoutHours: number;
  assignTimeoutMinutes: number;
  evaluateTimeoutHours: number;
  transferTimeoutHours: number;
  ownerName: string;
  ownerId: number;
}

export interface FetchOwnerSetupListParams {
  accountId: number;
  address: string;
  createdTime: string;
  description: string;
  email: string;
  id: number;
  name: string;
  orgType: string;
  parentOrgId: number;
  phone: string;
  regionCode: string;
  status: string;
  uscc: string;
}
