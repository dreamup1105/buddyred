import type { labelItem } from '@/pages/Assets/type';

// 可以显示的设备标签列表
export const labelOptions: labelItem[] = [
  {
    label: '序列号',
    value: 'sn',
    line: 2,
  },
  {
    label: '生产厂家',
    value: 'manufacturerName',
    line: 2,
  },
  {
    label: '维修公司',
    value: 'crsAlias',
    line: 2,
  },
  {
    label: '报修电话',
    value: 'repairPhone',
    line: 1,
  },
  {
    label: '生产日期',
    value: 'productionDate',
    line: 1,
  },
  {
    label: '启用日期',
    value: 'initialUseDate',
    line: 1,
  },
  {
    label: '使用年限',
    value: 'usefulAge',
    line: 1,
  },
  {
    label: '保修结束',
    value: 'warranthyEndDate',
    line: 1,
  },
];

// 默认选中的设备标签列表
export const labelSelect: labelItem[] = [
  {
    label: '序列号',
    value: 'sn',
    line: 2,
  },
  {
    label: '生产厂家',
    value: 'manufacturerName',
    line: 2,
  },
  {
    label: '维修公司',
    value: 'crsAlias',
    line: 2,
  },
  {
    label: '报修电话',
    value: 'repairPhone',
    line: 1,
  },
  {
    label: '生产日期',
    value: 'productionDate',
    line: 1,
  },
  {
    label: '启用日期',
    value: 'initialUseDate',
    line: 1,
  },
];

// 模拟一条设备详情数据，作为预览
export const hispitalLogo =
  '1655100907864-rc-upload-1655100799618-7-1338807573708800';

export const initialDetail: any = {
  attachments: [],
  contract: [],
  equipment: {
    alias: 'qiuTest',
    brandName: null,
    createdTime: '2022-05-30 14:30:41',
    dealer: null,
    departmentId: 1338884432461825,
    departmentName: '所属科室',
    depreciationRate: 0.03,
    equipNameNew: '设备名称',
    equipmentNo: '202205300001',
    id: 1354868523909376,
    initialUseDate: '2022-05-30',
    isScrap: 'COMMON',
    isSigned: false,
    maintainPeriod: 12,
    manufacturerName: '生产厂家',
    modelId: 1341604071424256,
    modelName: '设备型号',
    name: '注微量注射泵',
    netWorth: 1000,
    obtainedBy: 'PURCHASED',
    obtainedDate: null,
    obtainedFrom: null,
    orgId: 1338880337346560,
    orgName: null,
    origin: null,
    originWorth: 1000,
    originalDepartmentId: 1338884432461825,
    originalDepartmentName: '所属科室',
    productionDate: '2022-05-01',
    purchaseMethod: 'INQUERY',
    roomNo: null,
    sn: 'GC12423434',
    srcContactPerson: null,
    srcContactTel: null,
    status: 'READY',
    statusChangedReason: null,
    statusChangedTime: '2022-05-30 14:30:41',
    typeId: 1338881794973952,
    typeName: '呼吸麻醉类',
    usefulAge: 12,
    ver: 0,
    warranthyEndDate: '2023-05-01',
    warranthyStatus: 'MANUFACTURER',
  },
  crs: [
    {
      agreementTotalCount: null,
      alias: '维修公司',
      deletedBy: null,
      deletedTime: null,
      id: 1339500908568832,
      isDeleted: false,
      orgId: 1338885051359232,
      orgName: '维修公司',
      phone: '13882554501',
      siteOrgId: 1338880337346560,
      siteOrgLogo: null,
      siteOrgName: '医院名称',
    },
  ],
  inquiries: [],
  org: {
    accountId: null,
    address: 'test',
    alias: '北京',
    createdTime: '2017-07-23 10:44:36',
    description: '',
    email: null,
    id: 18532102300,
    name: '医院名称',
    orgType: 'HOSPITAL',
    parentOrgId: 0,
    phone: '13997594947',
    regionCode: '110101',
    status: 'ACCEPTED',
    uscc: null,
    username: null,
  },
  tags: [],
};
