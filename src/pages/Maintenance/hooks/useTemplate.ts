import { useState, useEffect } from 'react';
import type { IComponentNode } from '@/pages/Dictionary/Maintenance/Editor/type';
import { ITemplateVersion } from '@/pages/Dictionary/Maintenance/Editor/type';
import { fetchTaskDetailWithTemplate } from '../service';
import type {
  ITaskDetail,
  ITaskValueContextItem,
  ITaskValueValuesItem,
} from '../type';
import { OperationType } from '../type';

// 解析模板策略对象
const resolveTemplateStrategies = {
  [ITemplateVersion.v1]: {
    resolve(
      templateContent: IComponentNode[],
      bizDetailItemValues: ITaskValueValuesItem[],
      contextValues: ITaskValueContextItem[],
      taskDetail: ITaskDetail | null,
    ) {
      let bizDetailItemValueIndex = 0;
      let contextItemIndex = 0;
      const walkComponent = (component: IComponentNode): IComponentNode => {
        switch (component.type) {
          case 'HEADER':
            return {
              ...component,
              properties: {
                ...component.properties,
                title: `${taskDetail?.taskInfo.orgName}${component.properties?.title}`,
              },
            };
          case 'BIZ_ITEM':
            return {
              ...component,
              properties: {
                ...component.properties,
                details: component?.properties?.details?.map((detail) => {
                  const value = bizDetailItemValues[bizDetailItemValueIndex];
                  bizDetailItemValueIndex += 1;
                  return {
                    ...detail,
                    value,
                  };
                }),
              },
            };
          case 'CONTEXT_ITEM':
            // eslint-disable-next-line no-case-declarations
            const value = contextValues[contextItemIndex]?.val;
            contextItemIndex += 1;
            return {
              ...component,
              properties: {
                ...component.properties,
                contextValue: value,
              },
            };
          case 'SYSTEM':
          case 'GROUP':
          case 'CONTEXT':
            return {
              ...component,
              children: component?.children?.map(walkComponent) ?? [],
            };
          default:
            return component;
        }
      };

      return templateContent.map(walkComponent);
    },
  },
};

export const injectDataToTemplate = (
  templateContent: IComponentNode[],
  templateVersion: ITemplateVersion,
  bizDetailItemValues: ITaskValueValuesItem[],
  contextValues: ITaskValueContextItem[],
  taskDetail: ITaskDetail | null,
): IComponentNode[] => {
  switch (templateVersion) {
    case ITemplateVersion.v1:
      return resolveTemplateStrategies[ITemplateVersion.v1].resolve(
        templateContent,
        bizDetailItemValues,
        contextValues,
        taskDetail,
      );
    default:
      return [];
  }
};

export default function useTemplate(
  taskId: number | undefined,
  operation: OperationType,
) {
  const [componentData, setComponentData] = useState<IComponentNode[]>([]);
  const [fetching, setFetching] = useState(false);
  const [hasError, setHasError] = useState(false); // 解析或获取模板内容时发生错误

  // 请求模板内容和采集到的值集合
  const loadTemplate = async () => {
    if (fetching) {
      return;
    }
    setFetching(true);
    try {
      const { data } = await fetchTaskDetailWithTemplate(taskId!);
      const { ext: taskDetail, maintainTaskData: taskValues, template } = data;
      const { content, version } = JSON.parse(template.body);
      setComponentData(
        injectDataToTemplate(
          content,
          version,
          taskValues?.values || [],
          taskValues?.context || [],
          taskDetail,
        ),
      );
    } catch (error) {
      setHasError(true);
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (
      taskId &&
      (operation === OperationType.VIEW || operation === OperationType.PRINT)
    ) {
      setHasError(false);
      loadTemplate();
    }
  }, [taskId, operation]);

  return {
    componentData,
    fetching,
    hasError,
  };
}
