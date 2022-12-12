import type { IComponentNode } from '../type';

function groupContext(contexts: IComponentNode[] | undefined) {
  if (!contexts) {
    return [];
  }

  const result = [];
  for (let i = 0; i < contexts.length; i += 2) {
    result.push(contexts.slice(i, i + 2));
  }

  return result;
}

/**
 * 用于处理上下文区块，上下文项目集合的排列场景
 * @param component
 * @returns
 */
export default function useTemplateContext(
  component: IComponentNode,
): [IComponentNode[], IComponentNode[][], IComponentNode | undefined] {
  const topContexts = component?.children?.filter(
    (item) => item.properties?.contextType === 'top',
  );
  const bottomContexts = component?.children?.filter(
    (item) => item.properties?.contextType === 'bottom',
  );
  const hasExtraRow = !(bottomContexts && bottomContexts.length % 2 === 0);
  let filteredBottomContexts: IComponentNode[][] | undefined;
  let lastRowContext;

  if (hasExtraRow) {
    filteredBottomContexts = groupContext(
      bottomContexts?.slice(0, bottomContexts.length - 1),
    );
    lastRowContext = bottomContexts?.pop();
  } else {
    filteredBottomContexts = groupContext(bottomContexts);
  }

  return [topContexts || [], filteredBottomContexts || [], lastRowContext];
}
