import type { ITemplateContext } from '@/pages/Dictionary/Maintenance/Template/type';
import type {
  IComponentNode,
  IMaintainItemWithVersion,
  ActiveRecord,
  ActiveContextRecord,
  InsertPosition,
} from './type';

/**
 * 生成组件唯一id
 * @returns
 */
export const genComponentId = () => {
  let d = new Date().getTime();
  const componentId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (c) => {
      // eslint-disable-next-line no-bitwise
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // eslint-disable-next-line no-bitwise
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return componentId;
};

/**
 * 规范化样式属性键值
 * @param attrs 属性集合
 * @isRevert 属性值的正反向操作，正向：数字 => 字符串  反向： 字符串 => 数字
 * @returns
 */
export const normalizeStyleAttrs = (
  attrs: Record<string, any> | undefined,
  isRevert?: boolean,
) => {
  if (!attrs) {
    return {};
  }

  const attrWhiteList = ['marginTop', 'marginBottom', 'isHideBottomBorder'];
  const filteredAttrKeys = Object.keys(attrs).filter((key) =>
    attrWhiteList.includes(key),
  );

  return filteredAttrKeys.reduce((acc, key) => {
    const value = attrs[key];

    switch (key) {
      case 'marginTop':
      case 'marginBottom':
        if (isRevert) {
          acc[key] =
            typeof value === 'string' ? Number(value.replace('px', '')) : value;
        } else {
          acc[key] = typeof value === 'number' ? `${value}px` : value;
        }
        break;
      default:
        acc[key] = value;
        break;
    }
    return acc;
  }, {});
};

export const componentAction = {
  // 可编辑单元格统一保存方法
  save: (
    componentData: IComponentNode[],
    value: string,
    type: string,
    parentId: string | null | undefined,
    id: string | undefined,
  ) => {
    return componentData.map((component) => {
      switch (type) {
        case 'GROUP': // 组
          if (id === component.id) {
            return {
              ...component,
              properties: {
                ...component.properties,
                groupName: value,
              },
            };
          }
          return component;
        case 'BIZ_ITEM': // 保养项
        case 'CONTEXT_ITEM': // 系统上下文
          if (parentId === component.id) {
            return {
              ...component,
              children: component.children?.map((d) => {
                if (d.id === id) {
                  return {
                    ...d,
                    properties: {
                      ...d.properties,
                      name: value,
                    },
                  };
                }
                return d;
              }),
            };
          }
          return component;
        case 'TITLE': // 主标题
        case 'SUB_TITLE': // 二级标题
          if (component.id === 'header') {
            return {
              ...component,
              properties: {
                ...component.properties,
                [type === 'TITLE' ? 'title' : 'subTitle']: value,
              },
            };
          }
          return component;
        default:
          return component;
      }
    });
  },

  // 添加组
  addGroup: (
    componentData: IComponentNode[],
    type?: InsertPosition,
    record?: IComponentNode,
  ) => {
    const componentId = genComponentId();
    const newGroup = {
      id: componentId,
      parentId: null,
      type: 'GROUP',
      properties: {
        groupName: '标题',
        style: {
          marginTop: 20,
          marginBottom: 0,
        },
      },
      children: [],
    } as IComponentNode;
    if (type) {
      const activeIndex = componentData.findIndex(
        (item) => item.id === record!.id,
      );
      const componentDataCopy = JSON.parse(JSON.stringify(componentData));
      const isBefore = type === 'before';
      componentDataCopy.splice(
        isBefore ? activeIndex! : activeIndex! + 1,
        0,
        newGroup,
      );
      return componentDataCopy;
    }
    return componentData.concat([newGroup]);
  },

  // 删除组
  deleteGroup: (componentData: IComponentNode[], id: string) => {
    return componentData.filter((component) => component.id !== id);
  },

  // 删除保养项
  deleteBizItem: (
    componentData: IComponentNode[],
    parentId: string,
    id: string,
  ) => {
    return componentData.map((component) => {
      if (parentId === component.id) {
        return {
          ...component,
          children: component.children?.filter((child) => child.id !== id),
        };
      }
      return component;
    });
  },

  // 删除上下文
  deleteContextItem: (componentData: IComponentNode[], id: string) => {
    return componentData.map((component) => {
      if (component.id === 'context') {
        return {
          ...component,
          children: component.children?.filter((child) => child.id !== id),
        };
      }
      return component;
    });
  },

  // 插入保养项目
  insertBizItem: (
    componentData: IComponentNode[],
    activeComponent: IComponentNode | undefined,
    selectedItem: IMaintainItemWithVersion,
    activeRecord: ActiveRecord,
  ) => {
    return componentData.map((component) => {
      if (component.id === activeComponent?.id) {
        const newBizItem = {
          type: 'BIZ_ITEM',
          id: genComponentId(),
          parentId: activeComponent?.id,
          bizId: selectedItem.id,
          properties: {
            name: selectedItem.name,
            details: selectedItem.details,
          },
        } as IComponentNode;
        // 向上/向下添加一行
        if (activeRecord) {
          const activeIndex = component.children?.findIndex(
            (item) => item.id === activeRecord.record.id,
          );
          const isBefore = activeRecord.type === 'before';
          component.children?.splice(
            isBefore ? activeIndex! : activeIndex! + 1,
            0,
            newBizItem,
          );
          return component;
        }
        return {
          ...component,
          children: component.children?.concat([newBizItem]),
        };
      }
      return component;
    });
  },

  insertContextItem: (
    componentData: IComponentNode[],
    selectedItem: ITemplateContext,
    activeContextRecord: ActiveContextRecord,
  ) => {
    return componentData.map((component) => {
      if (component.id === 'context') {
        const newContextItem = {
          type: 'CONTEXT_ITEM',
          id: genComponentId(),
          parentId: 'context',
          properties: {
            name: selectedItem.label,
            contextBizId: selectedItem.id,
            contextCode: selectedItem.code,
            contextType: activeContextRecord?.type,
          },
        } as IComponentNode;

        if (activeContextRecord?.position) {
          const activeIndex = component.children?.findIndex(
            (item) => item.id === activeContextRecord.record.id,
          );
          const isBefore = activeContextRecord.position === 'before';
          component.children?.splice(
            isBefore ? activeIndex! : activeIndex! + 1,
            0,
            newContextItem,
          );
          return component;
        }
        return {
          ...component,
          children: component.children?.concat([newContextItem]),
        };
      }
      return component;
    });
  },

  // 对组件节点应用样式等
  applyAttrs: (
    componentData: IComponentNode[],
    activeComponent: IComponentNode | undefined,
    attrs: Record<string, any>,
  ) => {
    if (activeComponent?.type !== 'GROUP') {
      return componentData;
    }

    return componentData.map((component) => {
      if (component.id === activeComponent?.id) {
        return {
          ...component,
          properties: {
            ...component.properties,
            style: attrs,
          },
        };
      }
      return component;
    });
  },

  // 更新业务项目集版本（模板内容要进行相应的变化，适配最新的业务项和指标项）
  updateSpecVersion: (
    componentData: IComponentNode[],
    bizItems: IMaintainItemWithVersion[], // 选中的项目集合
  ) => {
    const bizItemMap = new Map(bizItems.map((item) => [item.id, item]));
    return componentData.map((component) => {
      if (component.type === 'GROUP') {
        const hasChildren = !!component.children?.length;
        return {
          ...component,
          children: hasChildren
            ? component.children?.map((item) => {
                if (item.bizId && bizItemMap.has(item.bizId)) {
                  const bizItemDetailMap = new Map(
                    bizItemMap
                      .get(item.bizId)
                      ?.details.map((detailItem) => [
                        detailItem.id,
                        detailItem,
                      ]),
                  );
                  return {
                    ...item,
                    properties: {
                      ...item.properties,
                      name: bizItemMap.get(item.bizId)?.name,
                      details: item.properties?.details?.map((detailItem) => {
                        if (bizItemDetailMap.has(detailItem.id)) {
                          return {
                            ...detailItem,
                            ...bizItemDetailMap.get(detailItem.id),
                          };
                        }
                        return detailItem;
                      }),
                    },
                  };
                }
                return item;
              })
            : [],
        };
      }
      return component;
    });
  },
};
