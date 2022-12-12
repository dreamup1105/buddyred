import { useRef } from 'react';
import type { StringifiableRecord } from 'query-string';
import { parse, stringify } from 'query-string';
import { useHistory, useLocation } from 'umi';

type SetQueryHandler<Q> = (query: Q) => Q;

export default function useQuery<Q>(defaultQuery: Q) {
  const history = useHistory();
  const { search, pathname } = useLocation();
  const parsedSearch = search ? (parse(search) as unknown as Q) : defaultQuery;
  const queryState = useRef(parsedSearch);

  const setQuery = (handler: SetQueryHandler<Q>) => {
    const nextQuery = handler(queryState.current);
    queryState.current = nextQuery;
    history.replace({
      pathname,
      search: stringify(nextQuery as unknown as StringifiableRecord),
    });
  };

  return [queryState.current, setQuery] as const;
}
