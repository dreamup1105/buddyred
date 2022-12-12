import path from 'path';
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './route';
import proxy from './proxy';

const { REACT_APP_ENV, MODE } = process.env;

export default defineConfig({
  // mfsu: {
  //   development: {
  //     output: './.mfsu-dev',
  //   },
  // },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'ikkyu',
    locale: false,
    siderWidth: 208,
    ...defaultSettings,
  },
  locale: {
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  metas: [
    {
      name: 'description',
      content: '医修库 - 医疗设备全生命周期管理系统, 医疗设备维修管理软件'
    },
    {
      name: 'keywords',
      content: '医修库, 医疗设备维修管理软件, 医疗设备全生命周期管理系统'
    }
  ],
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  favicon: '/favicon.ico',
  ignoreMomentLocale: true,
  proxy: proxy[(REACT_APP_ENV as AppEnv) || 'dev'],
  manifest: {
    basePath: '/',
  },
  resolve: {
    includes: ['docs', 'src']
  },
  alias: {
    '@': path.resolve(__dirname, '..', 'src')
  },
  define: {
    "process.env": {
      NODE_ENV: 'development',
      MODE
    }
  }
});
