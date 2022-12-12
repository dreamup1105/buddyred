import React, { useState, useRef } from 'react';
import { message } from 'antd';
import type { PaginationConfig } from '@/components/ListPage';
import debounce from 'lodash.debounce';

export interface ChildProps<I, C, Config = Record<string, unknown>> {
  width?: number;
  nameKey?: string;
  valueKey?: string;
  items: I[];
  value?: I[];
  loaderConfig: Config;
  searchCondition?: C;
  searchPlaceholder?: string;
  searchLoading: boolean;
  pagination: PaginationConfig;
  disabled?: boolean;
  onChange?: (items: I[]) => void;
  onSearch: (value: C) => void;
  onPageChange: (pagination: PaginationConfig) => void;
  onLoadMore: () => void;
}

export interface ParentProps<I, C> {
  value?: I[];
  width?: number;
  searchPlaceholder?: string;
  nameKey?: string;
  valueKey?: string;
  loaderConfig?: C;
  singleSelect?: boolean;
  disabled?: boolean;
  onChange?: (items: I[]) => void;
}

export function withItemSelect<
  I,
  Condition = Record<string, unknown>,
  Config = Record<string, unknown>,
>(
  Component: React.FC<ChildProps<I, Condition, Config>>,
  defaultPagination: PaginationConfig,
  fetchItems: (
    page: number,
    pageSize: number,
    condition?: Condition,
    config?: Config,
  ) => Promise<ResponseBody<I[]>>,
  searchDelay = 500,
) {
  const ItemSelect: React.FC<ParentProps<I, Config>> = ({
    width,
    nameKey = 'name',
    valueKey = 'value',
    value,
    searchPlaceholder = '输入关键词搜索',
    loaderConfig = {},
    singleSelect = false,
    disabled = false,
    onChange,
  }) => {
    const [items, setItems] = useState<I[]>([]);
    const [itemLoaded, setItemLoaded] = useState<number>(0);
    const [pagination, setPagination] =
      useState<PaginationConfig>(defaultPagination);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const searchRef = useRef<{ condition?: Condition }>({
      condition: undefined,
    });
    const loaderRef = useRef({
      items: debounce(
        async (p: PaginationConfig, config, currentItems?: I[]) => {
          const { current, pageSize } = p;
          setSearchLoading(true);
          try {
            const { data, total = 0 } = await fetchItems(
              current,
              pageSize,
              searchRef.current.condition,
              config,
            );
            setPagination({ current, pageSize, total });
            // 调用loader时，若传入currentItems，表示此次为累积加载数据
            if (currentItems) {
              setItems([...currentItems, ...data]);
              setItemLoaded((_) => _ + data.length);
            } else {
              setItems(data);
              setItemLoaded(data.length);
            }
          } catch (err) {
            message.error(err.message);
            console.error(err);
          } finally {
            setSearchLoading(false);
          }
        },
        searchDelay,
      ),
    });

    const handleSearch = (condition: Condition) => {
      searchRef.current.condition = condition;
      loaderRef.current.items(pagination, loaderConfig);
    };
    const handleChangePage = (p: PaginationConfig) => {
      loaderRef.current.items(
        {
          ...pagination,
          ...p,
        },
        loaderConfig,
      );
    };
    const handleLoadMore = () => {
      if (itemLoaded < (pagination.total as number)) {
        loaderRef.current.items(
          {
            ...pagination,
            current: pagination.current + 1,
          },
          loaderConfig,
          items,
        );
      }
    };
    const handleChangeValue = (v: I[]) => {
      if (!onChange) return;
      const l = v.length;
      if (l > 0) {
        onChange([v[l - 1]]);
      } else {
        onChange([]);
      }
    };

    return (
      <Component
        width={width}
        nameKey={nameKey}
        valueKey={valueKey}
        items={items}
        value={value}
        loaderConfig={loaderConfig as Config}
        searchCondition={searchRef.current.condition}
        searchPlaceholder={searchPlaceholder}
        searchLoading={searchLoading}
        pagination={pagination}
        disabled={disabled}
        onChange={singleSelect ? handleChangeValue : onChange}
        onSearch={handleSearch}
        onPageChange={handleChangePage}
        onLoadMore={handleLoadMore}
      />
    );
  };

  return ItemSelect;
}
