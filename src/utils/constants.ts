/**
 * 机构类型
 */
export const MEETCODELen = 3;
export const MEETINGUrl = 'hy.bjyixiu.com';
export enum OrgTypeTextEnum {
  PLATFORM = '平台',
  HOSPITAL = '医院',
  MAINTAINER = '维修公司',
  MANUFACTURER = '厂商',
}

export enum OrgTypeEnum {
  'HOSPITAL' = 'HOSPITAL', // 医院
  'PLATFORM' = 'PLATFORM', // 平台
  'MAINTAINER' = 'MAINTAINER', // 工程师
  'MANUFACTURER' = 'MANUFACTURER', // 厂商
}

export const OrgType = [
  {
    key: 'PLATFORM',
    value: '平台',
  },
  {
    key: 'HOSPITAL',
    value: '医院',
  },
  {
    key: 'MAINTAINER',
    value: '维修公司',
  },
  {
    key: 'MANUFACTURER',
    value: '厂商',
  },
];

/**
 * 机构注册状态
 */
export enum OrgStatusEnum {
  DRAFT = '草稿',
  ACCEPTED = '审核通过',
  REJECTED = '不通过',
}

export const OrgStatus = [
  {
    key: 'DRAFT',
    value: '草稿',
  },
  {
    key: 'ACCEPTED',
    value: '审核通过',
  },
  {
    key: 'REJECTED',
    value: '不通过',
  },
];

export enum AccountOptionEnum {
  NOOP = 'NOOP',
  CREATE_OR_UPDATE = 'CREATE_OR_UPDATE',
  RESET_PASSWORD = 'RESET_PASSWORD',
  DELETE = 'DELETE',
}

/**
 * 账号操作选项
 */
export enum AccountOptionTextEnum {
  NOOP = '不改变登录账号',
  CREATE_OR_UPDATE = '创建/更新(AccountInfo非空字段)',
  RESET_PASSWORD = '重置密码(如果有账号)',
  DELETE = '删除账号(如果有账号)',
}

export const AccountOption = [
  {
    key: 'NOOP',
    value: '不改变登录账号',
  },
  {
    key: 'CREATE_OR_UPDATE',
    value: '创建/更新(AccountInfo非空字段)',
  },
  {
    key: 'RESET_PASSWORD',
    value: '重置密码(如果有账号)',
  },
  {
    key: 'DELETE',
    value: '删除账号(如果有账号)',
  },
];

export const NameDictionarys = [
  {
    key: 'EQUIPMENT_TYPE',
    value: '设备类型',
  },
  {
    key: 'EQUIPMENT_TAG',
    value: '设备标签',
  },
  {
    key: 'MAINTAIN_ITEM',
    value: '保养项目',
  },
  {
    key: 'PROBLEM_ITEM',
    value: '故障项目',
  },
];

export enum NameDictionarysEnum {
  EQUIPMENT_TYPE = 'EQUIPMENT_TYPE',
  EQUIPMENT_TAG = 'EQUIPMENT_TAG',
  MAINTAIN_ITEM = 'MAINTAIN_ITEM',
  PROBLEM_ITEM = 'PROBLEM_ITEM',
  MI_TAG = 'MI_TAG',
}

export const CodeDictionarys = [
  {
    key: 'REGION_CODE',
    value: '行政区划代码',
  },
];

export enum CodeDictionarysEnum {
  REGION_CODE = 'REGION_CODE',
}

/**
 * 性别
 */
export enum GenderEnum {
  UNKNOWN = 'UNKNOWN',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

/**
 * 静态资源路径（图片，文本，音频）http://yxkdev.bjyixiu.com/v1/image/get/Fqs7eY1k1jx2LP8OccZ1Rm_Ix6SG
 */
export const ResourcePath = `//${
  window.location.host.includes('localhost') ||
  window.location.host.includes('127.0.0.1')
    ? 'localhost:8000'
    : window.location.host
}/v1/image/get/`;

export enum AttachmentCategory {
  // 设备信息
  EQUIPMENT_PHOTO = 'EQUIPMENT_PHOTO', // 设备图片
  EQUIPMENT_CERTIFICATION = 'EQUIPMENT_CERTIFICATION', // 设备合格证
  EQUIPMENT_REGISTRATION = 'EQUIPMENT_REGISTRATION', // 设备注册证

  // 工单
  MP_TICKET_PHOTO = 'MP_TICKET_PHOTO', // 纸质工单照片
  MP_REPAIR_FAILURE = 'MP_REPAIR_FAILURE', // 报修故障图片
  MP_REPAIR_FAILURE_VOICE = 'MP_REPAIR_FAILURE_VOICE', // 报修语音
  MP_MAINTAIN = 'MP_MAINTAIN', // 保养单图片（总）
  MP_MAINTAIN_ITEM = 'MP_MAINTAIN_ITEM', // 保养项目图片

  // 人员
  EMPLOYEE_AVATAR = 'EMPLOYEE_AVATAR', // 用户头像

  // 组织
  ORGANIZATION_LOGO = 'ORGANIZATION_LOGO', // 组织机构Logo

  // 签约
  CONTRACT_PHOTO = 'CONTRACT_PHOTO', // 合同照片
}

export const ExcelAccept =
  '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const GatewayNS = '/ent'; // gateway服务namespace
export const BackendNS = '/v3'; // 后端服务namespace
export const Terminal = 'yxkweb'; // 端

// 默认用户头像
export const DefaultAvatarUrl =
  'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';

// h5生产host
export const MobileHost = 'm.bjyixiu.com';

// h5开发host
export const MobileDevHost = 'mdev.bjyixiu.com';

// 设备报废状态
export enum ScrapStatus {
  COMMON = 'COMMON',
  SCRAP = 'SCRAP',
}

export const ScrapStatusMap = new Map([
  [
    ScrapStatus.COMMON,
    {
      label: '正常使用',
      color: 'green',
    },
  ],
  [
    ScrapStatus.SCRAP,
    {
      label: '已报废',
      color: 'red',
    },
  ],
]);
