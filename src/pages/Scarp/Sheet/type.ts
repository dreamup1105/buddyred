import type { UploadFile } from 'antd/es/upload/interface';

export interface ITableItem {
  id: string;
  orderNo: string;
  equipmentName: string;
  equipmentDeptName?: string;
  reportTime?: string;
  approvalPersonName?: string;
  approvalTime?: string;
  scrapStatus?: string;
  equipmentId: number;
  reportPerson?: number;
}

// 报废单状态
export enum ScarpStatus {
  INIT = 'INIT',
  REPORTING = 'REPORTING',
  PASS = 'PASS',
  REJECT = 'REJECT',
}

export const RecordStatuTextMap = new Map<string, string>([
  [ScarpStatus.INIT, '草稿'],
  [ScarpStatus.REPORTING, '申请中'],
  [ScarpStatus.PASS, '通过'],
  [ScarpStatus.REJECT, '驳回'],
]);

export const ScarpStatusEnum = new Map<any, any>([
  [
    ScarpStatus.INIT,
    {
      label: '草稿',
      color: <any>'default',
    },
  ],
  [
    ScarpStatus.REPORTING,
    {
      label: '申请中',
      color: <any>'processing',
    },
  ],
  [
    ScarpStatus.PASS,
    {
      label: '通过',
      color: <any>'success',
    },
  ],
  [
    ScarpStatus.REJECT,
    {
      label: '驳回',
      color: <any>'error',
    },
  ],
]);

export interface ScarpDetailItem {
  eqType?: string; //	设备类型
  eqVendor?: string; //	设备厂商
  eqModel?: string; //	设备型号
  eqNo?: string; //	设备编号
  repairCost?: string; //	维修费用
  approvalAdvice?: string; //	审批意见
  approvalPerson?: number; //	审批人员id
  approvalPersonName?: string; //	审批人员姓名
  approvalTime?: string; //	审批时间
  equipmentDeptName?: string; //	设备所属科室名称
  equipmentName?: string; //		设备名称
  identifyAdvice?: string; //		技术人员鉴定意见
  maintainTimes?: number; //	保养次数
  orderNo?: string; //	报废单编号
  partCount?: number; //	设备更换配件费用
  partCost?: number; //	设备更换配件数量
  repairTimes?: number; //	修理次数
  reportPersonName?: number; //	申报人姓名
  reportTime?: string; //	申报时间
  scrapReason?: string; //	报废原因
  scrapStatus?: string; //	报废单状态,可用值:INIT,REPORTING,PASS,REJECT
  reportPerson: number;
  simpleAttachmentInfoList?: UploadFile[];
}

export interface ScarpSearchFormItem {
  orgId?: number;
  isAcl: boolean;
  deptId?: number;
  keyword: string;
  current: number;
  pageSize: number;
  scrapStatus?: string | null;
}
export interface ICertCategoryItem {
  key: string;
  value: string;
  fileList: any;
}
