import type {
  MenuDataItem,
  Settings as ProSettings,
} from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import type { StateType } from './login';

export { GlobalModelState, UserModelState };

export interface Loading {
  global: boolean;
  effects: Record<string, boolean | undefined>;
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: ProSettings;
  user: UserModelState;
  login: StateType;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}
