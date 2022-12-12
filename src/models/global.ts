import type { Subscription, Reducer, Effect } from 'umi';

import type { NoticeIconData } from '@/components/NoticeIcon';
import { fetchCodeDictionarys } from '@/services/dictionary';
import type { ConnectState } from './connect.d';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}

export interface GlobalModelState {
  collapsed: boolean;
  notices: NoticeItem[];
  provinces: AddressOption[];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchProvinces: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveNotices: Reducer<GlobalModelState>;
    saveClearedNotices: Reducer<GlobalModelState>;
    saveProvinces: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const defaultState: GlobalModelState = {
  collapsed: false,
  notices: [],
  provinces: [],
};

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    provinces: [],
  },

  effects: {
    *fetchProvinces(_, { call, put }) {
      const res = yield call(fetchCodeDictionarys);
      if (res.code === 0) {
        yield put({
          type: 'saveProvinces',
          payload: res.data.map((i: AddressOption) => ({
            ...i,
            label: i.name,
            value: i.code,
            isLeaf: i.childrenNumber === 0,
          })),
        });
      }
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count: number = yield select(
        (state: ConnectState) => state.global.notices.length,
      );
      const unreadCount: number = yield select(
        (state: ConnectState) =>
          state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices: NoticeItem[] = yield select((state: ConnectState) =>
        state.global.notices.map((item) => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        }),
      );

      yield put({
        type: 'saveNotices',
        payload: notices,
      });

      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter((item) => !item.read).length,
        },
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state = defaultState, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state = defaultState, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: false,
        notices: payload,
      };
    },
    saveClearedNotices(state = defaultState, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      };
    },
    saveProvinces(state = defaultState, { payload }): GlobalModelState {
      return {
        ...state,
        provinces: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
