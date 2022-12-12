// 保养项目/保养模板公用type

// 所属类型
export enum TemplateFor {
  PLATFORM = 'PLATFORM', //平台
  OTHER_PLATFORM = 'OTHER_PLATFORM', //医院/维修公司
}

export const TemplateForMap = new Map<string, string>([
  [TemplateFor.PLATFORM, '平台'],
  [TemplateFor.OTHER_PLATFORM, '本机构'],
]);
