import { GatewayNS } from '@/utils/constants';
import { request } from 'umi';

/**
 * 获取所有组织模版信息
 */
export async function fetchTemplates(): ResponseBodyWithPromise<
  Template.ITemplateItem[]
> {
  return request(`/v1/tree/get_all_template`);
}

/**
 * 设定模板
 * @param data
 */
export async function setTemplateToOrg(data: Template.ISetTemplateToOrgData) {
  return request(`${GatewayNS}/org/set_group_template`, {
    method: 'POST',
    data,
  });
}
