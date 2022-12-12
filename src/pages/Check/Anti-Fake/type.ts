export interface IFetchDetailItem {
  detectEquipment?: string;
  detectPerson?: string;
  detectTime?: string;
  detectTool?: string;
  hospitalName?: string;
  id?: number;
  importReportTime?: string;
  isInvalid?: number;
  orgId?: number;
  orgName?: string;
  reportTitle?: number;
  securityCode?: number;
  simpleAttachmentInfoList?: any;
}

export interface IFetchTableFormItem {
  current: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
  orgId?: number;
  keyword?: string;
  isAcl?: boolean;
}

export interface ITableListItem {
  detectEquipment?: string;
  detectPerson?: string;
  detectTime?: string;
  detectTool?: string;
  hospitalName?: string;
  id?: string;
  importReportTime?: string;
  isInvalid?: string;
  reportTitle?: string;
  securityCode: string;
  orgName?: string;
  simpleAttachmentInfoList?: any;
}
