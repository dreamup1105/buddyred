import { useEffect, useState } from 'react';
import usePreviousValue from '@/hooks/usePreviousValue';
import type { ITableListItem } from '../type';

/**
 * 在当前页数据缓存中找到未选中的keys，服务于全量导出和打印
 * @param enableFullSelect 
 * @param selectedKeys 
 * @returns 
 */
export default function useExclude (
  enableFullSelect: boolean, 
  selectedKeys: number[]
): [
  number, 
  ITableListItem[], 
  Set<number>, 
  (dataSource: ITableListItem[], total: number) => void
]{
  const previousEnableFullSelect = usePreviousValue(enableFullSelect);
  const [fullSelectTotal, setFullSelectTotal] = useState(0); // 选中的总数
  const [keys, setKeys] = useState<Set<number>>(new Set()); // 要排除的key集合
  const [dataSource, setDataSource] = useState<ITableListItem[]>([]); // 当前页数据缓存
  const [total, setTotal] = useState(0); // 总条数

  useEffect(() => {
    if (enableFullSelect) {
      if (previousEnableFullSelect) {
        const excludeKeys = dataSource.filter(item => !selectedKeys.includes(item.id)).map(item => item.id);
        setKeys((prevKeys) => {
          const prevExcludeKeys = [...prevKeys].filter(key => !selectedKeys.includes(key));
          return new Set([...prevExcludeKeys, ...excludeKeys]);
        });
      } else {
        setKeys(new Set());
      }
    }
  }, [selectedKeys, enableFullSelect]);

  useEffect(() => {
    setFullSelectTotal(total - keys.size);
  }, [total, keys.size]);

  const updateCache = (data: ITableListItem[], totals: number) => {
    setDataSource(data);
    setTotal(totals);
  }

  return [
    fullSelectTotal,
    dataSource,
    keys,
    updateCache,
  ];
}