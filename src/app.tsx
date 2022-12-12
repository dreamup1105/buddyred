import React from 'react';
import { message, notification } from 'antd';
import { fetchCurrent, fetchMenus } from '@/services/user';
import { history, Link } from 'umi';
import type { RequestConfig } from 'umi';
import type { ResponseError } from 'umi-request';
import type {
  BasicLayoutProps,
  Settings as LayoutSettings,
  MenuDataItem,
} from '@ant-design/pro-layout';
import omit from 'omit.js';
import { PageLoading } from '@ant-design/pro-layout';
import LeftContent from '@/components/GlobalHeader/LeftContent';
import RightContent from '@/components/GlobalHeader/RightContent';
import MenuHeader from '@/components/MenuHeader';
import IconFont from '@/components/IconFont';
import { OrgTypeEnum } from '@/utils/constants';
import { getMenus, getRouteMap, getGlobalAuthorities } from '@/utils/utils';
import { fetchUnreadCount } from '@/pages/Message/User/service';
import { stopMessageTask } from '@/utils/ws';
import defaultSettings from '../config/defaultSettings';
import routesConfig from '../config/route';

type CurrentCustomer = Customer | null | undefined;

/**
 * 获取当前要选中的team，只针对工程师（缓存｜teams对象中）
 * @param currentUser
 * @returns
 */
const getCurrentCustomer = (currentUser: CurrentUserInfo) => {
  if (currentUser.org.orgType === OrgTypeEnum.MAINTAINER) {
    if (currentUser.customers?.length) {
      let currentCustomerStorage = localStorage.getItem('currentCustomer');

      try {
        if (currentCustomerStorage) {
          currentCustomerStorage = JSON.parse(currentCustomerStorage);
          return currentCustomerStorage as unknown as CurrentCustomer;
        }
      } catch (error) {
        currentCustomerStorage = null;
        console.error(error);
      }
      if (!currentCustomerStorage) {
        // eslint-disable-next-line prefer-destructuring
        return currentUser.customers[0];
      }
    }
  }
  return null;
};

/**
 * 将后端返回的crs字段重命名为customers，因为customers语义更好
 * @param currentUser
 * @returns
 */
const renameField = (currentUser: CurrentUserInfo & { crs: Customer[] }) => {
  const customers = currentUser.crs;
  return {
    ...omit(currentUser, ['crs']),
    customers,
  };
};

export async function getInitialState(): Promise<{
  currentUser?: CurrentUserInfo & CurrentUserExtInfo;
  settings?: LayoutSettings;
  routes?: MenuDataItem[];
  routesMap?: Map<string, IMenuItem>;
  globalAuthorities?: string[]; // 全局权限（非子权限）
  message?: { unreadCount: any };
}> {
  const { pathname } = history.location;
  if (!pathname.startsWith('/login')) {
    try {
      // eslint-disable-next-line prefer-const
      let [{ data: currentUser }, { data: remoteMenus }] = await Promise.all([
        fetchCurrent(),
        fetchMenus(),
      ]);

      currentUser = renameField(currentUser);

      // 缓存服务机构
      localStorage.setItem('customers', JSON.stringify(currentUser.customers));

      const menus = getMenus(routesConfig, remoteMenus);

      menus.push({
        path: '/meeting',
        name: 'Meeting',
        icon: 'iconvideo',
        routes: [
          {
            path: '/meeting/all-meetings',
            name: 'All Meetings',
            component: './Meetings/All/index',
            flag: '',
            apis: null,
            authority: [],
            routes: [],
          },
          {
            path: '/meeting/meeting-history',
            name: 'Meeting History',
            component: './Meetings/History/index',
            flag: '',
            apis: null,
            authority: [],
            routes: [],
          },
          {
            path: '/meeting/meeting-room',
            name: 'Meeting Room',
            component: './Meetings/Room/index',
            flag: '',
            apis: null,
            authority: [],
            routes: [],
          },
          {
            path: '/meeting/meeting-schedule',
            name: 'Meeting schedule',
            component: './Meetings/Schedule/index',
            flag: '',
            apis: null,
            authority: [],
            routes: [],
          },
        ],
        flag: '',
        apis: null,
        authority: [],
      });
      const { data: unreadMessageCount = 0 } = await fetchUnreadCount(
        currentUser.user.id,
      );
      const isCustomersEmpty =
        currentUser.customers?.length === 0 &&
        currentUser?.org.orgType === OrgTypeEnum.MAINTAINER; // 是否该公司没有任何医院客户

      if (isCustomersEmpty) {
        message.warning('暂无任何医院客户');
      }

      return {
        currentUser: {
          ...currentUser,
          currentCustomer: getCurrentCustomer(currentUser), // 当前选中的客户医院
          isMaintainer: currentUser?.org.orgType === OrgTypeEnum.MAINTAINER, // 是否是工程师或维修公司
          isHospital: currentUser?.org.orgType === OrgTypeEnum.HOSPITAL, // 是否是医院
          isPlatform: currentUser?.org.orgType === OrgTypeEnum.PLATFORM, // 是否是平台
          isManufacturer: currentUser?.org.orgType === OrgTypeEnum.MANUFACTURER, // 是否是厂商
          isCustomersEmpty,
        },
        settings: defaultSettings,
        routes: menus,
        routesMap: getRouteMap(menus),
        globalAuthorities: getGlobalAuthorities(remoteMenus),
        message: {
          unreadCount: unreadMessageCount,
        },
      };
    } catch (error) {
      localStorage.clear();
      console.error(error);
      history.push('/login');
    }
  }
  return {
    settings: defaultSettings,
    routes: routesConfig,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: {
    settings: LayoutSettings;
    currentUser: CurrentUserInfo;
    routes: MenuDataItem[];
  };
}): BasicLayoutProps => {
  const walkMenu = (_routes: MenuDataItem[]) => {
    return _routes.map((route) => {
      const subRoute: MenuDataItem = {};
      if (route.icon) {
        if (route.icon == 'iconvideo') {
          subRoute.icon = (
            <span className="anticon" role="img">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14px"
                height="14px"
                viewBox="0 0 24 24"
                version="1.1"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <rect x="0" y="0" width="14" height="14" />
                  <rect
                    fill="#10acdc"
                    x="2"
                    y="6"
                    width="13"
                    height="12"
                    rx="2"
                  />
                  <path
                    fill="#10acdc"
                    d="M22,8.4142119 L22,15.5857848 C22,16.1380695 21.5522847,16.5857848 21,16.5857848 C20.7347833,16.5857848 20.4804293,16.4804278 20.2928929,16.2928912 L16.7071064,12.7071013 C16.3165823,12.3165768 16.3165826,11.6834118 16.7071071,11.2928877 L20.2928936,7.70710477 C20.683418,7.31658067 21.316583,7.31658098 21.7071071,7.70710546 C21.8946433,7.89464181 22,8.14899558 22,8.4142119 Z"
                  />
                </g>
              </svg>
            </span>
          );
        } else {
          subRoute.icon = <IconFont type={route.icon as string} />;
        }
      }
      if (route.routes) {
        subRoute.routes = walkMenu(route.routes);
      }
      subRoute.locale = false;
      return {
        ...route,
        ...subRoute,
      };
    });
  };

  return {
    headerContentRender: () => <LeftContent />,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => null,
    onCollapse: (collapsed: boolean) => {
      const dom = document.querySelector('.footer-bar') as HTMLElement;
      if (dom) {
        if (collapsed) {
          dom.style.width = 'calc(100% - 48px)';
        } else {
          dom.style.width = 'calc(100% - 240px)';
        }
      }
    },
    onPageChange: () => {
      const { pathname } = history.location;
      // 如果没有登录，重定向到 login
      if (
        !initialState?.currentUser?.user.id &&
        !pathname.startsWith('/login')
      ) {
        history.push('/login');
      }
    },
    menuDataRender: () => walkMenu(initialState.routes),
    menuHeaderRender: () => <MenuHeader />,
    menuItemRender: (menuItemProps, defaultDom) => {
      if (
        menuItemProps.path?.startsWith('http') ||
        menuItemProps.path?.startsWith('/dashboard')
      ) {
        return (
          <a target="_blank" href={menuItemProps.path} rel="noreferrer">
            {defaultDom}
          </a>
        );
      }
      return <Link to={menuItemProps.path as string}>{defaultDom}</Link>;
    },
    // menuExtraRender: () => (
    //   <MenuHeaderExtra userInfo={initialState?.currentUser} />
    // ),
    pageTitleRender: (props: any, defaultPageTitle?: string) => {
      return defaultPageTitle!.replace('-', '');
    },
    breadcrumbRender: (routers = []) => {
      return [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ];
    },
    itemRender: (route) => {
      if (route.path === '/') {
        return <Link to="/">首页</Link>;
      }
      return <span>{route.breadcrumbName}</span>;
    },
    ...initialState?.settings,
    siderWidth: 240,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 静默页面（隐藏请求错误的notification）
 */
const SilentPages = [
  '/dashboard', // 数据大屏
];

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  const isSilentPage = SilentPages.includes(window.location.pathname);
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    if (!isSilentPage) {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }

    switch (status) {
      case 401:
        if (!history.location.pathname.startsWith('/login')) {
          stopMessageTask();
          localStorage.clear();
          window.location.href = `/login?redirect=${window.btoa(
            encodeURIComponent(window.location.href),
          )}`;
        }
        break;
      case 403:
        history.replace('/exception/403');
        break;
      default:
        break;
    }
  }

  if (!response || !isSilentPage) {
    notification.error({
      description: error.message || '您的网络发生异常，无法连接服务器',
      message: '业务错误',
    });
  }
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
  errorConfig: {
    adaptor: (resData, ctx) => {
      // responseType == blob 请求不做异常处理,通常在文件处理场景中来配置
      // 如果 responseType == blob ，直接返回response
      const responseType = ctx.req.options.responseType;
      if (responseType == 'blob') {
        return {
          ...resData,
          success: true,
        };
      }
      return {
        ...resData,
        success: resData.code === 0,
        errorMessage: resData.msg,
      };
    },
  },
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
