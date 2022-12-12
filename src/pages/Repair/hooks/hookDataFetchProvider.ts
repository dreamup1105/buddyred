import { useState, useReducer, useCallback, useEffect } from 'react';

export interface State<T> {
  loading: boolean;
  isError: boolean;
  page: number;
  pageSize: number;
  total: number;
  data: T[];
}

enum ActionType {
  LOAD_START,
  LOAD_FAIL,
  LOAD_SUCCESS,
}
interface Action<T> {
  type: ActionType;
  payload?: Partial<State<T>>;
}
interface Params {
  page: number;
  pageSize: number;
}

/* provider */
export function hookDataFetchProvider<Record, Search = any, OtherParams = any>(
  loader: (
    page: number,
    pageSize: number,
    search: Search,
    otherParams?: OtherParams,
  ) => Promise<Required<ResponseBody<Record[]>>>,
  __initialState?: Partial<State<Record>>,
  __search?: Search,
) {
  const initialState = {
    loading: false,
    isError: false,
    page: 1,
    pageSize: 10,
    total: 0,
    data: [],
    ...__initialState,
  };
  const initialParams = {
    page: initialState.page,
    pageSize: initialState.pageSize,
  };
  const reducer = (state: State<Record>, action: Action<Record>) => {
    switch (action.type) {
      case ActionType.LOAD_START:
        return { ...state, loading: true };
      case ActionType.LOAD_FAIL:
        return { ...state, loading: false, isError: true };
      case ActionType.LOAD_SUCCESS:
        return {
          ...state,
          ...action.payload,
          loading: false,
        };
      default:
        return state;
    }
  };

  /* hook */
  const useDataFetch = (otherParams?: OtherParams) => {
    const [state, dispatch] = useReducer<
      React.Reducer<State<Record>, Action<Record>>
    >(reducer, initialState);
    const [params, setParams] = useState<Params>(initialParams);
    const [searchParams, setSearchParams] = useState<Search>(
      __search as Search,
    );

    const fetchData = useCallback(async () => {
      try {
        dispatch({
          type: ActionType.LOAD_START,
        });
        const { page, pageSize } = params;
        const { data, total } = await loader(
          page,
          pageSize,
          searchParams,
          otherParams,
        );
        dispatch({
          type: ActionType.LOAD_SUCCESS,
          payload: {
            page,
            pageSize,
            total,
            data,
          },
        });
      } catch (err) {
        dispatch({
          type: ActionType.LOAD_FAIL,
        });
      }
    }, [params, searchParams, otherParams]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    const nextPage = () => {
      const { page, pageSize, total } = state;
      if (page * pageSize >= total) {
        return;
      }
      setParams({ ...params, page: state.page + 1 });
    };
    const changePage = (p: number) => {
      const { pageSize, total } = state;
      if (p <= Math.floor(total / pageSize) && p > 0) {
        setParams({ ...params, page: p });
      }
    };
    const changePageSize = (pageSize: number) => {
      setParams({ ...params, pageSize, page: 1 });
    };
    const search = (s: Partial<Search>) => {
      setParams({ ...params, page: 1 });
      setSearchParams({ ...searchParams, ...s });
    };
    const refresh = () => {
      fetchData();
    };
    const reset = () => {
      setParams({ ...initialParams });
    };

    return {
      state,
      nextPage,
      changePage,
      changePageSize,
      search,
      refresh,
      reset,
    };
  };

  return useDataFetch;
}
