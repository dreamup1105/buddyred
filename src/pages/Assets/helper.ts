import { fetchEquipments as fetchAclEquipments } from '@/pages/Equipment/service';
import { isInt } from '@/utils/utils';
import { OperationType, BizType } from './type';
import type { IBizConfig } from './type';
import { fetchEquipments } from './service';

export const getBizConfig = (
  currentRoute: IMenuItem | undefined, 
  isACL: boolean,
): IBizConfig | undefined => {
  if (!currentRoute) {
    return;
  }

  const { path } = currentRoute;

  // eslint-disable-next-line consistent-return
  return {
    bizType: path === '/assets/assets' ? BizType.ASSETS : BizType.EQUIPMENT,
    service: isACL
      ? fetchAclEquipments
      : fetchEquipments,
    tableTitle: path === '/assets/assets' ? '固定资产列表' : '设备列表',
  };
}

export const getParsedTag = (tag: string | string[] | undefined) => {
  let parsedTag;

  try {
    console.log(tag);

    if (!tag) {
      return [];
    }

    if (Array.isArray(tag)) {
      return tag;
    }

    parsedTag = JSON.parse(tag as string);
    if (!Array.isArray(parsedTag)) {
      parsedTag = [];
    }
  } catch (error) {
    parsedTag = [];
    console.error(error);
  }

  return parsedTag;
}

export const normalizeDepartmentId = (departmentId: any) => {
  if (Array.isArray(departmentId)) {
    return departmentId.map((d) => Number(d)).filter(isInt);
  }

  if (isInt(departmentId)) {
    return [Number(departmentId)];
  }
  
  return undefined;
}

export const getSubmitEquipmentInputMsg = (operation: OperationType) => {
  switch (operation) {
    case OperationType.INPUT: return '新增成功';
    case OperationType.EDIT: return '编辑成功';
    case OperationType.COPY: return '复制成功';
    default: return '操作成功';
  }
}