import { useState } from 'react';

const defaultQuery = {
  manufacturer: {
    current: 1,
    pageSize: 10,
    q: '',
    total: 0,
  },
  product: {
    q: '',
    current: 1,
    pageSize: 10,
    total: 0,
  },
  model: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

type TableType = 'manufacturer' | 'product' | 'model';

export default function useQueryState() {
  const [query, setQuery] = useState(defaultQuery);

  const getPagination = (type: TableType) => {
    return {
      current: query[type].current || 1,
      pageSize: query[type].pageSize || 10,
      total: query[type].total,
      onPageChange: (page: number) =>
        setQuery((prevQuery) => ({
          ...prevQuery,
          [type]: { ...prevQuery[type], current: page },
        })),
      onShowSizeChange: (size: number) =>
        setQuery((prevQuery) => ({
          ...prevQuery,
          [type]: { ...prevQuery[type], pageSize: size },
        })),
    };
  };

  const setTotal = (type: TableType, total: number) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      [type]: {
        ...prevQuery[type],
        total,
      },
    }));
  };

  return { query, setQuery, getPagination, setTotal };
}
